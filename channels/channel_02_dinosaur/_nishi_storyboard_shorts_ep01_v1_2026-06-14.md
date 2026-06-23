# Shorts EP01 映像コンテ確定稿 v1（2026-06-14）

- **起案日**: 2026-06-14
- **起案者**: nishi（映像クリエイター）
- **対象**: トリケラトプス・フリル Shorts 第1本（60秒固定）
- **準拠台本**: `_script_draft_shorts_ep01_v3.6_2026-06-14.md`（59秒/307字/テロップ13枚）
- **準拠ブリーフ**: `_pm_shorts_ep01_brief_v3_2026-06-10.md` §3 映像コンテ
- **目的**: junki編集着手用の素材ファイルパス確定 + Seedance/GPT Image 2/Pexels素材の生成ログ・採用判定・代替策の記録

---

## 0. v3.6 台本 → 5シーン映像構成マッピング

台本v3.6で closer 文言が「あなたなら、このフリル、何のためだったと思いますか?」に変更（マッチングアプリ自虐削除）された点を反映。closer 映像は予定通り Pexels `4584661_Rock_Grass` で進行。

| シーン# | 時刻 | 尺 | 台本ブロック | テロップ番号 | 素材方針 |
| --- | --- | --- | --- | --- | --- |
| **S1 hook** | 0:00-0:06 | 6秒 | hook | T1-T3 | **Seedance ①必須**（トリケラ正面首振り） |
| **S2 仮説→反証** | 0:06-0:21 | 15秒 | ①仮説提示 + ②反証 | T4-T6 | Magnific静止画 + ケンバーンズ動画化 / 解剖図はGPT Image 2補完 |
| **S3 黒挿入観察** | 0:21-0:29 | 8秒 | ③観察事実（アメリカの研究チーム） | T7-T8 | ベタ黒背景 + 大字テロップ（junki生成） |
| **S4 結論→疑問→結論②** | 0:29-0:51 | 22秒 | ④結論① + ⑤新疑問 + ⑥結論② | T9-T12 | **Seedance ②必須**（角合わせディスプレイ） + Magnific静止画補助 |
| **S5 closer** | 0:51-0:59 | 8秒 | closer | T13 | **Pexels `4584661_Rock_Grass`**（ケンバーンズ左→右パン） |

合計59秒。1秒余白は各シーン切替トランジションで吸収（junki側で実測調整）。

---

## 1. シーン詳細・キーフレーム指定

### S1 hook（0:00-0:06・6秒）

**目的**: 最初の3秒で視聴者の指を止める。「あ、トリケラトプスだ」と認識させた直後にフリルの存在感を最大化する。

| 項目 | 内容 |
| --- | --- |
| 映像素材 | **Seedance ① 5秒尺**（後述プロンプト） + 末尾1秒は同フレームのフリーズ or トランジション |
| カット構成 | 0:00-0:03 正面四分の三アングル → 0:03-0:06 ゆっくり首を振る（フリル横方向に動く） |
| キーフレーム | **F1.1（0:00）**: トリケラ正面四分の三、フリル正面いっぱい / **F1.2（0:03）**: 首を15度横へ振り始め / **F1.3（0:06）**: 首振り完了・フリル横プロファイル |
| テロップ重畳 | T1「トリケラトプスのこの襟飾り」（白・大・0:00-0:02・画面下） → T2「実は…」（白・標準・0:02-0:03・画面中央寄り） → **T3「盾じゃなかった」（赤・特大画面1/2・0:03-0:06・画面中央覆い被せ）** |
| BGM・SE | junki判断。hookは音圧上げ・SE「シャラ」等で注意喚起 |
| 縦9:16クロップ指針 | 16:9素材を縦9:16にクロップ。トリケラの頭部とフリル全体を画面中央に収める。**フリルが画面上下に切れないよう体長スケール調整必須** |

### S2 仮説→反証（0:06-0:21・15秒）

**目的**: 通説「肉食恐竜から守る盾」を提示 → 反証「牙の穴がない」で前提を崩す。情報密度高め。

| 項目 | 内容 |
| --- | --- |
| 映像素材 | 静止画ベース・ケンバーンズで動画化（4カット） |
| カット構成 | **C2.1（0:06-0:11・5秒）**: トリケラ全身静止画（Magnific/GPT Image 2）、左→右ゆっくりパン+少しズームイン<br/>**C2.2（0:11-0:13・2秒）**: ティラノとトリケラ対峙イメージ（Magnific 15_sp_multi 在庫があれば、なければカット）<br/>**C2.3（0:13-0:17・4秒）**: フリル拡大・通常時の襟飾り静止画（ズームインのみ）<br/>**C2.4（0:17-0:21・4秒）**: 「牙の穴がない」訴求カット。フリル拡大に赤×印overlay（編集側） |
| キーフレーム | **F2.1**: トリケラ全身横向き / **F2.2**: ティラノとの対峙（任意・在庫次第） / **F2.3**: フリル拡大 / **F2.4**: フリル拡大+赤×印 |
| テロップ重畳 | T4「肉食恐竜から守る盾?」（白・大・0:06-0:13） → T5「もし盾なら…」（黄・大・0:13-0:17） → **T6「牙の穴がない」（黄・大・0:17-0:21）** |
| 素材調達 | 全カット Magnific or GPT Image 2 静止画。**Magnific在庫ゼロのため GPT Image 2 で2枚生成想定**（後述§3） |
| 縦9:16指針 | 解剖図系は元々4:3 or 1:1なので縦化容易。全身カットは縦長クロップ要 |

### S3 黒挿入観察事実（0:21-0:29・8秒）

**目的**: 物語の山。通説崩壊→新観察事実の宣言。視覚的に他シーンと完全分離。

| 項目 | 内容 |
| --- | --- |
| 映像素材 | **ベタ黒背景**（junki側で生成・コスト0円） |
| カット構成 | 黒1枚で8秒固定。テロップで情報を運ぶ。中央にうっすら化石写真（Magnific 52_fb_fossil在庫があればトリケラ頭骨化石）をフェードイン/アウト可。なければ完全黒 |
| キーフレーム | **F3.1（0:21-0:23）**: 黒+「2009年」白中字 / **F3.2（0:23-0:29）**: 黒+「仲間同士の擦り傷」赤特大 |
| テロップ重畳 | T7「2009年」（白・中・0:21-0:23） → **T8「仲間同士の擦り傷」（赤・特大・0:23-0:29）** |
| 音声タイミング | 「アメリカの研究チームが2009年に、化石を調べたら、同じ仲間同士で角を突き合わせた擦り傷だったんです」 |
| SE | 「ドン」系の重い一発SE（junki判断・テロップ T8 切替で）。緊張感を出す |

### S4 結論→疑問→結論②（0:29-0:51・22秒）

**目的**: 結論①「盾じゃなかった」→ 新疑問「なぜ大きい？」→ 結論②「派手な個体ほど異性に選ばれた」の三段。Shortsの中で最も情報量が多いブロック。

| 項目 | 内容 |
| --- | --- |
| 映像素材 | **Seedance ② 5秒尺**（角合わせディスプレイ・後述プロンプト） + Magnific or GPT Image 2 補助カット |
| カット構成 | **C4.1（0:29-0:35・6秒）**: トリケラ全身静止画（S2.C2.1と別アングル）+ 赤×印overlay → 「盾じゃなかった」訴求<br/>**C4.2（0:35-0:42・7秒）**: トリケラ単体カット（Magnific or GPT Image 2、求愛動作前段）。ケンバーンズでフリルにズームイン<br/>**C4.3（0:42-0:48・6秒）**: **Seedance ② 5秒（2頭の角合わせディスプレイ）** + 末尾1秒フリーズ<br/>**C4.4（0:48-0:51・3秒）**: 派手な個体の静止画（GPT Image 2、フリル大きめの個体）ズームイン |
| キーフレーム | **F4.1**: トリケラ単体+赤×印 / **F4.2**: フリルクローズアップ / **F4.3**: 2頭が低強度で角を突き合わせる / **F4.4**: 派手な個体クローズアップ |
| テロップ重畳 | **T9「盾じゃなかった」（赤・特大画面1/2・0:29-0:35）** → T10「なぜ大きい?」（黄・大・0:35-0:42） → T11「派手な個体ほど」（白・大・0:42-0:48） → **T12「異性に選ばれるため」（赤・特大画面1/2・0:48-0:51）** |
| Seedance ②難度 | **本企画で最も学術精度判定が厳しいカット**。ブリーフ §3 「②カット（角合わせ動作）はSeedance難度が高い可能性あり」「リテイク2-3周でも未達なら **Magnific静止画+ケンバーンズで代替** に切替」運用 |

### S5 closer（0:51-0:59・8秒）

**目的**: 視聴者に問いを渡してコメント欄誘導。映像は環境系で「考える時間」を作る。

| 項目 | 内容 |
| --- | --- |
| 映像素材 | **Drive `_inbox/4584661_Rock_Grass_1920x1080.mp4`**（Pexels CC0・15.1MB） |
| Drive File ID | `1zCNxenxVVL7RWM9qpg09q8jp0gOb10Sy` |
| Drive viewURL | `https://drive.google.com/file/d/1zCNxenxVVL7RWM9qpg09q8jp0gOb10Sy/view?usp=drivesdk` |
| カット構成 | 8秒1カット。**左→右のゆっくりパン**（ケンバーンズ）。元動画が既にパン or 静止なら速度調整 |
| キーフレーム | **F5.1（0:51）**: 岩混じり草原の左端 / **F5.2（0:55）**: 中央フレーム / **F5.3（0:59）**: 右端で「問いかけ」読了 |
| テロップ重畳 | T13 上「あなたなら」（白・大・0:51-0:54） → 中「**何のため?**」（赤・特大・0:54-0:59） / 下段CTA「コメント欄で教えてください」（白・小・0:51-0:59 常時表示） |
| ライセンス | Pexels CC0確認済（ブリーフ §3 / Drive監査 §3 評価★★★） |
| 縦9:16指針 | 16:9を縦9:16に左右クロップ。草原中央部を取る。**「岩」が画面下三分の一に収まるよう構図調整** |

---

## 2. Seedance 生成指示（①②）

### ① hook用（必須・5秒）

| 項目 | 内容 |
| --- | --- |
| プロンプト | `Triceratops horridus, full body three-quarter front view, slowly turning its head, large bony frill clearly visible, three horns (one nasal + two brow horns), Late Cretaceous plain, naturalistic muted color palette, BBC Earth documentary style, no humans, no anachronistic vegetation` |
| 尺 | 5秒 |
| 出力比率 | 16:9（後で縦9:16クロップ） |
| 学術判定基準 | ① 角3本（鼻角1+眉角2）/ ② 四足歩行姿勢（前肢が後肢より短い）/ ③ フリル形状（後方に大きく張り出した骨の襟飾り）/ ④ 体長約9mスケール感 |
| リテイク許容 | 最大3周（cost: 5秒×$0.09×3=約204円） |
| 代替策 | 3周で角3本+フリル形状が満たせない場合、**Magnific静止画+ケンバーンズで首振り疑似** に切替（コスト ¥0、Magnific在庫ゼロのためGPT Image 2で1枚生成 約230円） |
| 出力ファイル名 | `S1_seedance01_triceratops_headturn_v{N}.mp4` |
| 配置先 | `assets/library/03_seedance/10_sp_triceratops/` |
| 採用判定 | nishi一次判定 → PM学術判定 |

### ② body後半用（必須・5秒）

| 項目 | 内容 |
| --- | --- |
| プロンプト | `Two Triceratops horridus facing each other, locking horns in a low-intensity display behavior, dorsal frills oriented toward each other, slow deliberate pace, Late Cretaceous savanna environment, golden hour lighting, naturalistic muted color palette` |
| 尺 | 5秒 |
| 出力比率 | 16:9 |
| 学術判定基準 | ① **激しい戦闘ではなくディスプレイ姿勢**（Farke 2009 解釈準拠）/ ② フリル傾き角度が自然範囲 / ③ 前肢を畳んで座る姿勢は不採用 / ④ 角3本維持 / ⑤ 体長9mスケール感 |
| リテイク許容 | 最大4周（②は本企画で最も難度高い・cost: 5秒×$0.09×4=約272円） |
| 代替策 | 4周で「激しい戦闘」を回避できない場合、**Magnific or GPT Image 2 静止画2枚（2頭が並ぶ静止画+フリル向け合わせ静止画）+ ケンバーンズで疑似動画化** に切替（GPT Image 2 2枚 約460円） |
| 出力ファイル名 | `S4_seedance02_triceratops_display_v{N}.mp4` |
| 配置先 | `assets/library/03_seedance/10_sp_triceratops/` |
| 採用判定 | nishi一次判定 → PM学術判定（**戦闘 vs ディスプレイの認定は PM 判断必須**） |

### Seedance変動費見込み

| シナリオ | コスト | 試験枠3,000円比 |
| --- | --- | --- |
| ①②各1周採用（リテイクなし） | 5秒×2×$0.09=約135円 | 4.5% |
| ①②平均2.5周（標準想定） | 約340円 | 11.3% |
| ①3周+②4周（最大想定） | 約476円 | 15.9% |
| **②をMagnific/GPT Image 2代替（③もボツ）** | ①340円+GPT 460円=約800円 | 26.6% |

→ 最大想定でも試験枠の27%以内。残り枠は2-4本目Shortsへ。

### Seedance ③ 予備（不使用優先）

closer は Pexels `4584661_Rock_Grass` 採用確定のため **不使用**。Pexels素材が使えない事態（ファイル破損等）が発覚した場合のみ ③ 平原遠景5秒を生成（追加 約100円）。

---

## 3. Magnific 既存ライブラリ確認 + GPT Image 2 補完

### Magnific 在庫確認結果（Drive実走査 2026-06-14）

| Drive フォルダ | フォルダID | 在庫数 | 状態 |
| --- | --- | --- | --- |
| `10_sp_triceratops` | `1_-cjuBLIvhquerNhYH5PuJBUJus76lKk` | **0件** | 空 |
| `30_anatomy` | `12fmYDJhyfLWz9X8rAzQNSBkdQINWlkMh` | **0件** | 空 |
| `21_env_plain` | `1kB7wIGWf4NbcXWXr3xjhBXlBPK5F5nDD` | **0件** | 空 |

**重要発見**: Magnific本格運用前のため、トリケラトプス静止画ライブラリは現時点で全カテゴリ空。ブリーフ §3 想定「在庫があれば使用、不足ならGPT Image 2で0-2枚補完」の前提を超え、**GPT Image 2 でフル補完が必要**。

### GPT Image 2 生成計画（pre_approved枠 2,000円内）

| # | 用途 | 配置シーン | 枚数 | プロンプト要旨 | 想定コスト |
| --- | --- | --- | --- | --- | --- |
| G1 | トリケラ全身横向き（成体・落ち着いた立ち姿） | S2.C2.1 / S4.C4.1 共用 | 1 | `Triceratops horridus adult, full body side view, standing calmly on Late Cretaceous plain, three horns and large bony frill clearly visible, naturalistic muted color palette, BBC Earth documentary style, no humans` | $1.5 / 約230円 |
| G2 | フリル拡大・通常時の襟飾り（傷跡なし） | S2.C2.3 | 1 | `Triceratops horridus frill close-up, dorsal frill surface texture detail, intact undamaged surface, naturalistic muted palette, scientific illustration style` | $1.5 / 約230円 |
| G3 | フリル拡大+解剖図風（傷跡ありの参考図・任意） | S2.C2.4（赤×印overlayの下地） | 0-1 | 同 G2 を流用しoverlay処理で代替可なら省略 | $0-1.5 / 0-230円 |
| G4 | 派手な大型フリル個体（求愛ディスプレイ前段） | S4.C4.2 / S4.C4.4 共用 | 1 | `Triceratops horridus with exceptionally large and ornate frill, dorsal view emphasizing display, golden hour lighting on Late Cretaceous savanna, BBC Earth documentary style` | $1.5 / 約230円 |

**標準想定: 3枚生成（G1+G2+G4） = $4.5 / 約690円**（pre_approved枠2,000円の35%）
**最大想定: 4枚生成（G3も含む） = $6 / 約920円**（46%）

### 配置先

- `assets/library/02_magnific/10_sp_triceratops/` （G1, G4）
- `assets/library/02_magnific/30_anatomy/` （G2, G3）

※ Magnific フォルダだが実生成は GPT Image 2。`_metadata.md` に出典明示（GPT Image 2 / プロンプト / 日付）。**material_reuse_policy.yml の配分監視対象として記録**。

### nishi 裁量範囲確認

- pre_approved枠2,000円内・5本目までは「承認付き」で nishi 使用可（ブリーフ §12 決裁項目2 / memory `feedback_gpt_image_2_first_5_shorts_approval.md`）
- **本企画は1本目のため承認内**。事前再承認不要

### 学術精度懸念

- GPT Image 2 は角3本+フリル形状の精度がSeedanceより安定（静止画なので破綻箇所が少ない）
- ただし**「角の本数を数えにくいアングル」（真正面・真後ろ）は避け、横向き or 四分の三アングル指定** を徹底
- フリル拡大カットでは「鱗の細密度」を盛りすぎないよう抑制（過剰CG感の回避）

---

## 4. Pexels `4584661_Rock_Grass` 取得状況

### Drive情報（確認済）

| 項目 | 値 |
| --- | --- |
| ファイル名 | `4584661_Rock_Grass_1920x1080.mp4` |
| Drive File ID | `1zCNxenxVVL7RWM9qpg09q8jp0gOb10Sy` |
| 親フォルダID | `1j3tkxrmSxdGxFW09SV0CFpxr25q6uSRL` (`_inbox/`) |
| サイズ | 15,130,605 bytes（約15.1MB） |
| 作成日時 | 2026-06-07 16:20:29 UTC |
| 解像度 | 1920×1080 |
| 形式 | MP4 |
| viewURL | `https://drive.google.com/file/d/1zCNxenxVVL7RWM9qpg09q8jp0gOb10Sy/view?usp=drivesdk` |
| ライセンス | Pexels CC0（PM Drive監査 §3 評価★★★） |

### ダウンロード状況

- **未取得**。`material-ingest` skill 実装待ち（ADR-010 Phase 3）。本企画は手動取得で進行
- Drive MCP の `download_file_content` は本セッションで permission deny（読み取り検索のみ許可）
- **nishi からの実行依頼**: なーたん or junki が Drive UI から手動ダウンロードし、`assets/library/_inbox_local/4584661_Rock_Grass_1920x1080.mp4` に配置
- ローカル配置先ディレクトリは本セッションで作成済 → `/Users/satonao/Documents/非属人youtube作成/channels/channel_02_dinosaur/assets/library/_inbox_local/`

### junki ハンドオフ後の取扱い

- closer S5（0:51-0:59・8秒）の元素材として使用
- ケンバーンズ左→右パン速度: 8秒で画面幅の40-50%移動が目安（速すぎる動きは情報過多になる）
- BGM フェードアウトと同期させ、最後の「思いますか?」読了から0.5秒の余韻を残す

---

## 5. 素材ファイルパス一覧（junki ハンドオフ用）

### Seedance生成物（生成後に追記）

| シーン | ファイル名（想定） | 配置先 | 状態 |
| --- | --- | --- | --- |
| S1 | `S1_seedance01_triceratops_headturn_v{N}.mp4` | `assets/library/03_seedance/10_sp_triceratops/` | **生成未着手**（プロンプト・判定基準 §2 参照） |
| S4 | `S4_seedance02_triceratops_display_v{N}.mp4` | `assets/library/03_seedance/10_sp_triceratops/` | **生成未着手**（同上） |

### GPT Image 2 生成物（生成後に追記）

| # | ファイル名（想定） | 配置先 | 状態 |
| --- | --- | --- | --- |
| G1 | `S2_gpt2_triceratops_fullbody_side_v{N}.png` | `assets/library/02_magnific/10_sp_triceratops/` | **生成未着手** |
| G2 | `S2_gpt2_frill_closeup_intact_v{N}.png` | `assets/library/02_magnific/30_anatomy/` | **生成未着手** |
| G3 | `S2_gpt2_frill_closeup_damaged_v{N}.png` | `assets/library/02_magnific/30_anatomy/` | **任意・G2overlay代替の場合は省略** |
| G4 | `S4_gpt2_triceratops_ornate_frill_v{N}.png` | `assets/library/02_magnific/10_sp_triceratops/` | **生成未着手** |

### Pexels素材

| シーン | ファイル名 | Drive viewURL | ローカル配置先 | 状態 |
| --- | --- | --- | --- | --- |
| S5 | `4584661_Rock_Grass_1920x1080.mp4` | `https://drive.google.com/file/d/1zCNxenxVVL7RWM9qpg09q8jp0gOb10Sy/view?usp=drivesdk` | `assets/library/_inbox_local/4584661_Rock_Grass_1920x1080.mp4` | **手動DL必要**（DriveID `1zCNxenxVVL7RWM9qpg09q8jp0gOb10Sy`） |

### junki 側生成（コスト¥0）

| シーン | 内容 | 配置先 |
| --- | --- | --- |
| S3 | ベタ黒背景8秒（編集ソフトで生成） | junki編集内ローカル |
| 全シーン | テロップ13枚（T1-T13、§1 参照） | junki編集内ローカル |
| S2-S4 | ケンバーンズ動画化（静止画 → 動画） | junki編集内ローカル |

---

## 6. 学術精度監視ログ（Seedance生成後に追記）

### S1 Seedance ① 採用判定ログ

| 周回 | プロンプト | 判定: 角3本 | 判定: 四足歩行 | 判定: フリル形状 | 判定: 体長スケール | 採用/リテイク | 備考 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| v1 | （§2 ①） | TBD | TBD | TBD | TBD | TBD | 生成後追記 |

### S4 Seedance ② 採用判定ログ

| 周回 | プロンプト | 判定: ディスプレイ姿勢 | 判定: フリル傾き自然 | 判定: 座り姿勢回避 | 判定: 角3本 | 採用/リテイク | 備考 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| v1 | （§2 ②） | TBD | TBD | TBD | TBD | TBD | **戦闘 vs ディスプレイ認定は PM 判断** |

### GPT Image 2 採用判定ログ

| # | プロンプト | 角3本 | フリル形状 | アングル妥当 | 採用 | 備考 |
| --- | --- | --- | --- | --- | --- | --- |
| G1 | （§3） | TBD | TBD | TBD | TBD | 生成後追記 |
| G2 | （§3） | - | TBD | TBD | TBD | 生成後追記 |
| G4 | （§3） | TBD | TBD | TBD | TBD | 生成後追記 |

---

## 7. junki ハンドオフ準備状況

### 確定事項（本コンテで即引き継ぎ可能）

- 5シーン構成・各シーン尺・テロップ13枚の時刻位置・色サイズ
- closer用 Pexels `4584661_Rock_Grass` の DriveID/viewURL（手動DL指示書）
- Seedance ①② プロンプト・学術判定基準・代替策
- GPT Image 2 4枚（G1-G4）のプロンプト・配置先
- ベタ黒S3・ケンバーンズ S2/S4 の編集側生成指示

### 未確定事項（生成後に追記）

- Seedance ①② 採用ファイル名（v番号）
- GPT Image 2 採用ファイル名（v番号）
- 学術判定実値（§6 ログ）
- 代替策発動の有無

### junki への引き継ぎタイミング

- **本コンテ作成完了時点で確定情報の引き継ぎ可**（プロンプト・判定基準・素材方針・テロップ位置・closer Pexels情報）
- Seedance/GPT Image 2 の実生成物は **生成完了後に §5 §6 を更新して再引き継ぎ**

---

## 8. 変動費見積りサマリ

| 費目 | 標準想定 | 最大想定 | pre_approved枠 |
| --- | --- | --- | --- |
| Seedance ①② | 約340円 | 約476円 | 月3,000円のうち |
| Seedance ③（予備・不使用想定） | 0円 | 約100円 | 同上 |
| GPT Image 2（G1+G2+G4 標準 / +G3最大） | 約690円 | 約920円 | 月2,000円のうち |
| Pexels `4584661_Rock_Grass` | 0円 | 0円 | CC0 |
| **本企画変動費合計** | **約1,030円** | **約1,496円** | 5,000円承認ルール非該当 |

→ ブリーフ §9 「410-1,040円/本」見積りに対して、Magnific在庫ゼロによりGPT Image 2側がやや増加。最大想定でも約1,500円で5,000円承認ルール内。pre_approved枠の合計5,000円（Seedance3,000+GPT 2,000）の30%以内に収まる。

---

## 9. 改訂履歴

- 2026-06-14 v1（本稿）: 台本v3.6準拠で5シーン構成確定。Drive `_inbox` 内 `4584661_Rock_Grass` のFileID取得済（`1zCNxenxVVL7RWM9qpg09q8jp0gOb10Sy`・手動DL指示書付き）。Magnific在庫が全カテゴリ空のためGPT Image 2 で3-4枚補完計画。Seedance ①② プロンプト・学術判定基準・代替策確定。junki ハンドオフ初回版として確定情報をまとめ、生成物は事後追記方式。
