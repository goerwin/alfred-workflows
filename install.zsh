#!/usr/bin/env zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKFLOWS_DIR="$HOME/Library/Application Support/Alfred/Alfred.alfredpreferences/workflows"

echo "Installing Alfred workflows..."
echo "Target: $WORKFLOWS_DIR"
mkdir -p "$WORKFLOWS_DIR"

count=0
for wf in "$SCRIPT_DIR"/workflow.*(N/); do
  plist="$wf/info.plist"
  [[ -f "$plist" ]] || continue

  bundleid="$(/usr/libexec/PlistBuddy -c 'Print :bundleid' "$plist" 2>/dev/null)"
  [[ -n "$bundleid" ]] || continue

  src="$(cd "$wf" && pwd)"
  dst="$WORKFLOWS_DIR/$bundleid"

  # Never link into itself
  [[ "$dst" == "$src" || "$dst" == "$src"/* ]] && continue

  ln -sfn "$src" "$dst"
  echo "  Linked: $(basename "$wf") -> $bundleid"
  count=$((count + 1))
done

echo "Done! $count workflow(s) installed."
