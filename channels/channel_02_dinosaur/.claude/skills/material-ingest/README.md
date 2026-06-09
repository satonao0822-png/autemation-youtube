# skill: material-ingest（予約）

> ADR-010 で skill化優先順位 #2 に指定された skill。
> 実装は Phase 3。本ファイルは予約・設計参照。

## 役割

なーたんが `assets/library/02_magnific/inbox/` に放り込んだ動画を：
1. ffmpeg でスクショ抽出
2. Claude Vision（Sonnet 4.6）で5+1軸判定
3. Google Drive にアップロード
4. ローカルに preview + メタ更新
5. inbox から削除（容量解放）

## 実装場所

`pipeline/stages/03_video/ingest/` 配下に実コード。本フォルダは SKILL.md ラッパーのみ。

## 起動方法（設計）

なーたんが「素材振り分けて」「inboxの動画整理して」等と言うと起動。

## 関連ドキュメント

- 設計: [ADR-010](../../../../../decisions/ADR-010_dinosaur_material_ingest_skill_and_cloud_storage.md)
- 設定: [pipeline/config/storage.yml](../../../pipeline/config/storage.yml)
- 実装場所: [pipeline/stages/03_video/ingest/README.md](../../../pipeline/stages/03_video/ingest/README.md)
- プロンプト: [pipeline/prompts/material_classification.md](../../../pipeline/prompts/material_classification.md)
- 出力先語彙: [assets/library/02_magnific/_tag_dictionary.yml](../../../assets/library/02_magnific/_tag_dictionary.yml)
