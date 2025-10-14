#!/usr/bin/env node
/* eslint-disable */
const path = require('path');

require('esbuild-register/dist/node').register();
if (!__dirname.includes('node_modules') && !require.extensions['.ts']) {
	// NOTE: This was copied from an internal dev tooling package, this may not be needed.
	// But this should only take 25–100ms when necessary.
	const paths = require('tsconfig-paths');
	paths.register(paths.loadConfig(__dirname));
}

require(path.join(__dirname, 'src/index.tsx'));
