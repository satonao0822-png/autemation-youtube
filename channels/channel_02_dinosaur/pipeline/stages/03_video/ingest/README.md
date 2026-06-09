# 03_video/ingest — material-ingest skill 実装場所

> ADR-010 の中核 skill。なーたんが `inbox/` に動画を放り込むと自動振り分けする。
> Phase 3 で実装。本ファイルは設計メモ・実装ステップ。

## 責務

1. `assets/library/02_magnific/inbox/*.mp4` を検知
2. 各動画について：
   - ffmpeg で 10秒分・1秒1枚 = 10枚スクショ抽出（一時ファイル）
   - Claude Vision（Sonnet 4.6）で5+1軸判定
   - Google Drive にアップロード
   - preview（代表1枚）をローカル `preview/` または `species/{x}/preview/` に配置
   - `_index.yml` と `_metadata.md` に追記
   - inbox の元 mp4 を削除（容量解放）
3. confidence 低いものは `_uncertain/` に preview を置く（なーたん 目視承認待ち）
4. 月次コストログを `episodes/_logs/material_ingest_cost.yml` に追記

## 入力

- `assets/library/02_magnific/inbox/*.mp4`
- `pipeline/config/storage.yml`
- `pipeline/prompts/material_classification.md`
- `assets/library/02_magnific/_tag_dictionary.yml`
- 環境変数: `ANTHROPIC_API_KEY`, `GOOGLE_OAUTH_CLIENT_SECRET`

## 出力

- Google Drive 上の動画ファイル
- ローカル: `_index.yml` 追記、`preview/*.jpg`、`_metadata.md` 追記
- ログ: `episodes/_logs/material_ingest_cost.yml`

## 実装ステップ（Phase 3）

### Step 1: 環境準備

- Node.js / TypeScript or Python 環境セットアップ
  - **言語選定（暫定）**: TypeScript（Remotion との統一・@anthropic-ai/sdk が成熟）
- Google Cloud Console で OAuth2 クライアント作成（Drive API 有効化）
- `.env` に `ANTHROPIC_API_KEY` と OAuth 設定追加

### Step 2: ffmpeg スクショ抽出

```bash
ffmpeg -i inbox/foo.mp4 -vf fps=1 -t 10 tmp/foo_%02d.jpg
```

10枚生成。完了したら次へ。

### Step 3: Claude Vision 判定

- `pipeline/prompts/material_classification.md` をシステムプロンプトとして使用
- 10枚画像 + プロンプトを Sonnet 4.6 に送信
- 構造化 JSON 出力（tool use 推奨）
- 失敗時のリトライ・タイムアウト・予算超過チェック

### Step 4: 判定結果に基づく振り分け

| confidence | アクション |
| --- | --- |
| ≥ 0.7 | 自動で `species/{x}/preview/` 等に配置・Drive アップ |
| 0.4 - 0.7 | `_uncertain/` に preview 配置・なーたん要確認 |
| < 0.4 | `_uncertain/` + 警告ログ |

### Step 5: Google Drive アップロード

- OAuth2 トークンで認証
- Drive の対応フォルダ作成（存在しなければ）
- 動画 mp4 をアップロード（resumable upload）
- 共有設定: アクセス制限あり（リンクを知っている人のみ）
- ファイルID と URL を `_index.yml` に記録

### Step 6: メタ書き戻し

- `_index.yml` に machine_readable レコード追記
- `_metadata.md` の人間向け表に1行追加（同期）

### Step 7: ローカル削除・ログ

- inbox の元 mp4 を削除
- スクショ一時ファイルを削除
- コストログに今回の Vision API 利用料を追記
- 月次予算超過チェック → 800円で alert / 1000円で取り込み停止

## ファイル構成（実装済 2026-06-08）

```
pipeline/stages/03_video/ingest/
├── README.md            ← このファイル
├── package.json         ← Node.js依存
├── tsconfig.json
├── .env.example         ← 環境変数テンプレ（実物は .env / .gitignore除外）
├── src/
│   ├── main.ts          ← エントリポイント（全体フロー）
│   ├── auth.ts          ← OAuth 初回認証（npm run auth）
│   ├── driveClient.ts   ← Drive API ラッパー（list/download/move/trash/rename/ensureFolder）
│   ├── extractFrames.ts ← ffmpeg で10秒・10枚抽出 + sharp で preview縮小
│   ├── classify.ts      ← Claude Vision Sonnet 4.6 で5+1軸判定
│   ├── duplicateDetect.ts ← md5/サイズ名/視覚類似度の3段重複検出
│   ├── pathResolver.ts  ← 分類結果 → Drive subfolder ID + ローカルパス
│   ├── updateIndex.ts   ← _index.yml / _duplicate_log.yml / _metadata.md / cost log
│   └── types.ts         ← 共通型定義
└── tests/               ← 未実装
```

## セットアップ手順

### 1. なーたんの作業（GCP Console）

1. https://console.cloud.google.com/ で新規プロジェクト作成
2. **Drive API 有効化**（APIライブラリで検索 → 有効化）
3. **OAuth同意画面**設定（外部 / テストユーザーに自分のメール追加 / スコープ: `.../auth/drive`）
4. **OAuth クライアントID 作成**（デスクトップアプリ） → credentials.json ダウンロード
5. credentials.json を `~/.config/dino-ch/credentials.json` に配置

### 2. 依存インストール

```bash
cd channels/channel_02_dinosaur/pipeline/stages/03_video/ingest/
npm install
```

### 3. .env 設定

```bash
cp .env.example .env
# .env を編集（ANTHROPIC_API_KEY と credentials パスを設定）
```

### 4. OAuth 初回認証

```bash
npm run auth
# → ブラウザ開く → Google認証 → token.json 自動保存
```

### 5. 動作確認（dry-run）

```bash
npm run ingest:dry
# → _inbox/ 中身を list するだけで Drive 操作なし
```

### 6. 本番実行

```bash
npm run ingest
# → _inbox/ の全動画を処理（重複検出 → 振り分け or trash）
```

## 動作フロー（実装版）

1. .env / OAuth トークン読み込み
2. 月次予算チェック（超過時は中断）
3. Drive `_inbox/` の動画 list
4. 各動画について:
   a. **Step1-2 重複検出**（md5完全一致 or サイズ+名前類似）→ 即 trash + log
   b. 一時 download
   c. ffmpeg で 10秒/10枚スクショ抽出
   d. **Step3 視覚的重複検出**（Vision で既存 preview と比較）→ trash or 続行
   e. Vision Sonnet 4.6 で5+1軸判定
   f. confidence < 0.7 → `_uncertain/` 配置 / それ以上 → `species/{x}/`, `environment/{place}/` 等
   g. Drive 上で `_inbox/` から move + rename
   h. preview ローカル保存
   i. `_index.yml` / `_metadata.md` / コストログ更新
   j. 一時ファイル削除
5. サマリ出力（ingested / uncertain / duplicate_trashed / error 件数 + 今回コスト）

## skill 化

最終的に `.claude/skills/material-ingest/` 配下に SKILL.md + 上記スクリプトをラップ。
なーたんが「素材振り分けて」と言うと skill が起動 → inbox/ 全件処理。

## 注意

- **コスト上限 月¥1000**（`storage.yml > cost_management`）。超過時は自動停止
- **Vision 誤判定リスク**: Sonnet 4.6 でも種誤判定はあり得る。`_uncertain/` 退避と目視ゲートが安全弁
- **Drive 認証**: OAuth トークンは `.env` に格納・`.gitignore` 対象。リポジトリに乗せない

## 重複検出（material_reuse_policy.yml > duplicate_detection）

2026-06-08 なーたん要望: 「見境なくDLすると過去履歴が分からなくなる。_inbox/ 投入タイミングで重複を検出してゴミ箱に入れて」

### 検出フロー（Vision 判定の前段）

1. 新規 mp4 が _inbox/ に投入される
2. **Step 1: ファイルハッシュ照合**
   - md5 hash を計算 → `_index.yml` 全レコードの hash と比較
   - 完全一致 → 即ゴミ箱（Drive trashed=true）+ `_duplicate_log.yml` に記録
3. **Step 2: ファイルサイズ + 名前類似度**
   - サイズ完全一致 + 名前類似 → Step 3 へ
4. **Step 3: 視覚類似度（Claude Vision Sonnet 4.6）**
   - 新規動画のサムネ vs 既存動画のサムネ（preview/*.jpg）
   - 類似度 ≥ 0.92 → ゴミ箱
   - 類似度 0.80-0.92 → `_uncertain/` で要目視
   - 類似度 < 0.80 → 重複なしと判定 → Vision 振り分け判定へ
5. **重複なし** と判定されたら通常の Vision 振り分け（種・場所・行動等）に進む

### ゴミ箱送りの記録

```yaml
# assets/library/02_magnific/_duplicate_log.yml
duplicates:
  - new_file: M053_xxx.mp4
    drive_file_id: 1abc...
    existing_id: M021
    existing_path: species/triceratops/walk_wide_forest_dawn_M021.mp4
    match_method: visual_similarity  # file_hash / size_name / visual_similarity
    match_score: 0.95
    trashed_at: 2026-06-XX
    action: trashed
```

## 在庫不足検知（ADR-011 / material_reuse_policy.yml）

material-ingest 自体は素材を「入れる」skill だが、`03_video` stage の **素材選定時に在庫不足を検知** する責務を持つ：

1. シーン要件（種・場所・行動・構図）から候補を `_index.yml` で検索
2. 各候補の `used_in` 配列を確認
3. `material_reuse_policy.yml` のルール（連続NG + 4EP cooldown）違反候補を除外
4. 全候補が cooldown 中なら **`shortage_alert` 発火**
5. PM がなーたんに依頼（窓口Claude経由・テンプレは `material_reuse_policy.yml > shortage_alert.request_template`）
6. なーたんが Magnific or フリー素材で追加 → `_inbox/` → ingest skill が振り分け → 在庫補充完了

実装は Phase 3 で素材選定ロジックと統合。
