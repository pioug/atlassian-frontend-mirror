import { dirname } from 'path';

import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';

import { parseBarrelExports } from '../shared/barrel-parsing';
import { DEFAULT_TARGET_FOLDERS, findWorkspaceRoot, isRelativeImport } from '../shared/file-system';
import { findPackageInRegistry, isPackageInApplyToImportsFrom } from '../shared/package-registry';
import { findExportForSourceFile, parsePackageExports } from '../shared/package-resolution';
import { type ExportInfo, type FileSystem, realFileSystem } from '../shared/types';

/**
 * Options for the no-barrel-entry-imports rule.
 */
interface RuleOptions {
	applyToImportsFrom?: string[];
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

	const importPath = node.source.value;

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
 * Classifies import specifiers by their target export paths.
 * Groups specifiers that can be remapped to more specific exports.
 * For cross-package re-exports, suggests importing from the source package's most specific subpath.
 */
function classifySpecifiers({
	node,
	importContext,
	workspaceRoot,
	fs,
}: {
	node: ImportDeclarationNode;
	importContext: ImportContext;
	workspaceRoot: string;
	fs: FileSystem;
}): SpecifierClassification {
	const { currentExportPath, exportsMap, exportMap } = importContext;
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
					targetExportPath = findExportForSourceFile({
						sourceFilePath: exportInfo.path,
						exportsMap: sourcePackageExportsMap,
					});
				}

				// Build the full import path: @package/subpath or just @package if no subpath found
				const targetKey = targetExportPath
					? sourcePackageName + targetExportPath.slice(1) // Remove leading '.' from subpath
					: sourcePackageName;

				if (!specifiersByTarget.has(targetKey)) {
					specifiersByTarget.set(targetKey, []);
				}
				specifiersByTarget.get(targetKey)!.push({
					spec: { ...spec, importKind: effectiveKind } as AugmentedSpecifier,
					originalName: exportInfo.originalName,
					targetExportPath: targetKey,
					kind: effectiveKind,
					sourcePackageName,
				});
				continue;
			}

			// Find if there's a package.json export that points to this source file
			const targetExportPath = findExportForSourceFile({
				sourceFilePath: exportInfo.path,
				exportsMap,
			});

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
					originalName: exportInfo.originalName,
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
			const isTypeImport = node.importKind === 'type';
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
		const isTypeImport = node.importKind === 'type';
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
}: {
	node: ImportDeclarationNode;
	context: Rule.RuleContext;
	workspaceRoot: string;
	fs: FileSystem;
	applyToImportsFrom: string[];
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
			const workspaceRoot = findWorkspaceRoot({
				startPath: dirname(context.filename),
				fs,
				applyToImportsFrom,
			});

			return {
				ImportDeclaration(rawNode) {
					const node = rawNode as ImportDeclarationNode;

					handleImportDeclaration({ node, context, workspaceRoot, fs, applyToImportsFrom });
				},
			};
		},
	};
}

const rule: Rule.RuleModule = createRule(realFileSystem);

export default rule;
