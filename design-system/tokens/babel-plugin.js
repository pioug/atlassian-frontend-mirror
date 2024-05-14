/* eslint-disable */
/**
 * This is a custom `main` entrypoint that switches between source/dist depending on environment, similar to the /bin entrypoint
 * This is necessary so the babel plugin can be transpiled when we're building other packages (and this package may not have been compiled).
 */
const fs = require('fs');
const path = require('path');

const project = path.join(__dirname, 'tsconfig.node.json');
const dev = fs.existsSync(project);

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'babel-plugin', 'index');

if (dev || !fs.existsSync(entrypoint)) {
  entrypoint = path.join(__dirname, 'prebuilt', 'babel-plugin', 'plugin');
}

module.exports = require(entrypoint);
