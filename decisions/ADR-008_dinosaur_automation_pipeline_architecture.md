# ADR-008: 恐竜chの完全自動化パイプライン・アーキテクチャ

- **Status**: Accepted
- **Date**: 2026-06-07
- **Deciders**: なーたん（決裁）／ 窓口Claude（起案）
- **Channel scope**: `channel_02_dinosaur` のみ（投資ch・将来の他chは対象外）

## コンテキスト

恐竜ch（古代生物のふしぎな世界）は、これまで manami / nishi / junki / hina の4職能エージェントが **ドキュメント（企画書・台本・提案・議事録）でやり取りしながら制作する** 運用設計だった。

EP01 進行を通じて以下が見えてきた：

1. **同じ意思決定を何度も書き直している**（提案 → 議論 → ADR化までの粒度がバラバラ）
2. **中間成果物（台本・音声・クリップ・編集プロジェクト）の置き場が確定していない** ため、EP数が増えると探索コストが増える
3. **「完全自動（無人公開）」をゴールに置くと、各メンバーの作業は最終的に skill 化されコードから呼び出される** ことになる
4. **既存の議事録群は履歴として価値があるが、現在の作業に必要なファイルと混ざっている**

このまま手作業ベースでEP数を増やすと、自動化への移行コストが指数的に膨らむ。

## 決定

恐竜chに **EP単位の完全自動化パイプライン構造** を導入する。

### スコープと前提（このADRが守る境界）

- 対象は **恐竜chのみ**。`channels/channel_02_dinosaur/` 配下に閉じる。投資chや横断ナレッジには影響を出さない（共通基盤化は EP10 以降に必要性を再評価）
- 最終ゴールは **完全自動（無人公開）**。ただし学術監修ゲート等の品質ゲートは仕組みで吸収する
- 各メンバー（manami/nishi/junki/hina）の作業は **将来 skill として呼び出す** 形に移行する。エージェント定義（`.claude/agents/`）は当面残置し、skill 移行は段階的
- 技術スタックの細部（映像生成API、編集ツール、公開API）は **ヒアリングしながら個別決定**。本ADRはディレクトリ骨格のみ確定

### 採用するディレクトリ構造

```
channels/channel_02_dinosaur/
├── 00_concept.md / 01-04_*.md           # 戦略ドキュメント（既存維持）
│
├── pipeline/                             # 【NEW】自動化パイプラインの正本
│   ├── README.md
│   ├── config/                           # ch固有設定（コードが参照）
│   │   ├── channel.yml                   # トーン・尺・NGワード・人格
│   │   ├── voice.yml                     # fish audio（元気な女性 / speed=1.0）
│   │   ├── video_sources.yml             # 3ソース戦略（freestock/Magnific/Seedance）
│   │   ├── bgm.yml                       # BGMライブラリ
│   │   ├── telop.yml                     # テロップデザイン
│   │   ├── thumbnail.yml                 # サムネテンプレ
│   │   └── publish.yml                   # YouTubeメタ・公開設定
│   ├── prompts/                          # 各工程のLLMプロンプト雛形
│   │   ├── research.md / structure.md / script.md
│   │   ├── video_brief.md / telop.md
│   │   └── thumbnail.md / publish_meta.md
│   └── stages/                           # 工程実装スクリプト置き場
│       ├── 01_research/ ... 06_publish/
│
├── episodes/                             # 【NEW】EP単位の中間成果物
│   ├── _template/                        # 雛形（EP立ち上げ時に複製）
│   │   ├── 00_meta.yml
│   │   ├── 01_research/ ... 06_publish/
│   │   └── 99_logs/                      # パイプライン実行ログ
│   └── EP{NN}_{slug}/                    # 個別EP
│
├── assets/                               # 既存維持（library/voice_samples/thumbnails）
├── analytics/                            # 既存維持
├── archive/                              # 【NEW】過去議事録・提案・履歴
│   └── 2026-q2_*/
│
├── .claude/
│   └── skills/                           # 【NEW】skill 移行先（将来）
│
└── scripts/                              # 既存（pipeline/stages/ に統合予定）
```

### 各層の責務

| 層 | 責務 | 例 |
| --- | --- | --- |
| 戦略ドキュメント（00-04） | 「どんな番組か」の不変ルール | コンセプト・ペルソナ・KPI |
| `pipeline/config/` | 自動化コードが読む「ch固有の値」 | 声紋ID、speed、NG語彙、ソース配分 |
| `pipeline/prompts/` | LLMに渡す指示の正本 | 構成プロンプト、台本プロンプト |
| `pipeline/stages/` | 工程ごとの実装コード | fish audio呼び出し、ffmpeg合成 |
| `episodes/{EP}/` | EP単位の入出力・中間成果物 | 台本・音声wav・最終mp4 |
| `assets/library/` | 横断的に使い回す素材 | ストック画像・BGM |
| `archive/` | 履歴・参照用（読み専） | 過去の提案・議事録 |
| `.claude/skills/` | 将来のskill本体 | manami-script, junki-edit など |

### 既存のチーム運用との関係

- **当面は共存**: `.claude/agents/{manami,nishi,junki,hina}.md` のエージェント定義はそのまま使う。新規EPでも「manamiに台本」「junkiに音声」は従来通り通る
- **段階的移行**: 各エージェントが繰り返す作業から順に `.claude/skills/{role}-{task}/` として skill 化していく
- **skill 化の優先順位**: **2026-06-07 ADR-009 で上書き**（下記は初期想定。最新は [ADR-009](ADR-009_dinosaur_pipeline_phase1_tech_stack.md) を参照）
  1. ~~`junki-voice`~~ → **`research-skill` が #1 に**（なーたん明示：再現性目的）
  2. `junki-voice`: fish audio API呼び出し
  3. `manami-script`: 台本生成
  4. `junki-edit`: **Remotion** 合成（ffmpeg ではなく Remotion 採用・ADR-009）
  5. `nishi-video`: Seedance + フリー素材取得
  6. `publish-youtube`: YouTube Data API（unlisted まで）
  7. `hina-thumbnail`: サムネ案出し

### 移行プラン

| Phase | 内容 | 完了条件 |
| --- | --- | --- |
| **Phase 0**（本ADR） | ディレクトリ骨格作成・既存メモのアーカイブ | 本ファイル merge / `pipeline/` `episodes/` `archive/` 作成 |
| **Phase 1** | 技術スタック確定（映像・編集・公開） | `pipeline/config/*.yml` に値が入る |
| **Phase 2** | EP01 を新構造に移植 | `episodes/EP01_triceratops_frill/` に成果物集約 |
| **Phase 3** | 最初の skill（`junki-voice`）実装 | fish audio呼び出しがコードで完結 |
| **Phase 4** | 残stage の skill 化 | EP単位で `make all` で動く |
| **Phase 5** | YouTube公開まで自動化 | 無人で1本公開できる |

## 結果（期待される効果）

- EP数が増えても「どこに何があるか」が一意になる
- 自動化スクリプトがch横断ではなくchローカルで完結し、責務が単純化される
- 既存の議事録は履歴として残り、現在進行ファイルと混在しなくなる
- 各メンバーの仕事を skill として再利用可能な形に分解する圧力が働く

## トレードオフ

- `_pm_*.md` `_proposal_*.md` 等の既存ファイル群を **archive に移動する作業が発生**（次ターン以降・なーたん承認後）
- 一時的に「manami の作業を依頼する場所」と「pipeline の prompt」が重複する（Phase 2-4 の間）
- skill 化が進むまでは pipeline が空のフォルダ群に見える（README で意図を明示してカバー）

## 関連

- ADR-006（恐竜chトーン軌道修正）— pipeline で守るトーン・NG語彙の根拠
- ADR-007（3ソース調達戦略）— `pipeline/config/video_sources.yml` の根拠
- `03_production_workflow.md` — 人手版ワークフローの正本（pipeline はこれを機械化したもの）

## 次アクション

1. `pipeline/` `episodes/_template/` `archive/` `.claude/skills/` のディレクトリと README を作成（本ターン）
2. アーカイブ移動候補リストを `_archive_candidates_2026-06-07.md` に提示（本ターン）
3. なーたんの承認後、archive 移動を実行（次ターン）
4. 技術スタック・ヒアリング（映像・編集・公開）を順に進めて `pipeline/config/*.yml` を埋める（後続ターン）
