/**
 * material-ingest skill エントリポイント
 *
 * 使い方:
 *   npm run ingest         本番実行
 *   npm run ingest:dry     dry-run（Drive操作なし・ログのみ）
 *
 * フロー（pipeline/stages/03_video/ingest/README.md 参照）:
 *   1. Drive _inbox/ の動画 list
 *   2. 各動画について:
 *      a. 一時DL
 *      b. 重複検出 quick → trash or 続行
 *      c. フレーム抽出
 *      d. 重複検出 visual → trash or 続行
 *      e. Vision分類
 *      f. 振り分け先解決
 *      g. confidence チェック → 低なら _uncertain/
 *      h. Drive上で move
 *      i. preview ローカル保存
 *      j. _index.yml / _metadata.md / cost log 更新
 *   3. サマリ表示
 */

import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import dotenv from "dotenv";
import { DriveClient } from "./driveClient.js";
import { extractFrames, cleanupFrames } from "./extractFrames.js";
import { classifyFrames } from "./classify.js";
import { quickDetect, visualDetect } from "./duplicateDetect.js";
import {
  readIndex,
  appendIndex,
  appendDuplicateLog,
  appendMetadataRow,
  appendCostLog,
  checkBudget,
} from "./updateIndex.js";
import {
  loadSubfolderIds,
  resolveDestination,
  uncertainDestination,
  nextMaterialId,
  buildFinalFilename,
} from "./pathResolver.js";
import type { IndexRecord, IngestResult, SubfolderIds } from "./types.js";

dotenv.config();

const PROJECT_ROOT = path.resolve(import.meta.dirname, "../../../../..");
const STORAGE_YML = path.join(PROJECT_ROOT, "pipeline/config/storage.yml");
const MAGNIFIC_DIR = path.join(PROJECT_ROOT, "assets/library/02_magnific");
const INDEX_YML = path.join(MAGNIFIC_DIR, "_index.yml");
const DUPLICATE_LOG = path.join(MAGNIFIC_DIR, "_duplicate_log.yml");
const METADATA_MD = path.join(PROJECT_ROOT, "assets/library/_metadata.md");
const PREVIEW_DIR = path.join(MAGNIFIC_DIR, "preview");
const COST_LOG = path.join(PROJECT_ROOT, "episodes/_logs/material_ingest_cost.yml");

const CONFIDENCE_THRESHOLD = 0.7;
const MONTHLY_BUDGET = Number(process.env.MONTHLY_BUDGET_YEN ?? 1000);

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");

async function main(): Promise<void> {
  console.log("=== material-ingest skill 起動 ===");
  console.log(`mode: ${DRY_RUN ? "DRY RUN" : "PRODUCTION"}`);

  // 予算チェック
  const budget = await checkBudget(COST_LOG, MONTHLY_BUDGET);
  if (budget.exceeded) {
    console.error(`月予算 ${MONTHLY_BUDGET}円 を超過済（${budget.spentYen.toFixed(0)}円）。中断。`);
    console.error("再開には COST_LOG を確認し、なーたん承認後に手動でリセット");
    process.exit(2);
  }
  if (budget.alert) {
    console.warn(`予算アラート: ${budget.spentYen.toFixed(0)} / ${MONTHLY_BUDGET}円`);
  }

  const drive = await DriveClient.create();
  const ids = await loadSubfolderIds(STORAGE_YML);

  console.log("Drive _inbox/ の動画を取得中...");
  const videos = await drive.listVideos(ids._inbox);
  console.log(`発見: ${videos.length} 本`);
  if (videos.length === 0) {
    console.log("処理対象なし。終了。");
    return;
  }

  const existingRecords = await readIndex(INDEX_YML);
  console.log(`既存 _index.yml レコード: ${existingRecords.length} 件`);

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "ingest-"));
  await fs.mkdir(PREVIEW_DIR, { recursive: true });
  await fs.mkdir(path.dirname(COST_LOG), { recursive: true });

  const results: IngestResult[] = [];
  let runningIndex = [...existingRecords];

  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    if (!v.id || !v.name) continue;
    console.log(`\n[${i + 1}/${videos.length}] ${v.name} (id=${v.id})`);
    try {
      const result = await processOne(drive, v, ids, runningIndex, tmpDir);
      results.push(result);
      if (result.outcome === "ingested" || result.outcome === "uncertain") {
        // _index.yml に追記したものは runningIndex にも反映
        const latest = await readIndex(INDEX_YML);
        runningIndex = latest;
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  ERROR: ${msg}`);
      results.push({
        drive_file_id: v.id,
        original_name: v.name,
        size_bytes: Number(v.size ?? 0),
        outcome: "error",
        cost_yen: 0,
        error: msg,
      });
    }
  }

  // 一時ディレクトリ削除
  await fs.rm(tmpDir, { recursive: true, force: true });

  // サマリ
  printSummary(results, budget.spentYen);
}

async function processOne(
  drive: DriveClient,
  v: { id: string; name: string; size?: string | null; md5Checksum?: string | null; mimeType?: string | null },
  ids: SubfolderIds,
  existingIndex: IndexRecord[],
  tmpDir: string
): Promise<IngestResult> {
  const sizeBytes = Number(v.size ?? 0);
  const md5 = v.md5Checksum ?? "";

  // Step 1+2: quick duplicate detect（DL前に判定できる範囲）
  const quick = quickDetect({ md5, sizeBytes, name: v.name }, existingIndex);
  if (quick.matched) {
    console.log(`  重複検出 (${quick.method}, score=${quick.match_score}) → 既存 ${quick.existing_id}`);
    if (!DRY_RUN) {
      await drive.trash(v.id);
      await appendDuplicateLog(DUPLICATE_LOG, {
        new_file: v.name,
        drive_file_id: v.id,
        existing_id: quick.existing_id,
        existing_path: quick.existing_path,
        match_method: quick.method,
        match_score: quick.match_score,
        trashed_at: new Date().toISOString(),
        action: "trashed",
      });
    }
    return {
      drive_file_id: v.id,
      original_name: v.name,
      size_bytes: sizeBytes,
      outcome: "duplicate_trashed",
      duplicate: quick,
      cost_yen: 0,
    };
  }

  // DL → フレーム抽出
  const localVideoPath = path.join(tmpDir, `${v.id}.mp4`);
  console.log("  download...");
  await drive.download(v.id, localVideoPath);
  console.log("  extract frames...");
  const frames = await extractFrames(localVideoPath, tmpDir, v.id);

  // Step 3: visual duplicate detect
  console.log("  visual duplicate check...");
  const visual = await visualDetect(frames.previewPath, existingIndex, MAGNIFIC_DIR);
  if (visual.matched) {
    console.log(`  視覚的重複 (score=${visual.match_score}) → 既存 ${visual.existing_id}`);
    if (!DRY_RUN) {
      await drive.trash(v.id);
      await appendDuplicateLog(DUPLICATE_LOG, {
        new_file: v.name,
        drive_file_id: v.id,
        existing_id: visual.existing_id,
        existing_path: visual.existing_path,
        match_method: visual.method,
        match_score: visual.match_score,
        trashed_at: new Date().toISOString(),
        action: "trashed",
      });
    }
    await cleanupFrames(frames.framePaths, frames.previewPath);
    await fs.unlink(localVideoPath).catch(() => undefined);
    return {
      drive_file_id: v.id,
      original_name: v.name,
      size_bytes: sizeBytes,
      outcome: "duplicate_trashed",
      duplicate: visual,
      cost_yen: 0,
    };
  }

  // Vision分類
  console.log("  Vision classification...");
  const { classification, costLog } = await classifyFrames(frames.framePaths, v.id);
  console.log(
    `  → species=${classification.species.join("/") || "(none)"}, env=${classification.environment.join("/") || "(none)"}, conf=${classification.confidence.overall.toFixed(2)}`
  );

  // 振り分け先決定
  const lowConfidence = classification.confidence.overall < CONFIDENCE_THRESHOLD;
  const dest = lowConfidence
    ? uncertainDestination(ids)
    : await resolveDestination(drive, ids, classification);

  // ID採番
  const materialId = nextMaterialId(existingIndex.map((r) => r.id));
  const newFilename = buildFinalFilename(
    classification.suggested_filename || "untitled",
    materialId,
    extName(v.name)
  );

  // md5 (Drive が返してくれてない場合はローカル計算)
  const computedMd5 = md5 || (await calcMd5(localVideoPath));

  // Drive 上で move + rename
  if (!DRY_RUN) {
    await drive.move(v.id, ids._inbox, dest.driveFolderId);
    await drive.rename(v.id, newFilename);
  }

  // preview をローカル保存
  const localPreviewDir = path.join(MAGNIFIC_DIR, dest.localRelativeDir, "preview");
  if (!DRY_RUN) await fs.mkdir(localPreviewDir, { recursive: true });
  const previewName = `${materialId}_${classification.suggested_filename || "preview"}.jpg`;
  const localPreviewPath = path.join(localPreviewDir, previewName);
  if (!DRY_RUN) await fs.copyFile(frames.previewPath, localPreviewPath);

  // _index.yml レコード作成
  const record: IndexRecord = {
    id: materialId,
    file_local_preview: path.relative(MAGNIFIC_DIR, localPreviewPath),
    file_cloud_path: `${dest.subPath}/${newFilename}`,
    file_cloud_id: v.id,
    file_cloud_url: `https://drive.google.com/file/d/${v.id}/view`,
    md5: computedMd5,
    size_bytes: sizeBytes,
    duration_sec: frames.durationSec,
    species: classification.species,
    period: classification.period,
    behavior: classification.behavior,
    shot: classification.shot,
    environment: classification.environment,
    light: classification.light,
    mood: classification.mood,
    anatomical_ok: classification.anatomical_ok,
    ingested_at: new Date().toISOString(),
    vision_confidence: classification.confidence,
    vision_model: costLog.model,
    used_in: [],
    notes: classification.notes ?? "",
  };

  if (!DRY_RUN) {
    await appendIndex(INDEX_YML, record);
    await appendMetadataRow(METADATA_MD, record, v.name, new Date().toISOString().slice(0, 10));
    await appendCostLog(COST_LOG, costLog);
  }

  // 一時ファイル削除
  await cleanupFrames(frames.framePaths, frames.previewPath);
  await fs.unlink(localVideoPath).catch(() => undefined);

  console.log(
    `  → ${dest.subPath}/${newFilename} (${lowConfidence ? "UNCERTAIN" : "ingested"}, cost=${costLog.cost_yen.toFixed(2)}円)`
  );

  return {
    drive_file_id: v.id,
    original_name: v.name,
    size_bytes: sizeBytes,
    outcome: lowConfidence ? "uncertain" : "ingested",
    classification,
    destination_path: `${dest.subPath}/${newFilename}`,
    cost_yen: costLog.cost_yen,
  };
}

function extName(name: string): string {
  const m = name.match(/\.([a-zA-Z0-9]+)$/);
  return m ? m[1].toLowerCase() : "mp4";
}

async function calcMd5(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  return crypto.createHash("md5").update(data).digest("hex");
}

function printSummary(results: IngestResult[], spentYenBefore: number): void {
  const ingested = results.filter((r) => r.outcome === "ingested").length;
  const uncertain = results.filter((r) => r.outcome === "uncertain").length;
  const duplicates = results.filter((r) => r.outcome === "duplicate_trashed").length;
  const errors = results.filter((r) => r.outcome === "error").length;
  const totalCost = results.reduce((acc, r) => acc + r.cost_yen, 0);

  console.log("\n=== サマリ ===");
  console.log(`処理: ${results.length} 本`);
  console.log(`  ingested:          ${ingested}`);
  console.log(`  uncertain:         ${uncertain}（_uncertain/ に配置）`);
  console.log(`  duplicate_trashed: ${duplicates}`);
  console.log(`  error:             ${errors}`);
  console.log(`今回のVisionコスト: ${totalCost.toFixed(2)}円`);
  console.log(`月累計（処理前）: ${spentYenBefore.toFixed(2)}円 / ${MONTHLY_BUDGET}円`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
