#!/usr/bin/env node
/* eslint-disable */
const fs = require('fs');
const path = require('path');
const project = path.join(__dirname, 'tsconfig.json');
const srcEntrypoint = path.join(__dirname, 'src', 'index.tsx');
const inPackage = __dirname.includes('node_modules');

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'index.js');
if (!inPackage && fs.existsSync(srcEntrypoint)) {
	entrypoint = srcEntrypoint;
	if (!require.extensions['.ts']) {
		require('ts-node').register({ project });
	}
}

require(entrypoint);
