# episodes/ — EP単位の中間成果物

> 1エピソードの「全部」がこのフォルダ配下で完結する設計。
> パイプラインの設計は [`pipeline/README.md`](../pipeline/README.md)、戦略は [`decisions/ADR-008`](../../../decisions/ADR-008_dinosaur_automation_pipeline_architecture.md)。

## 命名規則

- ディレクトリ名: `EP{NN}_{slug}/`
  - 例: `EP01_triceratops_frill/`, `EP02_stegosaurus_plates/`
- slug は英小文字＋アンダースコア。日本語禁止（パイプライン処理で文字化け回避）

## 新規EPの立ち上げ

```bash
cp -r episodes/_template episodes/EP{NN}_{slug}
# その後、00_meta.yml を編集してテーマ・公開予定日を埋める
```

## ディレクトリ構造（`_template/` を参照）

| パス | 内容 | 主な書き手 |
| --- | --- | --- |
| `00_meta.yml` | タイトル・slug・状態・公開予定・テーマ要約 | PM（最初） / 全 stage（状態更新） |
| `01_research/` | 学術ソース・ファクト集（manami 領域） | stage 01 |
| `02_script/` | 構成案・台本（manami 領域） | stage 02 |
| `03_video/` | 取得済みクリップ・図解（nishi 領域） | stage 03 |
| `04_voice/` | fish audio 生成音声・タイミング情報（junki 領域） | stage 04 |
| `05_edit/` | 編集プロジェクト・最終mp4（junki 領域） | stage 05 |
| `06_publish/` | サムネ・概要欄・タグ・公開メタ（hina + junki 領域） | stage 06 |
| `99_logs/` | 各 stage の実行ログ・失敗記録 | 全 stage |

## 状態管理

`00_meta.yml` の `status` フィールドで管理する：

```
draft → researching → scripting → voicing → videoing → editing → reviewing → publishing → published
                  ↑                                                          ↓
                  └── on_hold（保留）─────────────────────────────────────────┘
```

- 1stage終わるごとに状態を進める
- ゲート（品質チェック・なーたん承認）は `reviewing` で止める

## 既存EP01の扱い

EP01（トリケラトプスのフリル）の中間成果物は現状 `channels/channel_02_dinosaur/` 直下に散在している。
ADR-008 Phase 2 で `episodes/EP01_triceratops_frill/` に移植する。
移植までは現状の `_proposal_from_manami_ep01_structure_v1.1_2026-06-02.md` 等を参照する。
