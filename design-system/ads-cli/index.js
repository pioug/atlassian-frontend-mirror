/**
 * Custom `main` entrypoint that switches between source (in the monorepo) and the
 * built `dist/cjs` output (when published to npm), mirroring the sibling
 * `@atlaskit/codemod-cli` package.
 *
 * When required from inside the monorepo the compiled output does not exist, so we
 * register `@atlassian/ts-loader` (the AFM-blessed `tsx`-based require hook) and load
 * the TypeScript source directly. When installed from npm (e.g. via
 * `npx @atlaskit/ads-cli`) the `tsconfig.json` is stripped by `.npmignore`, so we fall
 * through to the pre-built CommonJS bundle.
 */
/* eslint-disable global-require, import/no-dynamic-require */

const fs = require('fs');
const path = require('path');

// The presence of tsconfig.json indicates we are running from source in the monorepo.
const isDev = fs.existsSync(path.join(__dirname, 'tsconfig.json'));

let entrypoint = path.join(__dirname, 'dist', 'cjs', 'cli');

if (isDev) {
	// `@atlassian/ts-loader` registers `tsx` require hooks so the TypeScript source
	// (including `.tsx` files and cross-package imports) can be `require`d directly
	// without a pre-build step. Unlike `ts-node`, it supports TS Project References.
	// eslint-disable-next-line import/no-extraneous-dependencies
	require('@atlassian/ts-loader');
	entrypoint = path.join(__dirname, 'src', 'cli');
}

module.exports = require(entrypoint);
