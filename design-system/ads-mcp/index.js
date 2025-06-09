#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const project = path.join(__dirname, 'tsconfig.json');
const dev = fs.existsSync(project);

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'index');
if (dev) {
	entrypoint = path.join(__dirname, 'src', 'index');
	if (!require.extensions['.ts']) {
		// ts-node can only handle being registered once, see https://github.com/TypeStrong/ts-node/issues/409
		require('ts-node').register({ project });
	}
}

require(entrypoint);
