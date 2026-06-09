# ADR-011: 恐竜ch 素材運用の軌道修正 — Magnific抑制 + 重複回避 + BAN回避最優先

- **Status**: Accepted
- **Date**: 2026-06-08
- **Deciders**: なーたん（決裁）／ 窓口Claude（起案）
- **Supersedes**: [ADR-007](ADR-007_dinosaur_video_3source_procurement_strategy.md) §配分比率（運用解釈変更）
- **Channel scope**: `channel_02_dinosaur` のみ

## コンテキスト

ADR-007 で「無料ストック25% / Magnific35% / Seedance40%」の3ソース戦略を採用したが、ADR-010 で素材取り込み自動化を設計する段階で、なーたんから運用上の重要な軌道修正があった：

1. **汎用素材（環境・トランジション）はフリー素材サイトで基本完結する**ことが判明
2. Magnific のリソースは **種別（species）の生成に優先配分**したい
3. **YouTube の重複コンテンツ判定** が BAN 直結。同じ素材を毎回・2EPに1回使い回すのは危険
4. 在庫不足時は **PM がなーたんに都度依頼**（自動生成しない）
5. **チャンネル BAN が最も恐れること**

「BAN 回避」はパイプライン全工程の **最優先制約** として明文化する必要がある。

## 決定

### 1. 3ソース配分の見直し（戦略本体は維持・運用解釈のみ変更）

| ソース | 旧（ADR-007） | 新（本ADR） | 主な用途 |
| --- | --- | --- | --- |
| freestock | 25% | **50%** | 汎用素材の主軸（環境・トランジション・抽象） |
| magnific | 35% | **15%** | 種別の補助カット（種別不問の脇役） |
| seedance | 40% | **35%** | 種別の主役カット（API再開後） |

合計100%。戦略「3ソース併用」は維持。

### 2. Magnific 運用方針

- **種別優先**（species/ 配下に行く素材を最優先生成）
- **汎用素材生成は抑制**（必要なら生成OKだが基本フリー素材で）
- 月予算は ADR-010 のVision コスト管理と分離（Magnific 契約は別途・月1000円契約済み）

### 3. 重複コンテンツ判定回避ポリシー

| ルール | 内容 |
| --- | --- |
| **連続使用禁止** | 同一クリップを隣接EPで使わない |
| **4EP cooldown** | 直近4EP内で使ったクリップは再利用しない |
| **BGM 例外** | メインBGM（DOVA the water temple）はチャンネル統一でOK（アイデンティティ要素） |
| **トランジション** | 連続NG + 直近5EP cooldown（特に目立つため長め） |
| **anatomy / fallback_illustration** | 連続NG + 直近6EP cooldown（再利用感が強く出るため） |
| **検知** | `_index.yml > used_in` を参照して material-ingest skill / PM が判定 |

詳細は `pipeline/config/material_reuse_policy.yml`。

### 4. 在庫不足ワークフロー

- material-ingest skill / PM が「全候補が cooldown 中」を検知
- **なーたんに都度依頼**（窓口Claude経由・formal な PR/issue 化はしない）
- 依頼テンプレ:
  ```
  EP{NN} で {category}/{place_or_species} の素材が不足しています。
  既存 N 本は全て直近 4EP 以内に使用済み。
  Magnific or フリー素材サイトで {期待する内容} の素材を {本数} 追加お願いします。
  ```
- なーたん作業: Magnific生成 or フリー素材DL → `_inbox/` に追加 → skill が振り分け

### 5. BAN 回避を最優先制約として明文化

- `pipeline/config/channel.yml` に `ban_avoidance` セクション追加
- これは恐竜ch の **全 stage の上位制約**
- 学術整合性・トーン・重複回避すべて BAN 回避の手段として位置付け
- ランク付きリスクと緩和策を機械可読化

## トレードオフ

- **得**: BANリスク最小化 / Magnific 生成コスト最適化 / フリー素材活用合理化 / 「何を生成すべきか」が明確化
- **失**: 在庫管理コスト増（4EP cooldown ルール運用）/ 在庫不足時のなーたん依頼頻度

## 反映先（本ADR採択に伴うファイル更新）

- [x] `pipeline/config/video_sources.yml` — 配分比率と運用方針を反映
- [x] `pipeline/config/material_reuse_policy.yml`（新規）— 重複回避ポリシーの機械可読版
- [x] `pipeline/config/channel.yml` — `ban_avoidance` セクション追加
- [x] `pipeline/stages/03_video/ingest/README.md` — 在庫不足検知 + 依頼通知ロジック追加
- [x] `assets/library/02_magnific/_index.yml` — `used_in` フィールド運用ルール強化
- [x] ADR-010 の skill 仕様に重複検知を追加

## 関連

- ADR-007（3ソース戦略・本ADRで運用解釈を上書き）
- ADR-010（material-ingest skill 仕様に重複検知が追加される）
- `feedback_no_youtube_ban_risk` memory（BAN回避が最優先制約）
