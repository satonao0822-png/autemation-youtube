# 05_edit — 編集合成（Remotion）

## 責務

- 映像クリップ・ナレーション・BGM・テロップを1本に合成
- ラウドネス調整（YouTube推奨 -16 LUFS）
- テロップは焼き込まずレイヤー分離（恒久ルール）

## 技術スタック（ADR-009）

**Remotion**（React/TypeScript）で動画をコード化する。

- React コンポーネントで動画の構造を宣言的に記述
- テロップは独立コンポーネントとして実装 → レイヤー分離の恒久ルールと自然に整合
- BGM・SE・ナレーション同期は `<Sequence>` `<Audio>` `<OffthreadVideo>` で記述
- 出力時に内部で ffmpeg を呼ぶ。直接 ffmpeg を書く必要はほぼ無し

## 入力

- `episodes/{EP}/03_video/scenes/` + `scene_map.yml`
- `episodes/{EP}/04_voice/narration.wav` + `timing.json`
- `pipeline/config/edit.yml`, `bgm.yml`, `telop.yml`
- `assets/library/05_bgm/`

## 出力

- `episodes/{EP}/05_edit/final.mp4` — 公開用本体
- `episodes/{EP}/05_edit/final.srt` — メインテロップ（別ファイル）
- `episodes/{EP}/05_edit/project/` — Remotion プロジェクト一式（再編集用）

## 担当（人格）

junki。skill 化先は `.claude/skills/junki-edit/`（ADR-009 優先順位 #4）。

## Remotion 想定構成（暫定）

```
pipeline/stages/05_edit/
├── remotion.config.ts
├── src/
│   ├── Root.tsx                # 全 Composition の登録
│   ├── compositions/
│   │   ├── MainVideo.tsx       # 本編 Composition
│   │   ├── Opening.tsx
│   │   ├── BodyPart.tsx
│   │   ├── Closing.tsx
│   │   └── Cta.tsx
│   ├── components/
│   │   ├── TelopMain.tsx       # メインテロップ
│   │   ├── TelopSupplementary.tsx  # 学名・出典補足
│   │   ├── SceneTransition.tsx
│   │   └── BgmTrack.tsx
│   └── lib/
│       ├── loadEpisode.ts      # episodes/{EP}/ から設定読み込み
│       └── timingSync.ts       # 04_voice/timing.json との同期
├── package.json
└── tsconfig.json
```

## 実装の進め方（Phase 2 以降）

1. Node.js / npm 環境を整備（プロジェクト直下に Remotion セットアップ）
2. 最小 Composition（背景動画 + ナレーション + 1テロップ）が回ることを確認
3. EP01 の構成に沿って Composition を組み立てる
4. `.claude/skills/junki-edit/` に skill としてラップ
