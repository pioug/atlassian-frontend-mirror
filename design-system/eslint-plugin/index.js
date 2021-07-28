/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
// Used only for internal repo usage.
const path = require('path');

const paths = require('tsconfig-paths');

if (!require.extensions['.ts']) {
  // ts-node can only handle being registered once, see https://github.com/TypeStrong/ts-node/issues/409
  require('ts-node').register({
    project: path.join(__dirname, 'tsconfig.json'),
  });
}

try {
  // We programatically register tsconfig paths here so it picks up the tsconfig here
  // instead of in root CWD.
  paths.register(paths.loadConfig(__dirname));
} catch (e) {
  // eslint-disable-next-line no-console
  console.log(e);
}

module.exports = require('./src/index');
