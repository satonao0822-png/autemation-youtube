# 02_script — 構成・台本生成

## 責務

- 7パート構成（opening → introduction → body_1/2/3 → closing → cta）に沿った構成案
- 台本本文（ナレーター「こはく」の語り口）
- fish audio に渡せる形式への整形（ふりがな・読み・ポーズ指示）

## 入力

- `episodes/{EP}/01_research/` の出力
- `pipeline/config/channel.yml`（トーン・尺・NG語彙）
- `pipeline/config/voice.yml`（人格・speed）
- `pipeline/prompts/structure.md`, `script.md`

## 出力

- `episodes/{EP}/02_script/structure.yml` — パート別の尺・キーメッセージ
- `episodes/{EP}/02_script/script.md` — 台本本文（テロップ・SE指示込み）
- `episodes/{EP}/02_script/script_for_voice.txt` — fish audio投入用プレーンテキスト

## 担当（人格）

manami（執筆）→ 恐竜PM（レビュー：学術精度・トーン逸脱・著作権）

## 品質ゲート

- `pm_script_review` を通過しないと stage 04（voice）へ進めない
- NG語彙混入チェック（自動）
- 最上級表現の限定詞チェック（「現在知られている中で最大級の」等）
