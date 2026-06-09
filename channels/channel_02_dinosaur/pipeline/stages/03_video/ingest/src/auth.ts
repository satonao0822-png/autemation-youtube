/**
 * Google OAuth セットアップ
 * 初回実行で credentials.json → token.json を生成
 *
 * 使い方:
 *   npm run auth
 *   → ブラウザが開く → なーたん が Google アカウント認証
 *   → token.json が GOOGLE_OAUTH_TOKEN_PATH に保存される
 */

import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/drive"];

async function main(): Promise<void> {
  const credPath = process.env.GOOGLE_OAUTH_CLIENT_SECRET_PATH;
  const tokenPath = process.env.GOOGLE_OAUTH_TOKEN_PATH;

  if (!credPath || !tokenPath) {
    throw new Error(
      "GOOGLE_OAUTH_CLIENT_SECRET_PATH と GOOGLE_OAUTH_TOKEN_PATH を .env に設定してください"
    );
  }

  const credentials = JSON.parse(await fs.readFile(credPath, "utf-8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed ?? credentials.web;

  // ローカルコールバック用ポート（redirect_uris の中で http://localhost:* を探す）
  const localRedirect =
    (redirect_uris as string[]).find((u) => u.startsWith("http://localhost")) ??
    "http://localhost:8765";

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, localRedirect);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
  });

  console.log("\n以下のURLをブラウザで開いて認証してください:\n");
  console.log(authUrl);
  console.log("\n認証後、自動的にコールバックを受け取ります...\n");

  const port = Number(new URL(localRedirect).port || "8765");
  const code = await waitForCode(port);

  const { tokens } = await oAuth2Client.getToken(code);
  await fs.mkdir(path.dirname(tokenPath), { recursive: true });
  await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2), "utf-8");

  console.log(`\nOK: トークンを ${tokenPath} に保存しました`);
}

function waitForCode(port: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${port}`);
      const code = url.searchParams.get("code");
      if (code) {
        res.end("認証完了。このタブは閉じて構いません。");
        server.close();
        resolve(code);
      } else {
        res.statusCode = 400;
        res.end("code パラメータが見つかりません");
      }
    });
    server.on("error", reject);
    server.listen(port);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
