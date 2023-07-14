/**
 * This is a custom `main` entrypoint that switches between source/dist depending on environment, similar to the /bin entrypoint
 */
/* eslint-disable global-require,import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

const project = path.join(__dirname, 'tsconfig.json');
const dev = fs.existsSync(project);

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'index');
if (dev) {
  if (!require.extensions['.ts']) {
    // ts-node can only handle being registered once, see https://github.com/TypeStrong/ts-node/issues/409
    // eslint-disable-next-line import/no-extraneous-dependencies
    require('ts-node').register({ project });
  }
  entrypoint = path.join(__dirname, 'src', 'index');
}

module.exports = require(entrypoint);
