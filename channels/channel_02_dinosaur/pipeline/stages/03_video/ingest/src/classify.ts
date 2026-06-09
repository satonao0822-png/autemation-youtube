/**
 * Claude Vision（Sonnet 4.6）で動画スクショを5+1軸判定
 * プロンプトは pipeline/prompts/material_classification.md と整合
 */

import fs from "node:fs/promises";
import Anthropic from "@anthropic-ai/sdk";
import type { VisionClassification, CostLogEntry } from "./types.js";

const MODEL = "claude-sonnet-4-6";
// 為替・トークン単価（2026-06 暫定）
const PRICE_INPUT_YEN_PER_MTOK = 450;    // $3 * 150yen/$
const PRICE_OUTPUT_YEN_PER_MTOK = 2250;  // $15 * 150yen/$

const SYSTEM_PROMPT = `あなたは恐竜・古生物に詳しい映像素材アーキビスト。
入力された10枚のスクショ（同一動画から1秒間隔で抽出）を分析し、恐竜chの素材ライブラリに自動振り分けする。

5+1軸で判定し、必ず JSON で出力（他のテキストを含めない）。
語彙は厳密に以下の値のみ使う:

species: triceratops, tyrannosaurus, stegosaurus, velociraptor, pteranodon, brachiosaurus, allosaurus, spinosaurus, ankylosaurus, parasaurolophus, apatosaurus, diplodocus, iguanodon, oviraptor, therizinosaurus, quetzalcoatlus, plesiosaurus, mosasaurus, _multi, _unknown（恐竜不在なら []）
period: triassic, jurassic, cretaceous_early, cretaceous_late, unknown
behavior: walk, run, charge, eat, rest, courtship, fight, idle, landscape, swim, fly, hunt, herd, vocalize
shot: wide, medium, close, part_close, overhead, low_angle
environment: forest, plain, coast, river, volcano, desert, mountain, sky, underwater, abstract, cave, swamp, museum
light: dawn, day, dusk, night, storm, fog, moonlit
mood: calm, dreamy, dramatic, dark, cinematic, serene, mysterious（任意・推定できる時のみ）

学術整合性 anatomical_ok: 指の本数・歯列・羽毛・運動様式・解剖学的破綻が1つでもあれば false。疑わしきは false（保守的判定）。

suggested_path のルール:
- 種が映っている → "species/{species_name}/"
- 恐竜不在の環境素材 → "environment/{environment}/"
- 部位クローズアップ → "anatomy/"
- トランジション素材 → "transitions/"
- 図解・復元画 → "fallback_illustration/"

confidence は各軸 0.0-1.0 で記入。overall は全体評価。判別困難な種ペア（トリケラ vs スティラコ等、ティラノ vs アロ等）に遭遇したら積極的に下げる（0.6未満）。

JSON 出力フォーマット:
{
  "species": ["triceratops"],
  "period": "cretaceous_late",
  "behavior": ["walk"],
  "shot": "wide",
  "environment": ["forest"],
  "light": "dawn",
  "mood": "calm",
  "anatomical_ok": true,
  "anatomical_notes": "",
  "confidence": {"species": 0.95, "period": 0.85, "behavior": 0.88, "shot": 0.92, "environment": 0.78, "light": 0.91, "overall": 0.88},
  "suggested_filename": "walk_wide_forest_dawn",
  "suggested_path": "species/triceratops/",
  "notes": ""
}`;

const USER_PROMPT = `この10枚は同一動画から1秒間隔で抽出したスクショです。
判定して JSON のみ返してください。`;

export interface ClassifyResult {
  classification: VisionClassification;
  costLog: CostLogEntry;
}

export async function classifyFrames(
  framePaths: string[],
  fileId: string
): Promise<ClassifyResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY が .env に設定されていません");
  }
  const client = new Anthropic();

  const imageContent = await Promise.all(
    framePaths.slice(0, 10).map(async (p) => {
      const data = await fs.readFile(p);
      return {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: "image/jpeg" as const,
          data: data.toString("base64"),
        },
      };
    })
  );

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 800,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [...imageContent, { type: "text", text: USER_PROMPT }],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Vision レスポンスに text ブロックがありません");
  }

  const classification = extractJson<VisionClassification>(textBlock.text);

  const input = response.usage.input_tokens;
  const output = response.usage.output_tokens;
  const costYen =
    (input * PRICE_INPUT_YEN_PER_MTOK) / 1_000_000 +
    (output * PRICE_OUTPUT_YEN_PER_MTOK) / 1_000_000;

  const costLog: CostLogEntry = {
    timestamp: new Date().toISOString(),
    model: MODEL,
    input_tokens: input,
    output_tokens: output,
    cost_yen: costYen,
    file_processed: fileId,
  };

  return { classification, costLog };
}

function extractJson<T>(text: string): T {
  // ```json ブロックを優先、なければ最外側の { から } を抽出
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1] : text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
  return JSON.parse(raw.trim()) as T;
}
