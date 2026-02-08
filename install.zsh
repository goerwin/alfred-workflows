#!/usr/bin/env zsh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKFLOWS_DIR="$HOME/Library/Application Support/Alfred/Alfred.alfredpreferences/workflows"

mkdir -p "$WORKFLOWS_DIR"

for wf in "$SCRIPT_DIR"/workflow.*(N/); do
  src="$(cd "$wf" && pwd)"
  dst="$WORKFLOWS_DIR/$(basename "$wf")"

  # Do not link into itself or its children
  [[ "$dst" == "$src" || "$dst" == "$src"/* ]] && continue

  ln -sfn "$src" "$dst"
done
