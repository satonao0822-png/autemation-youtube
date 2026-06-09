# 02_magnific/ — Magnific素材ライブラリ

> ADR-010 で確定した新構造。動画本体は **Google Drive** 保管、ローカルにはメタ + preview のみ。
> 振り分けは `material-ingest` skill が Claude Vision で自動判定（Phase 3 実装）。

## ディレクトリ規約（番号付きフラット構造・2026-06-08改訂）

なーたん要件: 「ファイル名のカシラ数字とフォルダ番号がリンクするように」→ ドラッグ移動が一目で分かる構造。

```
02_magnific/
├── README.md                ← このファイル
├── _index.yml               ← 全素材の機械可読インデックス
├── _tag_dictionary.yml      ← 語彙統制
├── _duplicate_log.yml       ← 重複検出ログ
├── preview/                 ← 採用素材の代表1枚（数十KB）
│
├── 00_inbox/                ← Magnific/Pexels からDLした mp4 投入先
├── 01_uncertain/            ← 判定低confidence の退避先
│
├── 10_sp_triceratops/       ← ★10系=種別
├── 11_sp_tyrannosaurus/
├── 12_sp_stegosaurus/
├── 13_sp_velociraptor/
├── 14_sp_pteranodon/
├── 15_sp_multi/             ← 複数種同居
│
├── 20_env_forest/           ← ★20系=環境
├── 21_env_plain/
├── 22_env_coast/
├── 23_env_river/
├── 24_env_volcano/
├── 25_env_desert/
├── 26_env_mountain/
├── 27_env_sky/
├── 28_env_underwater/
├── 29_env_abstract/         ← 宇宙・粒子・霧・嵐・テクスチャ
│
├── 30_anatomy/              ← 部位アップ
│
├── 40_tr_fade/              ← ★40系=トランジション
├── 41_tr_light_burst/
├── 42_tr_particle/
├── 43_tr_zoom/
├── 44_tr_morph/
│
├── 50_fb_diagram/           ← ★50系=フォールバック図解
├── 51_fb_reconstruction/
├── 52_fb_fossil/
├── 53_fb_phylogeny/
└── 54_fb_map/
```

## ファイル命名規約

### 今後 Magnific で生成する新規素材

```
{XX}_{behavior}_{shot}_{light}_M{NNN}.{ext}
```
例: `20_dawn_calm_M042.mp4` → なーたん は頭の「20」を見て **`20_env_forest/`** にドラッグするだけ。

- `XX`: 行き先フォルダの2桁番号（10-54）
- `behavior` / `shot` / `light` の意味は [`_tag_dictionary.yml`](_tag_dictionary.yml) 参照
- `M{NNN}`: 通し番号（M001〜）

### 既存 Pexels 等のフリー素材

Pexels デフォルト名（`{video_id}_{tag1}_{tag2}_{resolution}.mp4`）はそのまま。**リネーム不要**。
判別は「Pexels タグから推測 → 該当フォルダにドラッグ」。

## 多軸検索の戦略

フォルダ階層は1軸だけ。**時代・ムード・光は `_index.yml` で多軸検索**：
```yaml
- id: M042
  path: 20_env_forest/dawn_calm_cretaceous_M042.mp4
  place: forest
  light: dawn
  mood: calm
  period: cretaceous
```
Claude が grep 1発で「白亜紀の森の夜明け」を絞り込める。
```

## ファイル命名規約

新規追加するのは **preview**（代表1枚 jpg）のみ。命名は：

```
{behavior}_{shot}_{environment}_{light}_M{NNN}.jpg
```

例: `walk_wide_forest_dawn_M001.jpg` （`species/triceratops/preview/` 配下）

- behavior: `walk` / `run` / `charge` / `eat` / `rest` / `courtship` / `fight` / `idle` / `landscape`
- shot: `wide` / `medium` / `close` / `part_close`
- environment: `forest` / `plain` / `coast` / `volcano` / `river` / `desert` / `cave`
- light: `dawn` / `day` / `dusk` / `night` / `storm` / `fog`
- `M{NNN}`: 自動採番（Magnific 素材の通し番号）

語彙の正本は [`_tag_dictionary.yml`](_tag_dictionary.yml)。

## なーたんの作業フロー

**動画本体はローカルに一度も載らない設計**（Drive 完結）。

1. Magnific or Pexels で動画を作成・ダウンロード（ブラウザDL）
2. ダウンロードした mp4 を **Google Drive の `00_inbox/`** に直接アップ
   - 保管ルート: https://drive.google.com/drive/folders/1PRy9c_Qm5_f4Hc7k1eTushVWLk420De5
   - 手順: drive.google.com → 共有フォルダ → `00_inbox/` を開く → ブラウザにmp4をD&D
   - **アップ完了後、ローカル ~/Downloads/ の mp4 は削除する**（容量解放）
3. （Phase 3 実装後）`material-ingest` skill が自動で：
   - Drive `_inbox/` から動画を一時DL（/tmp）
   - ffmpeg で 10秒・1秒1枚 = 10枚スクショ抽出
   - Claude Vision（Sonnet 4.6）で5+1軸判定
   - Drive 上で `_inbox/` から `species/{x}/` 等へ移動（ファイル移動だけ・再アップ不要）
   - preview（代表1枚 jpg）をローカル `preview/` に保存
   - `_index.yml` と `_metadata.md` に追記
   - /tmp の一時ファイル削除
4. confidence 低いものは Drive `_uncertain/` に移動 + ローカル preview に印 → なーたん目視で承認 or 削除

**ローカルの `inbox/` フォルダはフォールバック用**（Drive 使えない時の代替投入口）。基本は Drive `_inbox/` を使う。

## Claude / skill のクローリング動線

1. `_index.yml` を grep（軽量ファイル）
2. `species` + `behavior` + `environment` で候補絞り込み
3. `anatomical_ok: false` は本編から除外（fallback_illustration から代替を探す）
4. 採用したら `used_in` に追記（再利用感を避ける）
5. 編集時のみクラウドから動画 fetch（Remotion）

## 関連

- [ADR-010](../../../../decisions/ADR-010_dinosaur_material_ingest_skill_and_cloud_storage.md)
- [pipeline/config/storage.yml](../../pipeline/config/storage.yml)
- [pipeline/stages/03_video/ingest/README.md](../../pipeline/stages/03_video/ingest/README.md)
- [pipeline/prompts/material_classification.md](../../pipeline/prompts/material_classification.md)
- 既存ライセンス台帳: [../_metadata.md](../_metadata.md)（人間向け・継続運用）
