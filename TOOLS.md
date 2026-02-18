# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## Telegram 发图片

Telegram 不支持 `MEDIA:` 标签发本地图片。必须用 `openclaw message send` CLI：

```bash
# 1. 先把图片复制到允许的目录
cp /path/to/image.png /home/codespace/.openclaw/media/inbound/image.png

# 2. 用 CLI 发送
openclaw message send \
  --channel telegram \
  --target "7068941808" \
  --message "caption 文字" \
  --media /home/codespace/.openclaw/media/inbound/image.png
```

**关键：** 只有 `/home/codespace/.openclaw/media/inbound/` 目录下的文件才能发送，其他路径会报 `not under an allowed directory` 错误。

## Google CLI (gog)

`gog` v0.11.0 — Google CLI for Gmail/Calendar/Drive/Contacts/Tasks etc.

- **Account:** yuki.leong.20@gmail.com
- **必须设置环境变量:** `GOG_KEYRING_PASSWORD="openclaw-kip-2026"`

### 安装 & 迁移指南

```bash
# 1. 安装 gog (检查最新版本)
# gog 是独立二进制，确认安装方式: https://github.com/...

# 2. 导入 OAuth client secret
gog auth credentials set /path/to/client_secret.json

# 3. 登录授权 (无浏览器环境用 --remote)
GOG_KEYRING_PASSWORD="openclaw-kip-2026" gog login yuki.leong.20@gmail.com \
  --remote --step 1 \
  --services gmail,calendar,drive,contacts,tasks \
  --force-consent
# 然后浏览器打开 URL，授权后把跳转 URL 拿回来:
GOG_KEYRING_PASSWORD="openclaw-kip-2026" gog login yuki.leong.20@gmail.com \
  --remote --step 2 --auth-url '<redirect-url>'
```

### 迁移需要的文件

| 文件 | 路径 | 说明 |
|------|------|------|
| Client Secret | `auth/client_secret_*.json` | OAuth 客户端凭证（在 workspace 里） |
| gog 配置 | `~/.config/gogcli/config.json` | gog CLI 配置 |
| gog 凭证 | `~/.config/gogcli/credentials.json` | OAuth client credentials |
| gog tokens | `~/.config/gogcli/keyring/` | 加密的 refresh token |

⚠️ **注意:** token 文件用 `GOG_KEYRING_PASSWORD` 加密，迁移后密码一致就能直接用。如果丢了就重新走一遍 login flow。

### 已知限制

- `gmail batch delete`（永久删除）需要 `mail.google.com` scope，当前只有 `gmail.modify`
- 用 `--add TRASH --remove INBOX` 代替永久删除（30天后自动清）
- 如需永久删除，重新授权时加 scope 或用 `--services all`

### 常用命令

- `gog gmail search "query"` — 搜索邮件
- `gog gmail search "query" --all` — 搜索所有页
- `gog gmail batch modify <id>... --add TRASH --remove INBOX` — 移到垃圾桶
- `gog gmail batch modify <id>... --add <label>` — 加 label
- `gog gmail batch delete <id>...` — 永久删除（需要更高 scope）
- `gog calendar` — 日历操作
- `gog drive ls` / `gog drive search` — Drive 文件
- `gog contacts` — 联系人
- `gog tasks` — 任务

---

Add whatever helps you do your job. This is your cheat sheet.
