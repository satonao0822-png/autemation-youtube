# 非属人YouTubeチャンネル運用プロジェクト

非属人（フェイスレス）YouTubeチャンネルを量産・運用するチームのワークスペース。

## チーム体制

```
なーたん（意思決定者）
   └─ yutaka（YouTubeプロジェクト責任者）
        ├─ manami（作家 / リサーチ・台本）
        ├─ nishi（映像クリエイター / seedance等）
        ├─ junki（編集 / fish audio音声合成・字幕・最終仕上げ）
        └─ hina（サムネ / タイトル設計）
```

- **なーたん**: プロジェクトオーナー。最終意思決定。
- **yutaka**: YouTube運用責任者。戦略立案 / チーム取りまとめ / なーたんへの報告。`.claude/agents/yutaka.md`
- **manami**: YouTube作家。ネタリサーチと台本執筆。`.claude/agents/manami.md`
- **nishi**: 映像クリエイター。動画生成AIで背景映像とBロール。`.claude/agents/nishi.md`
- **junki**: 動画編集。音声合成・字幕・最終仕上げ。`.claude/agents/junki.md`
- **hina**: サムネ / タイトル設計。CTR最大化。`.claude/agents/hina.md`

運営チーム4人はチャンネル横断でyutakaの下に編成（[ADR-002](decisions/ADR-002_ops_team_formation.md)）。
互いに直接やり取り可。詳細は [`team/communication_protocol.md`](team/communication_protocol.md)。

特定チャンネル専属のPMが必要になった場合は `team/channel_managers/_template.md` を複製して追加。

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

## エージェントの呼び出し方

Claude Codeで作業中、特定のメンバーに頼みたいとき：

| 言い回し | 呼ばれる人 |
| --- | --- |
| 「yutakaに相談」「yutakaに振って」 | yutaka |
| 「manamiに台本」「ネタ探して」 | manami |
| 「nishiに映像」「画コンテ作って」 | nishi |
| 「junkiに編集」「音声入れて」 | junki |
| 「hinaにサムネ」「タイトル考えて」 | hina |

内部的にはAgentツールで `subagent_type: {name}` を呼び出す。
複数職種にまたがる依頼は yutaka に投げると、必要に応じてメンバーを召集してくれる。

## 新規チャンネル立ち上げ手順

1. なーたん × yutaka でコンセプト方向性を合意
2. `decisions/` に企画起案ADRを追加
3. `channels/_template/` を `channels/{slug}/` にコピー
4. yutaka がチームに初動タスクを割る（manami: リサーチ・台本フォーマット試作 → nishi: 画コンテ → junki: 音声・編集 → hina: サムネ）
5. 1本目を作って公開、改善サイクルへ
