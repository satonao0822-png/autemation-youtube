# 03_video — 映像素材取得

## 責務

- 台本のシーン分解
- 3ソース戦略（無料ストック25% / Magnific35% / Seedance40%）に沿った素材取得
- 学術的破綻カットの図解・復元画・化石写真への差し替え判定

## 入力

- `episodes/{EP}/02_script/script.md`（シーン分解可能形式）
- `pipeline/config/video_sources.yml`
- `assets/library/{01_freestock, 02_magnific, 03_seedance}/`

## 出力

- `episodes/{EP}/03_video/scenes/*.mp4` または 静止画
- `episodes/{EP}/03_video/scene_map.yml` — シーン番号 ↔ 素材ファイル ↔ 出典の対応

## 担当（人格）

nishi。学術整合性は 恐竜PM レビュー。

## 注意

- Seedance は 2026-06-04 一旦保留中。再開条件は `video_sources.yml` 参照
- 破綻パターン（指の本数・歯列・羽毛の有無・運動様式）の自動検出は将来課題。当面は人手判定
- シーン制約3点：複数種同居最小化／クロースアップ回避／仮説動作の断定回避
