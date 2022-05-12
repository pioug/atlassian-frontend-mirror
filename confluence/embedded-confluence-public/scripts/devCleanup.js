const fs = require('fs');
const path = require('path');

const ORIG_PKG_PATH = path.resolve(__dirname, '../package.json');
const CACHED_PKG_PATH = path.resolve(__dirname, '../cached-package.json');

const pkgData = JSON.parse(fs.readFileSync(ORIG_PKG_PATH));

const devDepsToRemove = ['@atlassian/atlassian-frontend-prettier-config-1.0.0'];

fs.writeFile(CACHED_PKG_PATH, JSON.stringify(pkgData), function (err) {
  if (err) throw err;
});

devDepsToRemove.forEach(function (pkgName) {
  delete pkgData.devDependencies[pkgName];
});

delete pkgData.optionalDependencies;

fs.writeFile(ORIG_PKG_PATH, JSON.stringify(pkgData, null, 2), function (err) {
  if (err) throw err;
});
