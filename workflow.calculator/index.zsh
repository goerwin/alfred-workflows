#!/usr/bin/env zsh

query="$1"

result="$(numi-cli "$query" 2>/dev/null)"

if [[ -z "$result" || "$result" == "error" ]]; then
  jq -n '{
    items: [
      {
        title: "Invalid input",
        valid: false
      }
    ]
  }'
  exit 0
fi

jq -n --arg r "$result" '{
  items: [
    {
      title: $r,
      match: $r,
      arg: $r
    }
  ]
}'
