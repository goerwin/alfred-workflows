import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { globby } from 'globby';

const HOME_DIR = os.homedir();

function absPath(filePath: string, basePath = HOME_DIR) {
  return path.join(basePath, filePath);
}

const IGNORE_PATTERNS = [
  '**/.git',
  '**/node_modules',
  '**/cache',
  '**/.cache',
  '**/.temp',
  '**/.tmp',
  '**/tmp',
  '**/.prvt',
  '**/.nvm',
  '**/.local',
  '**/.Trash',
  '**/.npm',
  '**/.turbo',
  '**/.Encrypted',
  '**/.DS_Store',

  '**/cypress',
  '**/*.app/**/*',
];

const globalPaths = await globby('**/*', {
  cwd: HOME_DIR,
  absolute: true,
  onlyFiles: false,
  dot: true,
  followSymbolicLinks: false,
  suppressErrors: true,

  ignore: [
    ...IGNORE_PATTERNS,
    absPath('.!(config|hammerspoon)/**/*'),
    absPath('Movies'),
    absPath('Pictures'),
    absPath('Music'),
    absPath('Library'),
    '**/coverage/**/*',
    '**/temp-icons/**/*',
    '**/.docusaurus/**/*',
    '**/Projects/**/dist/**/*',
    '**/Projects/**/lib/**/*',
    '**/Projects/**/fixtures/**/*',
    '**/Projects/godaddy/**/components/icon/**/*',
    '**/Projects/godaddy/**/*.svg',
  ],
});

const cloudPaths = await globby(
  [
    absPath('Library/CloudStorage/**/*'),
    absPath('Library/Mobile Documents/com~apple~CloudDocs/**/*'),
  ],
  {
    cwd: HOME_DIR,
    absolute: true,
    onlyFiles: false,
    dot: true,
    followSymbolicLinks: false,
    suppressErrors: true,
    ignore: [...IGNORE_PATTERNS],
  }
);

const db = {
  items: [...globalPaths, ...cloudPaths].map((elementPath) => {
    return {
      uid: elementPath,
      title: path.basename(elementPath),
      subtitle: elementPath.replace(HOME_DIR, '~'),
      autocomplete: path.basename(elementPath),
      // match: parsedFilePath,
      arg: elementPath,
      type: 'file:skipcheck',
      icon: {
        type: 'fileicon',
        path: elementPath,
      },
    };
  }),
};

// await new Promise((resolve) =>
//   process.stdout.write(
//     JSON.stringify([...globalPaths, ...cloudPaths], null, 2),
//     resolve
//   )
// );
// process.exit(0);

console.error('Updating index database...');

const CACHE_DIR = path.join(HOME_DIR, '.cache/co-goerwin-alfred-fd');
const DB_FILE_PATH = path.join(CACHE_DIR, 'db.json');

await fs.mkdir(CACHE_DIR, { recursive: true });
await fs.writeFile(DB_FILE_PATH, JSON.stringify(db, null, 2));

console.log(
  JSON.stringify({
    items: [
      {
        title: 'Done!',
        subtitle: `Index database updated! Items: ${db.items.length}. (⌘↵ to open it)`,
        mods: {
          cmd: {
            valid: true,
            arg: DB_FILE_PATH,
            subtitle: `Open ${DB_FILE_PATH}`,
          },
        },
      },
    ],
  })
);
