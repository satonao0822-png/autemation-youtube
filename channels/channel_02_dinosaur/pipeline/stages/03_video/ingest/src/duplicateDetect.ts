/**
 * 重複検出（material_reuse_policy.yml > duplicate_detection）
 *
 * 段階:
 *   1. file_hash（md5）完全一致 → 確定重複
 *   2. file_size + 名前類似 → Vision 比較に進む
 *   3. visual_similarity（Claude Vision で代表サムネ比較）
 */

import fs from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";
import type { IndexRecord, DuplicateMatch } from "./types.js";

const VISUAL_THRESHOLD_HIGH = 0.92;   // ≥ → 即重複
const VISUAL_THRESHOLD_LOW = 0.80;    // 0.80-0.92 → _uncertain

/** Step 1+2: ハッシュ・サイズ・名前で粗判定 */
export function quickDetect(
  candidate: { md5: string; sizeBytes: number; name: string },
  existing: IndexRecord[]
): DuplicateMatch {
  // Step 1: md5 完全一致
  const hashMatch = existing.find((r) => r.md5 && r.md5 === candidate.md5);
  if (hashMatch) {
    return {
      matched: true,
      method: "file_hash",
      existing_id: hashMatch.id,
      existing_path: hashMatch.file_cloud_path,
      match_score: 1.0,
    };
  }

  // Step 2: サイズ完全一致 + 名前類似（部分一致）
  const sizeNameMatch = existing.find(
    (r) =>
      r.size_bytes === candidate.sizeBytes &&
      r.file_cloud_path &&
      nameSimilar(candidate.name, basename(r.file_cloud_path))
  );
  if (sizeNameMatch) {
    return {
      matched: true,
      method: "size_name",
      existing_id: sizeNameMatch.id,
      existing_path: sizeNameMatch.file_cloud_path,
      match_score: 0.85,
    };
  }

  return { matched: false, method: "none", existing_id: null, existing_path: null, match_score: 0 };
}

/** Step 3: Vision で代表サムネを既存 preview と1対1比較（最も類似度高いものを返す） */
export async function visualDetect(
  candidatePreviewPath: string,
  existing: IndexRecord[],
  localPreviewBaseDir: string
): Promise<DuplicateMatch> {
  if (existing.length === 0) {
    return { matched: false, method: "none", existing_id: null, existing_path: null, match_score: 0 };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY が .env にありません");
  }
  const client = new Anthropic();

  // 既存全件と1枚ずつ Vision 比較するとコスト膨大。
  // 同カテゴリ・同サイズ近似 等で絞る → 上位N件のみ送る方針
  // 簡易実装: 直近100件 + サイズ比近似（±10%）
  const candidates = existing
    .filter((r) => r.file_local_preview)
    .slice(0, 50);

  if (candidates.length === 0) {
    return { matched: false, method: "none", existing_id: null, existing_path: null, match_score: 0 };
  }

  // 1リクエストに候補画像 + 新規画像 を全部入れて「最も似てるID + 類似度」を返してもらう
  const candidateImages = await Promise.all(
    candidates.map(async (r) => {
      const fullPath = `${localPreviewBaseDir}/${r.file_local_preview}`;
      try {
        const data = await fs.readFile(fullPath);
        return {
          id: r.id,
          imageBlock: {
            type: "image" as const,
            source: {
              type: "base64" as const,
              media_type: "image/jpeg" as const,
              data: data.toString("base64"),
            },
          },
        };
      } catch {
        return null;
      }
    })
  );
  const validCandidates = candidateImages.filter((c): c is NonNullable<typeof c> => c !== null);
  if (validCandidates.length === 0) {
    return { matched: false, method: "none", existing_id: null, existing_path: null, match_score: 0 };
  }

  const newImage = await fs.readFile(candidatePreviewPath);

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 200,
    system:
      "あなたは画像類似度判定者。新規画像と複数の既存画像を比較し、視覚的に最も類似する既存IDと類似度（0.0-1.0）を JSON で返す。出力は { \"best_match_id\": \"M042\", \"score\": 0.95 } の形式。類似なしなら score=0",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "新規画像（1枚目）と既存画像（2枚目以降・IDは順に: " +
              validCandidates.map((c) => c.id).join(", ") +
              "）。最も類似する既存IDと類似度を JSON で返してください。",
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: newImage.toString("base64"),
            },
          },
          ...validCandidates.map((c) => c.imageBlock),
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return { matched: false, method: "none", existing_id: null, existing_path: null, match_score: 0 };
  }
  const raw = textBlock.text.slice(textBlock.text.indexOf("{"), textBlock.text.lastIndexOf("}") + 1);
  const result = JSON.parse(raw) as { best_match_id: string; score: number };

  if (result.score >= VISUAL_THRESHOLD_HIGH) {
    const matched = existing.find((r) => r.id === result.best_match_id);
    return {
      matched: true,
      method: "visual_similarity",
      existing_id: result.best_match_id,
      existing_path: matched?.file_cloud_path ?? null,
      match_score: result.score,
    };
  }
  if (result.score >= VISUAL_THRESHOLD_LOW) {
    return {
      matched: false,
      method: "visual_similarity",
      existing_id: result.best_match_id,
      existing_path: existing.find((r) => r.id === result.best_match_id)?.file_cloud_path ?? null,
      match_score: result.score,
    };
  }
  return { matched: false, method: "visual_similarity", existing_id: null, existing_path: null, match_score: result.score };
}

function basename(p: string): string {
  return p.split("/").pop() ?? p;
}

function nameSimilar(a: string, b: string): boolean {
  // 拡張子除いた前半部分の一致度（簡易）
  const stem = (s: string) => s.replace(/\.[^.]+$/, "").toLowerCase();
  const sa = stem(a);
  const sb = stem(b);
  if (sa === sb) return true;
  return sa.includes(sb.slice(0, 8)) || sb.includes(sa.slice(0, 8));
}
