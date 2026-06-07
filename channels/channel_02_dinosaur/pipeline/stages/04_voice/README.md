# 04_voice — ナレーション生成

## 責務

- 台本（プレーンテキスト）を fish audio に投げる
- 音声トラックを wav で出力
- 文ごとのタイミング情報を timing.json に出力（テロップ同期に使う）

## 入力

- `episodes/{EP}/02_script/script_for_voice.txt`
- `pipeline/config/voice.yml`（声紋ID、speed=1.0）
- 環境変数 `FISH_AUDIO_API_KEY`

## 出力

- `episodes/{EP}/04_voice/narration.wav`
- `episodes/{EP}/04_voice/timing.json` — `{sentence_index, start_ms, end_ms, text}` の配列

## 担当（人格）

junki。

## 注意

- **speed=1.0 固定**（リサンプリング劣化防止・なーたん 2026-06-06 決裁）
- 声紋IDは `5161d41404314212af1254556477c17d`（元気な女性）
- ふうか（旧）に切り替えない
- 失敗時は voice.yml の retry_policy に従う

## 最も早く skill 化される工程

ADR-008 Phase 3 で `.claude/skills/junki-voice/` として最初に skill 化する想定。
