# 06_publish — YouTube 公開

## 責務

- YouTube Data API v3 で `final.mp4` をアップロード
- メタデータ（タイトル・概要欄・タグ・カテゴリ・サムネ）設定
- AI開示の付与
- private で上がる → 最終ゲート通過後 public

## 入力

- `episodes/{EP}/05_edit/final.mp4`
- `episodes/{EP}/06_publish/meta.yml`（タイトル・概要欄・タグの個別値）
- `pipeline/config/publish.yml`（チャンネル共通設定）
- `assets/thumbnails/EP{NN}_{slug}_v{N}.png`
- OAuth 認証情報（secrets/ 配下・.env で参照）

## 出力

- YouTube 動画URL（00_meta.yml に書き戻し）
- アップロードログ（99_logs/）

## 担当（人格）

hina + 恐竜PM がメタを作り、最終的に publish skill が実行。

## ゲート（publish 実行前に全て満たす）

`pipeline/config/publish.yml > upload_gate` 参照。
- `pm_final_review_passed`
- `naatan_approval`
- `disclosure_present`（AI開示）
- `thumbnail_present`
- `references_present`（概要欄に学術ソース）

## 注意

- 初回は private アップ → 目視チェック → public 切替の2段階で慣らす
- public 切替も自動化するのは Phase 5
