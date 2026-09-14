#!/usr/bin/env node

/* eslint-disable no-console -- This command-line validator reports actionable failures to stderr. */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [packageJsonPath] = process.argv.slice(2);

if (!packageJsonPath) {
	console.error('Usage: check-package-export-keys.mjs <path-to-package.json>');
	process.exitCode = 2;
} else {
	const resolvedPackageJsonPath = resolve(packageJsonPath);
	const packageJson = JSON.parse(await readFile(resolvedPackageJsonPath, 'utf8'));
	const exportsMap = packageJson.exports;

	if (exportsMap && typeof exportsMap === 'object' && !Array.isArray(exportsMap)) {
		const invalidKeys = Object.keys(exportsMap).filter((key) => key.split('/').includes('src'));

		if (invalidKeys.length > 0) {
			console.error(
				`${packageJson.name ?? resolvedPackageJsonPath} has invalid exports key${
					invalidKeys.length === 1 ? '' : 's'
				} containing a src path segment:`,
			);
			for (const key of invalidKeys) {
				console.error(`  - ${key}`);
			}
			console.error('Export values may reference src; export keys must not.');
			process.exitCode = 1;
		}
	}
}
