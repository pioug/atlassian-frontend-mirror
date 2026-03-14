import { dirname, relative } from 'path';

import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';

import {
	hasReExportsFromOtherFiles,
	parseBarrelExports as parseBarrelExportsFromShared,
} from '../shared/barrel-parsing';
import { findWorkspaceRoot, isRelativeImport, resolveImportPath } from '../shared/file-system';
import { findPackageInRegistry } from '../shared/package-registry';
import { findExportForSourceFile, parsePackageExports } from '../shared/package-resolution';
import { type ExportInfo, type FileSystem, realFileSystem } from '../shared/types';

type ImportSpecifierNode =
	| TSESTree.ImportSpecifier
	| TSESTree.ImportDefaultSpecifier
	| TSESTree.ImportNamespaceSpecifier;
type ImportDeclarationNode = TSESTree.ImportDeclaration;
type AugmentedSpecifier = ImportSpecifierNode & { importKind?: 'type' | 'value' };

/**
 * Specifier with additional metadata for tracking during barrel file resolution.
 */
interface SpecifierWithOriginal {
	spec: ImportSpecifierNode | TSESTree.ExportSpecifier;
	originalName?: string;
	exportInfo?: ExportInfo;
	nameInSource: string;
	nameInLocal: string;
	kind?: 'type' | 'value';
}

/**
 * Context for barrel file resolution, returned by resolveBarrelFileContext.
 */
interface BarrelFileContext {
	importPath: string;
	basedir: string;
	resolvedPath: string;
	workspaceRoot: string;
	exportMap: Map<string, ExportInfo>;
}

/**
 * Result of collecting specifiers by their source file.
 */
interface CollectedSpecifiers {
	importsBySource: Map<string, SpecifierWithOriginal[]>;
	unmappedSpecifiers: (ImportSpecifierNode | TSESTree.ExportSpecifier)[];
	hasNamespaceImport: boolean;
}

// Cache per source package name to avoid repeated exports parsing during a single lint run.
// This is keyed by fs instance to avoid test pollution.
const sourcePackageExportsMapsByFs = new WeakMap<FileSystem, Map<string, Map<string, string>>>();

function getSourcePackageExportsMaps(fs: FileSystem): Map<string, Map<string, string>> {
	let map = sourcePackageExportsMapsByFs.get(fs);
	if (!map) {
		map = new Map();
		sourcePackageExportsMapsByFs.set(fs, map);
	}
	return map;
}

function getImportedName(spec: TSESTree.ImportSpecifier): string {
	const imported = spec.imported as TSESTree.Identifier | TSESTree.Literal;
	return imported.type === 'Identifier' ? imported.name : String(imported.value);
}

/**
 * Get the exported name from an ExportSpecifier, handling both Identifier and Literal
 */
function getExportedName(node: TSESTree.Identifier | TSESTree.Literal): string {
	return node.type === 'Identifier' ? node.name : String(node.value);
}

/**
 * Convert absolute file path back to relative import path
 */
function getImportPathForSourceFile({
	sourceFilePath,
	basedir,
	originalImportPath,
	exportInfo,
	workspaceRoot,
	fs,
}: {
	sourceFilePath: string;
	basedir: string;
	originalImportPath: string;
	exportInfo: ExportInfo | null;
	workspaceRoot: string;
	fs: FileSystem;
}): string {
	const crossPackageName = exportInfo?.crossPackageSource?.packageName;
	if (crossPackageName) {
		const sourcePackageExportsMaps = getSourcePackageExportsMaps(fs);
		let exportsMap = sourcePackageExportsMaps.get(crossPackageName);
		if (!exportsMap) {
			const pkgDir = findPackageInRegistry({
				packageName: crossPackageName,
				workspaceRoot,
				fs,
			});
			if (pkgDir) {
				exportsMap = parsePackageExports({ packageDir: pkgDir, fs });
				sourcePackageExportsMaps.set(crossPackageName, exportsMap);
			}
		}

		const targetExportPath = exportsMap
			? findExportForSourceFile({ sourceFilePath, exportsMap })
			: null;

		return targetExportPath ? crossPackageName + targetExportPath.slice(1) : crossPackageName;
	}

	return getRelativeImportPath({ basedir, absolutePath: sourceFilePath, originalImportPath });
}

function getRelativeImportPath({
	basedir,
	absolutePath,
	originalImportPath,
}: {
	basedir: string;
	absolutePath: string;
	originalImportPath: string;
}): string {
	if (!absolutePath.startsWith('/') && !absolutePath.match(/^[a-zA-Z]:/)) {
		return absolutePath;
	}

	let relativePath = relative(basedir, absolutePath);
	// Normalize to use forward slashes
	relativePath = relativePath.replace(/\\/g, '/');

	// Check for extension in original path
	const extMatch = originalImportPath.match(/\.(js|jsx|ts|tsx|mjs|cjs)$/);
	const originalExt = extMatch ? extMatch[0] : '';

	// Get extension from the resolved absolute path
	const targetExtMatch = absolutePath.match(/\.(js|jsx|ts|tsx|mjs|cjs)$/);
	const targetExt = targetExtMatch ? targetExtMatch[0] : '';

	// Remove file extension from the target path
	relativePath = relativePath.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, '');

	// If original had extension, append it
	if (originalExt) {
		// If original was a TypeScript source extension, use the actual target extension
		if (['.ts', '.tsx'].includes(originalExt) && targetExt) {
			relativePath += targetExt;
		} else {
			relativePath += originalExt;
		}
	} else {
		// Remove /index suffix only if no extension was present
		if (relativePath.endsWith('/index')) {
			relativePath = relativePath.slice(0, -6);
		} else if (relativePath === 'index') {
			relativePath = '.';
		}
	}

	// Ensure it starts with .. or .
	if (!relativePath.startsWith('.') && !relativePath.startsWith('/')) {
		relativePath = './' + relativePath;
	}
	return relativePath;
}

/**
 * Build an import statement for a set of specifiers
 */
function buildImportStatement({
	specs,
	path,
	quoteChar,
	isTypeImport = false,
}: {
	specs: ImportSpecifierNode[];
	path: string;
	quoteChar: string;
	isTypeImport?: boolean;
}): string {
	const importNames = specs
		.map((spec) => {
			if (spec.type === 'ImportDefaultSpecifier') {
				return spec.local.name;
			} else if (spec.type === 'ImportSpecifier') {
				const imported = getImportedName(spec);
				const local = spec.local.name;
				const isInlineType = spec.importKind === 'type' && !isTypeImport;
				const prefix = isInlineType ? 'type ' : '';
				return imported === local ? `${prefix}${imported}` : `${prefix}${imported} as ${local}`;
			}
			return '';
		})
		.filter((name) => name.length > 0);

	if (importNames.length === 0) {
		return '';
	}

	const typeKeyword = isTypeImport ? 'type ' : '';
	const hasDefault = specs.some((spec) => spec.type === 'ImportDefaultSpecifier');
	const hasNamed = specs.some((spec) => spec.type === 'ImportSpecifier');

	if (hasDefault && hasNamed) {
		const defaultName = specs.find(
			(spec): spec is TSESTree.ImportDefaultSpecifier => spec.type === 'ImportDefaultSpecifier',
		)?.local.name;
		const namedImports = specs
			.filter((spec): spec is TSESTree.ImportSpecifier => spec.type === 'ImportSpecifier')
			.map((spec) => {
				const imported = getImportedName(spec);
				const local = spec.local.name;
				const isInlineType = spec.importKind === 'type' && !isTypeImport;
				const prefix = isInlineType ? 'type ' : '';
				return imported === local ? `${prefix}${imported}` : `${prefix}${imported} as ${local}`;
			})
			.join(', ');

		return `import ${typeKeyword}${defaultName}, { ${namedImports} } from ${quoteChar}${path}${quoteChar};`;
	} else if (hasDefault) {
		const defaultName = specs.find(
			(spec): spec is TSESTree.ImportDefaultSpecifier => spec.type === 'ImportDefaultSpecifier',
		)?.local.name;
		return `import ${typeKeyword}${defaultName} from ${quoteChar}${path}${quoteChar};`;
	} else {
		return `import ${typeKeyword}{ ${importNames.join(', ')} } from ${quoteChar}${path}${quoteChar};`;
	}
}

/**
 * Build an export statement for a set of specifiers
 */
function buildExportStatement({
	specs,
	path,
	quoteChar,
	isTypeExport = false,
}: {
	specs: { nameInSource: string; nameInLocal: string; kind?: 'type' | 'value' }[];
	path: string;
	quoteChar: string;
	isTypeExport?: boolean;
}): string {
	const exportNames = specs
		.map((spec) => {
			const isInlineType = spec.kind === 'type' && !isTypeExport;
			const prefix = isInlineType ? 'type ' : '';
			return spec.nameInSource === spec.nameInLocal
				? `${prefix}${spec.nameInSource}`
				: `${prefix}${spec.nameInSource} as ${spec.nameInLocal}`;
		})
		.filter((name) => name.length > 0);

	if (exportNames.length === 0) {
		return '';
	}

	const typeKeyword = isTypeExport ? 'type ' : '';
	return `export ${typeKeyword}{ ${exportNames.join(', ')} } from ${quoteChar}${path}${quoteChar};`;
}

const ruleMeta: Rule.RuleMetaData = {
	type: 'problem',
	docs: {
		description:
			'Warn when imports are from a relative barrel file and provide an auto-fix to split them into specific imports.',
		category: 'Best Practices',
		recommended: false,
	},
	fixable: 'code',
	messages: {
		barrelImport:
			"Import from barrel file '{{path}}' should be split into more specific imports. Use auto-fix to resolve.",
	},
};

/**
 * Resolve barrel file context from an import/export node.
 * Returns null if the node should not be checked (not relative, not resolvable, not a barrel).
 */
function resolveBarrelFileContext({
	node,
	context,
	fs,
}: {
	node: ImportDeclarationNode | TSESTree.ExportNamedDeclaration;
	context: Rule.RuleContext;
	fs: FileSystem;
}): BarrelFileContext | null {
	if (!node.source) {
		return null;
	}

	const importPath = node.source.value;

	if (!isRelativeImport(importPath)) {
		return null;
	}

	const basedir = dirname(context.filename);
	const resolvedPath = resolveImportPath({ basedir, importPath, fs });

	if (!resolvedPath) {
		return null;
	}

	const workspaceRoot = findWorkspaceRoot({ startPath: basedir, fs });
	const exportMap = parseBarrelExportsFromShared({
		barrelFilePath: resolvedPath,
		workspaceRoot,
		fs,
	});

	if (exportMap.size === 0) {
		return null;
	}

	if (!hasReExportsFromOtherFiles({ exportMap, sourceFilePath: resolvedPath })) {
		return null;
	}

	return {
		importPath,
		basedir,
		resolvedPath,
		workspaceRoot,
		exportMap,
	};
}

/**
 * Collect specifiers grouped by their source file.
 */
function collectSpecifiersBySource({
	specifiers,
	node,
	exportMap,
}: {
	specifiers: readonly (ImportSpecifierNode | TSESTree.ExportSpecifier)[];
	node: ImportDeclarationNode | TSESTree.ExportNamedDeclaration;
	exportMap: Map<string, ExportInfo>;
}): CollectedSpecifiers {
	const importsBySource = new Map<string, SpecifierWithOriginal[]>();
	const unmappedSpecifiers: (ImportSpecifierNode | TSESTree.ExportSpecifier)[] = [];
	let hasNamespaceImport = false;

	for (const spec of specifiers) {
		let nameInSource: string;
		let nameInLocal: string;
		let kind: 'type' | 'value' = 'value';

		if (spec.type === 'ImportNamespaceSpecifier') {
			hasNamespaceImport = true;
			continue;
		}

		if (spec.type === 'ImportDefaultSpecifier') {
			nameInSource = 'default';
			nameInLocal = spec.local.name;
		} else if (spec.type === 'ImportSpecifier') {
			nameInSource = getImportedName(spec);
			nameInLocal = spec.local.name;
			const parentImportKind = node.type === 'ImportDeclaration' ? node.importKind : undefined;
			kind = parentImportKind === 'type' || spec.importKind === 'type' ? 'type' : 'value';
		} else if (spec.type === 'ExportSpecifier') {
			nameInSource = spec.local.name;
			nameInLocal = spec.exported.name;
			const parentExportKind = node.type === 'ExportNamedDeclaration' ? node.exportKind : undefined;
			kind = parentExportKind === 'type' || spec.exportKind === 'type' ? 'type' : 'value';
		} else {
			continue;
		}

		const exportInfo = exportMap.get(nameInSource);

		if (exportInfo) {
			if (!importsBySource.has(exportInfo.path)) {
				importsBySource.set(exportInfo.path, []);
			}
			const effectiveKind: 'type' | 'value' =
				kind === 'type' || exportInfo.isTypeOnly ? 'type' : 'value';
			importsBySource.get(exportInfo.path)!.push({
				spec,
				originalName: exportInfo.originalName,
				exportInfo,
				nameInSource,
				nameInLocal,
				kind: effectiveKind,
			});
		} else {
			unmappedSpecifiers.push(spec);
		}
	}

	return {
		importsBySource,
		unmappedSpecifiers,
		hasNamespaceImport,
	};
}

/**
 * Find an existing import statement that imports from the same source file.
 */
function findExistingImportForSourceFile({
	sourceFile,
	allImports,
	basedir,
	fs,
}: {
	sourceFile: string;
	allImports: ImportDeclarationNode[];
	basedir: string;
	fs: FileSystem;
}): ImportDeclarationNode | undefined {
	return allImports.find((n) => {
		const isSourceAbsolute = sourceFile.startsWith('/') || sourceFile.match(/^[a-zA-Z]:/);

		if (!isRelativeImport(sourceFile) && !isSourceAbsolute) {
			return n.source.value === sourceFile;
		}

		if (!isRelativeImport(n.source.value)) {
			return false;
		}
		const existingPath = resolveImportPath({ basedir, importPath: n.source.value, fs });
		return existingPath === sourceFile;
	});
}

/**
 * Find an existing export statement that exports from the same source file.
 */
function findExistingExportForSourceFile({
	sourceFile,
	allExports,
	basedir,
	fs,
}: {
	sourceFile: string;
	allExports: TSESTree.ExportNamedDeclaration[];
	basedir: string;
	fs: FileSystem;
}): TSESTree.ExportNamedDeclaration | undefined {
	return allExports.find((n) => {
		if (!n.source) {
			return false;
		}
		const isSourceAbsolute = sourceFile.startsWith('/') || sourceFile.match(/^[a-zA-Z]:/);

		if (!isRelativeImport(sourceFile) && !isSourceAbsolute) {
			return n.source.value === sourceFile;
		}

		if (!isRelativeImport(n.source.value)) {
			return false;
		}
		const existingPath = resolveImportPath({ basedir, importPath: n.source.value, fs });
		return existingPath === sourceFile;
	});
}

/**
 * Transform import specifiers to handle aliasing when the original name differs.
 */
function transformImportSpecifiers({
	specsWithOriginal,
}: {
	specsWithOriginal: SpecifierWithOriginal[];
}): ImportSpecifierNode[] {
	return specsWithOriginal.map(({ spec, originalName, kind }) => {
		if (!originalName) {
			return spec as ImportSpecifierNode;
		}

		if (originalName === 'default') {
			if (spec.type === 'ImportDefaultSpecifier') {
				return spec;
			}
			return {
				type: 'ImportDefaultSpecifier',
				local: spec.local,
				range: spec.range,
				loc: spec.loc,
				parent: spec.parent,
			} as TSESTree.ImportDefaultSpecifier;
		} else {
			return {
				type: 'ImportSpecifier',
				local: spec.local,
				imported: {
					type: 'Identifier',
					name: originalName,
					range: [0, 0],
					loc: {
						start: { line: 0, column: 0 },
						end: { line: 0, column: 0 },
					},
				},
				importKind: kind,
				range: spec.range,
				loc: spec.loc,
				parent: spec.parent,
			} as TSESTree.ImportSpecifier;
		}
	});
}

/**
 * Transform export specifiers to use original names from source.
 */
function transformExportSpecifiers({
	specsWithOriginal,
}: {
	specsWithOriginal: SpecifierWithOriginal[];
}): { nameInSource: string; nameInLocal: string; kind?: 'type' | 'value' }[] {
	return specsWithOriginal.map(({ originalName, nameInLocal, kind }) => ({
		nameInSource: originalName || nameInLocal,
		nameInLocal,
		kind,
	}));
}

export function createRule(fs: FileSystem): Rule.RuleModule {
	return {
		meta: ruleMeta,
		create(context) {
			const checkNode = (rawNode: any) => {
				const node = rawNode as ImportDeclarationNode | TSESTree.ExportNamedDeclaration;

				// Resolve barrel file context (handles early exits for non-barrel files)
				const barrelContext = resolveBarrelFileContext({ node, context, fs });
				if (!barrelContext) {
					return;
				}

				const { importPath, resolvedPath, exportMap } = barrelContext;

				// Check if we have any imports from this barrel
				const specifiers = node.specifiers;
				if (specifiers.length === 0) {
					return;
				}

				// Collect imports by source file
				const { importsBySource, unmappedSpecifiers, hasNamespaceImport } =
					collectSpecifiersBySource({
						specifiers,
						node,
						exportMap,
					});

				// If we have import * as, warn but don't auto-fix (too complex)
				if (hasNamespaceImport) {
					context.report({
						node: node as Rule.Node,
						messageId: 'barrelImport',
						data: { path: importPath },
					});
					return;
				}

				// Check if we actually found any imports that map to the barrel exports
				// If we found 0 mapped imports (all are unknown or missing), don't warn
				if (importsBySource.size === 0) {
					return;
				}

				// If all imports map back to the resolved path itself, don't warn.
				// This happens when the file (e.g. index.ts) exports the symbols directly (not re-exports),
				// so it is not acting as a barrel file for these imports.
				if (importsBySource.size === 1 && importsBySource.has(resolvedPath)) {
					return;
				}

				// Build the report with optional auto-fix
				const reportObj: Rule.ReportDescriptor = {
					node: node as Rule.Node,
					messageId: 'barrelImport',
					data: { path: importPath },
				};

				// Only provide auto-fix if all imports are mapped
				// If there are unmapped specifiers, don't auto-fix to avoid issues
				const nodeSource = node.source;
				if (unmappedSpecifiers.length === 0 && nodeSource) {
					reportObj.fix = function (fixer: Rule.RuleFixer) {
						const sourceCode = context.getSourceCode();
						const quote = sourceCode.getText(nodeSource)[0]; // Get quote character
						const basedirForFix = dirname(context.filename);

						const fixes: Rule.Fix[] = [];
						const newStatementsForBarrelReplacement: string[] = [];

						// Generate new import statements for each source file
						const sourceFileArray = Array.from(importsBySource.entries());

						for (let i = 0; i < sourceFileArray.length; i++) {
							const [sourceFile, specsWithOriginal] = sourceFileArray[i];

							if (node.type === 'ImportDeclaration') {
								// Transform specifiers if needed (handle aliasing)
								const specs = transformImportSpecifiers({ specsWithOriginal });

								// Get all existing imports to check for merging
								const allImports = (sourceCode.ast.body as TSESTree.Statement[]).filter(
									(n): n is ImportDeclarationNode => n.type === 'ImportDeclaration' && n !== node,
								);

								// Check for existing import
								const existingImport = findExistingImportForSourceFile({
									sourceFile,
									allImports,
									basedir: basedirForFix,
									fs,
								});

								// Skip merging if existing is namespace import
								const isNamespace = existingImport?.specifiers.some(
									(s) => s.type === 'ImportNamespaceSpecifier',
								);

								if (existingImport && !isNamespace) {
									// Merge!
									const existingSpecs: AugmentedSpecifier[] = existingImport.specifiers.map((s) => {
										// Normalize importKind
										if (existingImport.importKind === 'type') {
											// If the parent declaration is 'type', treat all specifiers as 'type'
											// We cast to AugmentedSpecifier to allow attaching importKind to DefaultSpecifier
											return {
												...s,
												importKind: 'type' as const,
											} as AugmentedSpecifier;
										}
										return s as AugmentedSpecifier;
									});

									const newSpecs: AugmentedSpecifier[] = specs.map((s) => {
										if (node.importKind === 'type') {
											return {
												...s,
												importKind: 'type' as const,
											} as AugmentedSpecifier;
										}
										return s as AugmentedSpecifier;
									});

									const mergedSpecs = [...existingSpecs, ...newSpecs];

									// Determine if we should use 'import type'
									const allType = mergedSpecs.every((s) => s.importKind === 'type');

									const relativePath = getImportPathForSourceFile({
										sourceFilePath: sourceFile,
										basedir: basedirForFix,
										originalImportPath: importPath,
										exportInfo: specsWithOriginal[0]?.exportInfo ?? null,
										workspaceRoot: findWorkspaceRoot({ startPath: basedirForFix, fs: fs }),
										fs: fs,
									});
									const newImportStatement = buildImportStatement({
										specs: mergedSpecs,
										path: relativePath,
										quoteChar: quote,
										isTypeImport: allType, // Use type import if all are types
									});

									if (newImportStatement.length > 0) {
										fixes.push(fixer.replaceText(existingImport, newImportStatement));
									}
								} else {
									// Create new import
									const relativePath = getImportPathForSourceFile({
										sourceFilePath: sourceFile,
										basedir: basedirForFix,
										originalImportPath: importPath,
										exportInfo: specsWithOriginal[0]?.exportInfo ?? null,
										workspaceRoot: findWorkspaceRoot({ startPath: basedirForFix, fs: fs }),
										fs: fs,
									});
									const isTypeImport = node.importKind === 'type';
									const importStatement = buildImportStatement({
										specs,
										path: relativePath,
										quoteChar: quote,
										isTypeImport,
									});

									if (importStatement.length > 0) {
										newStatementsForBarrelReplacement.push(importStatement);
									}
								}
							} else if (node.type === 'ExportNamedDeclaration') {
								// Handle ExportNamedDeclaration
								const specs = transformExportSpecifiers({ specsWithOriginal });

								// Get all existing exports to check for merging
								const allExports = (sourceCode.ast.body as TSESTree.Statement[]).filter(
									(n): n is TSESTree.ExportNamedDeclaration =>
										n.type === 'ExportNamedDeclaration' && n !== node && !!n.source,
								);

								// Check for existing export
								const existingExport = findExistingExportForSourceFile({
									sourceFile,
									allExports,
									basedir: basedirForFix,
									fs,
								});

								if (existingExport) {
									// Merge!
									const existingSpecs = existingExport.specifiers.map((s) => {
										// For `export type { A, B }`, the parent's exportKind is 'type'
										// Individual specifiers have exportKind: 'type' only for inline type (export { type A })
										// If parent is type-only, all specifiers are types
										// Otherwise, check individual specifier's exportKind
										const effectiveKind: 'type' | 'value' =
											existingExport.exportKind === 'type' || s.exportKind === 'type'
												? 'type'
												: 'value';
										return {
											nameInSource: getExportedName(s.local),
											nameInLocal: getExportedName(s.exported),
											kind: effectiveKind,
										};
									});

									const newSpecs = specs.map((s) => {
										if (node.exportKind === 'type') {
											return { ...s, kind: 'type' as const };
										}
										return s;
									});

									const mergedSpecs = [...existingSpecs, ...newSpecs];

									// Determine if we should use 'export type'
									const allType = mergedSpecs.every((s) => s.kind === 'type');

									const relativePath = getImportPathForSourceFile({
										sourceFilePath: sourceFile,
										basedir: basedirForFix,
										originalImportPath: importPath,
										exportInfo: specsWithOriginal[0]?.exportInfo ?? null,
										workspaceRoot: findWorkspaceRoot({ startPath: basedirForFix, fs: fs }),
										fs: fs,
									});
									const newExportStatement = buildExportStatement({
										specs: mergedSpecs,
										path: relativePath,
										quoteChar: quote,
										isTypeExport: allType,
									});

									if (newExportStatement.length > 0) {
										fixes.push(fixer.replaceText(existingExport as Rule.Node, newExportStatement));
									}
								} else {
									// Create new export
									const relativePath = getImportPathForSourceFile({
										sourceFilePath: sourceFile,
										basedir: basedirForFix,
										originalImportPath: importPath,
										exportInfo: specsWithOriginal[0]?.exportInfo ?? null,
										workspaceRoot: findWorkspaceRoot({ startPath: basedirForFix, fs: fs }),
										fs: fs,
									});
									const isTypeExport = node.exportKind === 'type';
									const exportStatement = buildExportStatement({
										specs,
										path: relativePath,
										quoteChar: quote,
										isTypeExport,
									});

									if (exportStatement.length > 0) {
										newStatementsForBarrelReplacement.push(exportStatement);
									}
								}
							}
						}

						if (newStatementsForBarrelReplacement.length > 0) {
							fixes.push(
								fixer.replaceText(node as Rule.Node, newStatementsForBarrelReplacement.join('\n')),
							);
						} else {
							// If all were merged, remove the node
							fixes.push(fixer.remove(node as Rule.Node));
						}

						return fixes;
					};
				}

				context.report(reportObj);
			};

			return {
				ImportDeclaration: checkNode,
				ExportNamedDeclaration: checkNode,
			};
		},
	};
}

const rule: Rule.RuleModule = createRule(realFileSystem);

export default rule;
