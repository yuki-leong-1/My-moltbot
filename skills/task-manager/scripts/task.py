#!/usr/bin/env python3
"""Task Manager CLI — SQLite-backed task management for OpenClaw agents."""

import argparse
import json
import os
import sqlite3
import sys
from datetime import datetime, timezone, timedelta

DB_PATH = os.environ.get("TASK_DB", os.path.join(os.path.dirname(__file__), "..", "tasks.db"))
MYT = timezone(timedelta(hours=8))


def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA journal_mode=WAL")
    db.execute("""
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            category TEXT DEFAULT 'inbox',
            date TEXT,
            status TEXT DEFAULT 'todo',
            reminder TEXT,
            progress TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT,
            done_at TEXT
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS task_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            note TEXT,
            timestamp TEXT NOT NULL,
            FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
        )
    """)
    db.execute("PRAGMA foreign_keys = ON")
    db.commit()
    return db


def now_myt():
    return datetime.now(MYT).strftime("%Y-%m-%d %H:%M MYT")


def now_utc_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def add_log(db, task_id, action, note=None):
    db.execute("INSERT INTO task_logs (task_id, action, note, timestamp) VALUES (?, ?, ?, ?)",
               (task_id, action, note, now_myt()))


def cmd_add(args):
    db = get_db()
    created = now_myt()
    db.execute(
        "INSERT INTO tasks (title, category, date, reminder, created_at) VALUES (?, ?, ?, ?, ?)",
        (args.title, args.category, args.date, args.reminder, created),
    )
    task_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    add_log(db, task_id, "created", f"Task created: {args.title}")
    db.commit()
    print(json.dumps({"ok": True, "id": task_id, "title": args.title, "category": args.category,
                       "date": args.date, "reminder": args.reminder, "created_at": created}))


def cmd_list(args):
    db = get_db()
    query = "SELECT * FROM tasks WHERE 1=1"
    params = []
    if args.status:
        query += " AND status = ?"
        params.append(args.status)
    if args.category:
        query += " AND category = ?"
        params.append(args.category)
    if args.date:
        query += " AND date = ?"
        params.append(args.date)
    query += " ORDER BY id DESC"
    rows = db.execute(query, params).fetchall()
    tasks = [dict(r) for r in rows]
    print(json.dumps(tasks, ensure_ascii=False, indent=2))


def cmd_done(args):
    db = get_db()
    done_at = now_myt()
    cur = db.execute("UPDATE tasks SET status='done', done_at=?, updated_at=? WHERE id=?",
                     (done_at, done_at, args.id))
    if cur.rowcount:
        add_log(db, args.id, "done", args.note)
        db.commit()
        print(json.dumps({"ok": True, "id": args.id, "done_at": done_at}))
    else:
        db.commit()
        print(json.dumps({"ok": False, "error": f"Task #{args.id} not found"}))


def cmd_update(args):
    db = get_db()
    updated_at = now_myt()
    sets = ["updated_at = ?"]
    params = [updated_at]
    if args.title:
        sets.append("title = ?"); params.append(args.title)
    if args.category:
        sets.append("category = ?"); params.append(args.category)
    if args.date:
        sets.append("date = ?"); params.append(args.date)
    if args.reminder:
        sets.append("reminder = ?"); params.append(args.reminder)
    if args.progress:
        sets.append("progress = ?"); params.append(args.progress)
    if args.status:
        sets.append("status = ?"); params.append(args.status)
    params.append(args.id)
    cur = db.execute(f"UPDATE tasks SET {', '.join(sets)} WHERE id = ?", params)
    if cur.rowcount:
        changes = []
        if args.title: changes.append(f"title→{args.title}")
        if args.category: changes.append(f"category→{args.category}")
        if args.progress: changes.append(f"progress: {args.progress}")
        if args.status: changes.append(f"status→{args.status}")
        add_log(db, args.id, "updated", "; ".join(changes) if changes else None)
        db.commit()
        print(json.dumps({"ok": True, "id": args.id, "updated_at": updated_at}))
    else:
        db.commit()
        print(json.dumps({"ok": False, "error": f"Task #{args.id} not found"}))


def cmd_delete(args):
    db = get_db()
    cur = db.execute("DELETE FROM tasks WHERE id = ?", (args.id,))
    db.commit()
    print(json.dumps({"ok": cur.rowcount > 0, "id": args.id}))


def cmd_log(args):
    """Add a manual progress log entry to a task."""
    db = get_db()
    task = db.execute("SELECT id FROM tasks WHERE id=?", (args.id,)).fetchone()
    if not task:
        print(json.dumps({"ok": False, "error": f"Task #{args.id} not found"}))
        return
    add_log(db, args.id, args.action, args.note)
    db.execute("UPDATE tasks SET updated_at=? WHERE id=?", (now_myt(), args.id))
    db.commit()
    print(json.dumps({"ok": True, "id": args.id, "action": args.action, "note": args.note, "timestamp": now_myt()}))


def cmd_logs(args):
    """View log history for a task."""
    db = get_db()
    rows = db.execute("SELECT * FROM task_logs WHERE task_id=? ORDER BY id ASC", (args.id,)).fetchall()
    logs = [dict(r) for r in rows]
    print(json.dumps(logs, ensure_ascii=False, indent=2))


def cmd_summary(args):
    db = get_db()
    date = args.date or datetime.now(MYT).strftime("%Y-%m-%d")
    todo = db.execute("SELECT * FROM tasks WHERE date=? AND status='todo'", (date,)).fetchall()
    done = db.execute("SELECT * FROM tasks WHERE date=? AND status='done'", (date,)).fetchall()
    inbox = db.execute("SELECT * FROM tasks WHERE category='inbox' AND status='todo'").fetchall()
    print(json.dumps({
        "date": date,
        "todo": [dict(r) for r in todo],
        "done": [dict(r) for r in done],
        "inbox": [dict(r) for r in inbox],
    }, ensure_ascii=False, indent=2))


def main():
    parser = argparse.ArgumentParser(description="Task Manager CLI")
    sub = parser.add_subparsers(dest="command")

    # add
    p_add = sub.add_parser("add")
    p_add.add_argument("title")
    p_add.add_argument("--category", "-c", default="inbox", help="personal|work|inbox")
    p_add.add_argument("--date", "-d", help="YYYY-MM-DD")
    p_add.add_argument("--reminder", "-r", help="ISO datetime for reminder (UTC)")

    # list
    p_list = sub.add_parser("list")
    p_list.add_argument("--status", "-s")
    p_list.add_argument("--category", "-c")
    p_list.add_argument("--date", "-d")

    # done
    p_done = sub.add_parser("done")
    p_done.add_argument("id", type=int)
    p_done.add_argument("--note", "-n", help="Completion note")

    # update
    p_up = sub.add_parser("update")
    p_up.add_argument("id", type=int)
    p_up.add_argument("--title", "-t")
    p_up.add_argument("--category", "-c")
    p_up.add_argument("--date", "-d")
    p_up.add_argument("--reminder", "-r")
    p_up.add_argument("--progress", "-p")
    p_up.add_argument("--status", "-s")

    # delete
    p_del = sub.add_parser("delete")
    p_del.add_argument("id", type=int)

    # log
    p_log = sub.add_parser("log")
    p_log.add_argument("id", type=int)
    p_log.add_argument("note", help="Log message")
    p_log.add_argument("--action", "-a", default="progress", help="Action type (default: progress)")

    # logs
    p_logs = sub.add_parser("logs")
    p_logs.add_argument("id", type=int)

    # summary
    p_sum = sub.add_parser("summary")
    p_sum.add_argument("--date", "-d")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    cmds = {"add": cmd_add, "list": cmd_list, "done": cmd_done,
            "update": cmd_update, "delete": cmd_delete, "log": cmd_log,
            "logs": cmd_logs, "summary": cmd_summary}
    cmds[args.command](args)


if __name__ == "__main__":
    main()
