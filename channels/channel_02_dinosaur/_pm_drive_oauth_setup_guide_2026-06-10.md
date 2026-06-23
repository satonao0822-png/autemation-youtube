# Google Drive OAuth 設定手順書（なーたん操作版）

- **対象**: material-ingest skill 初回認証
- **想定所要**: 15-25分（GCP Console 慣れていれば 10分）
- **起案**: 恐竜チャンネルPM（2026-06-10）
- **前提**: なーたん Google アカウント（Drive オーナー: nao.sato@or-design.co.jp）でログイン中
- **根拠**: ADR-010 v2

---

## 全体フロー

```
[なーたん] GCP Console 設定 (15分)
   ↓
[なーたん] credentials.json ダウンロード → 指定パスに配置
   ↓
[PM/Claude] .env 生成・npm install
   ↓
[なーたん] npm run auth でブラウザ承認 (1-2分)
   ↓
   token.json 自動保存 → 以後は自動再認証
   ↓
[完了] skill が Drive を操作できる状態に
```

---

## STEP 1: GCP プロジェクト作成 or 選択（なーたん作業 3分）

1. https://console.cloud.google.com/ にアクセス
2. 画面上部のプロジェクト選択ドロップダウン
3. 既存プロジェクトを使う場合: 適当なものを選択 → STEP 2 へ
4. 新規作成する場合:
   - 「新しいプロジェクト」をクリック
   - プロジェクト名: `dino-channel-material-ingest`（任意）
   - 組織: なし or 既定のまま
   - 「作成」ボタン

**注意**: プロジェクトIDは後で参照しないので何でも良い。GCP の課金は今回の用途では発生しない（Drive API 無料枠内）。

---

## STEP 2: Drive API 有効化（なーたん作業 1分）

1. 左サイドバーから「APIとサービス」→「ライブラリ」
2. 検索欄に `Google Drive API` と入力
3. 検索結果の「Google Drive API」をクリック
4. 「**有効にする**」ボタンをクリック
5. 「APIが有効になりました」のメッセージが出れば OK

---

## STEP 3: OAuth 同意画面の設定（なーたん作業 5-8分）

1. 左サイドバーから「APIとサービス」→「OAuth 同意画面」
2. ユーザータイプ選択画面（初回のみ）:
   - **「外部」を選択** → 「作成」
   - 理由: 個人 Google アカウントなので内部組織ユーザーではない
3. アプリ情報入力:
   - アプリ名: `dino-channel-material-ingest`
   - ユーザーサポートメール: なーたんのメール (nao.sato@or-design.co.jp)
   - アプリのロゴ: スキップ
   - アプリドメイン: 全部空欄でOK
   - 承認済みドメイン: 空欄でOK
   - 開発者の連絡先情報: なーたんのメール
   - 「保存して次へ」
4. スコープ画面:
   - 「スコープを追加または削除」をクリック
   - 検索欄に `drive` と入力
   - **`.../auth/drive`** (フルアクセス) にチェック
     - 理由: list / download / move / trash / upload すべてに必要
   - 「更新」→「保存して次へ」
5. テストユーザー追加:
   - 「+ ADD USERS」
   - なーたん自身のメール (nao.sato@or-design.co.jp) を追加
   - 「保存して次へ」
6. 概要確認 → 「ダッシュボードに戻る」

**重要**: アプリ公開（本番審査）は不要です。テストユーザー枠で使い続けます（個人利用なので 100ユーザー上限まで OK）。

---

## STEP 4: OAuth クライアントID 作成（なーたん作業 3分）

1. 左サイドバーから「APIとサービス」→「認証情報」
2. 上部の「+ 認証情報を作成」→「OAuth クライアントID」
3. アプリケーションの種類: **「デスクトップアプリ」**
   - 重要: 「ウェブアプリ」ではない。Node.js でローカル実行するため
4. 名前: `dino-channel-ingest-cli`（任意）
5. 「作成」をクリック
6. 「OAuth クライアントを作成しました」モーダルが出る:
   - 「**JSONをダウンロード**」をクリック
   - ファイル名は `client_secret_xxxxx.apps.googleusercontent.com.json` のような形

---

## STEP 5: credentials.json を指定パスに配置（なーたん作業 1-2分）

ダウンロードした JSON ファイルを、所定の場所にリネームして移動します。

### macOS Finder での操作

1. ダウンロードした JSON ファイルを `credentials.json` にリネーム
2. Finder で `Cmd+Shift+G`（移動メニュー）
3. 入力欄に: `~/.config/dino-ch/`
4. 「移動」をクリック → ディレクトリが**存在しなければ**:
   - 一旦 `~/.config/` で移動
   - 右クリックで「新規フォルダ」→ `dino-ch` を作成
   - その中に入る
5. リネーム済みの `credentials.json` をドラッグして配置

### または、ターミナルで操作する場合

```bash
mkdir -p ~/.config/dino-ch
mv ~/Downloads/client_secret_*.json ~/.config/dino-ch/credentials.json
ls -la ~/.config/dino-ch/credentials.json
```

**確認**: `~/.config/dino-ch/credentials.json` というパスでファイルが存在する状態にする。

---

## STEP 6: .env ファイル作成（PM 作業・なーたん操作不要）

PM が `.env.example` を元に `.env` を作成します。
このタイミングでなーたんから **ANTHROPIC_API_KEY**（Claude API キー）を共有してもらう必要があります。

```
.env の中身（例）:

ANTHROPIC_API_KEY=sk-ant-XXXXXXXXXX
GOOGLE_OAUTH_CLIENT_SECRET_PATH=/Users/satonao/.config/dino-ch/credentials.json
GOOGLE_OAUTH_TOKEN_PATH=/Users/satonao/.config/dino-ch/token.json
DRIVE_ROOT_FOLDER_ID=1PRy9c_Qm5_f4Hc7k1eTushVWLk420De5
MONTHLY_BUDGET_YEN=1000
INGEST_MODE=production
```

**なーたんお願い**: ANTHROPIC_API_KEY をすでに発行済みであればそれを使い回し（Magnific関連等で使ってるキーがあるはず）。新規発行が必要であれば https://console.anthropic.com/ から発行。

---

## STEP 7: 依存インストール（PM作業）

```bash
cd /Users/satonao/Documents/非属人youtube作成/channels/channel_02_dinosaur/pipeline/stages/03_video/ingest/
npm install
```

- ffmpeg は `ffmpeg-static` パッケージでバンドルされるためシステム ffmpeg 不要
- sharp は ネイティブビルド（macOS arm64 は prebuilt あり・通常成功）
- 所要 1-2分

### 想定エラー

- **Node.js バージョン**: 20以上必須。`node --version` で確認。古ければ `nvm install 20` 等で更新
- **sharp ビルド失敗**: `npm install --include=optional sharp` で再試行
- **権限エラー**: グローバルインストールではないので発生しない想定

---

## STEP 8: OAuth 初回認証（なーたん 1-2分）

PM がコマンド実行 → なーたんがブラウザで承認します。

### 8.1 PM がターミナルで実行

```bash
cd /Users/satonao/Documents/非属人youtube作成/channels/channel_02_dinosaur/pipeline/stages/03_video/ingest/
npm run auth
```

### 8.2 表示されるURL

ターミナルに以下のような出力が出ます:

```
以下のURLをブラウザで開いて認証してください:

https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=...&prompt=consent

認証後、自動的にコールバックを受け取ります...
```

### 8.3 なーたんがブラウザで承認

1. 上記URLをブラウザで開く（同じMac上で）
2. なーたんの Google アカウントを選択
3. 「Google hasn't verified this app（このアプリは Google に確認されていません）」警告:
   - これは「未審査アプリ」（テストユーザー枠）の標準警告
   - 「**詳細**」をクリック → 「**dino-channel-material-ingest（安全ではないページ）に移動**」をクリック
4. 権限スコープ確認: 「Google Drive の表示・管理」が表示される → 「**続行**」
5. 「認証完了。このタブは閉じて構いません。」と表示されたら成功
6. ターミナル側にも `OK: トークンを /Users/satonao/.config/dino-ch/token.json に保存しました` が出る

### 8.4 確認

```bash
ls -la ~/.config/dino-ch/
# credentials.json と token.json の2つがあれば完了
```

token.json は refresh_token を含むので、以後の `npm run ingest` は自動で再認証されます（ブラウザ操作不要）。

---

## トラブルシューティング

### Q1. ブラウザの「安全ではないページ」警告がブロックされる

**対応**: STEP 3-5 でテストユーザーに自分のメールが追加されているか確認。追加していれば「詳細」リンクが必ず表示される。

### Q2. リダイレクトで「localhost に接続できません」

**対応**: ターミナルの `npm run auth` が起動した状態で同じMac上のブラウザからアクセスする必要がある。別端末からの承認は不可。

### Q3. token.json が保存されない

**対応**: `GOOGLE_OAUTH_TOKEN_PATH` のディレクトリが存在するか確認。スクリプト側で自動 mkdir するが、書き込み権限がないと失敗する。

### Q4. 「invalid_grant」エラー

**対応**: token が古い/失効。`~/.config/dino-ch/token.json` を削除して `npm run auth` を再実行。

### Q5. credentials.json の中身が想定外

**対応**: `installed` キーが含まれる JSON か確認:

```json
{
  "installed": {
    "client_id": "...",
    "client_secret": "...",
    "redirect_uris": ["http://localhost"]
  }
}
```

`web` キーになっている場合は STEP 4 で「デスクトップアプリ」ではなく「ウェブアプリ」を選んでいる。やり直し。

---

## 完了チェックリスト

なーたん作業:
- [ ] GCP プロジェクト作成 or 既存選択
- [ ] Drive API 有効化
- [ ] OAuth 同意画面設定（外部 / テストユーザーに自メール）
- [ ] OAuth クライアントID 発行（デスクトップアプリ）
- [ ] credentials.json を `~/.config/dino-ch/credentials.json` に配置
- [ ] ANTHROPIC_API_KEY を PM に共有
- [ ] ブラウザで Google アカウント承認
- [ ] token.json 生成確認

PM作業:
- [ ] `.env` ファイル作成（.env.example をコピー → 値設定）
- [ ] `npm install` 実行
- [ ] `npm run auth` 実行 → なーたんブラウザ承認案内
- [ ] token.json 生成確認

---

## セキュリティ確認

- `credentials.json` / `token.json` は **`~/.config/dino-ch/`** に配置（リポジトリ外）
- `.env` は `channels/channel_02_dinosaur/pipeline/stages/03_video/ingest/` 直下（.gitignore で除外済）
- すべて `.gitignore` で除外パターン確認済（リポジトリ root の `.gitignore`）:
  - `.env`, `.env.*`
  - `**/credentials.json`
  - `**/token.json`

---

## 改訂履歴

- 2026-06-10 v1: 起案（恐竜チャンネルPM）
