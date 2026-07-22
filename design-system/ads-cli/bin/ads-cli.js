#!/usr/bin/env node
/* eslint-disable */
/* prettier-ignore */

/**
 * Executable entrypoint for `npx @atlaskit/ads-cli`.
 *
 * Like `index.js`, this switches between the TypeScript source (when running inside the
 * monorepo) and the built `dist/cjs` output (when installed from npm). It then invokes
 * the exported `run()` function and maps thrown numeric values to process exit codes so
 * commands can signal a specific exit status by throwing a number.
 */

const fs = require('fs');
const path = require('path');

// The presence of tsconfig.json indicates we are running from source in the monorepo.
const isDev = fs.existsSync(path.join(__dirname, '..', 'tsconfig.json'));

if (isDev) {
	// `@atlassian/ts-loader` registers `tsx` require hooks so the TypeScript source
	// (including `.tsx` files and cross-package imports) can be `require`d directly
	// without a pre-build step. Unlike `ts-node`, it supports TS Project References.
	require('@atlassian/ts-loader');
}

require(path.join('..', isDev ? 'src/cli' : 'dist/cjs/cli'))
	.run(process.argv.slice(2))
	.then((exitCode) => {
		// A resolved numeric value is treated as an explicit exit code.
		process.exit(typeof exitCode === 'number' ? exitCode : 0);
	})
	.catch((error) => {
		// A thrown number is treated as an explicit exit code (e.g. usage errors).
		if (typeof error === 'number') {
			process.exit(error);
		}
		console.error(error);
		process.exit(1);
	});
