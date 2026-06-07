#!/bin/zsh
# 毎日Notionの進捗を自動更新するスクリプト
# launchd から呼び出される（21:00 実行）

# ログファイル
LOG_DIR="/Users/satonao/Documents/非属人youtube作成/scripts/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/notion_update_$(date +%Y-%m-%d).log"

echo "=== Notion 自動更新 $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG_FILE"

# プロジェクトディレクトリへ移動
cd /Users/satonao/Documents/非属人youtube作成 || exit 1

# Claude CLI のパスを確認（Homebrew 経由）
CLAUDE_PATH=$(which claude 2>/dev/null || echo "/usr/local/bin/claude")

if [ ! -x "$CLAUDE_PATH" ]; then
  echo "ERROR: claude コマンドが見つかりません" >> "$LOG_FILE"
  exit 1
fi

# Claude に進捗更新を依頼（非対話モード）
"$CLAUDE_PATH" -p "日次報告を更新して。ローカルの最新ファイルを確認してNotionのエピソード管理DBと日次HQレポートを今日の日付で更新すること。" \
  --output-format text \
  >> "$LOG_FILE" 2>&1

echo "=== 完了 $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG_FILE"
