# 恐竜チャンネル 素材ライブラリ 運用ガイド

- **起案日**: 2026-06-04
- **起案者**: 窓口Claude（なーたん依頼）
- **読者**: なーたん（DL作業担当） / nishi（運用担当） / PM（管轄）
- **位置づけ**: 「無料ストック / Magnific / Seedance / マスター設定画」の4層を統合管理する素材ライブラリの運用ガイド。**ADR-007 3ソース調達戦略**の実行レイヤー

---

## 0. 三行サマリ

1. **3ソース調達戦略（ADR-007）の実装ライブラリ**。フォルダ4層・命名規則・タグ付け・メタデータ管理で「役割が一目で分かる素材棚」を作る
2. **なーたん作業（Claude in Chrome経由）**：Magnific と フリー素材サイトから動画ダウンロード → 所定フォルダに格納 → メタデータ追記（1行）
3. **nishi 作業**：収集された動画の役割タグ整理・マスター設定画ワークフロー・月次棚卸し

---

## 1. フォルダ構成

```
channels/channel_02_dinosaur/assets/library/
├── README.md                       ← このファイル（運用ガイド）
├── _metadata_template.md           ← メタデータ記録のテンプレート
├── _ep01_freestock_checklist.md    ← EP01「トリケラのフリル」用の取得チェックリスト
│
├── 01_freestock/                   ← 無料ストック素材（現金コスト0円）
│   ├── nature/                     ← 自然・地形（草原・空・川・火山）
│   ├── space/                      ← 宇宙・地球・星空
│   ├── museum/                     ← 博物館展示・化石実物
│   ├── historical/                 ← 古代風・地層・地質
│   ├── abstract/                   ← 抽象テクスチャ（過渡し用）
│   └── general/                    ← 汎用Bロール（その他）
│
├── 02_magnific/                    ← Magnific生成素材（サブスク済・現金コスト0円）
│   ├── nature/                     ← 草原・空・夕暮れ等
│   ├── transitions/                ← トランジション・イントロ
│   ├── dinosaur_bg/                ← 遠景の恐竜群れ・歩き・群衆
│   └── general/                    ← 汎用
│
├── 03_seedance/                    ← Seedance主役カット（EP別・現金支出）
│   ├── ep01_triceratops/           ← EP01 トリケラ主役カット
│   ├── ep02_stegosaurus/           ← EP02 ステゴサウルス主役カット（保留中）
│   └── （以降EP追加時）
│
└── 99_master_keyframes/            ← GPT Image 2マスター設定画（キャラ一貫性ソース）
    ├── ep01_triceratops_master.png ← トリケラ正面・横・斜め
    └── （以降キャラ追加時）
```

### 各層の役割

| 層 | 用途 | コスト | 主な担当 |
| --- | --- | --- | --- |
| `01_freestock/` | 汎用Bロール・実写背景・宇宙地球などの「**雑談に挟む雑多な画**」 | **0円** | なーたん DL / nishi 運用 |
| `02_magnific/` | 一貫性不要の汎用Bロール（草原・空・恐竜群衆等）の**自前生成**ライブラリ | **0円**（サブスク内） | なーたん 生成 / nishi 運用 |
| `03_seedance/` | **主役カット**（その回固有・キャラ一貫性が命）。トリケラのフリル誇示・決闘・求愛など | **約$0.09/秒**（従量） | nishi 生成 / PM 監修 |
| `99_master_keyframes/` | GPT Image 2 で作る**キャラのマスター設定画**（Seedance I2V の参照画像） | **約$3-6/EP** | nishi 生成 / PM 監修 |

---

## 2. 命名規則（必ず守る）

### 2-1. ファイル名フォーマット

```
<EP番号>_<シーン番号 or 用途>_<役割タグ>_<出典 or 生成元>_<尺秒>.<拡張子>
```

### 2-2. 例

| ファイル名 | 意味 |
| --- | --- |
| `ep01_05_volcano_pexels_8s.mp4` | EP01・シーン5・火山映像・Pexels出典・8秒 |
| `ep01_intro_starscape_coverr_12s.mp4` | EP01・イントロ用・星空・Coverr出典・12秒 |
| `general_dinoherd_magnific_6s.mp4` | EP非固定汎用・恐竜群衆・Magnific生成・6秒 |
| `ep01_seedance_frill_display_7s_v1.mp4` | EP01・Seedance・フリル誇示カット・7秒・v1試作 |
| `ep01_master_triceratops_front.png` | EP01・マスター設定画・トリケラ正面 |

### 2-3. ルール

- 半角英数 + アンダースコア（スペース・日本語・記号NG）
- `<EP番号>` 部分は `ep01` / `ep02` / `general`（EP非固定汎用）
- `<役割タグ>` 部分はセクション3の役割タグから選ぶ
- `<出典>` 部分はセクション5の出典コード（pexels/pixabay/coverr/mixkit/magnific/seedance）
- 尺は `秒数 + s`（小数なし、四捨五入）

---

## 3. 役割タグ（用途タグ）一覧

### 3-1. シーン役割（必須・1つ選ぶ）

| タグ | 用途 | 例 |
| --- | --- | --- |
| `opening` | 動画冒頭の引きカット | 夕暮れの古代風景・星空・恐竜シルエット |
| `scene-intro` | 本編セクション開始時の場面転換 | 火山噴火・地層断面・博物館入口 |
| `explanation` | 学術解説中の補助カット | フリル形状の図解・性淘汰の例示動物 |
| `cutaway` | 雑談・自虐セリフ時の差し込み | 抽象テクスチャ・空・水面 |
| `transition` | カット間の橋渡し | カラーフラッシュ・粒子エフェクト |
| `closing` | 終盤・CTA前の余韻演出 | 夜空・星雲・地平線 |

### 3-2. 動画分類（必須・1つ選ぶ）

| タグ | 内容 |
| --- | --- |
| `nature` | 自然・地形・天候 |
| `space` | 宇宙・地球・天体 |
| `museum` | 博物館展示・化石実物・標本 |
| `historical` | 古代風景・地層・地質 |
| `dinosaur-cgi` | 恐竜のCG・復元動画 |
| `abstract` | 抽象テクスチャ・パターン |
| `typography` | 文字・テロップ用素材 |

### 3-3. 尺カテゴリ（自動分類用）

| タグ | 尺範囲 |
| --- | --- |
| `short` | 0-3秒（クイックカット用） |
| `mid` | 3-8秒（標準カット用） |
| `long` | 8-15秒（じっくり見せるカット用） |

---

## 4. メタデータ管理（必須・厳守）

各動画ファイルをダウンロード or 生成したら、**必ず `_metadata.md` に1行追記**する。

メタデータシートのフォーマット・記入例は `_metadata_template.md` 参照。

### 4-1. 記録項目（最低限）

| 項目 | 必須/任意 | 例 |
| --- | --- | --- |
| ファイル名 | 必須 | `ep01_05_volcano_pexels_8s.mp4` |
| 出典URL | 必須 | `https://pexels.com/video/12345/` |
| ライセンス種別 | 必須 | `Pexels License` / `CC0` / `CC-BY 4.0` 等 |
| 商用利用 | 必須 | `OK` / `NG` / `要確認` |
| クレジット要否 | 必須 | `不要` / `必要（出典名+URL）` |
| クレジット表記文 | クレジット必要時 | `Video by John Doe / Pexels` |
| 取得日 | 必須 | `2026-06-04` |
| 取得者 | 必須 | `なーたん` / `nishi` / `Magnific生成（なーたん）` |
| 用途タグ（役割） | 必須 | `scene-intro` |
| 用途タグ（分類） | 必須 | `nature` |
| 使用予定EP | 任意 | `EP01` / `general` |
| 備考 | 任意 | 「フリル誇示シーンの差し込みに最適」等 |

### 4-2. ライセンスチェック（最重要・例外なし）

**取得前**に必ず以下を確認:

1. **商用利用OK**か（YouTube収益化対象なので商用扱い）
2. **クレジット表記要否**（必要なら概要欄に書く前提でメモ）
3. **再配布・改変OK**か
4. **モデルリリース**（人物が写る場合・恐竜chでは少ないが念のため）

**「商用利用NG」「ライセンス不明」は採用しない**。判断つかない素材は採用候補から外す。

---

## 5. 出典コード（命名規則・メタデータで統一）

| コード | 出典 | URL | 標準ライセンス |
| --- | --- | --- | --- |
| `pexels` | Pexels | https://pexels.com/videos/ | Pexels License（クレジット不要・商用OK） |
| `pixabay` | Pixabay | https://pixabay.com/videos/ | Pixabay License（クレジット不要・商用OK） |
| `coverr` | Coverr | https://coverr.co/ | CC0（クレジット不要・商用OK） |
| `mixkit` | Mixkit | https://mixkit.co/free-stock-video/ | Mixkit License（クレジット不要・商用OK） |
| `videvo` | Videvo | https://videvo.net/ | **要確認**（CC-BY / Royalty Free / Editorial Only 混在） |
| `pond5` | Pond5 Free | https://pond5.com/free | **要確認**（Free選択時のみ） |
| `wikimedia` | Wikimedia Commons | https://commons.wikimedia.org/ | **要確認**（CC各種・PD混在） |
| `nhk_archives` | NHKクリエイティブ・ライブラリー | https://www2.nhk.or.jp/archives/creative/ | **要確認**（教育用・出典明記必須） |
| `magnific` | Magnific（自前生成） | サブスク済 | サブスクライセンスに従う |
| `seedance` | Seedance（自前生成） | API従量 | 自社制作物 |
| `gpt_image_2` | GPT Image 2.0（自前生成） | API従量 | OpenAI 規約に従う |

### 5-1. 推奨運用順

1. **まず Pexels / Pixabay / Coverr / Mixkit を巡る**（クレジット不要・商用OK・条件シンプル）
2. 足りなければ Videvo / Wikimedia を確認（ライセンス要チェック）
3. それでも足りないものを Magnific で自前生成（一貫性不要のもの限定）
4. 主役カットだけ Seedance で生成（一貫性が命のもの）

---

## 6. 運用フロー（なーたん・nishi の役割分担）

### 6-1. なーたん作業（Claude in Chrome経由）

1. EP01用チェックリスト（`_ep01_freestock_checklist.md`）を見ながら、必要な用途をピックアップ
2. 推奨サイト（Pexels / Pixabay / Coverr / Mixkit）にアクセス → 検索 → ダウンロード
3. ライセンス情報（特にクレジット要否）をメモ
4. ファイル名を命名規則に従ってリネーム
5. 該当フォルダ（`01_freestock/<分類>/`）に格納
6. `_metadata.md` に1行追記（テンプレート参照）
7. Magnific は別途 Web で生成 → `02_magnific/<分類>/` に格納（同様にメタデータ追記）

### 6-2. nishi 作業（運用フェーズ）

1. なーたんから「素材回収完了」連絡を受領
2. `_metadata.md` を月1回棚卸し → ライセンス情報の漏れ・タグ整合性チェック
3. EP制作時、台本のシーン要求に対して**素材ライブラリから先に探す**（無料・サブスク内優先）
4. 足りないものだけ Seedance / Magnific で新規生成
5. 使った素材は `_usage_log.md` に記録（再利用判定用）

### 6-3. PM 監督

1. ライセンス遵守の最終チェック（EP公開前）
2. 概要欄のクレジット記述漏れチェック
3. ADR-007 の効果測定（無料/Magnific/Seedance の実使用比率が想定（25/35/40）に近いか）

---

## 7. 法務・著作権ガードレール

### 7-1. 絶対やらないこと

- ライセンス不明素材を使う
- 商用利用NG素材を使う
- クレジット必要素材を概要欄記述なしで使う
- AI生成素材で他社サービスの規約違反（例: GPT Image 2 を OpenAI規約に反する用途で使う）
- 人物が映る素材で「モデルリリースなし」のものを顔の見える形で使う

### 7-2. EP公開前のチェックリスト（PM管轄）

- [ ] 使用した全素材のライセンスを再確認（`_usage_log.md` ベース）
- [ ] 概要欄のクレジット記述を最終確認
- [ ] YouTubeのAI開示要件（Seedance生成カット含む）を満たすか確認
- [ ] 解剖学的破綻チェック5項目（nishi 領域）

---

## 8. 関連ファイル

- `_metadata_template.md` — メタデータ記録テンプレート
- `_ep01_freestock_checklist.md` — EP01「トリケラのフリル」用の取得チェックリスト
- `decisions/ADR-007_dinosaur_video_3source_procurement_strategy.md` — 3ソース戦略の正式決定
- `_brief_from_naatan_video_cost_2026-06-04.md` — なーたん原価ブリーフ
- `_pm_analysis_naatan_brief_video_cost_2026-06-04.md` — PM分析
- `team/yutaka_review_naatan_brief_video_cost_2026-06-04.md` — yutaka戦略評価

---

## 9. 改訂履歴

- 2026-06-04 v1: なーたん依頼を受けて窓口Claude起案。フォルダ構成・命名規則・タグ・メタデータテンプレ・ライセンスガードレールまで一括整備
