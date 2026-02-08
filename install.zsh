#!/usr/bin/env zsh

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKFLOWS_DIR="$HOME/Library/Application Support/Alfred/Alfred.alfredpreferences/workflows"

mkdir -p "$WORKFLOWS_DIR"

for wf in "$SCRIPT_DIR"/workflow.*(/); do
  ln -sf "$wf" "$WORKFLOWS_DIR/$(basename "$wf")"
done
