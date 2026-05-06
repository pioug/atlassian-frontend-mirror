#!/usr/bin/env node
/* eslint-disable */
const path = require('path');

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'index.js');

if (!__dirname.includes('node_modules')) {
	entrypoint = path.join(__dirname, 'src', 'index.tsx');
	if (!require.extensions['.ts']) {
		// NOTE: This was copied from an internal dev tooling package, this may not be needed.
		// But this should only take 25–100ms when necessary.
		require('esbuild-register/dist/node').register();
	}
}

require(entrypoint);
