# ADR-010: 恐竜ch 素材取り込み自動化（material-ingest skill）と クラウド保管

- **Status**: Accepted（2026-06-10 v2 改訂・実装フェーズ前倒し）
- **Date**: 2026-06-08 起票 / 2026-06-10 前倒し決裁
- **Deciders**: なーたん（決裁）／ 窓口Claude（起案）
- **Supersedes**: [ADR-009](ADR-009_dinosaur_pipeline_phase1_tech_stack.md) §skill化の優先順位（`material-ingest` を割り込ませる）
- **Channel scope**: `channel_02_dinosaur` のみ

## 2026-06-10 前倒し決裁（v2）

**決裁内容**: skill 実装フェーズを **Phase 3 → 即時着手** に前倒し。

**判断根拠**:
1. Drive `_inbox/` に Pexels 初期 50 本（約 1.78GB）が振り分け待ちで滞留中（2026-06-07 投入・2026-06-10 監査済）
2. Shorts主軸戦略（ADR-012）下では Pexels 一括投入の頻度・量が増える（200本目標）。手動振り分けは持続不可
3. Vision API 月予算 ¥1,000 は pre_approved 枠内（5,000円承認ルール下限内）・追加承認不要
4. 実装中も Shorts 第1本（EP01）作業は並行進行可能（Drive _inbox の `4584661_Rock_Grass` 等は手動取り出しで対応）

**実装着手指示先**: 恐竜チャンネルPM（直接発令）

**並行動作**: manami 台本 v3.3 起案・nishi/junki/hina Shorts発注フェーズと並走

**ADR-010 v2 で変わるもの**:
- 実装スコープのチェックリスト OAuth/skill実装/EP02運用開始 をPhase 3 → 即時に変更
- Drive `_inbox/` 50 件の手動振り分けは **やめて skill 完成後に skill 経由で一括処理**（Q1=PM実行・Q2=バオバブ削除+3件_uncertain・Q3=skill前倒しの判断と整合）


## コンテキスト

なーたんから「Magnific で動画を量産ダウンロードするが、ローカル容量が圧迫される。動画を放り込んだら自動でスクショ判定して振り分けてくれる仕組みが欲しい」との要望。

既存 `assets/library/02_magnific/` は4フォルダ（dinosaur_bg / general / nature / transitions）の汎用分類。EP数が増えると「文脈おかしい素材が編集に混入する」リスクが高まる：

- 種違い（トリケラのナレでステゴ素材）
- 時代違い（ジュラ紀シーンで白亜紀植生）
- 行動違い（食事ナレで戦闘）
- 構図違い（全体像が欲しいのに部位アップ）
- 環境違い（夜のシーンに昼素材）

「クローリングしやすさ」と「文脈齟齬の構造的防止」を両立するため、メタを **機械可読化** + **自動付与** する仕組みを入れる。

## 決定

### 1. 素材本体は Google Drive に保管

- ローカルには **`_index.yml`（メタ）+ `preview/*.jpg`（代表1枚・数十KB）** のみ保持
- 動画本体は **Google Drive**（なーたん既存課金プラン内・追加コストなし）
- 編集時（Remotion 実行時）のみ Drive から動画取得 or ストリーミング

### 2. material-ingest skill で振り分けを自動化

入力: なーたんが `inbox/` に放り込んだ mp4
処理:
1. ffmpeg で 10秒分・1秒1枚 = 10枚スクショ抽出
2. **Claude Vision（Sonnet 4.6）** に10枚送って5軸判定（種・時代・行動・構図・環境・光・学術整合性）
3. 判定結果に基づき：
   - Google Drive へアップロード
   - 適切なローカルパス（`species/{x}/` or `environment/{x}/` etc）に preview を配置
   - `_index.yml` に追記
4. confidence 低いものは `_uncertain/` に preview を置く（なーたん 目視確認）
5. ローカルの mp4 を削除（容量解放）

### 3. コスト管理

- Vision API（Sonnet 4.6）想定: 1動画あたり 約5〜10円
- 月100本ペースで **月500〜1000円**
- **月予算上限: ¥1000**（超過時は skill が alert + 取り込み停止 + なーたん再承認）
- CLAUDE.md「1万円以上は必ずなーたん承認 / 新規発生は金額問わず事前共有」に則り、本ADRで事前共有完了
- 月次集計ログを `episodes/_logs/material_ingest_cost.yml` に蓄積

### 4. 既存 02_magnific 構造の置換

- 旧4フォルダ（dinosaur_bg / general / nature / transitions）は **空のため廃止**
- 新構造: `species/` `environment/` `anatomy/` `transitions/` `fallback_illustration/` `inbox/` `_uncertain/` `preview/`
- 詳細は `assets/library/02_magnific/README.md`

### 5. 既存メタ運用との関係

- `_metadata.md`（既存・人間向けライセンス台帳）は **継続**。ライセンス情報・概要欄クレジット作成に必要
- `_index.yml`（新規・機械可読メタ）を **追加**。Claude / skill がクローリングに使う
- material-ingest skill は **両方に書き込む**（同期責任）

### 6. skill 優先順位の更新（ADR-009 を上書き）

| 順位 | skill | 備考 |
| --- | --- | --- |
| 1 | `research-skill` | リサーチ（変更なし） |
| **2** | **`material-ingest`** | **新規割り込み**（なーたん要望・素材取り込み自動化） |
| 3 | `junki-voice` | |
| 4 | `manami-script` | |
| 5 | `junki-edit`（Remotion） | |
| 6 | `nishi-video`（Seedance+ストック） | material-ingest と連携 |
| 7 | `publish-youtube` | |
| 8 | `hina-thumbnail` | |

## 実装スコープ（Phase 1.5 → v2 即時実装に前倒し）

本ADRでは当初 **設計と雛形まで** を進めて実コードは Phase 3 で着手予定だったが、2026-06-10 なーたん決裁により **即時実装** に変更：

- [x] 新フォルダ構造の物理作成
- [x] ADR-010 起票
- [x] `pipeline/config/storage.yml` 作成（Drive保管・Vision設定）
- [x] `pipeline/stages/03_video/ingest/README.md` 作成
- [x] `pipeline/prompts/material_classification.md` 作成（Vision判定プロンプト雛形）
- [x] `assets/library/02_magnific/README.md` / `_tag_dictionary.yml` / `_index.yml` 作成
- [x] `.claude/skills/material-ingest/README.md` 予約
- [ ] **OAuth 設定（Google Cloud Console）— 2026-06-10 着手**
- [ ] **skill 実装（ffmpeg + Claude Vision SDK + Drive API）— 2026-06-10 着手**
- [ ] **Drive `_inbox/` 50件の初回ingest実行**（バオバブ削除+T-Rex/Dinosaur/Skull 3件は`_uncertain/` 行き）
- [ ] EP02 以降での運用開始

## トレードオフ

- **得**: なーたんが「ポンと入れるだけ」になる / 文脈齟齬を構造的に防げる / ローカル容量圧迫解消 / 月数百円で人手数時間/月を節約
- **失**: Vision API コスト（月500-1000円）/ Google Drive OAuth 初期設定が必要 / 判定精度が完璧ではない（_uncertain への退避は必要）
- **判定リスク**: Sonnet 4.6 でも種誤判定・行動誤認はあり得る → confidence 閾値 + 目視ゲートで吸収

## 関連

- ADR-007（3ソース調達戦略）
- ADR-008（パイプライン骨格）
- ADR-009（Phase 1 技術スタック）
- `pipeline/config/storage.yml`
- `assets/library/02_magnific/README.md`
- `pipeline/stages/03_video/ingest/README.md`
