#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies, no-bitwise, no-console, no-continue, prefer-destructuring, prefer-template -- This command-line validator uses the package's TypeScript dev toolchain, compiler bit flags, stderr diagnostics, and parsing-oriented control flow. */

import { execFile as execFileCallback } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import ts from 'typescript';

const execFile = promisify(execFileCallback);

export async function buildExportMap({ packageJsonPath, readCurrentFile, readBaselineFile }) {
	const resolvedPackageJsonPath = resolve(packageJsonPath);
	const packageDirectory = dirname(resolvedPackageJsonPath);
	const packageJson = JSON.parse(await readCurrentFile(resolvedPackageJsonPath));
	const baselinePackageJson = JSON.parse(await readBaselineFile(resolvedPackageJsonPath));

	return {
		baseline: await describeExports({
			exportsField: baselinePackageJson.exports,
			packageDirectory,
			readFile: readBaselineFile,
		}),
		current: await describeExports({
			exportsField: packageJson.exports,
			packageDirectory,
			readFile: readCurrentFile,
		}),
	};
}

export function findExportCompatibilityViolations({ baseline, current }) {
	const violations = [];
	for (const [exportKey, baselineEntries] of Object.entries(baseline)) {
		const currentEntries = current[exportKey];
		if (!currentEntries) {
			violations.push(`Removed existing export key ${exportKey}.`);
			continue;
		}

		if (!sameExportSurface(baselineEntries, currentEntries)) {
			violations.push(
				`Changed public export surface for ${exportKey}:\n` +
					formatExportEntries('baseline', baselineEntries) +
					'\n' +
					formatExportEntries('current', currentEntries),
			);
		}

		for (const baselineEntry of baselineEntries) {
			if (
				runtimeExportCount(baselineEntry.exports) > 1 &&
				!currentEntries.some(({ fileName }) => fileName === baselineEntry.fileName) &&
				!baselineEntry.isSimpleReExport
			) {
				violations.push(
					`Removed existing multi-runtime-export file ${baselineEntry.fileName} from ${exportKey}. ` +
						'Only a simple re-export may be retargeted to a direct export.',
				);
			}
		}
	}

	return violations;
}

async function describeExports({ exportsField, packageDirectory, readFile: readSourceFile }) {
	const entriesByKey = {};
	for (const { exportKey, target } of getExportTargetEntries(exportsField)) {
		if (!target.startsWith('./') || target.includes('*')) {
			continue;
		}

		const filePath = resolve(packageDirectory, target);
		const sourceText = await readSourceFile(filePath);
		const exports = getExportedIdentifiers(
			ts.createSourceFile(
				filePath,
				sourceText,
				ts.ScriptTarget.Latest,
				true,
				getScriptKind(filePath),
			),
		);
		const entry = {
			fileName: target,
			exports,
			isSimpleReExport: isSimpleReExport(
				ts.createSourceFile(
					filePath,
					sourceText,
					ts.ScriptTarget.Latest,
					true,
					getScriptKind(filePath),
				),
			),
		};
		(entriesByKey[exportKey] ??= []).push(entry);
	}

	for (const entries of Object.values(entriesByKey)) {
		entries.sort((left, right) => left.fileName.localeCompare(right.fileName));
	}
	return entriesByKey;
}

function* getExportTargetEntries(exportsField, exportKey = '.') {
	if (typeof exportsField === 'string') {
		yield { exportKey, target: exportsField };
		return;
	}
	if (Array.isArray(exportsField)) {
		for (const value of exportsField) {
			yield* getExportTargetEntries(value, exportKey);
		}
		return;
	}
	if (!exportsField || typeof exportsField !== 'object') {
		return;
	}

	const keys = Object.keys(exportsField);
	const isSubpathMap = keys.some((key) => key.startsWith('.'));
	for (const [key, value] of Object.entries(exportsField)) {
		yield* getExportTargetEntries(value, isSubpathMap ? key : exportKey);
	}
}

function getExportedIdentifiers(sourceFile) {
	const identifiers = [];
	for (const statement of sourceFile.statements) {
		if (ts.isExportAssignment(statement)) {
			identifiers.push(createExport('default', 'runtime', statement.expression, false));
			continue;
		}
		if (ts.isExportDeclaration(statement)) {
			addExportDeclarationIdentifiers(statement, identifiers);
			continue;
		}
		if (!hasExportModifier(statement)) {
			continue;
		}

		const isDefault = hasDefaultModifier(statement);
		if (ts.isVariableStatement(statement)) {
			const isConstant = Boolean(statement.declarationList.flags & ts.NodeFlags.Const);
			for (const declaration of statement.declarationList.declarations) {
				addBindingIdentifiers(declaration.name, identifiers, isConstant);
			}
		} else if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
			identifiers.push(createExport(statement.name.text, 'type', statement.name, false));
		} else if (
			ts.isFunctionDeclaration(statement) ||
			ts.isClassDeclaration(statement) ||
			ts.isEnumDeclaration(statement) ||
			ts.isModuleDeclaration(statement)
		) {
			const name = isDefault ? 'default' : statement.name?.text;
			if (name) {
				identifiers.push(createExport(name, 'runtime', statement.name, false));
			}
		}
	}

	const namedRuntimeLocalNames = new Set(
		identifiers
			.filter(({ kind, name, localName }) => kind === 'runtime' && name !== 'default' && localName)
			.map(({ localName }) => localName),
	);
	return identifiers
		.map((entry) => ({
			...entry,
			duplicatesNamedExport:
				entry.name === 'default' && entry.localName
					? namedRuntimeLocalNames.has(entry.localName)
					: false,
		}))
		.sort(compareExports);
}

function createExport(name, kind, node, isReExport, isConstant = false) {
	return {
		name,
		kind,
		isDefault: name === 'default',
		localName: ts.isIdentifier(node) ? node.text : undefined,
		isReExport,
		isConstant,
		duplicatesNamedExport: false,
	};
}

function addExportDeclarationIdentifiers(statement, identifiers) {
	const isTypeOnly = statement.isTypeOnly;
	if (!statement.exportClause) {
		identifiers.push({
			name: `* from ${statement.moduleSpecifier.getText()}`,
			kind: isTypeOnly ? 'type' : 'runtime',
			isDefault: false,
			isReExport: true,
			duplicatesNamedExport: false,
		});
		return;
	}
	if (ts.isNamespaceExport(statement.exportClause)) {
		identifiers.push(
			createExport(
				statement.exportClause.name.text,
				isTypeOnly ? 'type' : 'runtime',
				statement.exportClause.name,
				true,
			),
		);
		return;
	}
	for (const element of statement.exportClause.elements) {
		identifiers.push(
			createExport(
				element.name.text,
				isTypeOnly || element.isTypeOnly ? 'type' : 'runtime',
				element.propertyName ?? element.name,
				Boolean(statement.moduleSpecifier),
			),
		);
	}
}

function addBindingIdentifiers(bindingName, identifiers, isConstant) {
	if (ts.isIdentifier(bindingName)) {
		identifiers.push(createExport(bindingName.text, 'runtime', bindingName, false, isConstant));
		return;
	}
	for (const element of bindingName.elements) {
		if (!ts.isOmittedExpression(element)) {
			addBindingIdentifiers(element.name, identifiers, isConstant);
		}
	}
}

function isSimpleReExport(sourceFile) {
	return (
		sourceFile.statements.length > 0 &&
		sourceFile.statements.every(
			(statement) =>
				ts.isExportDeclaration(statement) &&
				Boolean(statement.moduleSpecifier) &&
				Boolean(statement.exportClause) &&
				!ts.isNamespaceExport(statement.exportClause),
		)
	);
}

function sameExportSurface(baselineEntries, currentEntries) {
	const currentSurface = new Set(exportSurfaceSignature(currentEntries).split('\n'));
	return exportSurfaceSignature(baselineEntries)
		.split('\n')
		.every((baselineExport) => currentSurface.has(baselineExport));
}

function exportSurfaceSignature(entries) {
	return entries
		.flatMap(({ exports }) => exports)
		.map(({ name, kind, isDefault }) => JSON.stringify({ name, kind, isDefault }))
		.sort()
		.join('\n');
}

export function runtimeExportCount(exports) {
	const effectiveRuntimeExports = exports.filter(
		({ kind, duplicatesNamedExport }) => kind === 'runtime' && !duplicatesNamedExport,
	);
	const hasConstantExport = effectiveRuntimeExports.some(({ isConstant }) => isConstant);
	const nonConstantExportCount = effectiveRuntimeExports.filter(
		({ isConstant }) => !isConstant,
	).length;
	return nonConstantExportCount + Number(hasConstantExport);
}

function compareExports(left, right) {
	return `${left.kind}:${left.name}`.localeCompare(`${right.kind}:${right.name}`);
}

function formatExportEntries(label, entries) {
	return `${label}: ${JSON.stringify(entries, null, 2)}`;
}

function hasExportModifier(statement) {
	return (
		ts.canHaveModifiers(statement) &&
		ts.getModifiers(statement)?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
	);
}

function hasDefaultModifier(statement) {
	return (
		ts.canHaveModifiers(statement) &&
		ts.getModifiers(statement)?.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword)
	);
}

export function getScriptKind(filePath) {
	if (filePath.endsWith('.tsx')) return ts.ScriptKind.TSX;
	if (filePath.endsWith('.jsx')) return ts.ScriptKind.JSX;
	if (filePath.endsWith('.js') || filePath.endsWith('.mjs') || filePath.endsWith('.cjs')) {
		return ts.ScriptKind.JS;
	}
	return ts.ScriptKind.TS;
}

async function main() {
	const [packageJsonPath, ...arguments_] = process.argv.slice(2);
	if (!packageJsonPath) {
		console.error(
			'Usage: check-exported-identifiers.mjs <path-to-package.json> [--merge-base <commit>]',
		);
		process.exitCode = 2;
		return;
	}
	const mergeBaseIndex = arguments_.indexOf('--merge-base');
	const requestedMergeBase = mergeBaseIndex === -1 ? undefined : arguments_[mergeBaseIndex + 1];
	if (mergeBaseIndex !== -1 && !requestedMergeBase) {
		console.error('--merge-base requires a commit.');
		process.exitCode = 2;
		return;
	}

	const { stdout: repoRootOutput } = await execFile('git', ['rev-parse', '--show-toplevel']);
	const repoRoot = repoRootOutput.trim();
	const resolvedPackageJsonPath = resolve(packageJsonPath);
	const relativePackageJsonPath = relative(repoRoot, resolvedPackageJsonPath).replaceAll('\\', '/');
	const mergeBase =
		requestedMergeBase ?? (await execFile('git', ['merge-base', 'HEAD', 'master'])).stdout.trim();
	const readCurrentFile = (filePath) => readFile(filePath, 'utf8');
	const readBaselineFile = async (filePath) => {
		const relativePath = relative(repoRoot, filePath).replaceAll('\\', '/');
		return (await execFile('git', ['show', `${mergeBase}:${relativePath}`])).stdout;
	};

	try {
		const exportMap = await buildExportMap({ packageJsonPath, readCurrentFile, readBaselineFile });
		const violations = findExportCompatibilityViolations(exportMap);
		if (violations.length > 0) {
			console.error(
				`Export compatibility violations for ${relativePackageJsonPath} against ${mergeBase}:`,
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
