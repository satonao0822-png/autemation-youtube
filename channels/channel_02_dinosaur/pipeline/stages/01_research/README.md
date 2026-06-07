# 01_research — リサーチ・ネタ選定（最優先 skill 化対象）

## 位置づけ

ADR-009 で **skill 化優先順位 #1** に指定された stage。
なーたん明示「リサーチ作業自体をスキル化したい（次動画への再現性を持たせたい）」。

将来の skill 名: `.claude/skills/research-skill/`

## 責務

- 海外論文・大学・博物館の **一次情報** を収集（査読論文を優先）
- 一次ソースを **事実ベースで構造化** し、台本のソースとして残す
- 雑学化できるテーマかを判定
- 信頼度（high / medium / hypothesis）を明示

## 入力

- `episodes/{EP}/00_meta.yml`（テーマ要約・一次論文 DOI/URL があれば）
- `pipeline/config/channel.yml`（NG語彙・トーン）
- `pipeline/prompts/research.md`

## 出力

- `episodes/{EP}/01_research/sources.md` — 引用文献リスト
  - 和訳タイトル + 原タイトル + 著者 + 年 + DOI/URL
  - 各主張の信頼度・反対説・限界を併記
- `episodes/{EP}/01_research/facts.yml` — 構造化ファクト（台本生成 stage が読む）

## 担当（人格）

manami + 恐竜PM の役割を **research-skill が代行**（skill 化後）。
当面は manami（収集）+ 恐竜PM（ファクトチェック）の人手運用。

## 海外論文の参照経路

- **第一選択**: Claude の Web 検索（査読論文・大学公式・博物館公式）
- **段階的に追加**:
  - CrossRef API（DOI 解決・メタデータ）
  - Semantic Scholar API（論文関連性・引用関係）
  - arXiv API（プレプリント・最新研究）
- **一次ソース優先順位**:
  1. 査読論文（PLOS, Nature, Science, J. Vertebr. Paleontol., Cretaceous Res. 等）
  2. 大学・博物館の公式記事
  3. 学会発表抄録
  4. レビュー論文・解説記事（査読論文への入口として）

## 再現性のためのルール

- 同じテーマで再実行しても **同じ一次ソースに到達できる** ようクエリ・検索戦略をログ化
- `99_logs/01_research_query_log.yml` に検索クエリ・ヒットURL・採用判断を残す
- 採用ソースは DOI で固定（URL は変動するため）

## 品質ゲート

- 全主張に DOI または公式URL の出典があるか
- 推測・解釈は「○○とされている」表現で書かれているか
- 最上級表現に限定詞が付いているか
- NG語彙混入なし
