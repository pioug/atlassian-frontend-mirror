import { dirname } from 'path';

import * as ts from 'typescript';

import { isRelativeImport, readFileContent, resolveImportPath } from './file-system';
import { resolveCrossPackageImport } from './package-resolution';
import { perfInc, perfTime } from './perf';
import type { CrossPackageSource, ExportInfo, FileSystem } from './types';

/**
 * Maximum depth to traverse when looking for source files in barrel exports.
 * Can be adjusted based on project structure needs.
 */
const MAX_BARREL_DEPTH = 10;

/**
 * Get all named exports from a file.
 * This extracts what names are exported from a file for star exports.
 */
export function getNamedExportsFromFile({
	filePath,
	fs,
}: {
	filePath: string;
	fs: FileSystem;
}): Set<string> {
	const names = new Set<string>();
	const content = readFileContent({ filePath, fs });
	if (!content) {
		return names;
	}

	try {
		const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

		ts.forEachChild(sourceFile, (node) => {
			if (ts.isExportDeclaration(node)) {
				if (node.exportClause && ts.isNamedExports(node.exportClause)) {
					node.exportClause.elements.forEach((e) => names.add(e.name.text));
				}
			} else if (ts.isExportAssignment(node)) {
				names.add('default');
			} else if (ts.isVariableStatement(node)) {
				if (node.modifiers && node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
					node.declarationList.declarations.forEach((d) => {
						if (ts.isIdentifier(d.name)) {
							names.add(d.name.text);
						}
					});
				}
			} else if (
				ts.isFunctionDeclaration(node) ||
				ts.isClassDeclaration(node) ||
				ts.isInterfaceDeclaration(node) ||
				ts.isTypeAliasDeclaration(node) ||
				ts.isEnumDeclaration(node)
			) {
				if (node.modifiers && node.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
					if (node.name && ts.isIdentifier(node.name)) {
						names.add(node.name.text);
					}
				}
			}
		});
	} catch {
		// Ignore parsing errors
	}
	return names;
}

/**
 * Check if an export map represents a barrel file (has re-exports from other files)
 */
export function hasReExportsFromOtherFiles({
	exportMap,
	sourceFilePath,
}: {
	exportMap: Map<string, ExportInfo>;
	sourceFilePath: string;
}): boolean {
	return Array.from(exportMap.values()).some((info) => info.path !== sourceFilePath);
}

/**
 * Process a named export element with cross-package support and add it to the exports map
 */
function processNamedExportElementWithCrossPackage({
	element,
	resolvedSource,
	nestedExports,
	isStatementTypeOnly,
	exports,
	crossPackageSource,
}: {
	element: ts.ExportSpecifier;
	resolvedSource: string;
	nestedExports: Map<string, ExportInfo> | null;
	isStatementTypeOnly: boolean;
	exports: Map<string, ExportInfo>;
	crossPackageSource?: CrossPackageSource;
}): void {
	const localName = element.name.text;
	const propertyName = element.propertyName ? element.propertyName.text : localName;
	const isElementTypeOnly = isStatementTypeOnly || element.isTypeOnly;
	const isDefaultExport = propertyName === 'default';
	// Track if this export is aliased (exported name differs from source name)
	const isAliased = element.propertyName !== undefined && localName !== propertyName;

	if (nestedExports) {
		const deepSource = nestedExports.get(propertyName);
		if (deepSource) {
			exports.set(localName, {
				path: deepSource.path,
				isTypeOnly: isElementTypeOnly || deepSource.isTypeOnly,
				isDefaultExport: deepSource.isDefaultExport,
				// Use deep source's original name if available, otherwise use propertyName if aliased
				originalName: deepSource.originalName ?? (isAliased ? propertyName : undefined),
				// Preserve existing crossPackageSource from nested exports, or use the one from this level
				crossPackageSource: deepSource.crossPackageSource || crossPackageSource,
			});
		} else {
			exports.set(localName, {
				path: resolvedSource,
				isTypeOnly: isElementTypeOnly,
				isDefaultExport,
				originalName: isAliased ? propertyName : undefined,
				crossPackageSource,
			});
		}
	} else {
		exports.set(localName, {
			path: resolvedSource,
			isTypeOnly: isElementTypeOnly,
			isDefaultExport,
			originalName: isAliased ? propertyName : undefined,
			crossPackageSource,
		});
	}
}

/**
 * Handle star exports with cross-package support (export * from '...')
 */
function processStarExportWithCrossPackage({
	resolvedSource,
	nestedExports,
	exports,
	fs,
	crossPackageSource,
}: {
	resolvedSource: string;
	nestedExports: Map<string, ExportInfo> | null;
	exports: Map<string, ExportInfo>;
	fs: FileSystem;
	crossPackageSource?: CrossPackageSource;
}): void {
	if (nestedExports) {
		for (const [name, info] of nestedExports) {
			if (name !== 'default') {
				// Preserve existing crossPackageSource from nested exports, or use the one from this level
				exports.set(name, {
					...info,
					crossPackageSource: info.crossPackageSource || crossPackageSource,
				});
			}
		}
	} else {
		const nonBarrelExports = getNamedExportsFromFile({ filePath: resolvedSource, fs });
		for (const name of nonBarrelExports) {
			if (name !== 'default') {
				exports.set(name, { path: resolvedSource, isTypeOnly: false, crossPackageSource });
			}
		}
	}
}

/**
 * Process export declarations that have module specifiers (export ... from '...')
 */
function processExportWithModuleSpecifier({
	statement,
	resolveModule,
	depth,
	exports,
	fs,
	workspaceRoot,
	visitedPackages,
}: {
	statement: ts.ExportDeclaration;
	resolveModule: (moduleSpecifier: string) => string | null;
	depth: number;
	exports: Map<string, ExportInfo>;
	fs: FileSystem;
	workspaceRoot?: string;
	visitedPackages?: Set<string>;
}): void {
	if (!statement.moduleSpecifier || !ts.isStringLiteral(statement.moduleSpecifier)) {
		return;
	}

	const modulePath = statement.moduleSpecifier.text;

	// Try relative resolution first (existing behavior)
	let resolvedSource = resolveModule(modulePath);
	let crossPackageSource: CrossPackageSource | undefined;

	// If not a relative import, try cross-package resolution
	if (!resolvedSource && !isRelativeImport(modulePath) && workspaceRoot) {
		const crossPackageInfo = resolveCrossPackageImport({
			moduleSpecifier: modulePath,
			workspaceRoot,
			fs,
		});

		if (crossPackageInfo) {
			// Check for circular dependencies
			if (visitedPackages?.has(crossPackageInfo.packageName)) {
				return;
			}

			resolvedSource = crossPackageInfo.entryFilePath;
			crossPackageSource = {
				packageName: crossPackageInfo.packageName,
				exportPath: crossPackageInfo.exportPath,
			};
		}
	}

	if (!resolvedSource) {
		return;
	}

	const isStatementTypeOnly = statement.isTypeOnly;

	// For cross-package imports, track visited packages to prevent circular deps
	const newVisitedPackages = visitedPackages ? new Set(visitedPackages) : new Set<string>();
	if (crossPackageSource) {
		newVisitedPackages.add(crossPackageSource.packageName);
	}

	// Always trace through nested barrels and cross-package exports to find the ultimate source
	const potentialNestedExports = parseBarrelExports({
		barrelFilePath: resolvedSource,
		depth: depth + 1,
		fs,
		workspaceRoot,
		visitedPackages: newVisitedPackages,
	});
	const nestedExports = hasReExportsFromOtherFiles({
		exportMap: potentialNestedExports,
		sourceFilePath: resolvedSource,
	})
		? potentialNestedExports
		: null;

	if (statement.exportClause) {
		if (ts.isNamedExports(statement.exportClause)) {
			for (const element of statement.exportClause.elements) {
				processNamedExportElementWithCrossPackage({
					element,
					resolvedSource,
					nestedExports,
					isStatementTypeOnly,
					exports,
					crossPackageSource,
				});
			}
		} else if (ts.isNamespaceExport(statement.exportClause)) {
			const name = statement.exportClause.name.text;
			exports.set(name, {
				path: resolvedSource,
				isTypeOnly: isStatementTypeOnly,
				crossPackageSource,
			});
		}
	} else {
		processStarExportWithCrossPackage({
			resolvedSource,
			nestedExports,
			exports,
			fs,
			crossPackageSource,
		});
	}
}

/**
 * Process local export statements (no module specifier)
 */
function processLocalExportDeclaration({
	statement,
	barrelFilePath,
	exports,
}: {
	statement: ts.ExportDeclaration;
	barrelFilePath: string;
	exports: Map<string, ExportInfo>;
}): void {
	if (!statement.exportClause || !ts.isNamedExports(statement.exportClause)) {
		return;
	}

	const isStatementTypeOnly = statement.isTypeOnly;
	for (const element of statement.exportClause.elements) {
		const isElementTypeOnly = isStatementTypeOnly || element.isTypeOnly;
		exports.set(element.name.text, { path: barrelFilePath, isTypeOnly: isElementTypeOnly });
	}
}

/**
 * Process various declaration statements with export modifiers
 */
function processExportedDeclaration({
	statement,
	barrelFilePath,
	exports,
}: {
	statement: ts.Statement;
	barrelFilePath: string;
	exports: Map<string, ExportInfo>;
}): void {
	if (ts.isExportAssignment(statement)) {
		exports.set('default', { path: barrelFilePath, isTypeOnly: false });
		return;
	}

	const hasExportModifier =
		'modifiers' in statement &&
		Array.isArray(statement.modifiers) &&
		statement.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);

	if (!hasExportModifier) {
		return;
	}

	if (ts.isVariableStatement(statement)) {
		for (const decl of statement.declarationList.declarations) {
			if (ts.isIdentifier(decl.name)) {
				exports.set(decl.name.text, { path: barrelFilePath, isTypeOnly: false });
			}
		}
	} else if (ts.isFunctionDeclaration(statement) || ts.isClassDeclaration(statement)) {
		if (statement.name && ts.isIdentifier(statement.name)) {
			exports.set(statement.name.text, { path: barrelFilePath, isTypeOnly: false });
		}
	} else if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
		if (statement.name && ts.isIdentifier(statement.name)) {
			exports.set(statement.name.text, { path: barrelFilePath, isTypeOnly: true });
		}
	} else if (ts.isEnumDeclaration(statement)) {
		if (statement.name && ts.isIdentifier(statement.name)) {
			exports.set(statement.name.text, { path: barrelFilePath, isTypeOnly: false });
		}
	}
}

/**
 * Parse export statements from a file to find where each export comes from.
 * Returns a map of export name -> ExportInfo.
 *
 * This function recursively traces through nested barrels and cross-package re-exports
 * to find the ultimate source file for each export.
 */
export function parseBarrelExports({
	barrelFilePath,
	depth = 0,
	fs,
	workspaceRoot,
	visitedPackages,
}: {
	barrelFilePath: string;
	depth?: number;
	fs: FileSystem;
	workspaceRoot?: string;
	visitedPackages?: Set<string>;
}): Map<string, ExportInfo> {
	perfInc({ fs, key: 'parseBarrelExports.calls' });
	return perfTime({
		fs,
		key: 'parseBarrelExports.totalMs',
		fn: () => {
			if (depth > MAX_BARREL_DEPTH) {
				return new Map<string, ExportInfo>();
			}

			if (!fs.cache.barrelExportsByPath) {
				fs.cache.barrelExportsByPath = new Map();
			}

			let currentMtimeMs = 0;
			try {
				currentMtimeMs = fs.statSync(barrelFilePath).mtimeMs ?? 0;
			} catch {
				currentMtimeMs = 0;
			}

			const cached = fs.cache.barrelExportsByPath.get(barrelFilePath);
			if (cached && cached.mtimeMs === currentMtimeMs) {
				perfInc({ fs, key: 'parseBarrelExports.cacheHit' });
				return cached.exports;
			}
			perfInc({ fs, key: 'parseBarrelExports.cacheMiss' });

			const exports = new Map<string, ExportInfo>();

			const content = readFileContent({ filePath: barrelFilePath, fs });
			if (!content) {
				return exports;
			}

			let sourceFile: ts.SourceFile;
			try {
				sourceFile = perfTime({
					fs,
					key: 'parseBarrelExports.tsCreateSourceFileMs',
					fn: () => ts.createSourceFile(barrelFilePath, content, ts.ScriptTarget.Latest, true),
				});
			} catch {
				return exports;
			}

			const barrelDir = dirname(barrelFilePath);

			const resolveModule = (moduleSpecifier: string): string | null => {
				if (!isRelativeImport(moduleSpecifier)) {
					return null;
				}
				return resolveImportPath({ basedir: barrelDir, importPath: moduleSpecifier, fs });
			};

			for (const statement of sourceFile.statements) {
				if (ts.isExportDeclaration(statement)) {
					if (statement.moduleSpecifier) {
						processExportWithModuleSpecifier({
							statement,
							resolveModule,
							depth,
							exports,
							fs,
							workspaceRoot,
							visitedPackages,
						});
					} else {
						processLocalExportDeclaration({ statement, barrelFilePath, exports });
					}
				} else {
					processExportedDeclaration({ statement, barrelFilePath, exports });
				}
			}

			fs.cache.barrelExportsByPath.set(barrelFilePath, {
				mtimeMs: currentMtimeMs,
				exports,
			});
			return exports;
		},
	});
}
