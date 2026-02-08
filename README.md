# Alfred workflows

Run the install script via `zsh install.zsh` to create symlinks of these workflows into the Alfred's preference folder


## Troubleshooting

If you are receiving errors due to a sync folder path issue, it's probably due to having set a different preferences folder other than the default one. You may need to remove it from:

```sh
~/Library/Application Support/Alfred/prefs.json
```

After that, you must restart Alfred (via Alfred Preferences -> General)
