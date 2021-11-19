/* eslint-disable global-require,import/no-extraneous-dependencies */
/* eslint-disable */
/**
 * This is a custom `main` entrypoint that switches between source/dist depending on environment, similar to the /bin entrypoint
 * This is necessary so the babel plugin can be transpiled when we're building other packages (and this package may not have been compiled).
 */
const fs = require('fs');
const path = require('path');
const paths = require('tsconfig-paths');

const project = path.join(__dirname, 'tsconfig.node.json');
const dev = fs.existsSync(project);

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'babel-plugin', 'index');

if (dev) {
  if (
    !require.extensions['.ts'] ||
    // This extra condition is required to prevent compilation issues caused by jest attaching the JS loader to the TS extension
    // See https://product-fabric.atlassian.net/browse/AFP-3413?focusedCommentId=247598
    require.extensions['.ts'] === require.extensions['.js']
  ) {
    // ts-node can only handle being registered once, see https://github.com/TypeStrong/ts-node/issues/409
    require('ts-node').register({ project });
  }

  entrypoint = path.join(__dirname, 'src', 'babel-plugin', 'plugin');

  try {
    // We programmatically register tsconfig paths here so it picks up the tsconfig here
    // instead of in root CWD.
    paths.register(paths.loadConfig(__dirname));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

module.exports = require(entrypoint);
