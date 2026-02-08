const os = require('node:os');
const fs = require('node:fs');
const path = require('node:path');

const homeDir = os.homedir();
const gcPath = path.resolve(
  homeDir,
  'Library/Application Support/Google/Chrome'
);

const lsPath = path.resolve(gcPath, 'Local State');
const ls = JSON.parse(fs.readFileSync(lsPath, { encoding: 'utf8' }));
const profileInfo = ls.profile;
const profiles = Object.keys(profileInfo.info_cache).map((el) => ({
  uid: profileInfo.info_cache[el].name,
  title: el,
  subtitle: `${profileInfo.info_cache[el].user_name} - ${profileInfo.info_cache[el].name}`,
  arg: el,
}));

console.log(JSON.stringify({ items: profiles }));
