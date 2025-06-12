#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const project = path.join(__dirname, 'tsconfig.json');
const dev = fs.existsSync(project);

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'index.js');
if (dev) {
	entrypoint = path.join(__dirname, 'src', 'index');
	if (!require.extensions['.ts']) {
		require('ts-node').register({ project });
	}
}

require(entrypoint);
