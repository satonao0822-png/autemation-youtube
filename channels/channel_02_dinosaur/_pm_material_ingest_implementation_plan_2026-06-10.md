# material-ingest skill 実装計画書

- **起案**: 恐竜チャンネルPM
- **起案日**: 2026-06-10
- **根拠**: ADR-010 v2（2026-06-10 前倒し決裁）
- **対象**: `channel_02_dinosaur` のみ
- **並行作業**: manami 台本 v3.3 起案・nishi/junki/hina Shorts EP01 発注フェーズと並走

---

## 0. エグゼクティブサマリ

ADR-010 v2 で「Phase 3 → 即時着手」に前倒しされた material-ingest skill について、現状調査の結果、**skill 本体（src/*.ts 9ファイル）は 2026-06-08 時点で実装済み**である一方、storage.yml の番号付きフラット構造再編（2026-06-08）に伴う**型定義 / pathResolver の追従が未完**であることを確認した。

加えて、`.claude/skills/material-ingest/` 配下の SKILL.md（なーたん「振り分けて」発話で起動するための定義書）が**未作成**である。

本計画書では、以下の Phase B-D を順次完了させ、Drive `_inbox/` 50件の初回ingestを実行する。

---

## 1. 現状調査結果（Phase A 完了部分）

### 1.1 実装済みファイル

| パス | 状態 | 備考 |
| --- | --- | --- |
| `pipeline/stages/03_video/ingest/src/main.ts` | 完成 | 全体オーケストレーション・dry-run対応 |
| `pipeline/stages/03_video/ingest/src/auth.ts` | 完成 | OAuth 初回認証フロー（localhost callback） |
| `pipeline/stages/03_video/ingest/src/driveClient.ts` | 完成 | list/download/move/trash/rename/ensureFolder |
| `pipeline/stages/03_video/ingest/src/extractFrames.ts` | 完成 | ffmpeg + sharp で 10枚抽出 + preview縮小 |
| `pipeline/stages/03_video/ingest/src/classify.ts` | 完成 | Claude Sonnet 4.6 で5+1軸判定（プロンプト埋込済み） |
| `pipeline/stages/03_video/ingest/src/duplicateDetect.ts` | 完成 | md5/サイズ名/視覚類似度の3段検出 |
| `pipeline/stages/03_video/ingest/src/pathResolver.ts` | **要修正** | 旧フォルダID（`_inbox`/`species`/`environment_forest`）参照のまま |
| `pipeline/stages/03_video/ingest/src/updateIndex.ts` | 完成 | _index.yml/_duplicate_log.yml/_metadata.md/cost log 更新 |
| `pipeline/stages/03_video/ingest/src/types.ts` | **要修正** | `SubfolderIds` 型が旧キー名構造のまま |
| `pipeline/stages/03_video/ingest/package.json` | 完成 | scripts: build/ingest/ingest:dry/auth |
| `pipeline/stages/03_video/ingest/.env.example` | 完成 | ANTHROPIC_API_KEY/OAuth path/予算 |
| `pipeline/stages/03_video/ingest/tsconfig.json` | 完成 | ES2022/strict |
| `assets/library/02_magnific/_index.yml` | 空（正常） | materials: [] |
| `assets/library/02_magnific/_tag_dictionary.yml` | 完成 | 語彙統制定義 |
| `assets/library/02_magnific/{番号付きフォルダ群}` | 完成 | 28フォルダ（00_inbox〜54_fb_map） |
| `pipeline/prompts/material_classification.md` | 完成 | 判定プロンプト雛形 |
| `pipeline/config/storage.yml` | 完成 | 番号付き subfolder_ids 確定 |

### 1.2 未着手項目

| 項目 | 状態 | Phase |
| --- | --- | --- |
| `types.ts` の `SubfolderIds` を storage.yml 新キー（`00_inbox`/`10_sp_triceratops`等）に追従 | 未 | B |
| `pathResolver.ts` の解決ロジックを新キーに追従 | 未 | B |
| `.claude/skills/material-ingest/SKILL.md` 作成 | 未 | B |
| `.env`（実物）作成 | 未 | C |
| Google Cloud Console プロジェクト / OAuth クライアント | 未 | C（**なーたん作業**） |
| `~/.config/dino-ch/credentials.json` 配置 | 未 | C（**なーたん作業**） |
| `npm install` 実行 | 未 | C |
| `npm run auth` でトークン発行 | 未 | C（**なーたんブラウザ承認**） |
| ffmpeg / node20+ / npm の環境確認 | **未確認** | C |
| `npm run ingest:dry` で動作確認 | 未 | D |
| `_inbox/` 50件本番 ingest | 未 | D |

### 1.3 重要な乖離（要対応）

**storage.yml の新キー構造**:

```yaml
subfolder_ids:
  "00_inbox": "..."
  "01_uncertain": "..."
  "10_sp_triceratops": "..."
  "20_env_forest": "..."
  "30_anatomy": "..."
  "40_tr_fade": "..."
  "50_fb_diagram": "..."
```

**現 types.ts の `SubfolderIds`**:

```typescript
export interface SubfolderIds {
  _inbox: string;
  _uncertain: string;
  species: string;          // ← 廃止された旧階層フォルダ
  environment: string;       // ← 廃止された旧階層フォルダ
  anatomy: string;
  ...
  environment_forest: string;  // ← 新キーでは "20_env_forest"
}
```

**結論**: 現状のまま `npm run ingest` を実行すると、`pathResolver.ts` がフォルダIDを取得できず即エラー。Phase B で必ず修正する。

---

## 2. Phase 分割と所要時間

| Phase | 内容 | 所要 | 担当 | 並行作業との衝突 |
| --- | --- | --- | --- | --- |
| **A** | 設計確認・現状調査・本計画書起こし | 1h（完了） | PM | なし |
| **B** | skill本体修正（types.ts/pathResolver.ts/SKILL.md） | 1.5-2h | PM | なし（manami台本と完全並行） |
| **C** | OAuth設定 + 依存インストール + 初回認証 | 30-60min | **なーたん協力必須** | ブラウザ承認の数分のみなーたん拘束 |
| **D** | Drive `_inbox/` 50件 dry-run → 本番 ingest | 30-60min | PM（実行）+ なーたん（最終確認） | なし |

合計: 約 4-5 時間（Phase A 含む）。Phase C のなーたん拘束時間は実質 **15分以内**（GCP Console 操作 + ブラウザ承認）。

---

## 3. Phase B: skill本体修正（詳細）

### 3.1 `types.ts` の `SubfolderIds` を新キー構造に変更

```typescript
// AFTER: storage.yml 番号付き新キーと1対1対応
export interface SubfolderIds {
  // 00系: 特殊
  "00_inbox": string;
  "01_uncertain": string;
  // 10系: 種別
  "10_sp_triceratops": string;
  "11_sp_tyrannosaurus": string;
  "12_sp_stegosaurus": string;
  "13_sp_velociraptor": string;
  "14_sp_pteranodon": string;
  "15_sp_multi": string;
  // 20系: 環境
  "20_env_forest": string;
  "21_env_plain": string;
  "22_env_coast": string;
  "23_env_river": string;
  "24_env_volcano": string;
  "25_env_desert": string;
  "26_env_mountain": string;
  "27_env_sky": string;
  "28_env_underwater": string;
  "29_env_abstract": string;
  // 30系: 部位
  "30_anatomy": string;
  // 40系: トランジション
  "40_tr_fade": string;
  "41_tr_light_burst": string;
  "42_tr_particle": string;
  "43_tr_zoom": string;
  "44_tr_morph": string;
  // 50系: フォールバック
  "50_fb_diagram": string;
  "51_fb_reconstruction": string;
  "52_fb_fossil": string;
  "53_fb_phylogeny": string;
  "54_fb_map": string;
}
```

### 3.2 `pathResolver.ts` の解決ロジック差し替え

**species マッピング**（種名 → 番号付きフォルダ）:

```typescript
const SPECIES_TO_FOLDER: Partial<Record<Species, keyof SubfolderIds>> = {
  triceratops: "10_sp_triceratops",
  tyrannosaurus: "11_sp_tyrannosaurus",
  stegosaurus: "12_sp_stegosaurus",
  velociraptor: "13_sp_velociraptor",
  pteranodon: "14_sp_pteranodon",
  _multi: "15_sp_multi",
};
```

**environment マッピング**:

```typescript
const ENV_TO_FOLDER: Partial<Record<Environment, keyof SubfolderIds>> = {
  forest: "20_env_forest",
  plain: "21_env_plain",
  coast: "22_env_coast",
  river: "23_env_river",
  volcano: "24_env_volcano",
  desert: "25_env_desert",
  mountain: "26_env_mountain",
  sky: "27_env_sky",
  underwater: "28_env_underwater",
  abstract: "29_env_abstract",
};
```

辞書外（cave/swamp/museum）は abstract に落とす（Phase D の `_inbox/` 50件はすべて `_tag_dictionary.yml` 内に収まる想定）。

**main.ts 内 `ids._inbox`** → **`ids["00_inbox"]`** 等の参照も更新が必要。

**ローカルディレクトリ名**: `localRelativeDir` を `"10_sp_triceratops"`（フォルダ名と一致）に変更。`_index.yml > file_local_preview` の相対パスも `10_sp_triceratops/preview/M001_xxx.jpg` 形式に。

### 3.3 `.claude/skills/material-ingest/SKILL.md` 作成

なーたんが「素材振り分けて」「Drive の inbox 処理して」等と発話したときに claude が `material-ingest` skill を起動するための定義書。

格納先: `/Users/satonao/Documents/非属人youtube作成/.claude/skills/material-ingest/SKILL.md`

内容: skill description / 起動トリガー / 実行コマンド（`cd ... && npm run ingest`）/ 月予算超過時の挙動 / なーたん確認が必要な分岐。

### 3.4 Phase B 完了基準

- `npx tsc --noEmit` で型エラーなし
- `npm run ingest:dry` が `.env` 未設定で「ANTHROPIC_API_KEY が設定されていません」エラーで停止する（=コード読み込みは成功している）

---

## 4. Phase C: OAuth設定（なーたん協力必須）

詳細は別ドキュメント:
`/Users/satonao/Documents/非属人youtube作成/channels/channel_02_dinosaur/_pm_drive_oauth_setup_guide_2026-06-10.md`

要点のみ:

1. **GCP Console 作業**（なーたん 5-10分）:
   - プロジェクト作成 or 選択
   - Drive API 有効化
   - OAuth 同意画面（外部・テストユーザー追加）
   - OAuth 2.0 クライアントID 発行（**デスクトップアプリ**型）
   - credentials.json ダウンロード → `~/.config/dino-ch/credentials.json` に配置

2. **PM作業**（並行）:
   - `~/.config/dino-ch/` ディレクトリ作成
   - `.env` を `.env.example` から生成（ANTHROPIC_API_KEY もここで設定）
   - `npm install`（ffmpeg-static で ffmpeg バンドル不要・sharp はネイティブビルド）

3. **初回認証**（なーたん 1-2分）:
   - `npm run auth` 実行
   - 表示されたURLをブラウザで開いて Google 認証
   - localhost callback で token.json 自動保存

### 4.1 Phase C のリスク

| リスク | 対応 |
| --- | --- |
| ffmpeg が未インストール | `ffmpeg-static` パッケージでバンドル済み（Node側で自動解決） |
| Node 20 未満 | package.json で `engines.node >= 20` 明示。なーたん環境確認必要 |
| sharp のネイティブビルド失敗 (macOS arm64) | sharp 0.34 系は arm64 prebuilt あり・通常自動解決 |
| OAuth 同意画面が「未審査」警告 | テストユーザーに自分のメール追加すれば回避可（外部公開不要） |
| Drive API quota 超過 | 50件規模なら全く問題なし（無料枠は 1日10億クエリ） |
| credentials.json を誤って git に乗せる | .gitignore で `**/credentials.json` `**/token.json` 除外確認済 |

---

## 5. Phase D: Drive `_inbox/` 50件 初回ingest

### 5.1 事前確認（実行前にPM→なーたん最終承認）

ADR-010 v2 で予告されている処理対象:

| 件数 | 内容 | 想定アクション |
| --- | --- | --- |
| 1 | バオバブ（中生代植生として誤情報リスク） | **削除**（Drive trashed=true） |
| 3 | 学術精度疑い（T-Rex / Dinosaur / Skull） | `01_uncertain/` 行き |
| 46 | 環境動画（plain/forest/coast/volcano/desert/mountain/sky/underwater） | タグ辞書に従って自動振り分け |
| 計 50 | | |

**重複疑い**: Forest_Trees 3本・Crater_Volcano 2本・Ice_Ocean 2本 → Vision の visual_similarity で吸収（≥0.92 は trash、0.80-0.92 は uncertain）。

### 5.2 実行手順

1. **Step 1: dry-run**
   - `npm run ingest:dry` で全50本の処理計画を出力（Drive操作なし）
   - 各動画について「分類結果 / 振り分け先 / cost予測」を確認
   - 想定外の挙動（バオバブが削除されない等）があれば修正
   - **dry-run でも Vision API は呼ぶ**ため、約500円のコストが発生する可能性。これを抑えるため Step 1 では先頭5本のみで動作確認

2. **Step 1.5: バオバブ削除の独立処理**
   - dry-run の分類結果からバオバブを特定
   - Drive UI で手動削除 or skill に削除モード追加
   - **なーたん最終承認後に実行**（デストラクティブ操作のため）

3. **Step 2: 本番 ingest（残り49本）**
   - `npm run ingest` で本番実行
   - 各動画あたり 8-10円 × 49本 = **約400-500円**
   - 月予算 ¥1,000 の 40-50% 消費

4. **Step 3: 結果サマリ確認**
   - main.ts の `printSummary` 出力を確認
   - ingested / uncertain / duplicate_trashed / error の件数
   - `_index.yml` レコード数を確認
   - `_uncertain/` 配置リストをなーたんに目視確認依頼

### 5.3 Phase D 完了基準

- `_index.yml` に 46±α 件のレコード追加
- Drive 上で `00_inbox/` が空に近づく（uncertain 数本残る可能性）
- `episodes/_logs/material_ingest_cost.yml` に累計コスト記録
- 想定コスト ¥500 を大幅超過していない（超過時は即なーたん相談）

---

## 6. 想定リスクとフォールバック

| リスク | 影響度 | 対応 |
| --- | --- | --- |
| Vision API コスト超過（>¥1000） | 中 | main.ts の `checkBudget()` で hard stop。手動で COST_LOG リセット → 再開はなーたん承認後 |
| 種誤判定（confidence高なのに違う） | 中 | Phase D で `_uncertain/` 行き 3件以外の振り分け結果を目視抜き取り検査 |
| Drive API レート制限 | 低 | 50件規模なら問題なし。1000件超になったらバッチ分割検討 |
| ffmpeg 抽出失敗（壊れた mp4） | 低 | main.ts の try-catch で error として記録・続行 |
| バオバブ動画の誤分類（環境素材として ingested） | 中 | Phase D Step 1 dry-run で確認・Step 1.5 で個別処理 |
| 並行作業中の manami 台本作業に影響 | 低 | コード変更は ingest/ 配下のみ・台本ファイル無関係 |

---

## 7. なーたん承認が必要なゲート

| Gate | タイミング | なーたん判断事項 |
| --- | --- | --- |
| G1 | Phase A 完了直後 | 本計画書 OK / Phase B 着手 GO |
| G2 | Phase C 開始時 | GCP Console 作業着手（OAuth設定手順書に沿って） |
| G3 | Phase C 初回認証 | ブラウザで Google アカウント承認（実機操作） |
| G4 | Phase D Step 1 完了 | dry-run 結果レビュー / Step 1.5（バオバブ削除）GO |
| G5 | Phase D Step 2 直前 | 本番ingest GO（コスト約500円消費の確認） |
| G6 | Phase D 完了 | `_uncertain/` 配置の目視判定 |

---

## 8. 報告フォーマット（実行中の進捗共有）

各 Phase 完了時に窓口Claude経由でなーたんに以下を300字以内で報告:

```
[Phase X 完了]
- やったこと: (1行)
- 結果: (1行)
- 次のGate: GX (なーたん判断要 / 不要)
- 次のPhase開始予定: HH:MM
- リスク・想定外: なし / あり (詳細)
```

---

## 9. 関連ドキュメント

- ADR-010 v2: `/Users/satonao/Documents/非属人youtube作成/decisions/ADR-010_dinosaur_material_ingest_skill_and_cloud_storage.md`
- ADR-012: `/Users/satonao/Documents/非属人youtube作成/decisions/ADR-012_dinosaur_shorts_first_strategy.md`
- ADR-013: `/Users/satonao/Documents/非属人youtube作成/decisions/ADR-013_dinosaur_shorts_video_first_material_strategy.md`
- OAuth設定手順書: `_pm_drive_oauth_setup_guide_2026-06-10.md`
- skill README: `pipeline/stages/03_video/ingest/README.md`
- storage設定: `pipeline/config/storage.yml`
- 判定プロンプト: `pipeline/prompts/material_classification.md`
- タグ辞書: `assets/library/02_magnific/_tag_dictionary.yml`
- メタ正本: `assets/library/02_magnific/_index.yml`

---

## 10. 改訂履歴

- 2026-06-10 v1: 起案（恐竜チャンネルPM）
