# 制作ワークフロー

## パイプライン全体図

```
ネタ選定(yutaka/manami) → 構成案(manami) → 台本(manami) → yutakaレビュー
  → 音声合成(junki) → 素材収集/映像生成(nishi) → 編集(junki)
  → サムネ・タイトル(hina) → yutaka最終チェック → なーたん承認 → 公開(junki)
  → 分析(yutaka + 各員)
```

## 各工程の担当・所要時間・ツール

| 工程 | 担当 | 所要時間 | ツール / 補足 |
| --- | --- | --- | --- |
| ネタ選定 | yutaka + manami | 30分/週次 | 企画ストックA-E群から選定、検索ボリューム参照 |
| 構成案 | manami | 1-2時間 | 構成テンプレ準拠（フック/本編/CTA） |
| 台本 | manami | 4-6時間 | Markdown形式、テロップ用テキスト併記 |
| 台本レビュー | yutaka | 30分 | 法務ガード/トーン/独自視点の確認 |
| 音声合成 | junki | 1-2時間 | Fish Audio S2-Pro（日本語）、感情制御 |
| 素材収集/映像生成 | nishi | 4-6時間 | Seedance 2.0 Pro でBロール生成、図解はCanva/Figma |
| 編集 | junki | 4-6時間 | DaVinci Resolve / Premiere、字幕は自動生成 + 校正 |
| サムネ | hina | 2時間 | Photoshop / Figma、A/B 2-3案 |
| タイトル/概要欄 | hina + yutaka | 30分 | タイトル3案 → CTR想定でyutaka判断 |
| 公開設定 | junki | 30分 | タグ・カテゴリ・終了画面・カード |
| 分析 | yutaka中心 | 1時間 | 公開24h / 7日 / 28日でAnalytics確認 |

## 品質チェックリスト（公開前）

### 内容
- [ ] 冒頭15秒のフックは十分強いか（ペルソナ名指し + 1行の問い）
- [ ] 結論先出しになっているか
- [ ] **「投資助言ではない」「個別銘柄推奨ではない」「過去実績は将来を保証しない」の3点表記**
- [ ] 「絶対」「確実」「儲かる」などのNG断定表現がないか
- [ ] 「PR」「アフィリエイトリンクを含む」が概要欄に明示されているか

### 技術
- [ ] 音量レベルは適切か（-14 LUFS目安）
- [ ] 字幕の誤字脱字
- [ ] サムネとタイトルの整合性
- [ ] 概要欄のリンク・タイムスタンプ
- [ ] 著作権チェック（BGM・素材・引用データの出典）
- [ ] AI生成物の利用規約クリア（Seedance Pro / Fish Audio有料プラン）
- [ ] **「AI音声・AI生成映像を含む」開示が概要欄にあるか**
- [ ] タグ・カテゴリ・終了画面・カード

### Inauthentic判定対策
- [ ] `scripts/EP{NN}_editorial.md` に編集判断ログを残したか
- [ ] サムネ・タイトルが過去動画と過剰に似ていないか
- [ ] 独自試算・独自データ・独自視点が盛り込まれているか

## ファイル命名規則

- 台本: `scripts/EP{NN}_{slug}.md`（例: `EP01_how-to-start-nisa.md`）
- 編集判断ログ: `scripts/EP{NN}_editorial.md`
- サムネ: `assets/thumbnails/EP{NN}_{slug}_v{N}.{png|psd}`
- 分析メモ: `analytics/EP{NN}_{slug}_{YYYY-MM-DD}.md`
