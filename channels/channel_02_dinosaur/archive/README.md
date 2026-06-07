# archive/ — 履歴・参照用

> 過去の議事録・提案・PMメモ等を保管する場所。
> **読み専が原則**。新しい内容を書き足さない（書きたい時は pipeline/ か episodes/ に書く）。

## 目的

- 「現在進行のファイル」と「履歴」が混ざることによる探索コストの増大を防ぐ
- 過去の意思決定の経緯を辿れる状態を保つ（ADRの一次ソース）
- 削除はしない（情報資産として保持）

## サブフォルダ規約

`{YYYY-qN}_{category}/` 形式：

| 例 | 内容 |
| --- | --- |
| `2026-q2_proposals/` | `_proposal_from_*` 系（各メンバーの提案書） |
| `2026-q2_pm_memos/` | `_pm_memo_*` 系（PMメモ・判断記録） |
| `2026-q2_requests_feedbacks/` | `_request_to_*` `_feedback_to_*` `_followup_to_*` 系 |
| `2026-q2_research/` | `_competitor_analysis_*` `_research_*` `_tech_qa_*` 系 |
| `2026-q2_briefs/` | `_brief_from_naatan_*` 系 |

## 「アクティブ」と「アーカイブ」の判定基準

| アクティブ（移動しない） | アーカイブ（移動候補） |
| --- | --- |
| 戦略ドキュメント（00-04） | 個別の提案書（_proposal_from_*） |
| 確定した設計ガイド（`_narrator_persona`, `_bgm_design_guide`, `_telop_design_guide`） | EP01固有のメモ（次フェーズで episodes/EP01/ に移植） |
| 現役品質チェックリスト（`_pm_quality_checklist`） | 議論済みの依頼・返信（_request_to_*, _feedback_to_*） |
| 最新のステータス俯瞰（`_pm_status_overview` の最新版） | 競合分析・初期リサーチ（一度読めば十分） |

判定に迷う場合は `_archive_candidates_*.md` のリストでなーたん確認を取る。
