const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const homeDir = os.homedir();
const gcPath = path.resolve(
  homeDir,
  'Library/Application Support/Google/Chrome'
);

const selectedProfile =
  process.env.selectedProfile || process.env.defaultProfile || 'Default';
const prBms = path.resolve(gcPath, selectedProfile, 'Bookmarks');
const bmInfo = JSON.parse(fs.readFileSync(prBms, { encoding: 'utf8' }));

function getBookmarks(bookmark, bookmarks = [], path = '', depth = 0) {
  const { type, url, name } = bookmark;
  const isFolder = type === 'folder';

  if (isFolder)
    return bookmark.children.reduce(
      (newBookmarks, cur) =>
        getBookmarks(
          cur,
          newBookmarks,
          depth > 0 ? `${path}${path ? `/` : ''}${bookmark.name}` : '',
          depth + 1
        ),
      bookmarks
    );

  const normalizedPath = path.replace(/[\W]/g, ' ');
  const title = name || url;
  const normalizedTitle = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const parsedBookmark = {
    uid: url,
    title,
    subtitle: `${path ? `${path} - ` : ''}${url}`,
    match: `${normalizedPath} ${normalizedTitle} ${title} ${url}`.toLowerCase(),
    quicklookurl: url,
    arg: [selectedProfile, url],
    text: { copy: url, largetype: url },
    // icon: { path: '/Applications/Google Chrome.app', type: 'fileicon' },
  };

  return [...bookmarks, parsedBookmark];
}

const userInput = process.argv.slice(2).join(', ').toLowerCase().normalize();
const bookmarks = getBookmarks(bmInfo.roots.bookmark_bar);
const filteredBookmarks = bookmarks.filter((bm) =>
  bm.match.includes(userInput)
);

console.error('bb', 'cc', filteredBookmarks.length);

console.log(
  JSON.stringify({
    items: [
      ...filteredBookmarks,
      {
        title: userInput ? `Buscar: ${userInput}` : 'Google',
        arg: [
          selectedProfile,
          userInput
            ? `https://google.com/search?q=${encodeURIComponent(userInput)}`
            : 'https://google.com',
        ],
      },
    ],
  })
);
