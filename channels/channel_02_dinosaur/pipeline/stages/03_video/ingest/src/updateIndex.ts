/**
 * _index.yml の読み書き + _duplicate_log.yml への追記 + _metadata.md 同期
 */

import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import type { IndexRecord, DuplicateMatch, CostLogEntry } from "./types.js";

interface IndexFile {
  materials: IndexRecord[];
}

interface DuplicateLogFile {
  duplicates: DuplicateLogEntry[];
}

export interface DuplicateLogEntry {
  new_file: string;
  drive_file_id: string;
  existing_id: string | null;
  existing_path: string | null;
  match_method: DuplicateMatch["method"];
  match_score: number;
  trashed_at: string;
  action: "trashed" | "uncertain_kept";
}

export async function readIndex(indexPath: string): Promise<IndexRecord[]> {
  try {
    const text = await fs.readFile(indexPath, "utf-8");
    const data = yaml.load(text) as IndexFile | null;
    return data?.materials ?? [];
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

export async function appendIndex(indexPath: string, record: IndexRecord): Promise<void> {
  const existing = await readIndex(indexPath);
  existing.push(record);
  const file: IndexFile = { materials: existing };
  // ヘッダ部分（コメント）を保持するため、書き戻し時にヘッダを先頭に付ける
  const header = `# _index.yml — Magnific素材インデックス（機械可読・正本）
# material-ingest skill が自動更新（手動編集は最終手段）
# レコード形式は src/types.ts > IndexRecord 参照
#
`;
  await fs.writeFile(indexPath, header + yaml.dump(file, { lineWidth: 120 }), "utf-8");
}

export async function appendDuplicateLog(
  logPath: string,
  entry: DuplicateLogEntry
): Promise<void> {
  let existing: DuplicateLogEntry[] = [];
  try {
    const text = await fs.readFile(logPath, "utf-8");
    const data = yaml.load(text) as DuplicateLogFile | null;
    existing = data?.duplicates ?? [];
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
  existing.push(entry);
  await fs.writeFile(
    logPath,
    "# _duplicate_log.yml — 重複検出ログ\n# material-ingest skill が自動更新\n\n" +
      yaml.dump({ duplicates: existing }, { lineWidth: 120 }),
    "utf-8"
  );
}

/** _metadata.md (人間向けライセンス台帳) に1行追記（既存表の末尾） */
export async function appendMetadataRow(
  metadataPath: string,
  record: IndexRecord,
  originalName: string,
  ingestedAtDate: string
): Promise<void> {
  // 既存ファイルを読む。表の末尾に行を追加
  const text = await fs.readFile(metadataPath, "utf-8");
  const row = `| - | ${path.basename(record.file_cloud_path)} | ${ingestedAtDate} | material-ingest skill (Magnific DL: なーたん) | magnific | (Magnific Web) | Magnificサブスク | OK | 不要 | （社内生成） | ${suggestRoleTag(record)} | ${suggestCategoryTag(record)} | ${record.duration_sec ?? "?"} | (未定) | ${record.notes} |\n`;
  // "## メタデータ表" の表セクション末尾に追記。簡易実装: ファイル末尾の "## 改訂履歴" の前に挟む
  const marker = "## 採用見送り";
  const idx = text.indexOf(marker);
  if (idx === -1) {
    await fs.writeFile(metadataPath, text + "\n" + row, "utf-8");
    return;
  }
  const before = text.slice(0, idx).trimEnd() + "\n" + row + "\n";
  const after = text.slice(idx);
  await fs.writeFile(metadataPath, before + after, "utf-8");
}

function suggestRoleTag(record: IndexRecord): string {
  if (record.species.length > 0 && !record.species.includes("_unknown")) return "main-species";
  if (record.environment.length > 0) return "bg-environment";
  return "general";
}

function suggestCategoryTag(record: IndexRecord): string {
  if (record.species.length > 0 && !record.species.includes("_unknown")) {
    return `dinosaur-cgi(${record.species[0]})`;
  }
  return record.environment[0] ?? "general";
}

/** コストログ追記 */
export async function appendCostLog(logPath: string, entry: CostLogEntry): Promise<void> {
  let existing: CostLogEntry[] = [];
  try {
    const text = await fs.readFile(logPath, "utf-8");
    const data = yaml.load(text) as { entries?: CostLogEntry[] } | null;
    existing = data?.entries ?? [];
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
  }
  existing.push(entry);
  const totalYen = existing.reduce((acc, e) => acc + e.cost_yen, 0);
  await fs.writeFile(
    logPath,
    "# material_ingest_cost.yml — Vision API コストログ\n# material-ingest skill が自動追記\n\n" +
      yaml.dump({ total_yen: totalYen, entries: existing }, { lineWidth: 120 }),
    "utf-8"
  );
}

/** 月次予算チェック */
export async function checkBudget(
  logPath: string,
  monthlyBudgetYen: number
): Promise<{ spentYen: number; exceeded: boolean; alert: boolean }> {
  let existing: CostLogEntry[] = [];
  try {
    const text = await fs.readFile(logPath, "utf-8");
    const data = yaml.load(text) as { entries?: CostLogEntry[] } | null;
    existing = data?.entries ?? [];
  } catch {
    return { spentYen: 0, exceeded: false, alert: false };
  }
  // 今月分のみ集計
  const now = new Date();
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const thisMonth = existing.filter((e) => e.timestamp.startsWith(ym));
  const spentYen = thisMonth.reduce((acc, e) => acc + e.cost_yen, 0);
  return {
    spentYen,
    exceeded: spentYen >= monthlyBudgetYen,
    alert: spentYen >= monthlyBudgetYen * 0.8,
  };
}
