#!/usr/bin/env bash
# Blocks commits that break the Aethermind phase gate or leak keys.
set -e
now=$(TZ=Asia/Dhaka date +%Y%m%d%H%M)
gate=202612111200   # Dec 11, 2026, 12:00 PM Bangladesh time
files=$(git diff --cached --name-only)

# secrets, always checked
if git diff --cached | grep -E 'AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{20,}|BEGIN (RSA|PRIVATE) KEY' >/dev/null; then
  echo "BLOCKED: possible API key or secret in staged changes."; exit 1
fi

# before the gate: only mockup and documentation paths
if [ "$now" -lt "$gate" ]; then
  allowed='^(mockup/|docs/|scripts/|\.github/|README\.md$|LICENSE$|\.gitignore$|\.gitattributes$)'
  bad=$(echo "$files" | grep -Ev "$allowed" || true)
  if [ -n "$bad" ]; then
    echo "BLOCKED (Phase 1): only the static mockup and documentation may be committed before Dec 11, 12:00 PM."
    echo "$bad"; exit 1
  fi
fi
exit 0
