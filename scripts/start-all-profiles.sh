#!/usr/bin/env bash
# Start multiple OpenClaw profiles at once
# Usage: ./start-all-profiles.sh [start|stop|status]

PROFILES=("kip" "study" "work")  # 在这里加减 profile
ACTION="${1:-start}"

case "$ACTION" in
  start)
    for p in "${PROFILES[@]}"; do
      echo "🚀 Starting profile: $p"
      openclaw --profile "$p" gateway start
    done
    echo "✅ All profiles started!"
    ;;
  stop)
    for p in "${PROFILES[@]}"; do
      echo "🛑 Stopping profile: $p"
      openclaw --profile "$p" gateway stop
    done
    echo "✅ All profiles stopped!"
    ;;
  status)
    for p in "${PROFILES[@]}"; do
      echo "📊 Profile: $p"
      openclaw --profile "$p" gateway status
      echo "---"
    done
    ;;
  restart)
    for p in "${PROFILES[@]}"; do
      echo "🔄 Restarting profile: $p"
      openclaw --profile "$p" gateway restart
    done
    echo "✅ All profiles restarted!"
    ;;
  *)
    echo "Usage: $0 [start|stop|status|restart]"
    exit 1
    ;;
esac
