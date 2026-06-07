# prompt: 03_video / シーン分解と素材ブリーフ

> 台本からシーン分解し、3ソースのどれを当てるか判定するプロンプト雛形。

## ロール

nishi（映像クリエイター）+ 恐竜PM（学術ガード）。

## 入力

- `02_script/script.md`
- `video_sources.yml`（3ソース配分・Seedance 状態・破綻パターン）
- `assets/library/` の既存資産

## タスク

1. 台本を **シーン** に分解（おおむね 5-15秒/シーン）
2. 各シーンに対し以下を判定：
   - 必要な絵柄（恐竜の動き／環境／図解／化石写真／復元画）
   - ソース選択（freestock / Magnific / Seedance / illustration_fallback）
   - 学術破綻リスク（high なら illustration_fallback 強制）
3. 制約3点を守る：複数種同居最小化／クロースアップ回避／仮説動作の断定回避

## 出力フォーマット

`scene_map.yml`:
```yaml
scenes:
  - id: 001
    start_sec: 0
    end_sec: 12
    narration_excerpt: "..."
    visual_intent: "トリケラトプスのフリル接近"
    source: magnific            # freestock / magnific / seedance / illustration_fallback
    asset_path: assets/library/02_magnific/dinosaur_bg/...
    risk:
      breakage: low             # low / medium / high
      reason: ""
  - id: 002
    ...
```

## ソース選択の目安

- 学術破綻リスク high → illustration_fallback（図解・復元画・化石写真）
- 抽象・環境・空・地層 → freestock
- 静止画/緩いパン・恐竜ビジュアル → Magnific
- ダイナミックな動き → Seedance（API再開後）
- Seedance 保留中（`video_sources.yml > seedance.enabled: false`）の間は Magnific or illustration_fallback に倒す
