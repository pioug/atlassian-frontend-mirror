const fs = require('fs');
const path = require('path');

const ORIG_PKG_PATH = path.resolve(__dirname, '../package.json');
const CACHED_PKG_PATH = path.resolve(__dirname, '../cached-package.json');

if (!fs.existsSync(CACHED_PKG_PATH)) {
  throw new Error(
    'No cached package found! Make sure to run devCleanup first!',
  );
}

const cachedFile = JSON.parse(fs.readFileSync(CACHED_PKG_PATH));
const pkgData = `${JSON.stringify(cachedFile, null, 2)}\n`;

fs.writeFile(ORIG_PKG_PATH, pkgData, function (err) {
  if (err) throw err;
});

fs.unlink(CACHED_PKG_PATH, function (err) {
  if (err) throw err;
});
