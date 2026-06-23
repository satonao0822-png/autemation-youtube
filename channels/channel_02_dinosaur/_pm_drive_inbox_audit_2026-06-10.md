# Drive `_inbox/` 監査レポート

**日付**: 2026-06-10
**作成**: 恐竜チャンネルPM
**指示元**: なーたん（経由: 窓口Claude）
**対象フォルダ**: Drive `assets/library/_inbox/` (ID: `1j3tkxrmSxdGxFW09SV0CFpxr25q6uSRL`)
**監査範囲**: 読み取りのみ（移動・タグ付け等の書き込みは未実施）

---

## 0. 重要発見：URLの指す先がライブラリ全体

なーたんから受領した URL `https://drive.google.com/drive/folders/1PRy9c_Qm5_f4Hc7k1eTushVWLk420De5` は、`_inbox/` ではなく **ライブラリのルート** (`assets/library/`) でした。

ルート直下は既に振り分け先カテゴリフォルダが生成済み（10_sp_triceratops, 21_env_plain 等の37フォルダ）。実際の振り分け待ち素材は、その配下の `_inbox` (ID: `1j3tkxrmSxdGxFW09SV0CFpxr25q6uSRL`) に集中していました。

並走チェックした以下は全て空：
- `_uncertain/` (ID: `1Y6FqIX3pdvlD1PPmhxmyhYz69lo4TQ4R`) → 0件
- `00_inbox/` (ID: `1ShhufXqVXGQdYQ8a_djXuzUm71bi8dFq`) → 0件（カテゴリ階層側の空inbox）
- `01_uncertain/` (ID: `1MFds4UACRrZ9gl2-UgYr2fg4hkL1pxsL`) → 0件

つまり**振り分け待ち = `_inbox/` の50件**で確定。

---

## 1. 中身サマリ

| 項目 | 値 |
| --- | --- |
| 総ファイル数 | **50件** |
| 形式内訳 | mp4: 48件 / mov: 2件 |
| 画像（jpg/png）| **0件** |
| 推定容量合計 | **約1.78 GB**（mov 2本で約820MB、mp4 48本で約960MB） |
| 最大ファイル | `4599411_Tree_Forest_4096x2304.mov` (512MB) |
| 解像度 | 1920x1080 が主流。4K (3840x2160 / 4096x2304) が3本 |
| 投入日 | 全件 2026-06-07 15:30-16:30（1時間以内に一括投入） |
| 投入元アカウント | `nao.sato@or-design.co.jp`（なーたん別アカウント） |

**重要：全件「環境素材＋一般動画」で、Pexels等の汎用動画ストックからの一括ダウンロードと推測。**ファイル名先頭の `0_` や数字8桁は Pexels の命名パターン。

---

## 2. ファイルリスト（全50件・カテゴリ推定付き）

タグ辞書 `assets/library/02_magnific/_tag_dictionary.yml` の environment 語彙にマッピングして推定振り分け先を併記。

### 2-1. environment 系（46件 / 全体の92%）

#### 21_env_plain（平原・草原）想定 — 4件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 4584661_Rock_Grass_1920x1080.mp4 | 14.4MB | plain, day |
| 4567386_Australia_Dirt_1920x1080.mp4 | 14.3MB | plain, dry |
| 4567458_Australian_Outback_1920x1080.mp4 | 14.6MB | plain, day |
| 4584123_Jungle_Tropical_1920x1080.mp4 | 14.2MB | plain, day（※森林寄り） |

#### 20_env_forest（森林）想定 — 5件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 0_Forest_Sunlight_4096x2304.mov | **328MB** | forest, dawn, 4K |
| 4599411_Tree_Forest_4096x2304.mov | **489MB** | forest, day, 4K |
| 0_Forest_Trees_1920x1080.mp4 | 14.5MB | forest |
| 0_Forest_Trees_1920x1080 (1).mp4 | 14.6MB | forest（重複疑い） |
| 0_Forest_Trees_1920x1080 (2).mp4 | 14.4MB | forest（重複疑い） |
| 1784895_Baobabs_Baobab_1920x1080.mp4 | 20.2MB | forest, dry |

#### 22_env_coast（海岸・海）想定 — 9件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 1543895_Oceanscape_Seascape_1920x1080.mp4 | 17.5MB | coast, day |
| 0_Ocean_Sea_1920x1080.mp4 | 15.6MB | coast |
| 0_Ocean_Waves_1920x1080.mp4 | 18.5MB | coast, waves |
| 6727664_Waves_Crashing_1920x1080.mp4 | 21.8MB | coast, dramatic |
| 4599518_Sea_Summer_1920x1080.mp4 | 13.6MB | coast, day |
| 4573047_Beach_Travel_1920x1080.mp4 | 13.9MB | coast |
| 6488330_Blue_Hour_Sea_1920x1080.mp4 | 14.7MB | coast, dusk |
| 4597133_Ice_Ocean_1920x1080.mp4 | 13.7MB | coast, cold |
| 4582303_Ice_Ocean_1920x1080.mp4 | 14.6MB | coast, cold |

#### 24_env_volcano（火山・溶岩）想定 — 7件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 0_Lava_Live_Wallpaper_1920x1080.mp4 | 14.3MB | volcano, lava |
| 0_Lava_Danger_1920x1080.mp4 | 13.7MB | volcano, lava, dramatic |
| 0_Ai_generated_Volcano_1920x1080.mp4 | 14.6MB | volcano（**AI生成・要注意**） |
| 4574395_Crater_Volcano_1920x1080.mp4 | 14.8MB | volcano |
| 4574435_Crater_Volcano_1920x1080.mp4 | 14.4MB | volcano |
| 4584636_Volcano_Lava_1920x1080.mp4 | 14.9MB | volcano, lava |
| 1955886_Explode_Volcano_1920x1080.mp4 | 21.3MB | volcano, dramatic |

#### 25_env_desert（砂漠・荒地）想定 — 6件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 0_Desert_Mountains_1920x1080.mp4 | 14.3MB | desert, mountain |
| 0_Desert_Monument_Valley_1920x1080.mp4 | 14.3MB | desert |
| 0_Desert_Sunset_1920x1080.mp4 | 14.0MB | desert, dusk |
| 1282351_Desert_Dunes_1920x1080.mp4 | 16.1MB | desert |
| 4575334_Desert_Sand_1920x1080.mp4 | 14.5MB | desert |
| 4576253_Desert_Dune_1920x1080.mp4 | 14.6MB | desert |
| 4594422_Nature_Canyon_1920x1080.mp4 | 14.3MB | desert, canyon |

#### 26_env_mountain（山岳・崖）想定 — 6件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 0_Aerial_Gran_Canaria_1920x1080.mp4 | 18.6MB | mountain, overhead |
| 0_Cerro_Torre_Patagonia_1920x1080.mp4 | 21.4MB | mountain, dramatic |
| 4573041_Travel_Norway_1920x1080.mp4 | 3.8MB | mountain |
| 4573576_Peru_High_1920x1080.mp4 | 14.1MB | mountain |
| 4579303_Landscape_Morning_1920x1080.mp4 | 14.1MB | mountain, dawn |
| 7193567_Fitz_Roy_Patagonia_1920x1080.mp4 | 1.4MB | mountain（**容量小・要確認**） |
| 4576317_Sky_Bush_1920x1080.mp4 | 14.8MB | mountain or plain |

#### 27_env_sky（空・雲）想定 — 5件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 379500_Sky_Sun_1920x1080.mp4 | 15.2MB | sky, day |
| 0_Clouds_Orange_1920x1080.mp4 | 21.8MB | sky, dusk |
| 0_Storm_Ireland_1920x1080.mp4 | 15.5MB | sky, storm |
| 4590404_Sky_Water_1920x1080.mp4 | 14.4MB | sky, coast |
| 0_Fog_Mist_1920x1080.mp4 | 14.4MB | sky, fog |
| 4578457_Fog_Morning_1920x1080.mp4 | 14.4MB | sky, fog, dawn |
| 1574069_Alentejo_Fog_1920x1080.mp4 | 17.8MB | sky, fog |

#### 28_env_underwater（水中）想定 — 1件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 0_Underwater_Sunlight_1920x1080.mp4 | 14.5MB | underwater, dreamy |

### 2-2. species 系（2件 / 全体の4%）

#### 10-15 sp_*（恐竜系）— 2件
| ファイル名 | サイズ | 推定タグ | 判定 |
| --- | --- | --- | --- |
| 0_Dinosaur_Tyrannosaurus_1920x1080.mp4 | 14.9MB | tyrannosaurus → **11_sp_tyrannosaurus** | 学術精度要検証 |
| 0_Dinosaur_Dinosaurs_3840x2160.mp4 | 17.9MB | _multi → **15_sp_multi**（4K） | 学術精度要検証 |

**⚠️ 学術品質チェック必須**：Pexelsの一般動画なのでアニメ風・玩具風の可能性大。本編使用前に nishi のレビュー要。

### 2-3. anatomy 系（1件 / 全体の2%）

#### 30_anatomy 想定 — 1件
| ファイル名 | サイズ | 推定タグ |
| --- | --- | --- |
| 0_Skull_Animal_Skull_1920x1080.mp4 | 15.3MB | tooth, jaw, eye（哺乳類スカルなら**汎用素材**として 30_anatomy 配下） |

**⚠️ 注意**：恐竜の頭骨ではない可能性が高い（"Animal_Skull"）。学術文脈での使用には要確認。

### 2-4. 用途不明（1件 / 全体の2%）

| ファイル名 | サイズ | 備考 |
| --- | --- | --- |
| 1784895_Baobabs_Baobab_1920x1080.mp4 | 20.2MB | バオバブ。中生代の樹木ではない（顕花植物のため白亜紀後期以降）。誤情報リスク。**`_uncertain` 行き推奨** |

---

## 3. EP01 トリケラShorts（60秒）で使えそうな素材ピックアップ

EP01候補テーマ（トリケラ・フリル・平原環境・白亜紀後期）でフィルタした結果：

### 直接使えそう（評価★★★）
| ファイル | 用途 | コメント |
| --- | --- | --- |
| `4584661_Rock_Grass_1920x1080.mp4` | 21_env_plain | 岩混じり草原、白亜紀後期の北米Hell Creek層的環境にマッチ |
| `4567458_Australian_Outback_1920x1080.mp4` | 21_env_plain | 乾燥した平原。トリケラ生息環境イメージとして可 |
| `4579303_Landscape_Morning_1920x1080.mp4` | 21_env_plain or sky | 夜明けの広い風景、Shorts冒頭の "つかみ" カットに使える |

### 補助的に使える（評価★★）
| ファイル | 用途 | コメント |
| --- | --- | --- |
| `0_Forest_Sunlight_4096x2304.mov` | 20_env_forest | 4K、シダ林イメージ。白亜紀植生としては可 |
| `4599411_Tree_Forest_4096x2304.mov` | 20_env_forest | 4K、Shortsの背景カットに使える |
| `0_Clouds_Orange_1920x1080.mp4` | 27_env_sky | 夕焼け。エモーショナルな締めカット |

### EP01で直接は使わないが在庫として有用
- 火山系7本 → 将来の白亜紀末期K-Pg境界Shortsで活用可
- 砂漠系6本 → 三畳紀・ジュラ紀の乾燥環境シーンに

### **EP01で使えないもの / 注意素材**
- バオバブ → 中生代植生として誤情報リスク。NG
- T-Rex / Dinosaur 系 Pexels素材 → 学術精度未検証。本編使用前に nishi レビュー必須
- "Animal Skull" → 恐竜の頭骨ではなさそう。EP01フリル解説には使えない

---

## 4. 振り分け工数試算（手動 vs skill実装）

### 4-1. 手動振り分け（今すぐ着手可能）

**所要時間：約30-45分**

内訳：
- 50ファイル × 1ファイル30秒（Drive UIで右クリック→移動）= 25分
- `_index.yml` 作成（種別フォルダごとに）= 10分
- 重複疑い（Forest_Trees 3本、Crater_Volcano 2本、Ice_Ocean 2本）の精査 = 5-10分

**メリット**：
- 即着手可能、なーたん指示の当日に完了できる
- Drive側で確実に正しい場所に入る（書き込み権限の確認・ミスがない）
- ファイル名から推定できる程度の素材なので、人間判断で十分

**デメリット**：
- 50件×手作業は退屈。1回限りの作業ならコスパ良いが、今後も発生するなら自動化したい
- `_index.yml` 手書きは揺れが出やすい

### 4-2. material-ingest skill 実装（ADR-010 Phase 3予約済）

**所要時間：実装3-5時間 + 初回実行30分 = 計4-6時間**

内訳：
- Drive MCP経由のファイル一覧取得・タグ推定ロジック = 1.5時間
- ファイル名パターン→タグ辞書マッピング = 1時間
- Drive上での移動（書き込み操作）実装 = 1時間
- `_index.yml` 自動生成 = 1時間
- テスト・エッジケース対応（重複・不明素材→`_uncertain`） = 30分-1時間

**メリット**：
- 今後の素材投入（Pexels追加200本目標）でも秒で振り分け
- タグ揺れゼロ、`_tag_dictionary.yml` の語彙を機械的に強制
- 監査ログが自動で残る

**デメリット**：
- 今すぐ50件を振り分けるには時間がかかりすぎる（実装中はEP01着手できない）
- ADR-010では Phase 3 = 在庫200本達成後の予約。前倒しの判断要

### 4-3. 比較表

| | 手動 | skill実装 |
| --- | --- | --- |
| **着手から完了まで** | 約45分 | 約5時間 |
| **将来の再利用性** | なし | 高い（今後の素材投入が全自動） |
| **EP01着手への影響** | ほぼなし | 半日遅延 |
| **品質** | 人間判断（精度高いが揺れる） | 機械（精度はロジック次第・揺れない） |
| **コスト** | ¥0 | ¥0（実装はClaude） |
| **ADR遵守** | 問題なし | Phase 3前倒し判断が要る |

---

## 5. 推奨アクション

### 恐竜チャンネルPMからの推奨

**第一推奨：今回は手動振り分けで切り抜ける**

理由：
1. なーたんはEP01投稿を急いでいる（Shorts週4-6本ペース、ADR-012）
2. 50件は1回限りの作業量として手動が現実的
3. material-ingest skill は次回100件以上の一括投入時に実装した方が費用対効果が高い
4. ADR-010の Phase 3 = 在庫200本達成後の予約を崩さずに済む

**ただし、今回手動で振り分けるなら以下のサブ判断が要ります：**

### なーたん判断を仰ぐ問い（3つ）

#### Q1: 振り分けの実行者は誰か？

選択肢：
- **A**: 恐竜チャンネルPM（私）が Drive MCP の書き込み操作で順次実行（次回セッションで30-45分）
- **B**: なーたんが Drive UI で手動でドラッグ＆ドロップ（本レポートのカテゴリ推定を見ながら）
- **C**: hina or nishi に振る（ただし両名ともShorts EP01着手中なので非推奨）

**PM推奨：A**。本レポートのカテゴリ推定を機械的に実行するだけなので私が引き受けて良い。

#### Q2: 学術精度怪しい素材（4件）の扱い

対象：
- `0_Dinosaur_Tyrannosaurus_1920x1080.mp4`
- `0_Dinosaur_Dinosaurs_3840x2160.mp4`
- `0_Skull_Animal_Skull_1920x1080.mp4`
- `1784895_Baobabs_Baobab_1920x1080.mp4`（バオバブ・中生代植生として誤情報リスク）

選択肢：
- **A**: 一旦 `_uncertain/` 行き、nishi の学術判定後に本振り分け
- **B**: 各カテゴリに入れて `_index.yml` に `anatomical_ok: false` を付ける
- **C**: バオバブだけ削除、恐竜系2本とSkullは _uncertain

**PM推奨：A**。学術品質はShortsでも譲れない。nishi の判定を待つ。

#### Q3: material-ingest skill の前倒し実装をやるか

選択肢：
- **A**: やらない（ADR-010通り Phase 3 = 200本達成後）。今回は手動で対応
- **B**: 並行着手（Shorts EP01と並走で junki or nishi 不在時の隙間で実装）
- **C**: 次回100件以上投入が見えたタイミングで再判断（推奨）

**PM推奨：C**。今回は手動。次にPexels一括投入があれば即実装。

---

## 6. 補足：気になった点

- ファイル名の "0_" プレフィックスや "(1)"、"(2)" の連番がそのまま入っているため、Pexels等から**雑にダウンロードして一括アップロード**した形跡。これは責めるニュアンスではなく、料理素材を冷蔵庫に放り込んだ状態。私の方で整理する前提で受け取ります。
- 全件 mp4/mov の動画素材で、**画像（jpg/png）はゼロ**。解剖図・骨格図・化石写真はこの一式にはない。`fallback_illustration/` 配下の整備は別タスクとして残る。
- **重複疑い**: `Forest_Trees` が3本、`Crater_Volcano` が2本、`Ice_Ocean` が2本。Pexels の検索結果から重複ダウンロードされた可能性。振り分け時に内容確認して片方を `_archive` に回すか検討。

---

## 監査メタ

- 監査実行: 2026-06-10 by 恐竜チャンネルPM
- 使用ツール: `mcp__claude_ai_Google_Drive__search_files`（読み取りのみ）
- 書き込み操作: なし
- 決済発生: なし（Drive MCP使用料金は窓口Claude セッション内の通常API）
- 次アクション: なーたんの Q1/Q2/Q3 判断待ち
