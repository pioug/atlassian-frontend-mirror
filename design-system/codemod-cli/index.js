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
		// tsx registers the TypeScript loader
		require('tsx/cjs');
	}
	entrypoint = path.join(__dirname, 'src', 'index');
}

module.exports = require(entrypoint);
