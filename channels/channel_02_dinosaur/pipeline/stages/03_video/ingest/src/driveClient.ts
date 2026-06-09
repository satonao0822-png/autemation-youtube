/**
 * Google Drive API ラッパー
 * OAuth トークンを使って Drive 操作（list / download / move / trash / upload）を行う
 */

import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { google, drive_v3 } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

export class DriveClient {
  private drive: drive_v3.Drive;

  private constructor(drive: drive_v3.Drive) {
    this.drive = drive;
  }

  static async create(): Promise<DriveClient> {
    const credPath = process.env.GOOGLE_OAUTH_CLIENT_SECRET_PATH;
    const tokenPath = process.env.GOOGLE_OAUTH_TOKEN_PATH;
    if (!credPath || !tokenPath) {
      throw new Error("OAuth環境変数が設定されていません（.env 確認）");
    }
    const credentials = JSON.parse(await fs.readFile(credPath, "utf-8"));
    const { client_id, client_secret, redirect_uris } = credentials.installed ?? credentials.web;
    const localRedirect =
      (redirect_uris as string[]).find((u) => u.startsWith("http://localhost")) ??
      "http://localhost:8765";
    const oAuth2 = new google.auth.OAuth2(client_id, client_secret, localRedirect);
    const token = JSON.parse(await fs.readFile(tokenPath, "utf-8"));
    oAuth2.setCredentials(token);
    const drive = google.drive({ version: "v3", auth: oAuth2 });
    return new DriveClient(drive);
  }

  /** フォルダ直下のファイルを list（mp4/mov等の動画に絞る） */
  async listVideos(parentId: string): Promise<drive_v3.Schema$File[]> {
    const all: drive_v3.Schema$File[] = [];
    let pageToken: string | undefined;
    do {
      const res = await this.drive.files.list({
        q: `'${parentId}' in parents and (mimeType contains 'video/' or mimeType = 'application/octet-stream') and trashed = false`,
        fields:
          "nextPageToken, files(id, name, mimeType, size, md5Checksum, createdTime, modifiedTime, thumbnailLink, videoMediaMetadata, parents)",
        pageSize: 100,
        pageToken,
      });
      all.push(...(res.data.files ?? []));
      pageToken = res.data.nextPageToken ?? undefined;
    } while (pageToken);
    return all;
  }

  /** 動画を一時ファイルにダウンロード */
  async download(fileId: string, destPath: string): Promise<void> {
    const res = await this.drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );
    await pipeline(res.data, createWriteStream(destPath));
  }

  /** ファイルを別フォルダへ移動（parents 付け替え） */
  async move(fileId: string, fromParentId: string, toParentId: string): Promise<void> {
    await this.drive.files.update({
      fileId,
      addParents: toParentId,
      removeParents: fromParentId,
      fields: "id, parents",
    });
  }

  /** ファイルをゴミ箱へ */
  async trash(fileId: string): Promise<void> {
    await this.drive.files.update({
      fileId,
      requestBody: { trashed: true },
      fields: "id, trashed",
    });
  }

  /** ファイル名変更 */
  async rename(fileId: string, newName: string): Promise<void> {
    await this.drive.files.update({
      fileId,
      requestBody: { name: newName },
      fields: "id, name",
    });
  }

  /** フォルダ作成（同名がなければ・あれば既存ID返す） */
  async ensureFolder(parentId: string, name: string): Promise<string> {
    const res = await this.drive.files.list({
      q: `'${parentId}' in parents and name = '${name.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: "files(id, name)",
      pageSize: 1,
    });
    const existing = res.data.files?.[0];
    if (existing?.id) return existing.id;
    const created = await this.drive.files.create({
      requestBody: {
        name,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentId],
      },
      fields: "id",
    });
    if (!created.data.id) throw new Error(`フォルダ作成失敗: ${name}`);
    return created.data.id;
  }
}
