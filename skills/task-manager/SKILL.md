---
name: task-manager
description: Manage personal and work tasks with SQLite storage. Use when the user wants to add, list, complete, update, or delete tasks/todos, set reminders, view daily summaries, or track task progress. Handles categories (personal/work/inbox), timestamps, and reminder scheduling via OpenClaw cron.
---

# Task Manager

SQLite-backed task management. All data in `tasks.db` inside the skill directory.

## CLI

All commands use:

```bash
python3 /workspaces/My-moltbot/skills/task-manager/scripts/task.py <command> [args]
```

### Commands

| Command | Usage |
|---------|-------|
| **add** | `task.py add "title" [-c personal\|work\|inbox] [-d YYYY-MM-DD] [-r "UTC_ISO_DATETIME"]` |
| **list** | `task.py list [-s todo\|done] [-c personal\|work\|inbox] [-d YYYY-MM-DD]` |
| **done** | `task.py done <id>` |
| **update** | `task.py update <id> [-t "title"] [-c category] [-d date] [-r reminder] [-p "progress note"] [-s status]` |
| **delete** | `task.py delete <id>` |
| **summary** | `task.py summary [-d YYYY-MM-DD]` — shows todo + done + inbox for a date |

### Output

All output is JSON. When reporting to the user, format it human-friendly:

- Use bullet lists or numbered lists, not raw JSON
- Display dates/times in MYT (UTC+8) — the script already outputs MYT timestamps
- For task lists, show: checkbox (☐/☑), title, category, date, and ID

Example format for user:
```
📋 Tasks for 2026-02-16:
☐ Renew driving license @ JPJ (personal, #1)
☑ Test task (work, #4) — done 12:04 MYT
```

## Categories

- **inbox** — default, unsorted tasks
- **personal** — personal errands/life tasks
- **work** — work-related tasks

## Dates & Times

- Task dates: `YYYY-MM-DD`
- Reminders: UTC ISO datetime, e.g. `2026-02-16T04:00:00Z`
- Display timezone: MYT (UTC+8) — already handled by the script
- When user says a time like "10am", convert to UTC before passing as `-r`

## Reminder Workflow

When a task includes a reminder (`-r`), **also** create an OpenClaw cron one-shot:

```bash
openclaw cron add \
  --name "task-remind-<id>" \
  --at "<reminder_utc>" \
  --message "⏰ Reminder: <task title>" \
  --announce \
  --delete-after-run
```

This ensures the user gets notified at the reminder time.

## Typical Flows

1. **"Add task X"** → `task.py add "X"` (+ cron if reminder set)
2. **"What's on today?"** → `task.py summary` → format nicely
3. **"Done with X"** → find task ID from list, then `task.py done <id>`
4. **"Update progress"** → `task.py update <id> -p "progress note"`
5. **"Show my work tasks"** → `task.py list -c work -s todo`
