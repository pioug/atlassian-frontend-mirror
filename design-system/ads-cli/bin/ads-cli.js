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
	// without a pre-build step.
	require('@atlassian/ts-loader');
}

// The AFM repo-root shell shim sets this display-only value because it delegates to this same
// package entrypoint. A direct source invocation advertises the exact runnable command; published
// package runs retain the stable npx form.
const { resolveInvocation } = require('@atlaskit/cli-output/invocation');
const invocation = resolveInvocation({
	argv1: process.argv[1],
	isDev,
	environmentVariable: 'ADS_CLI_DISPLAY_INVOCATION',
	publishedInvocation: 'npx @atlaskit/ads-cli',
});

require(path.join('..', isDev ? 'src/cli' : 'dist/cjs/cli'))
	.run(process.argv.slice(2), undefined, { invocation })
	.then((exitCode) => {
		// Set the eventual exit code without forcing the process to stop. A forced `process.exit()` can
		// truncate output that is still draining to a pipe (for example, `icon --all --json`).
		process.exitCode = typeof exitCode === 'number' ? exitCode : 0;
	})
	.catch((error) => {
		// A thrown number is treated as an explicit exit code (e.g. usage errors).
		if (typeof error === 'number') {
			process.exitCode = error;
			return;
		}
		console.error(error);
		process.exitCode = 1;
	});
