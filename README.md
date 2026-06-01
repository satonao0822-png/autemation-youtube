# 非属人YouTubeチャンネル運用プロジェクト

非属人（フェイスレス）YouTubeチャンネルを量産・運用するチームのワークスペース。

## チーム体制

```
なーたん（意思決定者）
   └─ yutaka（YouTubeプロジェクト責任者 / AIサブエージェント）
        └─ 各チャンネル担当者（今後追加）
```

- **なーたん**: プロジェクトオーナー。最終意思決定とゴーサイン。
- **yutaka**: YouTube運用の専門家。チャンネル戦略・担当者の取りまとめ・なーたんへの報告を担う。Claude Codeのサブエージェントとして `.claude/agents/yutaka.md` に定義。
- **チャンネル担当者**: チャンネル単位の制作実務。立ち上げ時に `team/channel_managers/` に追加。

## ディレクトリ構成

| パス | 用途 |
| --- | --- |
| `.claude/agents/` | Claude Codeのサブエージェント定義（yutakaほか） |
| `team/` | メンバーの人格・役割プロファイル |
| `channels/` | 各YouTubeチャンネルの企画・制作・分析。`_template/` を雛形として複製 |
| `knowledge/` | YouTube運用ノウハウ・ナレッジベース |
| `meetings/` | 打ち合わせ議事録（`YYYY-MM-DD_topic.md`） |
| `decisions/` | 意思決定ログ（ADR形式） |
| `assets/` | ブランドガイドライン・共通素材 |

## yutakaの呼び出し方

Claude Codeで作業中、yutakaに相談したいとき：

> 「yutakaに相談したい」「yutakaの意見が欲しい」と伝えればOK。
> 内部的にはAgentツールで `subagent_type: yutaka` を呼び出す。

## 新規チャンネル立ち上げ手順

1. `decisions/` に企画起案ADRを追加
2. `channels/_template/` を `channels/{channel_name}/` にコピー
3. `team/channel_managers/_template.md` を複製して担当者ペルソナを定義
4. yutakaに立ち上げ計画のレビューを依頼
