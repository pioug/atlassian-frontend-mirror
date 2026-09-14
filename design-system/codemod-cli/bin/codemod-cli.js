#!/usr/bin/env node
/* eslint-disable */
/* prettier-ignore */

const fs = require('fs');
const path = require('path');
const project = path.join(__dirname, '../tsconfig.json');
const dev = fs.existsSync(project);

if (dev && !require.extensions['.ts']) {
	// tsx registers the TypeScript loader
	require('tsx/cjs');
}

require(path.join('..', dev ? 'src/cli' : 'dist/cjs/cli'))
	.run()
	.catch((error) => {
		if (typeof error === 'number') {
			process.exit(error);
		}
		console.error(error);
		process.exit(1);
	});
