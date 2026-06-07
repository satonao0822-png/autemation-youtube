# ADR-009: 恐竜ch パイプライン Phase 1 — 技術スタック決定

- **Status**: Accepted
- **Date**: 2026-06-07
- **Deciders**: なーたん（決裁）／ 窓口Claude（起案）
- **Supersedes**: [ADR-008](ADR-008_dinosaur_automation_pipeline_architecture.md) の `§移行プラン > skill化の優先順位` を上書き
- **Channel scope**: `channel_02_dinosaur` のみ

## コンテキスト

ADR-008（Phase 0）でパイプラインの骨格は確定した。Phase 1 として、自動化の心臓部となる4軸の技術スタックを決める必要があった：

1. リサーチ（ネタ選定・一次情報収集）
2. 動画生成
3. 編集
4. YouTube公開

技術選定の細部はヒアリングしながら決める方針（ADR-008 §スコープと前提）。本ADRで4軸ともに方向確定。

## 決定

### 1. リサーチ — **海外論文参照・skill化最優先**

- **方式**: Claude（Web検索）で海外論文・一次情報を収集 → 台本ソースに事実ベースで残す
- **論文API連携**（CrossRef / Semantic Scholar / arXiv 等）は必要に応じて段階的に追加
- **特記**: なーたんから「リサーチ作業自体をスキル化したい（次動画への再現性を持たせたい）」と明示。skill化の **最優先** に位置付ける

### 2. 動画生成 — **Seedance + フリー素材サイト併用**

- **Seedance**: 採用は **確定**。API実装・課金再開は将来
- **フリー素材サイト**: 併用前提。具体的なサイト選定（Pexels / Pixabay 以外を含む）は将来
- **当面の運用**: Magnific（契約済）+ assets/library 既存資産 + フリー素材手動取得で回す
- **3ソース戦略**（ADR-007）は継続。Seedance 配分（40%）は再開時に有効化

### 3. 編集 — **Remotion**

- React/TypeScript で動画をコード記述
- Node.js 依存。学習コストはあるが、完全自動化との相性は最高
- テロップはコンポーネントとして実装（焼き込まずレイヤー分離の要件も React の階層構造で自然に満たす）
- BGM・SE・ナレーション同期も Remotion の Composition で記述
- ffmpeg は Remotion の内部で使われる（出力時）。直接書く必要はほぼ無し

### 4. YouTube公開 — **unlisted（限定公開）→ public 段階フロー**

- アップロード時の privacy: **`unlisted`**（限定公開）
- なーたん が URL で確認 → 問題なければ **手動で `public` 切替**（YouTube Studio で操作）
- API は YouTube Data API v3
- 完全無人 public 化は当面しない（Phase 5 で評価）

## skill化の優先順位（ADR-008 を上書き）

| 順位 | skill 名 | 内容 | 備考 |
| --- | --- | --- | --- |
| 1 | `research-skill` | リサーチ・一次ソース収集 | **最優先**（なーたん明示・再現性目的） |
| 2 | `junki-voice` | fish audio API呼び出し | 機械的・自動化容易 |
| 3 | `manami-script` | 台本生成 | リサーチ skill の出力を消費 |
| 4 | `junki-edit` | Remotion で編集合成 | Remotion 採用が前提 |
| 5 | `nishi-video` | Seedance + フリー素材取得・図解差し替え | Seedance再開・素材サイト選定が先 |
| 6 | `publish-youtube` | YouTube Data API（unlisted 上げまで） | public 切替は手動継続 |
| 7 | `hina-thumbnail` | サムネ案出し | 実装はなーたん手動継続 |

注: `research-skill` を `manami-research` でなく独立命名にしているのは、PM レビューも含めた一連の流れ全体を skill 化する意図（人格に閉じない）。

## 既存 config への反映

本ADR採択に伴い以下を更新：

- `pipeline/config/video_sources.yml` — Seedance「採用確定・実装は将来」を明示
- `pipeline/config/publish.yml` — `default_privacy: unlisted` に変更、手動public切替フロー明記
- `pipeline/config/edit.yml` — 新規作成（Remotion 採用宣言）
- `pipeline/stages/05_edit/README.md` — Remotion 前提に書き換え
- `pipeline/stages/01_research/README.md` — 海外論文参照・skill化最優先を反映
- `pipeline/prompts/research.md` — 一次ソース必須・事実ベース台本ソース化

## 次アクション

- Phase 2（EP01 を新構造に移植）に進む
- 並行して **research-skill の設計**に着手（最初のskill実装候補）
- EP02 以降の量産設計は research-skill の再現性が見えてから

## 関連

- ADR-006（トーン軌道修正）
- ADR-007（3ソース調達戦略）
- ADR-008（パイプライン骨格 / Phase 0）
- `pipeline/README.md`（Phase 進行状況）
