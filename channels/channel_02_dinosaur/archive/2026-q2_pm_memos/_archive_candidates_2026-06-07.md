# アーカイブ候補リスト — 2026-06-07

> ADR-008 Phase 0 に基づき、`channel_02_dinosaur/` 直下の散在ファイルを `archive/` または `episodes/EP01_triceratops_frill/` に振り分ける提案。
> **このファイル自身は一時メモ。なーたん承認後、移動を実行し、本ファイルは archive へ。**

## 振り分け方針

3カテゴリに分ける：

| カテゴリ | 行き先 | 判定 |
| --- | --- | --- |
| **A. アクティブ維持** | 移動しない | 戦略コア／確定設計ガイド／現役運用ドキュメント |
| **B. archive/ 移動** | `archive/2026-q2_*/` | 議事・提案・依頼など履歴的価値のみのもの |
| **C. EP01 移植**（Phase 2） | `episodes/EP01_triceratops_frill/` | EP01固有の成果物。新EP構造への移植 |

---

## A. アクティブ維持（移動しない）

| ファイル | 理由 |
| --- | --- |
| `00_concept.md` 〜 `04_kpi.md`, `README.md` | 戦略コア |
| `03_production_workflow.md` | 人手版ワークフローの正本（pipeline と並走） |
| `_narrator_persona.md` | こはく人格の正本（pipeline/config/voice.yml から参照） |
| `_bgm_design_guide_2026-06-04.md` | BGM設計の正本（pipeline/config/bgm.yml から参照） |
| `_telop_design_guide_2026-06-04.md` | テロップ設計の正本（pipeline/config/telop.yml から参照） |
| `_pm_quality_checklist.md` | 現役品質ゲート |
| `_pm_status_overview_2026-06-02.md` | 最新ステータス。更新終了したらアーカイブ |

---

## B. archive/ 移動候補

### → `archive/2026-q2_proposals/`

- `_proposal_from_hina_channel_name.md`
- `_proposal_from_hina_thumbnail_retry_2026-06-02.md`
- `_proposal_from_hina_thumbnail_v3_2026-06-02.md`
- `_proposal_from_hina_workflow_2026-06-02.md`
- `_proposal_from_junki_workflow_2026-06-02.md`
- `_proposal_from_manami_ep01_structure_2026-06-02.md`（v1.1 で置き換え済）
- `_proposal_from_nishi_workflow_2026-06-02.md`

### → `archive/2026-q2_pm_memos/`

- `_pm_memo_execution_plan_2026-06-02.md`
- `_pm_memo_weekly_goal_2026-06-07.md`
- `_pm_memo_seedance_pause_2026-06-04.md`（要点は `pipeline/config/video_sources.yml` に反映済）
- `_pm_memo_to_junki_voice_decided_2026-06-04.md`（要点は `pipeline/config/voice.yml` に反映済）
- `_pm_memo_voice_direction_change_2026-06-04.md`（同上）
- `_pm_analysis_naatan_brief_video_cost_2026-06-04.md`
- `_pm_request_to_yutaka_invest_pause_2026-06-04.md`

### → `archive/2026-q2_requests_feedbacks/`

- `_feedback_to_hina_2026-06-02.md`
- `_request_to_hina_2026-06-01.md`
- `_request_to_hina_role_update_2026-06-04.md`
- `_request_to_hina_workflow_2026-06-02.md`
- `_request_to_junki_api_setup_2026-06-02.md`
- `_request_to_junki_workflow_2026-06-02.md`
- `_request_to_nishi_2026-06-01.md`
- `_request_to_nishi_workflow_2026-06-02.md`

### → `archive/2026-q2_research/`

- `_competitor_analysis_nazology_2026-06-02.md`
- `_research_vaience_script_2026-06-02.md`
- `_research_vaience_thumbnail_2026-06-02.md`
- `_tech_qa_fish_audio_2026-06-02.md`
- `_tech_qa_seedance_2026-06-02.md`

### → `archive/2026-q2_briefs/`

- `_brief_from_naatan_video_cost_2026-06-04.md`
- `_voice_sample_listening_2026-06-04.md`

---

## C. EP01 移植候補（Phase 2 で実施）

> Phase 2（EP01 を新構造に移植）で `episodes/EP01_triceratops_frill/` 配下に再配置する。

| 元ファイル | 移植先 |
| --- | --- |
| `_proposal_from_manami_ep01_structure_v1.1_2026-06-02.md` | `episodes/EP01_*/02_script/structure_draft.md` |
| `_pm_memo_ep01_decision_2026-06-02.md` | `episodes/EP01_*/00_decision_log.md` |
| `_pm_memo_ep01_longlist.md` | `episodes/EP01_*/01_research/longlist.md` |
| `_pm_instruction_to_manami_v1.2_2026-06-04.md` | `episodes/EP01_*/02_script/pm_instruction.md` |
| `_followup_to_manami_ep01_go_2026-06-02.md` | `episodes/EP01_*/02_script/followup.md` |
| `_request_to_manami_ep01_2026-06-02.md` | `episodes/EP01_*/02_script/request.md` |
| `_review_workflow_ep01.md` | `episodes/EP01_*/_review_workflow.md` |
| `assets/library/_ep01_freestock_checklist.md` | `episodes/EP01_*/03_video/freestock_checklist.md` |

---

## なーたんへの確認事項

1. **B の archive 移動を実行してよいか**（履歴は残るが直下から消える）
2. **C の EP01 移植を Phase 2 で実施することを承認するか**
3. **A の判定（移動しない）でズレているものはないか**

承認が下りたら次ターンで実行する。
