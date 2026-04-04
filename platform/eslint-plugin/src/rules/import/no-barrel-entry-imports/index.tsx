import { dirname } from 'path';

import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';

import { parseBarrelExports } from '../shared/barrel-parsing';
import { DEFAULT_TARGET_FOLDERS, findWorkspaceRoot, isRelativeImport } from '../shared/file-system';
import { findPackageInRegistry, isPackageInApplyToImportsFrom } from '../shared/package-registry';
import {
	findCrossPackageBridgeExportPath,
	findExportForSourceFile,
	parsePackageExports,
} from '../shared/package-resolution';
import { type ExportInfo, type FileSystem, realFileSystem } from '../shared/types';

/**
 * Options for the no-barrel-entry-imports rule.
 */
interface RuleOptions {
	applyToImportsFrom?: string[];
	/**
	 * When a barrel re-exports from another package, prefer `@scope/barrel/subpath` if that
	 * subpath's entry file directly re-exports from the dependency, instead of importing the dependency package.
	 */
	preferImportedPackageSubpath?: boolean;
}

type ImportSpecifierNode =
	| TSESTree.ImportSpecifier
	| TSESTree.ImportDefaultSpecifier
	| TSESTree.ImportNamespaceSpecifier;
type ImportDeclarationNode = TSESTree.ImportDeclaration;
type AugmentedSpecifier = ImportSpecifierNode & { importKind?: 'type' | 'value' };

/**
 * Represents a Jest automock call: jest.mock('path') with no additional arguments
 */
interface JestAutomock {
	/** The ExpressionStatement node containing the jest.mock call */
	statementNode: TSESTree.ExpressionStatement;
	path: string;
	quoteChar: string;
}

/**
 * Metadata for the ESLint rule
 */
const ruleMeta: Rule.RuleMetaData = {
	type: 'problem',
	docs: {
		description: 'Disallow importing from barrel files in entry points.',
		category: 'Best Practices',
		recommended: false,
	},
	fixable: 'code',
	schema: [
		{
			type: 'object',
			properties: {
				applyToImportsFrom: {
					type: 'array',
					items: { type: 'string' },
					description:
						'The folder paths (relative to workspace root) containing packages whose imports will be checked and autofixed.',
				},
				preferImportedPackageSubpath: {
					type: 'boolean',
					description:
						'Prefer subpaths on the imported barrel package when they bridge to the dependency (e.g. @scope/pkg/subpath instead of @scope/dependency).',
				},
			},
			additionalProperties: false,
		},
	],
	messages: {
		barrelEntryImport:
			"Importing from barrel file '{{path}}' is not allowed. Import directly from the source file using a more specific package.json export instead.",
	},
};

/**
 * Get the imported name from an ImportSpecifier, handling both Identifier and Literal
 */
function getImportedName(spec: TSESTree.ImportSpecifier): string {
	const imported = spec.imported as TSESTree.Identifier | TSESTree.Literal;
	return imported.type === 'Identifier' ? imported.name : String(imported.value);
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
	specs: AugmentedSpecifier[];
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
 * Represents a specifier with its resolved target export path information.
 */
interface SpecifierWithTarget {
	spec: AugmentedSpecifier;
	originalName?: string;
	targetExportPath: string | null;
	kind: 'type' | 'value';
	/** The source package name for cross-package re-exports */
	sourcePackageName?: string;
}

/**
 * Context resolved for an import that may be a barrel import.
 */
interface ImportContext {
	importPath: string;
	packageName: string;
	currentExportPath: string;
	exportsMap: Map<string, string>;
	exportMap: Map<string, ExportInfo>;
}

/**
 * Result of classifying specifiers by their target export paths.
 */
interface SpecifierClassification {
	specifiersByTarget: Map<string, SpecifierWithTarget[]>;
	unmappedSpecifiers: SpecifierWithTarget[];
	hasNamespaceImport: boolean;
}

/**
 * Resolves import context for barrel file analysis from a module specifier string.
 * Returns null if the import should not be processed (relative import, not in target folder, etc.)
 */
function resolveImportContextFromModulePath({
	importPath,
	workspaceRoot,
	fs,
	applyToImportsFrom,
}: {
	importPath: string;
	workspaceRoot: string;
	fs: FileSystem;
	applyToImportsFrom: string[];
}): ImportContext | null {
	// Skip relative imports - this rule is for cross-package imports
	if (isRelativeImport(importPath)) {
		return null;
	}

	// Extract the base package name (without subpath)
	// e.g., "@atlassian/conversation-assistant-instrumentation" from
	// "@atlassian/conversation-assistant-instrumentation" or
	// "@atlassian/conversation-assistant-instrumentation/controllers/analytics"
	const packageNameMatch = importPath.match(/^(@[^/]+\/[^/]+)/);
	if (!packageNameMatch) {
		return null;
	}

	const packageName = packageNameMatch[1];
	const subPath = importPath.slice(packageName.length); // e.g., "" or "/controllers/analytics"

	// Find the package (resolution is not constrained by applyToImportsFrom)
	const packageDir = findPackageInRegistry({ packageName, workspaceRoot, fs });
	if (!packageDir) {
		return null;
	}

	// Only check imports from packages in our applyToImportsFrom folders
	if (!isPackageInApplyToImportsFrom({ packageDir, workspaceRoot, applyToImportsFrom })) {
		return null;
	}

	// Get the exports map for this package
	const exportsMap = parsePackageExports({ packageDir, fs });
	if (exportsMap.size === 0) {
		return null;
	}

	// Determine which export path we're importing from
	// For bare package imports, it's ".", for subpath imports it's "./" + subPath
	const currentExportPath = subPath ? '.' + subPath : '.';

	// Get the resolved path for the current export (the entry point file for this import)
	const entryFilePath = exportsMap.get(currentExportPath);
	if (!entryFilePath) {
		return null;
	}

	// Parse the entry file to find where each export originates
	// Pass workspaceRoot to enable cross-package re-export resolution
	const exportMap = parseBarrelExports({
		barrelFilePath: entryFilePath,
		fs,
		workspaceRoot,
	});
	if (exportMap.size === 0) {
		return null;
	}

	return {
		importPath,
		packageName,
		currentExportPath,
		exportsMap,
		exportMap,
	};
}

/**
 * Resolves import context for barrel file analysis.
 * Returns null if the import should not be processed (relative import, not in target folder, etc.)
 */
function resolveImportContext({
	node,
	workspaceRoot,
	fs,
	applyToImportsFrom,
}: {
	node: ImportDeclarationNode;
	workspaceRoot: string;
	fs: FileSystem;
	applyToImportsFrom: string[];
}): ImportContext | null {
	if (!node.source || typeof node.source.value !== 'string') {
		return null;
	}

	return resolveImportContextFromModulePath({
		importPath: node.source.value,
		workspaceRoot,
		fs,
		applyToImportsFrom,
	});
}

/**
 * Classifies import specifiers by their target export paths.
 * Groups specifiers that can be remapped to more specific exports.
 * For cross-package re-exports, suggests importing from the source package's most specific subpath.
 */
function classifySpecifiers({
	node,
	importContext,
	workspaceRoot,
	fs,
	preferImportedPackageSubpath,
}: {
	node: ImportDeclarationNode;
	importContext: ImportContext;
	workspaceRoot: string;
	fs: FileSystem;
	preferImportedPackageSubpath: boolean;
}): SpecifierClassification {
	const {
		currentExportPath,
		exportsMap,
		exportMap,
		packageName: importedPackageName,
	} = importContext;
	const specifiers = node.specifiers;

	const specifiersByTarget = new Map<string, SpecifierWithTarget[]>();
	const unmappedSpecifiers: SpecifierWithTarget[] = [];
	let hasNamespaceImport = false;

	// Cache for source package exports maps to avoid redundant parsing
	const sourcePackageExportsMaps = new Map<string, Map<string, string>>();

	for (const spec of specifiers) {
		if (spec.type === 'ImportNamespaceSpecifier') {
			hasNamespaceImport = true;
			continue;
		}

		let nameInSource: string;
		let kind: 'type' | 'value' = 'value';

		if (spec.type === 'ImportDefaultSpecifier') {
			nameInSource = 'default';
			kind = node.importKind === 'type' ? 'type' : 'value';
		} else if (spec.type === 'ImportSpecifier') {
			nameInSource = getImportedName(spec);
			const parentImportKind = node.importKind;
			kind = parentImportKind === 'type' || spec.importKind === 'type' ? 'type' : 'value';
		} else {
			continue;
		}

		const exportInfo = exportMap.get(nameInSource);

		if (exportInfo) {
			const effectiveKind: 'type' | 'value' =
				kind === 'type' || exportInfo.isTypeOnly ? 'type' : 'value';

			// Check if this is a cross-package re-export
			const sourcePackageName = exportInfo.crossPackageSource?.packageName;
			if (sourcePackageName) {
				let targetKey: string;
				let resolvedOriginalName = exportInfo.originalName;

				if (preferImportedPackageSubpath) {
					const bridge = findCrossPackageBridgeExportPath({
						exportsMap,
						crossPackageName: sourcePackageName,
						exportedName: nameInSource,
						fs,
					});
					if (bridge) {
						targetKey = importedPackageName + bridge.exportPath.slice(1);
						if (bridge.entryPointExportName !== undefined) {
							resolvedOriginalName =
								bridge.entryPointExportName === nameInSource
									? undefined
									: bridge.entryPointExportName;
						}
						if (!specifiersByTarget.has(targetKey)) {
							specifiersByTarget.set(targetKey, []);
						}
						specifiersByTarget.get(targetKey)!.push({
							spec: { ...spec, importKind: effectiveKind } as AugmentedSpecifier,
							originalName: resolvedOriginalName,
							targetExportPath: targetKey,
							kind: effectiveKind,
							sourcePackageName,
						});
						continue;
					}
				}

				// For cross-package re-exports, find the most specific subpath in the source package
				// Note: Package resolution is not constrained by applyToImportsFrom - any package can be resolved
				let sourcePackageExportsMap = sourcePackageExportsMaps.get(sourcePackageName);
				if (!sourcePackageExportsMap) {
					const sourcePackageDir = findPackageInRegistry({
						packageName: sourcePackageName,
						workspaceRoot,
						fs,
					});
					if (sourcePackageDir) {
						sourcePackageExportsMap = parsePackageExports({ packageDir: sourcePackageDir, fs });
						sourcePackageExportsMaps.set(sourcePackageName, sourcePackageExportsMap);
					}
				}

				// Find the best export path in the source package
				let targetExportPath: string | null = null;
				if (sourcePackageExportsMap) {
					const sourceExportName = exportInfo.originalName ?? nameInSource;
					const matchResult = findExportForSourceFile({
						sourceFilePath: exportInfo.path,
						exportsMap: sourcePackageExportsMap,
						fs,
						sourceExportName,
					});
					targetExportPath = matchResult?.exportPath ?? null;
					if (matchResult?.entryPointExportName !== undefined) {
						resolvedOriginalName =
							matchResult.entryPointExportName === nameInSource
								? undefined
								: matchResult.entryPointExportName;
					}
				}

				// Build the full import path: @package/subpath or just @package if no subpath found
				targetKey = targetExportPath
					? sourcePackageName + targetExportPath.slice(1) // Remove leading '.' from subpath
					: sourcePackageName;

				if (!specifiersByTarget.has(targetKey)) {
					specifiersByTarget.set(targetKey, []);
				}
				specifiersByTarget.get(targetKey)!.push({
					spec: { ...spec, importKind: effectiveKind } as AugmentedSpecifier,
					originalName: resolvedOriginalName,
					targetExportPath: targetKey,
					kind: effectiveKind,
					sourcePackageName,
				});
				continue;
			}

			// Find if there's a package.json export that points to this source file
			const sourceExportName = exportInfo.originalName ?? nameInSource;
			const matchResult = findExportForSourceFile({
				sourceFilePath: exportInfo.path,
				exportsMap,
				fs,
				sourceExportName,
			});
			const targetExportPath = matchResult?.exportPath ?? null;

			let resolvedOriginalName2 = exportInfo.originalName;
			if (matchResult?.entryPointExportName !== undefined) {
				resolvedOriginalName2 =
					matchResult.entryPointExportName === nameInSource
						? undefined
						: matchResult.entryPointExportName;
			}

			// Get the file that the current export path resolves to
			const currentExportResolvedFile = exportsMap.get(currentExportPath);

			// Skip if:
			// 1. No target export path found
			// 2. Target is same as current (no change needed)
			// 3. Current export path already resolves to the same file as the source
			//    (handles multiple exports pointing to same file - avoid no-op changes)
			const currentExportAlreadyPointsToSourceFile =
				currentExportResolvedFile !== undefined && currentExportResolvedFile === exportInfo.path;

			if (
				targetExportPath &&
				targetExportPath !== currentExportPath &&
				!currentExportAlreadyPointsToSourceFile
			) {
				if (!specifiersByTarget.has(targetExportPath)) {
					specifiersByTarget.set(targetExportPath, []);
				}
				specifiersByTarget.get(targetExportPath)!.push({
					spec: { ...spec, importKind: effectiveKind } as AugmentedSpecifier,
					originalName: resolvedOriginalName2,
					targetExportPath,
					kind: effectiveKind,
				});
			} else {
				// No more specific export available
				unmappedSpecifiers.push({
					spec: spec as AugmentedSpecifier,
					targetExportPath: null,
					kind,
				});
			}
		} else {
			unmappedSpecifiers.push({
				spec: spec as AugmentedSpecifier,
				targetExportPath: null,
				kind,
			});
		}
	}

	return { specifiersByTarget, unmappedSpecifiers, hasNamespaceImport };
}

/**
 * Transforms a specifier to use the original export name (handling aliasing).
 * Converts named imports of default exports to ImportDefaultSpecifier.
 */
function transformSpecifierForExport({
	spec,
	originalName,
	kind,
}: {
	spec: AugmentedSpecifier;
	originalName: string | undefined;
	kind: 'type' | 'value';
}): AugmentedSpecifier {
	if (!originalName) {
		return spec;
	}

	if (originalName === 'default') {
		// Should be ImportDefaultSpecifier
		if (spec.type === 'ImportDefaultSpecifier') {
			return spec;
		}
		// Convert ImportSpecifier to ImportDefaultSpecifier
		return {
			type: 'ImportDefaultSpecifier',
			local: spec.local,
			range: spec.range,
			loc: spec.loc,
			parent: spec.parent,
		} as TSESTree.ImportDefaultSpecifier;
	} else {
		// Create synthetic ImportSpecifier with correct importKind
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
}

/**
 * Merges new specifiers with an existing import declaration.
 * Returns the new import statement string.
 */
function buildMergedImportStatement({
	existingImport,
	newSpecs,
	newImportPath,
	nodeImportKind,
	quoteChar,
}: {
	existingImport: ImportDeclarationNode;
	newSpecs: AugmentedSpecifier[];
	newImportPath: string;
	nodeImportKind: 'type' | 'value' | undefined;
	quoteChar: string;
}): string {
	const existingSpecs: AugmentedSpecifier[] = existingImport.specifiers.map((s) => {
		if (existingImport.importKind === 'type') {
			return { ...s, importKind: 'type' as const } as AugmentedSpecifier;
		}
		return s as AugmentedSpecifier;
	});

	const augmentedNewSpecs: AugmentedSpecifier[] = newSpecs.map((s) => {
		if (nodeImportKind === 'type') {
			return { ...s, importKind: 'type' as const } as AugmentedSpecifier;
		}
		return s as AugmentedSpecifier;
	});

	const mergedSpecs = [...existingSpecs, ...augmentedNewSpecs];

	// Determine if we should use 'import type'
	const allType = mergedSpecs.every((s) => s.importKind === 'type');

	return buildImportStatement({
		specs: mergedSpecs,
		path: newImportPath,
		quoteChar,
		isTypeImport: allType,
	});
}

/**
 * Check if an ExpressionStatement is a Jest automock: jest.mock('path') with exactly one string argument.
 * Returns the JestAutomock info if it is, null otherwise.
 */
function getJestAutomock(node: TSESTree.Node): JestAutomock | null {
	if (node.type !== 'ExpressionStatement') {
		return null;
	}

	const statement = node as TSESTree.ExpressionStatement;
	const expr = statement.expression;
	if (expr.type !== 'CallExpression') {
		return null;
	}

	// Check for jest.mock(...)
	const callee = expr.callee;
	if (
		callee.type !== 'MemberExpression' ||
		callee.object.type !== 'Identifier' ||
		callee.object.name !== 'jest' ||
		callee.property.type !== 'Identifier' ||
		callee.property.name !== 'mock'
	) {
		return null;
	}

	// Must have exactly one argument (automock = no factory function)
	if (expr.arguments.length !== 1) {
		return null;
	}

	const arg = expr.arguments[0];
	if (arg.type !== 'Literal' || typeof arg.value !== 'string') {
		return null;
	}

	// Get the quote character from the raw value
	const raw = arg.raw || `'${arg.value}'`;
	const quoteChar = raw[0];

	return {
		statementNode: statement,
		path: arg.value,
		quoteChar,
	};
}

/**
 * Find all Jest automocks in the AST that match the given import path.
 */
function findMatchingAutomocks({
	sourceCode,
	importPath,
}: {
	sourceCode: Rule.RuleContext['sourceCode'];
	importPath: string;
}): JestAutomock[] {
	const automocks: JestAutomock[] = [];
	const ast = sourceCode.ast as TSESTree.Program;

	for (const statement of ast.body) {
		const automock = getJestAutomock(statement);
		if (automock && automock.path === importPath) {
			automocks.push(automock);
		}
	}

	return automocks;
}

/**
 * Build a jest.mock() statement string
 */
function buildAutomockStatement({ path, quoteChar }: { path: string; quoteChar: string }): string {
	return `jest.mock(${quoteChar}${path}${quoteChar});`;
}

/**
 * Creates a fix to remove a node with proper whitespace handling.
 * Removes surrounding newlines to avoid leaving blank lines.
 */
function createNodeRemovalFix({
	fixer,
	node,
	sourceCode,
}: {
	fixer: Rule.RuleFixer;
	node: ImportDeclarationNode;
	sourceCode: ReturnType<Rule.RuleContext['sourceCode']['getText']> extends string
		? Rule.RuleContext['sourceCode']
		: never;
}): Rule.Fix {
	const nodeStart = node.range![0];
	const nodeEnd = node.range![1];

	// Check for leading newline (prefer removing the line separator before the node)
	const textBeforeNode = sourceCode.text.slice(0, nodeStart);
	const leadingNewlineMatch = textBeforeNode.match(/(\r?\n)$/);

	if (leadingNewlineMatch) {
		// Remove the leading newline plus the node
		return fixer.removeRange([nodeStart - leadingNewlineMatch[1].length, nodeEnd]);
	}

	// No leading newline - check for trailing newline
	const textAfterNode = sourceCode.text.slice(nodeEnd);
	const trailingNewlineMatch = textAfterNode.match(/^(\r?\n)/);

	if (trailingNewlineMatch) {
		return fixer.removeRange([nodeStart, nodeEnd + trailingNewlineMatch[1].length]);
	}

	return fixer.remove(node);
}

/**
 * Creates the auto-fix for barrel import violations.
 * Generates new import statements and handles merging with existing imports.
 * Also updates Jest automocks (jest.mock calls with only a path) when present.
 */
function createBarrelImportFix({
	fixer,
	node,
	context,
	importContext,
	specifiersByTarget,
	unmappedSpecifiers,
}: {
	fixer: Rule.RuleFixer;
	node: ImportDeclarationNode;
	context: Rule.RuleContext;
	importContext: ImportContext;
	specifiersByTarget: Map<string, SpecifierWithTarget[]>;
	unmappedSpecifiers: SpecifierWithTarget[];
}): Rule.Fix[] {
	const { importPath, packageName } = importContext;
	const sourceCode = context.sourceCode;
	const quote = sourceCode.getText(node.source)[0]; // Get quote character

	const fixes: Rule.Fix[] = [];
	const newStatements: string[] = [];

	// Find any Jest automocks that match this import path
	const automocks = findMatchingAutomocks({ sourceCode, importPath });

	// Track which new import paths need automocks (only value imports, not type-only)
	const automockPaths: string[] = [];

	// Track if we have any value imports at all (to determine if automocks should be updated)
	let hasAnyValueImports = false;

	// Get all existing imports to check for merging
	const allImports = (sourceCode.ast.body as TSESTree.Statement[]).filter(
		(n): n is ImportDeclarationNode => n.type === 'ImportDeclaration' && n !== node,
	);

	// Generate new import statements for each target export path
	for (const [targetExportPath, specsWithTarget] of specifiersByTarget) {
		// Check if this is a cross-package re-export (sourcePackageName is set)
		const isCrossPackage = specsWithTarget.some((s) => s.sourcePackageName);
		const newImportPath = isCrossPackage
			? targetExportPath // For cross-package, targetExportPath is already the full import path (e.g., @package/subpath)
			: packageName + targetExportPath.slice(1); // Remove leading '.' for same-package imports

		// Transform specifiers if needed (handle aliasing)
		const specs = specsWithTarget.map(({ spec, originalName, kind }) =>
			transformSpecifierForExport({ spec, originalName, kind }),
		);

		// Check if any specifier in this group is a value import (not type-only)
		// Only add automock paths for value imports (types don't need mocking at runtime)
		if (automocks.length > 0) {
			const hasValueImport = specsWithTarget.some(
				({ kind, spec }) =>
					kind === 'value' && (spec.type !== 'ImportSpecifier' || spec.importKind !== 'type'),
			);
			if (hasValueImport) {
				hasAnyValueImports = true;
				automockPaths.push(newImportPath);
			}
		}

		// Check for existing import from the same path
		const existingImport = allImports.find((n) => n.source.value === newImportPath);

		// Skip merging if existing is namespace import
		const isNamespace = existingImport?.specifiers.some(
			(s) => s.type === 'ImportNamespaceSpecifier',
		);

		if (existingImport && !isNamespace) {
			// Merge with existing import
			const newImportStatement = buildMergedImportStatement({
				existingImport,
				newSpecs: specs,
				newImportPath,
				nodeImportKind: node.importKind,
				quoteChar: quote,
			});

			if (newImportStatement.length > 0) {
				fixes.push(fixer.replaceText(existingImport, newImportStatement));
			}
		} else {
			// Create new import
			const allSpecsAreType = specsWithTarget.every((s) => s.kind === 'type');
			const isTypeImport = node.importKind === 'type' || allSpecsAreType;
			const importStatement = buildImportStatement({
				specs,
				path: newImportPath,
				quoteChar: quote,
				isTypeImport,
			});

			if (importStatement.length > 0) {
				newStatements.push(importStatement);
			}
		}
	}

	// Handle unmapped specifiers - they stay in the original import
	if (unmappedSpecifiers.length > 0) {
		const unmappedSpecs = unmappedSpecifiers.map((u) => u.spec);
		const allUnmappedAreType = unmappedSpecifiers.every((u) => u.kind === 'type');
		const isTypeImport = node.importKind === 'type' || allUnmappedAreType;
		const remainingImport = buildImportStatement({
			specs: unmappedSpecs,
			path: importPath,
			quoteChar: quote,
			isTypeImport,
		});
		if (remainingImport.length > 0) {
			newStatements.push(remainingImport);
		}

		// If there are unmapped value specifiers and automocks, keep the original automock path too
		if (automocks.length > 0) {
			const hasUnmappedValueImport = unmappedSpecifiers.some(
				({ kind, spec }) =>
					kind === 'value' && (spec.type !== 'ImportSpecifier' || spec.importKind !== 'type'),
			);
			if (hasUnmappedValueImport) {
				hasAnyValueImports = true;
				automockPaths.push(importPath);
			}
		}
	}

	if (newStatements.length > 0) {
		fixes.push(fixer.replaceText(node, newStatements.join('\n')));
	} else {
		// If all were merged, remove the node including surrounding whitespace/newlines
		fixes.push(createNodeRemovalFix({ fixer, node, sourceCode }));
	}

	// Handle automock updates
	// Only modify automocks if there are value imports being fixed
	// Type-only imports don't need runtime mocking, so we preserve existing automocks
	if (automocks.length > 0 && hasAnyValueImports && automockPaths.length > 0) {
		for (const automock of automocks) {
			// Build new automock statements for all new paths
			const newAutomockStatements = automockPaths.map((path) =>
				buildAutomockStatement({ path, quoteChar: automock.quoteChar }),
			);

			// Replace the original automock statement with the new automock(s)
			fixes.push(
				fixer.replaceTextRange(automock.statementNode.range, newAutomockStatements.join('\n')),
			);
		}
	}

	return fixes;
}

function isPlainRequireCall(node: TSESTree.CallExpression): boolean {
	if (node.callee.type !== 'Identifier' || node.callee.name !== 'require') {
		return false;
	}
	if (node.arguments.length !== 1) {
		return false;
	}
	const arg = node.arguments[0];
	return arg.type === 'Literal' && typeof arg.value === 'string';
}

function unwrapToRequireCall(expr: TSESTree.Expression): TSESTree.CallExpression | null {
	let e: TSESTree.Expression = expr;
	for (;;) {
		const wrapped = e as { type?: string; expression?: TSESTree.Expression };
		if (wrapped.type !== 'ParenthesizedExpression' || !wrapped.expression) {
			break;
		}
		e = wrapped.expression;
	}
	if (e.type !== 'CallExpression' || !isPlainRequireCall(e)) {
		return null;
	}
	return e;
}

function buildSyntheticImportFromRequireAccess(
	exportPropertyName: string,
	modulePath: string,
): ImportDeclarationNode {
	const specifiers: TSESTree.ImportDeclaration['specifiers'] =
		exportPropertyName === 'default'
			? ([
					{
						type: 'ImportDefaultSpecifier',
						local: { type: 'Identifier', name: '_r' },
					},
				] as TSESTree.ImportDefaultSpecifier[])
			: ([
					{
						type: 'ImportSpecifier',
						imported: { type: 'Identifier', name: exportPropertyName },
						local: { type: 'Identifier', name: exportPropertyName },
					},
				] as TSESTree.ImportSpecifier[]);

	return {
		type: 'ImportDeclaration',
		source: {
			type: 'Literal',
			value: modulePath,
			raw: `'${modulePath}'`,
		} as TSESTree.StringLiteral,
		specifiers,
		importKind: 'value',
	} as ImportDeclarationNode;
}

function fullNewImportPathForTarget(
	targetKey: string,
	specsWithTarget: SpecifierWithTarget[],
	packageName: string,
): string {
	const isCrossPackage = specsWithTarget.some((s) => s.sourcePackageName);
	return isCrossPackage ? targetKey : packageName + targetKey.slice(1);
}

function getRhsPropertyAfterTransform(spec: AugmentedSpecifier): string {
	if (spec.type === 'ImportDefaultSpecifier') {
		return 'default';
	}
	return getImportedName(spec as TSESTree.ImportSpecifier);
}

function appendAutomockFixesForPathMigration({
	fixer,
	sourceCode,
	oldBarrelPath,
	newPaths,
}: {
	fixer: Rule.RuleFixer;
	sourceCode: Rule.RuleContext['sourceCode'];
	oldBarrelPath: string;
	newPaths: string[];
}): Rule.Fix[] {
	const automocks = findMatchingAutomocks({ sourceCode, importPath: oldBarrelPath });
	if (automocks.length === 0 || newPaths.length === 0) {
		return [];
	}
	const fixes: Rule.Fix[] = [];
	for (const automock of automocks) {
		const newAutomockStatements = newPaths.map((path) =>
			buildAutomockStatement({ path, quoteChar: automock.quoteChar }),
		);
		fixes.push(
			fixer.replaceTextRange(automock.statementNode.range!, newAutomockStatements.join('\n')),
		);
	}
	return fixes;
}

/**
 * `require('barrel').default` or `require('barrel').namedExport`
 */
function handleRequireMemberExpression({
	node,
	context,
	workspaceRoot,
	fs,
	applyToImportsFrom,
	preferImportedPackageSubpath,
}: {
	node: TSESTree.MemberExpression;
	context: Rule.RuleContext;
	workspaceRoot: string;
	fs: FileSystem;
	applyToImportsFrom: string[];
	preferImportedPackageSubpath: boolean;
}): void {
	if (node.computed || node.property.type !== 'Identifier') {
		return;
	}

	const reqCall = unwrapToRequireCall(node.object as TSESTree.Expression);
	if (!reqCall) {
		return;
	}

	const modulePath = (reqCall.arguments[0] as TSESTree.StringLiteral).value;
	const importContext = resolveImportContextFromModulePath({
		importPath: modulePath,
		workspaceRoot,
		fs,
		applyToImportsFrom,
	});
	if (!importContext) {
		return;
	}

	const exportPropertyName = node.property.name;
	const synthetic = buildSyntheticImportFromRequireAccess(exportPropertyName, modulePath);
	const { specifiersByTarget, hasNamespaceImport } = classifySpecifiers({
		node: synthetic,
		importContext,
		workspaceRoot,
		fs,
		preferImportedPackageSubpath,
	});

	if (hasNamespaceImport || specifiersByTarget.size === 0) {
		return;
	}

	const entries = [...specifiersByTarget.entries()];
	if (entries.length !== 1) {
		return;
	}

	const [targetKey, specsWithTarget] = entries[0]!;
	if (specsWithTarget.length !== 1) {
		return;
	}

	const st = specsWithTarget[0]!;
	const newImportPath = fullNewImportPathForTarget(
		targetKey,
		specsWithTarget,
		importContext.packageName,
	);
	const transformed = transformSpecifierForExport({
		spec: st.spec,
		originalName: st.originalName,
		kind: st.kind,
	});
	const newRhs = getRhsPropertyAfterTransform(transformed);

	const sourceCode = context.getSourceCode();
	const quote = sourceCode.getText(reqCall.arguments[0] as unknown as Rule.Node)[0];

	context.report({
		node: node as unknown as Rule.Node,
		messageId: 'barrelEntryImport',
		data: { path: importContext.importPath },
		fix(fixer) {
			const fixes: Rule.Fix[] = [];
			fixes.push(
				fixer.replaceText(
					node as unknown as Rule.Node,
					`require(${quote}${newImportPath}${quote}).${newRhs}`,
				),
			);
			if (st.kind === 'value') {
				fixes.push(
					...appendAutomockFixesForPathMigration({
						fixer,
						sourceCode,
						oldBarrelPath: modulePath,
						newPaths: [newImportPath],
					}),
				);
			}
			return fixes;
		},
	});
}

/**
 * `const { a, b } = require('barrel')`
 */
function handleRequireDestructuringDeclarator({
	node,
	context,
	workspaceRoot,
	fs,
	applyToImportsFrom,
	preferImportedPackageSubpath,
}: {
	node: TSESTree.VariableDeclarator;
	context: Rule.RuleContext;
	workspaceRoot: string;
	fs: FileSystem;
	applyToImportsFrom: string[];
	preferImportedPackageSubpath: boolean;
}): void {
	if (node.id.type !== 'ObjectPattern' || !node.init || node.init.type !== 'CallExpression') {
		return;
	}
	const initCall = node.init;
	if (!isPlainRequireCall(initCall)) {
		return;
	}

	const modulePath = (initCall.arguments[0] as TSESTree.StringLiteral).value;
	const importContext = resolveImportContextFromModulePath({
		importPath: modulePath,
		workspaceRoot,
		fs,
		applyToImportsFrom,
	});
	if (!importContext) {
		return;
	}

	const specifiers: TSESTree.ImportDeclaration['specifiers'] = [];
	for (const prop of node.id.properties) {
		if (prop.type !== 'Property' || prop.computed) {
			continue;
		}
		if (prop.key.type !== 'Identifier' || prop.value.type !== 'Identifier') {
			continue;
		}
		const importedName = prop.key.name;
		const localName = prop.value.name;
		specifiers.push({
			type: 'ImportSpecifier',
			imported: { type: 'Identifier', name: importedName },
			local: { type: 'Identifier', name: localName },
		} as TSESTree.ImportSpecifier);
	}

	if (specifiers.length === 0) {
		return;
	}

	const synthetic: ImportDeclarationNode = {
		type: 'ImportDeclaration',
		source: {
			type: 'Literal',
			value: modulePath,
			raw: `'${modulePath}'`,
		} as TSESTree.StringLiteral,
		specifiers,
		importKind: 'value',
	} as ImportDeclarationNode;

	const { specifiersByTarget, unmappedSpecifiers, hasNamespaceImport } = classifySpecifiers({
		node: synthetic,
		importContext,
		workspaceRoot,
		fs,
		preferImportedPackageSubpath,
	});

	if (hasNamespaceImport || specifiersByTarget.size === 0 || unmappedSpecifiers.length > 0) {
		return;
	}

	const parentDecl = node.parent as TSESTree.VariableDeclaration;
	if (parentDecl.type !== 'VariableDeclaration') {
		return;
	}
	if (specifiersByTarget.size > 1 && parentDecl.declarations.length !== 1) {
		return;
	}

	const sourceCode = context.getSourceCode();
	const quote = sourceCode.getText(initCall.arguments[0] as unknown as Rule.Node)[0];
	const pkg = importContext.packageName;

	const buildFixes = (fixer: Rule.RuleFixer): Rule.Fix[] => {
		const fixes: Rule.Fix[] = [];
		let hasValue = false;
		const automockPaths: string[] = [];

		if (specifiersByTarget.size === 1) {
			const [targetKey, specsWithTarget] = [...specifiersByTarget.entries()][0]!;
			const newImportPath = fullNewImportPathForTarget(targetKey, specsWithTarget, pkg);
			if (specsWithTarget.some((s) => s.kind === 'value')) {
				hasValue = true;
				automockPaths.push(newImportPath);
			}
			fixes.push(
				fixer.replaceText(
					initCall.arguments[0] as unknown as Rule.Node,
					`${quote}${newImportPath}${quote}`,
				),
			);
		} else {
			const lines: string[] = [];
			for (const [targetKey, specsWithTarget] of specifiersByTarget) {
				const newImportPath = fullNewImportPathForTarget(targetKey, specsWithTarget, pkg);
				if (specsWithTarget.some((s) => s.kind === 'value')) {
					hasValue = true;
					automockPaths.push(newImportPath);
				}
				for (const st of specsWithTarget) {
					const transformed = transformSpecifierForExport({
						spec: st.spec,
						originalName: st.originalName,
						kind: st.kind,
					});
					const rhs = getRhsPropertyAfterTransform(transformed);
					const local = st.spec.local.name;
					lines.push(`${local} = require(${quote}${newImportPath}${quote}).${rhs}`);
				}
			}
			const declText = lines.map((l) => `${parentDecl.kind} ${l};`).join('\n');
			fixes.push(fixer.replaceText(parentDecl as unknown as Rule.Node, declText));
		}

		if (hasValue) {
			fixes.push(
				...appendAutomockFixesForPathMigration({
					fixer,
					sourceCode,
					oldBarrelPath: modulePath,
					newPaths: [...new Set(automockPaths)],
				}),
			);
		}
		return fixes;
	};

	context.report({
		node: initCall as unknown as Rule.Node,
		messageId: 'barrelEntryImport',
		data: { path: importContext.importPath },
		fix: buildFixes,
	});
}

/**
 * Handles an ImportDeclaration node to check for barrel file imports.
 * Reports and auto-fixes imports that could use more specific export paths.
 */
function handleImportDeclaration({
	node,
	context,
	workspaceRoot,
	fs,
	applyToImportsFrom,
	preferImportedPackageSubpath,
}: {
	node: ImportDeclarationNode;
	context: Rule.RuleContext;
	workspaceRoot: string;
	fs: FileSystem;
	applyToImportsFrom: string[];
	preferImportedPackageSubpath: boolean;
}): void {
	// Resolve import context (validates and extracts package/export info)
	// applyToImportsFrom is used here to filter which packages the rule applies to
	const importContext = resolveImportContext({ node, workspaceRoot, fs, applyToImportsFrom });
	if (!importContext) {
		return;
	}

	// Check each imported specifier to see if we can find a more specific export
	if (node.specifiers.length === 0) {
		return;
	}

	// Classify specifiers by their target export paths
	const { specifiersByTarget, unmappedSpecifiers, hasNamespaceImport } = classifySpecifiers({
		node,
		importContext,
		workspaceRoot,
		fs,
		preferImportedPackageSubpath,
	});

	// If namespace import, report without auto-fix if there are specific exports available
	if (hasNamespaceImport) {
		if (specifiersByTarget.size > 0) {
			context.report({
				node,
				messageId: 'barrelEntryImport',
				data: { path: importContext.importPath },
			});
		}
		return;
	}

	// If no specifiers can be remapped to more specific imports, don't report
	if (specifiersByTarget.size === 0) {
		return;
	}

	// Report with auto-fix
	context.report({
		node,
		messageId: 'barrelEntryImport',
		data: { path: importContext.importPath },
		fix(fixer: Rule.RuleFixer) {
			return createBarrelImportFix({
				fixer,
				node,
				context,
				importContext,
				specifiersByTarget,
				unmappedSpecifiers,
			});
		},
	});
}

/**
 * Factory function to create the ESLint rule with a given file system.
 * This enables testing with mock file systems.
 */
export function createRule(fs: FileSystem): Rule.RuleModule {
	return {
		meta: ruleMeta,
		create(context) {
			const options = (context.options[0] || {}) as RuleOptions;
			const applyToImportsFrom = options.applyToImportsFrom ?? DEFAULT_TARGET_FOLDERS;
			const preferImportedPackageSubpath = options.preferImportedPackageSubpath ?? false;
			const workspaceRoot = findWorkspaceRoot({
				startPath: dirname(context.filename),
				fs,
				applyToImportsFrom,
			});

			return {
				ImportDeclaration(rawNode) {
					const node = rawNode as ImportDeclarationNode;

					handleImportDeclaration({
						node,
						context,
						workspaceRoot,
						fs,
						applyToImportsFrom,
						preferImportedPackageSubpath,
					});
				},
				MemberExpression(rawNode) {
					handleRequireMemberExpression({
						node: rawNode as TSESTree.MemberExpression,
						context,
						workspaceRoot,
						fs,
						applyToImportsFrom,
						preferImportedPackageSubpath,
					});
				},
				VariableDeclarator(rawNode) {
					handleRequireDestructuringDeclarator({
						node: rawNode as TSESTree.VariableDeclarator,
						context,
						workspaceRoot,
						fs,
						applyToImportsFrom,
						preferImportedPackageSubpath,
					});
				},
			};
		},
	};
}

const rule: Rule.RuleModule = createRule(realFileSystem);

export default rule;
