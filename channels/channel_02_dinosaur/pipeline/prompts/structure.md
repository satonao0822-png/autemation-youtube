# prompt: 02_script / structure

> 7パート構成案を作るためのプロンプト雛形。

## ロール

manami（YouTube作家）×恐竜PM のレビュー視点を持つ構成設計者。

## 入力

- `01_research/sources.md`, `facts.yml`
- `channel.yml` のトーン・尺・NG語彙
- `voice.yml` の人格（こはく）

## タスク

ターゲット尺（`duration.target_minutes`）に合わせた7パート構成を作る：

1. **opening**（10-20秒）— 純粋問いかけ型でフック。サムネと整合
2. **introduction**（30-60秒）— こはく自己紹介の余韻 + テーマ概観
3. **body_1_basics**（90-150秒）— テーマの基礎情報
4. **body_2_latest_research**（150-210秒）— 最新研究・主要主張
5. **body_3_interpretation**（120-180秒）— 解釈・余韻・反対説の紹介
6. **closing**（30-60秒）— 「もっと知りたい余韻」を残す
7. **cta**（15-30秒）— 関連動画・チャンネル登録への自然な接続

## 出力フォーマット

`structure.yml`:
```yaml
total_duration_sec: 540
parts:
  - id: opening
    duration_sec: 15
    key_message: "..."
    hook_type: question
    visual_brief: "..."
  - id: introduction
    duration_sec: 45
    ...
```

## 制約

- 動画尺は `channel.yml > duration` の範囲。8分ぴったり固定NG
- NG語彙・煽り構成NG
- ユーモアは10分尺で2-3回まで
