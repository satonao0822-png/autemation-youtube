# .claude/skills/ — 恐竜ch 専用スキル置き場（将来）

> 各メンバー（manami/nishi/junki/hina）の作業を Claude Code の skill として呼び出すための置き場。
> 現状は **予約のみ**。実装は ADR-008 Phase 3 以降。

## 設計方針

- skill 名は `{role}-{task}` 形式（例: `junki-voice`, `manami-script`）
- 各 skill は `pipeline/stages/{NN}_*/` のコードを呼ぶエントリポイント
- skill の責務は「パイプラインの1工程を完結させる」こと

## 移行優先順位（ADR-008 §移行プラン より）

1. `junki-voice` — fish audio API呼び出し（最も自動化容易）
2. `manami-script` — 台本生成
3. `junki-edit` — ffmpeg 合成
4. `nishi-video` — 3ソース取得・図解差し替え判定
5. `publish-youtube` — YouTube Data API
6. `hina-thumbnail` — サムネ案出し（実装はなーたん手動継続が現実的）

## エージェントとの関係

`.claude/agents/{manami,nishi,junki,hina}.md`（プロジェクトルート）の人格定義は当面残置。
skill は「人格 × タスク」の組み合わせで切り出すため、エージェント定義は人格・トーンの正本として参照され続ける。
