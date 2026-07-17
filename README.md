# ⚠️ This Repository Has Been Archived

This project is no longer maintained. I switched to syncing my workflows via `Google Drive` since they change quite often, and keeping them in sync with `Git` was just too painful.

---

# Alfred workflows

Run the install script via `zsh install.zsh` to create symlinks of these workflows into the Alfred's preference folder


## Troubleshooting

If you are receiving errors due to a sync folder path issue, it's probably due to having set a different preferences folder other than the default one. You may need to remove it from:

```sh
~/Library/Application Support/Alfred/prefs.json
```

After that, you must restart Alfred (via Alfred Preferences -> General)
