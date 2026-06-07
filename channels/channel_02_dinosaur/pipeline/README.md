# pipeline/ — 恐竜ch 自動化パイプライン

> 恐竜ch（古代生物のふしぎな世界）の **完全自動公開** を目指すコード・設定・プロンプトの置き場。
> 設計の正本は [`decisions/ADR-008`](../../../decisions/ADR-008_dinosaur_automation_pipeline_architecture.md)。
> 人手版ワークフローは [`03_production_workflow.md`](../03_production_workflow.md)。

## ゴール

リサーチ → 構成/台本 → 映像生成 → ナレーション生成 → テロップ・BGM編集 → YouTube公開 を **無人で実行できる** こと。

## 全体図

```
[01_research] ─→ [02_script] ─→ [04_voice] ──┐
                       │                       │
                       └──→ [03_video] ────────┤
                                               ↓
                                          [05_edit] ─→ [06_publish]
```

EP単位で `episodes/EP{NN}_{slug}/` 配下に中間成果物が落ちる。各 stage は前の stage の出力を読んで次の出力を書く。

## ディレクトリ

| パス | 役割 |
| --- | --- |
| `config/` | チャンネル固有の値（声紋ID、speed、NG語彙、ソース配分など）。コードはここを読む |
| `prompts/` | 各工程のLLMプロンプト雛形。中身は manami/nishi/junki/hina のノウハウを言語化したもの |
| `stages/01_research/` | ネタ選定・学術ソース収集 |
| `stages/02_script/` | 構成案・台本生成 |
| `stages/03_video/` | 3ソース（無料ストック / Magnific / Seedance）から映像素材取得・図解差し替え |
| `stages/04_voice/` | fish audio API でナレーション生成 |
| `stages/05_edit/` | ffmpeg等で映像・音声・テロップ・BGMを合成 |
| `stages/06_publish/` | YouTube Data API でアップロード・公開 |

## 設計原則

1. **設定とコードを分離**: ch固有の値は `config/*.yml` に集約。コードは値を持たない
2. **EPを跨いだ状態を持たない**: 各 stage は EP のディレクトリだけ読み書き。グローバル状態を作らない
3. **再実行可能**: 同じ EP で同じ stage を再実行しても結果が安定する（冪等性を狙う）
4. **失敗が読める**: `episodes/{EP}/99_logs/` に各 stage のログを残す
5. **skill 化を妨げない**: stage 実装は将来 `.claude/skills/` に切り出せる粒度で書く

## 各 stage の入出力（暫定）

| stage | 入力 | 出力 |
| --- | --- | --- |
| 01_research | `00_meta.yml` のテーマ | `01_research/sources.md`、`facts.yml` |
| 02_script | `01_research/` の出力 | `02_script/structure.yml`、`script.md`、`script.ssml` |
| 03_video | `02_script/script.md` のシーン分解 | `03_video/scenes/*.mp4`、`scene_map.yml` |
| 04_voice | `02_script/script.md` または `script.ssml` | `04_voice/narration.wav`、`timing.json` |
| 05_edit | 03/04 の出力 + `config/{bgm,telop}.yml` | `05_edit/final.mp4` |
| 06_publish | 05 の出力 + `06_publish/meta.yml` | YouTube 上の公開動画URL |

## 現状

- **Phase 0**（ディレクトリ整備）: ✅ 2026-06-07
- **Phase 1**（技術スタック確定）: ✅ 2026-06-07 — [ADR-009](../../../decisions/ADR-009_dinosaur_pipeline_phase1_tech_stack.md)
  - リサーチ: 海外論文参照 + skill化最優先
  - 動画生成: Seedance採用確定（実装は将来）+ フリー素材併用
  - 編集: **Remotion**（React/TypeScript）
  - 公開: unlisted → なーたん確認 → public 手動切替
- **Phase 2**（EP01 を新構造に移植）: ⏳ 次タスク
- **Phase 3**（最初の skill 実装 = `research-skill`）: 未着手
- **Phase 4-5**: 未着手

## 関連

- 戦略: [`00_concept.md`](../00_concept.md), [`02_content_strategy.md`](../02_content_strategy.md)
- 品質基準: [`_pm_quality_checklist.md`](../_pm_quality_checklist.md)
- ナレーター: [`_narrator_persona.md`](../_narrator_persona.md)
- 声: [`assets/voice_samples/voice_genkinajyosei_info.txt`](../assets/voice_samples/voice_genkinajyosei_info.txt)
- BGM: [`_bgm_design_guide_2026-06-04.md`](../_bgm_design_guide_2026-06-04.md)
- テロップ: [`_telop_design_guide_2026-06-04.md`](../_telop_design_guide_2026-06-04.md)
- 素材: [`assets/library/README.md`](../assets/library/README.md)
