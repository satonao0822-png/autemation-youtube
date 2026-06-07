# stages/ — パイプライン工程の実装

各サブフォルダが1工程に対応する。Phase 1〜2 で実装を入れる。

| 番号 | 工程 | 入力 | 出力 | 主な技術（暫定） |
| --- | --- | --- | --- | --- |
| 01_research | リサーチ・ネタ選定 | テーマ案 | sources.md / facts.yml | Web検索 + LLM要約 |
| 02_script | 構成・台本生成 | research出力 | structure.yml / script.md | LLM（Claude） |
| 03_video | 映像素材取得 | script のシーン分解 | scenes/*.mp4 / scene_map.yml | Pexels/Pixabay API + Magnific + Seedance（再開後） |
| 04_voice | ナレーション生成 | script.md | narration.wav / timing.json | fish audio API |
| 05_edit | 編集合成 | 03/04 出力 + config | final.mp4 | ffmpeg（暫定） |
| 06_publish | YouTube公開 | 05 出力 + publish.yml | YouTube URL | YouTube Data API v3 |

## 実装の進め方

1. 各 stage はまず「呼び出すと該当 EP の中間ファイルを出力する」CLIスクリプトとして書く
2. 動いたら `.claude/skills/{role}-{task}/` に skill としてラップする
3. 最後に EP 単位で全 stage を一気に回すオーケストレーション層を書く

## 命名規約

- スクリプト: `{NN}_{stage}.py` または `.ts`
- エントリポイント: `run.py` または `main.ts`
- テスト: `tests/`
