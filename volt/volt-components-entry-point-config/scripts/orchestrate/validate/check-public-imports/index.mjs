#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies, no-console, no-continue -- This command-line validator uses the package's TypeScript dev toolchain, reports failures to stderr, and uses early loop exits to avoid nested conditions. */

import { readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import ts from 'typescript';

const [packageJsonPath] = process.argv.slice(2);

if (!packageJsonPath) {
	console.error('Usage: check-public-imports.mjs <path-to-package.json>');
	process.exitCode = 2;
} else {
	await main(resolve(packageJsonPath));
}

async function main(resolvedPackageJsonPath) {
	try {
		const packageJson = JSON.parse(await readFile(resolvedPackageJsonPath, 'utf8'));
		const packageDirectory = dirname(resolvedPackageJsonPath);
		const targets = [...new Set(collectExportTargets(packageJson.exports))].filter((target) =>
			target.startsWith('./'),
		);
		const violations = [];

		for (const target of targets) {
			if (target.includes('*')) continue;
			const filePath = resolve(packageDirectory, target);
			try {
				await stat(filePath);
			} catch {
				violations.push(`${target}: export target does not exist.`);
				continue;
			}

			const source = await readFile(filePath, 'utf8');
			const { importedFiles } = ts.preProcessFile(source, true, true);
			for (const { fileName } of importedFiles) {
				if (!fileName.startsWith('.')) continue;
				const resolution = ts.resolveModuleName(
					fileName,
					filePath,
					{
						allowJs: true,
						module: ts.ModuleKind.Node16,
						moduleResolution: ts.ModuleResolutionKind.Node16,
						resolveJsonModule: true,
					},
					ts.sys,
				);
				if (!resolution.resolvedModule) {
					violations.push(`${target}: cannot resolve ${fileName} from ${target}.`);
				}
			}
		}

		if (violations.length > 0) {
			console.error(
				`Public export import-resolution failures for ${packageJson.name ?? resolvedPackageJsonPath}:`,
			);
			for (const violation of violations) console.error(`  - ${violation}`);
			process.exitCode = 1;
		}
	} catch (error) {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	}
}

function* collectExportTargets(value) {
	if (typeof value === 'string') {
		yield value;
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) yield* collectExportTargets(item);
		return;
	}
	if (!value || typeof value !== 'object') return;
	for (const nestedValue of Object.values(value)) yield* collectExportTargets(nestedValue);
}
