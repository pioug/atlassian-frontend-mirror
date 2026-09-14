#!/usr/bin/env node

/* eslint-disable no-console, no-continue -- This command-line validator reports failures and uses early loop exits to avoid nested conditions. */

import { execFile as execFileCallback } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { promisify } from 'node:util';

// eslint-disable-next-line import/extensions -- Node ESM requires the file extension for this local import.
import { buildExportMap, runtimeExportCount } from '../check-exported-identifiers/index.mjs';

const execFile = promisify(execFileCallback);

export function findNewExportTargetShapeViolations({ current, preExistingFiles }) {
	const violations = [];

	for (const [exportKey, entries] of Object.entries(current)) {
		for (const entry of entries) {
			if (preExistingFiles.has(entry.fileName) || runtimeExportCount(entry.exports) <= 1) continue;
			violations.push(
				`${exportKey} introduces multi-runtime-export target ${entry.fileName}:\n${JSON.stringify(entry.exports, null, 2)}`,
			);
		}
	}
	return violations;
}

async function main() {
	const [packageJsonPath, ...arguments_] = process.argv.slice(2);
	if (!packageJsonPath) {
		console.error(
			'Usage: check-export-target-shapes.mjs <path-to-package.json> [--merge-base <commit>]',
		);
		process.exitCode = 2;
		return;
	}
	const mergeBaseIndex = arguments_.indexOf('--merge-base');
	const requestedMergeBase = mergeBaseIndex === -1 ? undefined : arguments_[mergeBaseIndex + 1];
	const { stdout: repoRootOutput } = await execFile('git', ['rev-parse', '--show-toplevel']);
	const repoRoot = repoRootOutput.trim();
	const mergeBase =
		requestedMergeBase ?? (await execFile('git', ['merge-base', 'HEAD', 'master'])).stdout.trim();
	const resolvedPackageJsonPath = resolve(packageJsonPath);
	const readCurrentFile = (filePath) => readFile(filePath, 'utf8');
	const readBaselineFile = async (filePath) => {
		const relativePath = relative(repoRoot, filePath).replaceAll('\\', '/');
		return (await execFile('git', ['show', `${mergeBase}:${relativePath}`])).stdout;
	};

	try {
		const { current } = await buildExportMap({
			packageJsonPath: resolvedPackageJsonPath,
			readCurrentFile,
			readBaselineFile,
		});
		const packageDirectory = dirname(resolvedPackageJsonPath);
		const preExistingFiles = new Set();
		for (const entries of Object.values(current)) {
			for (const { fileName } of entries) {
				const repositoryPath = relative(repoRoot, resolve(packageDirectory, fileName)).replaceAll(
					'\\\\',
					'/',
				);
				try {
					await execFile('git', ['cat-file', '-e', `${mergeBase}:${repositoryPath}`]);
					preExistingFiles.add(fileName);
				} catch {
					// A missing merge-base file is a newly introduced target.
				}
			}
		}
		const violations = findNewExportTargetShapeViolations({ current, preExistingFiles });

		if (violations.length > 0) {
			console.error(
				`Invalid new export targets for ${resolvedPackageJsonPath} against ${mergeBase}:`,
			);
			for (const violation of violations) console.error(`\n- ${violation}`);
			process.exitCode = 1;
		}
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	await main();
}
