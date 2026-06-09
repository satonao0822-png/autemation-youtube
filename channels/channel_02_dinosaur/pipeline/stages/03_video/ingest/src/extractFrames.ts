/**
 * ffmpeg で動画からフレームを抽出（10秒分・1秒1枚 = 10枚）
 */

import path from "node:path";
import fs from "node:fs/promises";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";
import sharp from "sharp";

if (ffmpegStatic) ffmpeg.setFfmpegPath(ffmpegStatic);

const FRAME_COUNT = 10;
const FRAME_INTERVAL_SEC = 1;
const MAX_WIDTH = 1024;     // Vision に送る画像幅（コスト抑制）

export interface ExtractedFrames {
  /** 10枚のJPEGファイルパス（一時ファイル） */
  framePaths: string[];
  /** 1枚目（preview として保存する代表画像） */
  previewPath: string;
  /** 元動画の duration_sec（取れたら） */
  durationSec: number | null;
}

/**
 * 動画から10秒分のフレーム抽出。一時ディレクトリに JPEG を出力
 */
export async function extractFrames(
  videoPath: string,
  tmpDir: string,
  fileId: string
): Promise<ExtractedFrames> {
  await fs.mkdir(tmpDir, { recursive: true });
  const outputPattern = path.join(tmpDir, `${fileId}_%02d.jpg`);

  await new Promise<void>((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions([
        `-vf fps=1/${FRAME_INTERVAL_SEC},scale=${MAX_WIDTH}:-1`,
        `-frames:v ${FRAME_COUNT}`,
        `-q:v 4`,
      ])
      .output(outputPattern)
      .on("end", () => resolve())
      .on("error", reject)
      .run();
  });

  const files = (await fs.readdir(tmpDir))
    .filter((f) => f.startsWith(`${fileId}_`) && f.endsWith(".jpg"))
    .sort()
    .map((f) => path.join(tmpDir, f));

  if (files.length === 0) {
    throw new Error(`フレーム抽出失敗: ${videoPath}`);
  }

  // duration 取得
  const durationSec = await getDurationSec(videoPath);

  // 代表1枚を preview として返す（縮小して軽量化）
  const previewPath = path.join(tmpDir, `${fileId}_preview.jpg`);
  await sharp(files[0]).resize({ width: 640 }).jpeg({ quality: 85 }).toFile(previewPath);

  return { framePaths: files, previewPath, durationSec };
}

function getDurationSec(videoPath: string): Promise<number | null> {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(videoPath, (err, data) => {
      if (err) {
        resolve(null);
        return;
      }
      resolve(data.format?.duration ?? null);
    });
  });
}

/** 一時フレームを削除 */
export async function cleanupFrames(framePaths: string[], previewPath: string): Promise<void> {
  await Promise.allSettled([...framePaths, previewPath].map((p) => fs.unlink(p)));
}
