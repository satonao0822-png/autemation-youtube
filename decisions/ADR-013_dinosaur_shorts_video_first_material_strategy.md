# ADR-013: 恐竜ch Shorts動画運用版・素材調達戦略 — 動画80%以上 + Seedance試験枠 + 5,000円承認

- **Status**: **Accepted**（2026-06-09 なーたん決裁）
- **Date**: 2026-06-09
- **Deciders**: なーたん（決裁）／ yutaka（起案・YouTube責任者）
- **Proposed by**: yutaka
- **Channel scope**: `channel_02_dinosaur` のみ（Phase 1 Shorts 16本/月運用）
- **Parallel to**: [ADR-011](ADR-011_dinosaur_material_sourcing_pivot_and_ban_avoidance.md)（長尺前提・並立維持）
- **Builds on**: [ADR-012](ADR-012_dinosaur_shorts_first_strategy.md)（Shorts主軸戦略本体・採択済）
- **Supersedes (partial)**: ADR-007 / ADR-011 §配分比率（Shorts適用範囲に限り上書き）

---

## コンテキスト

### 1. 経緯（2026-06-09 連続決裁）

本日、ADR-012「Shorts主軸戦略転換」採択後、なーたんから追加の方針確定が4点出た：

1. **素材運用は動画80%以上 + 静止画補助**
   - なーたん明示: 「動画の運用にしたい。今後のことも含めて」
   - これは Magnific 静止画主体（ADR-011 配分: freestock50/magnific15/seedance35）を Shorts では維持できないことを意味する
2. **Seedance 試験枠 月3,000円上限で承認**
   - ADR-007 で paused された Seedance API を、本格再開ではなく **試験運用**として限定再開
   - 月3,000円 hard_stop（storage.yml § channel_budget_guardrails 反映済）
3. **支出承認ルールを 1万円 → 5,000円に厳格化**
   - なーたん明示: 「とにかく5000円以上の決済はちゃんと俺に通すようにしてね。べらぼうに高くなるとしんどいから」
   - feedback_payment_approval_rule.md 2026-06-09 更新済
4. **Phase 1 初月は Shorts のみ16本運用**（長尺ゼロ）
   - ADR-012 Phase 1 の「長尺 0-1本/月」のうち「0本」を初月確定

### 2. ADR-011 との非整合（解消が必要な理由）

ADR-011 の配分は **長尺8-10分尺前提**で設計されている：

- freestock 50%（Pexelsの環境動画は豊富 → 長尺なら時間を埋めやすい）
- magnific 15%（種別の脇役・静止画ベース）
- seedance 35%（種別主役・5-8秒クリップ）

Shorts 60秒尺ではこの配分は機能しない：

- **静止画のまま使うと「動画運用」要件不達**（なーたん明示の80%以上に反する）
- **Magnific 静止画素材46本は既存資産だが Shorts では「ケンバーンズ動画化」しないと動画扱いにならない**
- **Pexels の恐竜本体実写は事実上ゼロ**（CG・骨格・博物館展示はあるが「動く実在恐竜」は存在しえない）→ 種別主役は Seedance に依存せざるを得ない
- Shortsは1本60秒×16本=月960秒。**長尺1本（600秒）の1.6倍の動画素材消費量**

つまり ADR-011 を Shorts にそのまま適用すると、**動画比率が50%を割り込む**（Magnific 静止画15% + Pexels静止画含む → 静止画系で30%超）。

### 3. 本ADRのスコープ

- **Shorts専用の素材調達配分**を新規定義（ADR-011 と並立、長尺は ADR-011 維持）
- **Seedance 試験枠の運用条件**を明文化（評価基準・スケールアップ条件）
- **チャンネル予算ガードレール**を正式化（storage.yml に暫定追記済の channel_budget_guardrails を本ADRで決裁）
- **支出承認 5,000円ルール**を恐竜ch運用上の正式制約として位置付け

---

## 決定（提案）

### D-1. Shorts専用 素材配分（動画80%以上達成）

**配分案（推奨）**:

| ソース | 配分 | 形態 | 主用途 |
| --- | --- | --- | --- |
| **Seedance（動画生成AI）** | **25%** | 動画 | 種別主役カット（特定恐竜のダイナミックな動き・5-8秒×3カット程度） |
| **Pexels等フリー動画** | **30%** | 動画 | 環境・地球・空・水中・植生・抽象（恐竜本体は使用不可） |
| **Magnific 静止画→ケンバーンズ動画化** | **30%** | 擬似動画 | 種別の補助カット・解剖断面・古生物復元静止画を縦パン+ズーム+パララックスで動画化 |
| **GPT Image 2 静止画→ケンバーンズ動画化** | **10%** | 擬似動画 | マスター設定画・解剖図・系統樹等の補助（Magnific不足時の補完） |
| **その他**（テロップ・黒挿入・トランジション） | **5%** | 非映像 | フック導入の文字フレーム・パート間ブリッジ |

**動画素材率の集計**:
- 純動画: Seedance 25% + Pexels 30% = **55%**
- 擬似動画（ケンバーンズ化静止画）: 30% + 10% = **40%**
- 動画扱い合計: **95%**
- 非映像: 5%

→ **「動画運用80%以上」要件を達成**（純動画55% + 擬似動画40% = 95%）。

**ケンバーンズ動画化の運用基準**:

| パラメータ | 仕様 | 根拠 |
| --- | --- | --- |
| パン方向 | 縦中心（9:16 アスペクトに合わせ縦パンが自然） | Shorts 9:16 |
| ズーム比 | 1.0 → 1.15-1.25（ゆっくり拡大）or 1.2 → 1.0（縮小） | 過度なズームは酔いの原因 |
| パララックス | 前景・中景・背景の3レイヤー分離（可能なもののみ） | 静止画→動画化の説得力 |
| 1カット尺 | 3-5秒（Shortsテンポに合わせ短く） | 60秒尺で10-12カット想定 |
| 適用元素材 | Magnific 高解像度静止画・GPT Image 2 出力・古生物復元画 | 既存資産活用 |
| 編集ステージ | `pipeline/stages/05_edit/shorts/kenburns/` （新規・junki 管轄） | ADR-012 反映先 |

### D-2. 各ソースの使用方針（Shorts特化）

**Seedance（動画生成AI・試験枠）**:
- 月3,000円上限 hard_stop（D-3 参照）
- 1本あたり配分: 25% = 60秒の25% = **15秒/本**（3-4カット）
- Shorts 16本想定での月間目安: 16本 × 15秒 = 240秒
- $0.09/秒 × 240秒 × リテイク2.5倍 = **約$54 ≒ 約8,000円/月**
- → **月3,000円枠では16本中6本程度しかカバー不可**。残り10本は Magnific ケンバーンズで代替
- 主用途: 「これは Seedance でないと表現不能」な種別主役カット（トリケラ突進・T-rex 咆哮等）

**Pexels等フリー動画**:
- 月予算ゼロ（ライセンス費なし）
- 1本あたり配分: 30% = 18秒/本（4-5カット）
- 用途: 環境動画のみ（雷・嵐・森・海・宇宙・地球・植生・水中）
- **NG**: 恐竜本体実写は使用しない（存在しないため・偽情報リスク）
- ライセンス: Pexels License / Pixabay Content License（クレジット運用は ADR-007 リスク1 ルール継続）

**Magnific 静止画→ケンバーンズ動画化**:
- 既契約月1,000円固定（追加課金なし）
- 1本あたり配分: 30% = 18秒/本（4-5カット×3-5秒）
- 既存資産46本（環境素材中心）+ ADR-011 で抑制した「種別補助カット」枠を Shorts では復活させる
- 種別優先方針は維持（汎用環境は freestock で代替）
- ケンバーンズ化は junki の編集ステージで自動化（テンプレ化）

**GPT Image 2（補助）**:
- 月2,000円上限（storage.yml § gpt_image_2 pre-approved）
- 1本あたり配分: 10% = 6秒/本（1-2カット）
- 用途: マスター設定画・解剖図・系統樹・古環境マップ等の「動画では撮れない」補助図解
- Shorts では字幕情報密度が高いため、解剖図の出番は長尺より多くなる想定

### D-3. 予算ガードレール（正式化）

storage.yml § channel_budget_guardrails の暫定記録を本ADRで正式化する：

| 費目 | 月額上限 | 種別 | hard_stop | 承認状態 |
| --- | --- | --- | --- | --- |
| **支出承認閾値** | 5,000円 | 全API・サブスク・外注共通 | - | feedback_payment_approval_rule.md 2026-06-09 |
| Seedance 試験枠 | 3,000円 | 変動・試験 | **true** | 2026-06-09 |
| Magnific サブスク | 1,000円 | 固定・既契約 | - | 2026-06-02 |
| Fish Audio サブスク | 100円 | 固定・既契約 | - | 2026-06-02 |
| GPT Image 2 | 2,000円 | 変動・補助 | false | 2026-06-09 |
| material-ingest（Vision分類） | 1,000円 | 変動・取込量依存 | false | 2026-06-08 |
| **合計（標準想定）** | **6,000円/月** | - | - | - |
| **合計（最大張り付き）** | **7,100円/月** | - | - | - |

**承認運用ルール**:
- 上記 pre_approved_budgets 内であれば追加承認不要
- 月次見込み / サブスク月額 / 1回課金のいずれかが **5,000円を超える場合**はなーたん事前承認必須
- 新規API・サブスクは金額問わず事前共有（追加発生の透明性確保）

### D-4. Seedance 試験枠の評価とスケールアップ条件

**試験運用の位置付け**:
- ADR-007 で paused された Seedance を「本格再開」ではなく「限定再開」する
- 月3,000円枠 = 16本中6本程度のSeedance使用 = Shorts 16本中6本の種別主役クリップを Seedance で生成
- 残り10本は Magnific ケンバーンズで代替

**評価期間**: 採択後1ヶ月（Shorts 16本目公開後を起点）

**評価3軸**:

| 軸 | 指標 | 閾値（推測・実測で調整） |
| --- | --- | --- |
| **品質** | Seedance生成カットの採用率（生成 → リテイク含めて本編採用に至った率） | ≥ 70% |
| **品質** | Shorts視聴維持率の Seedance有/無 比較（同テーマ条件下） | Seedance有が +5pt 以上 |
| **原価** | Seedance使用Shorts 1本あたり実コスト | ≤ 600円/本（試験枠 3,000円 ÷ 5-6本） |
| **原価** | リテイク率（生成回数/採用回数の逆数） | ≤ 2.5倍 |
| **運用負荷** | 1本あたりSeedance関連工程時間（プロンプト・生成待ち・選別・編集調整） | ≤ 30分/本 |

**スケールアップ条件**（本格運用への移行）:
- 3軸すべて閾値達成 + Shorts視聴維持率向上が統計的に意味あり（最低EP数 = 8本以上）
- 達成時: 月5,000円枠まで自動拡張（5,000円超は再承認）
- 未達時: Seedance枠を月1,000円に縮小 or 一時停止し、Magnific ケンバーンズ100%運用に切替

**評価レビュー責任者**: yutaka（戦略責任） + 恐竜chPM（運用実態） + junki（編集工数） + nishi（生成品質）

### D-5. ADR-011 との関係

| 観点 | ADR-011（長尺前提） | ADR-013（Shorts専用） |
| --- | --- | --- |
| 適用範囲 | 長尺8-10分 | Shorts 60秒 |
| 主軸ソース | Pexels汎用（50%） | Seedance + Pexels動画 + Magnificケンバーンズ |
| 静止画/動画比率 | 静止画許容（Magnific15%+図解） | 動画80%以上強制 |
| Seedance | 35%・本格運用前提 | 25%・試験枠（月3,000円上限） |
| BAN回避 | 4EP cooldown | Shorts用cooldown再設計（D-6） |

**並立運用ルール**:
- Phase 1 初月（2026-06-09起点）はShortsのみ → 本ADR単独適用
- Phase 2以降で長尺再投入時は長尺＝ADR-011 / Shorts＝ADR-013 の **二系統並立**
- 矛盾発生時は「動画の形態（縦/横・尺）」で適用ADRを判定（Shorts化された動画は ADR-013 適用）

### D-6. material_reuse_policy.yml の Shorts用 cooldown 見直し

ADR-011 の cooldown は 4EP（長尺前提・月4本想定 → 1ヶ月分カバー）。Shorts 16本/月では同じ4EPルールは **1週間分しかカバーしない** → 素材枯渇加速。

**Shorts専用 cooldown 案**:

| カテゴリ | 長尺 cooldown（ADR-011） | Shorts cooldown（本ADR） | 根拠 |
| --- | --- | --- | --- |
| species（種別主役） | 4EP | **8 Shorts** | 同一恐竜=同一テーマ連投禁止（ADR-012追加ルールA）と整合・月内2回まで |
| environment | 4EP | **6 Shorts** | 環境素材は使いまわし圧大 |
| transitions | 5EP | **8 Shorts** | 目立つため長め |
| anatomy | 6EP | **10 Shorts** | 字幕セットなので再利用感強い |
| fallback_illustration | 6EP | **10 Shorts** | 図解は繰り返しNG |
| kenburns_master（新規） | - | **6 Shorts** | 同一静止画のケンバーンズ動画化は「動かし方を変えて」最大2回まで |

**テーマ重複ルール（ADR-012追加ルールA との整合）**:
- 同一恐竜・同一テーマでのShorts連投禁止 → cooldown は「素材」だけでなく「テーマ」も対象
- material_reuse_policy.yml に `theme_cooldown` セクション新規追加（実装は junki + 恐竜chPM）

### D-7. 反映先ファイル

採択時の更新項目：

| ファイル | 更新内容 | 担当 | 優先度 |
| --- | --- | --- | --- |
| `pipeline/config/video_sources.yml` | `shorts_allocation` セクション新規追加（D-1配分） | yutaka | A（即時） |
| `pipeline/config/storage.yml` | `channel_budget_guardrails` 暫定→正式（出典: 本ADR） | yutaka | A（即時） |
| `pipeline/config/material_reuse_policy.yml` | Shorts用 cooldown 表（D-6）+ `theme_cooldown` セクション | junki+dinosaur-pm | A（即時） |
| `pipeline/stages/05_edit/shorts/kenburns/`（新規） | ケンバーンズ動画化テンプレ・自動化スクリプト | junki | B（来週） |
| `channels/channel_02_dinosaur/_pm_seedance_trial_evaluation.md`（新規） | Seedance試験枠の月次評価レポートテンプレ | dinosaur-pm | B（来週） |
| `feedback_payment_approval_rule.md` | 5,000円ルール記載確認（既更新済） | yutaka | A（確認のみ） |
| `_pm_shorts_format_guide.md` | D-1配分への参照リンク追加 | dinosaur-pm | C（Shorts第1本企画時） |

---

## トレードオフ

**得**:
- 動画運用80%以上要件達成（なーたん明示要件クリア）
- Seedance を試験枠で限定再開 → 本格運用前のリスク低減
- 既存Magnific資産46本をケンバーンズ動画化で再活用（捨てる素材なし）
- 予算ガードレール明文化で原価予測可能性向上（月6,000円〜7,100円で収束）
- 5,000円承認ルールが pre-approved 範囲外の課金を確実に止める

**失**:
- Seedance 月3,000円枠は16本中6本しかカバーできず、種別主役カットの 60%以上は Magnific ケンバーンズ代替 → 動きの説得力でSeedance採用本に劣る可能性
- ケンバーンズ動画化の編集工数増（junki負荷）。1本あたり10-12カットのケンバーンズ処理は自動化が前提
- 長尺(ADR-011)とShorts(ADR-013)の二系統並立で運用ルールが複雑化（Phase 2以降の運用判断はPM負荷増）
- Pexels恐竜実写不在の制約により、種別カット表現の幅が Seedance + Magnific生成依存になる

---

## なーたん決裁項目

1. **Shorts配分の承認**: Seedance25/Pexels30/Magnificケンバーンズ30/GPTImage10/その他5 で良いか
2. **動画率達成方針**: ケンバーンズ動画化を「動画扱い」とする運用解釈で良いか（純動画55% + 擬似動画40% = 95%）
3. **Seedance試験枠の評価条件**: 3軸（品質・原価・運用負荷）と閾値（採用率70%・600円/本・30分/本）で妥当か
4. **スケールアップ条件**: 試験枠3,000円 → 達成時5,000円拡張・未達時1,000円縮小 or 停止 で良いか
5. **Shorts用cooldown**: D-6 の表（species 8 Shorts / environment 6 Shorts 等）で良いか
6. **テーマcooldown新設**: material_reuse_policy.yml に `theme_cooldown` セクション追加で良いか
7. **予算ガードレール正式化**: storage.yml § channel_budget_guardrails の暫定記録を本ADRで正式化することの承認

---

## 関連

- [ADR-007](ADR-007_dinosaur_video_3source_procurement_strategy.md): 3ソース戦略本体（長尺前提・Shorts範囲のみ本ADRで上書き）
- [ADR-010](ADR-010_dinosaur_material_ingest_skill_and_cloud_storage.md): material-ingest skill・Drive保管（変更なし）
- [ADR-011](ADR-011_dinosaur_material_sourcing_pivot_and_ban_avoidance.md): Magnific抑制・BAN回避（長尺継続・並立）
- [ADR-012](ADR-012_dinosaur_shorts_first_strategy.md): Shorts主軸戦略本体（採択済・本ADRで素材調達層を補完）
- `feedback_payment_approval_rule.md`: 5,000円ルール（2026-06-09 更新済）
- `feedback_magnific_species_priority.md`: Magnific種別優先（Shortsでは「ケンバーンズ動画化」で運用継続）
- `project_dinosaur_stock_target.md`: 汎用素材ストック目標200本（Pexels中心・本ADR D-2の Pexels 30%枠と整合）
- `feedback_youtube_ban_avoidance_top_priority.md`: BAN回避最優先制約

---

## 決裁結果（2026-06-09 なーたん決裁）

全7決裁項目すべて承認。本ADRは **Accepted**。

| 項目 | 決裁結果 | 起案案との差分 |
| --- | --- | --- |
| 1. Shorts配分（Seedance25/Pexels30/Magnific30/GPTImage10/その他5） | 承認 | 起案どおり |
| 2. ケンバーンズ動画化を「動画扱い」とする運用解釈 | 承認 | 起案どおり |
| 3. Seedance評価条件（1ヶ月後3軸評価） | 承認 | 起案どおり |
| 4. スケールアップ条件（達成→5,000円枠拡張・未達→1,000円縮小or停止） | 承認 | 起案どおり |
| 5. Shorts用cooldown（species 8 Shorts / environment 6 Shorts 等） | 承認 | 起案どおり |
| 6. テーマcooldown（material_reuse_policy.yml に `theme_cooldown` 新設） | 承認 | 起案どおり |
| 7. 予算ガードレール正式化（storage.yml § channel_budget_guardrails） | 承認 | 起案どおり |

### 反映指示（yutaka担当）

§D-7 反映先7項目を優先度どおり実行:
- A優先（即時）: video_sources.yml `shorts_allocation` / storage.yml 暫定→正式 / material_reuse_policy.yml Shorts用cooldown + theme_cooldown / feedback_payment_approval_rule.md 確認
- B優先（来週）: pipeline/stages/05_edit/shorts/kenburns/ 新規 / _pm_seedance_trial_evaluation.md 新規
- C優先（Shorts第1本企画時）: _pm_shorts_format_guide.md にD-1配分参照リンク追加

---

## 改訂履歴

- 2026-06-09 v1: yutaka 起案。Shorts配分・Seedance試験枠・予算ガード・cooldown見直しを Proposed。なーたん決裁項目7点。
- 2026-06-09 v2: なーたん決裁完了。全7項目承認。Status: Accepted。決裁結果セクション・反映指示セクション追記。
