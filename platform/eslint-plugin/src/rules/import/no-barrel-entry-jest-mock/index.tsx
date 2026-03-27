import { dirname } from 'path';

import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import * as ts from 'typescript';

import { hasReExportsFromOtherFiles, parseBarrelExports } from '../shared/barrel-parsing';
import {
	DEFAULT_TARGET_FOLDERS,
	findWorkspaceRoot,
	isRelativeImport,
	readFileContent,
	resolveImportPath,
} from '../shared/file-system';
import {
	extractImportPath,
	findJestRequireActualCalls,
	findJestRequireMockCalls,
	isJestMockCall,
	isJestRequireActual,
	resolveNewPathForRequireMock,
} from '../shared/jest-utils';
import { findPackageInRegistry, isPackageInApplyToImportsFrom } from '../shared/package-registry';
import { findExportForSourceFile, parsePackageExports } from '../shared/package-resolution';
import {
	type CrossPackageSource,
	type ExportInfo,
	type FileSystem,
	realFileSystem,
} from '../shared/types';

/**
 * Options for the no-barrel-entry-jest-mock rule.
 */
interface RuleOptions {
	applyToImportsFrom?: string[];
}

/**
 * Result of tracing a symbol through barrel files to its source.
 */
interface SymbolTraceResult {
	/** The name of the symbol being traced (as used in the mock) */
	symbolName: string;
	/** The original name of the symbol in the source file (for aliased exports) */
	originalName?: string;
	/** The absolute path to the source file where the symbol originates */
	sourceFilePath: string;
	/** Whether the symbol is a type-only export */
	isTypeOnly: boolean;
	/** Information about cross-package re-export origin, if applicable */
	crossPackageSource?: CrossPackageSource;
}

/**
 * Grouped mock properties by their target export path.
 */
interface MockPropertyGroup {
	/** The package.json export path (e.g., "./controllers/chat") */
	exportPath: string;
	/** The full import path (e.g., "@atlassian/conversation-assistant-store/controllers/chat") */
	importPath: string;
	/** The property names in this group (as used in the original mock) */
	propertyNames: string[];
	/** The property texts for each name (keyed by original mock property name) */
	propertyTexts: Map<string, string>;
	/** Map from mock property name to original source name (for aliased exports) */
	nameMapping: Map<string, string>;
	/** Whether this group contains a mock of a default export */
	hasDefaultExport: boolean;
}

/**
 * Trace the re-export chain for a symbol from a barrel file.
 * Returns an array of file paths representing the chain from the barrel to the source.
 * For example: [barrel.ts, intermediate.ts, source.ts]
 */
function traceReExportChain({
	barrelFilePath,
	symbolName,
	fs,
	visited = new Set<string>(),
}: {
	barrelFilePath: string;
	symbolName: string;
	fs: FileSystem;
	visited?: Set<string>;
}): string[] {
	if (visited.has(barrelFilePath)) {
		return [];
	}
	visited.add(barrelFilePath);

	const content = readFileContent({ filePath: barrelFilePath, fs });
	if (!content) {
		return [barrelFilePath];
	}

	let sourceFile: ts.SourceFile;
	try {
		sourceFile = ts.createSourceFile(barrelFilePath, content, ts.ScriptTarget.Latest, true);
	} catch {
		return [barrelFilePath];
	}

	const barrelDir = dirname(barrelFilePath);

	for (const statement of sourceFile.statements) {
		if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier) {
			continue;
		}

		if (!ts.isStringLiteral(statement.moduleSpecifier)) {
			continue;
		}

		const modulePath = statement.moduleSpecifier.text;
		if (!isRelativeImport(modulePath)) {
			continue;
		}

		// Check if this export statement includes our symbol
		let includesSymbol = false;
		if (statement.exportClause) {
			if (ts.isNamedExports(statement.exportClause)) {
				for (const element of statement.exportClause.elements) {
					const exportedName = element.name.text;
					if (exportedName === symbolName) {
						includesSymbol = true;
						break;
					}
				}
			}
		} else {
			// Star export - might include the symbol
			includesSymbol = true;
		}

		if (includesSymbol) {
			const resolvedSource = resolveImportPath({ basedir: barrelDir, importPath: modulePath, fs });
			if (resolvedSource) {
				// Recursively trace from the resolved source
				const restOfChain = traceReExportChain({
					barrelFilePath: resolvedSource,
					symbolName,
					fs,
					visited,
				});
				return [barrelFilePath, ...restOfChain];
			}
		}
	}

	// Symbol is defined in this file (not re-exported)
	return [barrelFilePath];
}

/**
 * Find a package.json export that can provide a given symbol.
 *
 * This function traces the re-export chain from the current barrel to the symbol's source,
 * and returns an export if its entry file is on that chain (i.e., it's an intermediate barrel
 * that the main barrel imports from for this symbol).
 *
 * This prevents suggesting unrelated barrel files that happen to re-export the same symbol
 * through a different path.
 */
function findExportForSymbol({
	symbolName,
	symbolSourcePath,
	exportsMap,
	currentExportPath,
	fs,
}: {
	symbolName: string;
	symbolSourcePath: string;
	exportsMap: Map<string, string>;
	currentExportPath: string;
	fs: FileSystem;
}): string | null {
	const currentEntryFilePath = exportsMap.get(currentExportPath);
	if (!currentEntryFilePath) {
		return null;
	}

	// Trace the re-export chain from the current barrel to the source
	const reExportChain = traceReExportChain({
		barrelFilePath: currentEntryFilePath,
		symbolName,
		fs,
	});

	// Convert chain to a Set for O(1) lookup
	const chainSet = new Set(reExportChain);

	// Check each package.json export entry (except the current one)
	for (const [exportPath, entryFilePath] of exportsMap) {
		if (exportPath === currentExportPath) {
			continue;
		}

		// Skip exports that resolve to the same file as the current export path
		if (entryFilePath === currentEntryFilePath) {
			continue;
		}

		// Only return this export if its entry file is on the re-export chain
		// (meaning it's an intermediate barrel the main barrel imports from for this symbol)
		// or if it directly points to the source file
		if (chainSet.has(entryFilePath) || entryFilePath === symbolSourcePath) {
			// Verify the symbol is actually exported from this entry file
			const entryExports = parseBarrelExports({ barrelFilePath: entryFilePath, depth: 0, fs });
			if (entryExports.has(symbolName)) {
				return exportPath;
			}
		}
	}
	return null;
}

/**
 * Preamble statement extracted from a mock factory function.
 */
interface PreambleStatement {
	/** The names of variables declared in this statement */
	declaredNames: string[];
	/** The source text of the statement */
	text: string;
	/** Names of identifiers used in this statement (excluding declared names) */
	usedIdentifiers: Set<string>;
}

/**
 * Collect all identifier names used in a node (recursively).
 * Avoids circular references by skipping parent-related properties.
 */
function collectUsedIdentifiers({ node }: { node: TSESTree.Node }): Set<string> {
	const identifiers = new Set<string>();
	const visited = new WeakSet<object>();

	// Properties to skip to avoid circular references
	const skipProperties = new Set(['parent', 'tokens', 'comments', 'loc', 'range']);

	function traverse(n: TSESTree.Node): void {
		if (visited.has(n)) {
			return;
		}
		visited.add(n);

		if (n.type === 'Identifier') {
			identifiers.add(n.name);
		}
		for (const key of Object.keys(n)) {
			if (skipProperties.has(key)) {
				continue;
			}
			const child = n[key as keyof typeof n];
			if (child && typeof child === 'object') {
				if (Array.isArray(child)) {
					for (const item of child) {
						if (item && typeof item === 'object' && 'type' in item) {
							traverse(item as TSESTree.Node);
						}
					}
				} else if ('type' in child) {
					traverse(child as TSESTree.Node);
				}
			}
		}
	}

	traverse(node);
	return identifiers;
}

/**
 * Extract preamble statements (variable declarations) from a block body.
 */
function extractPreambleStatements({
	mockImpl,
	sourceCode,
}: {
	mockImpl: TSESTree.Node;
	sourceCode: Rule.RuleContext['sourceCode'];
}): PreambleStatement[] {
	const preamble: PreambleStatement[] = [];

	let body: TSESTree.Statement[] | null = null;

	if (mockImpl.type === 'ArrowFunctionExpression' && mockImpl.body.type === 'BlockStatement') {
		body = mockImpl.body.body;
	} else if (mockImpl.type === 'FunctionExpression' && mockImpl.body.type === 'BlockStatement') {
		body = mockImpl.body.body;
	}

	if (!body) {
		return preamble;
	}

	for (const stmt of body) {
		if (stmt.type === 'ReturnStatement') {
			break; // Stop at return
		}

		if (stmt.type === 'VariableDeclaration') {
			const declaredNames: string[] = [];
			const usedIdentifiers = new Set<string>();

			for (const decl of stmt.declarations) {
				if (decl.id.type === 'Identifier') {
					declaredNames.push(decl.id.name);
				}
				if (decl.init) {
					const used = collectUsedIdentifiers({ node: decl.init });
					for (const id of used) {
						usedIdentifiers.add(id);
					}
				}
			}

			// Remove declared names from used identifiers
			for (const name of declaredNames) {
				usedIdentifiers.delete(name);
			}

			preamble.push({
				declaredNames,
				text: sourceCode.getText(stmt as unknown as Rule.Node),
				usedIdentifiers,
			});
		}
	}

	return preamble;
}

/**
 * Determine which preamble statements are needed for a set of property texts.
 * Returns the preamble statements in order, including any transitively needed ones.
 */
function getNeededPreamble({
	propertyTexts,
	allPreamble,
}: {
	propertyTexts: string[];
	allPreamble: PreambleStatement[];
}): PreambleStatement[] {
	// Collect all identifiers used in the property texts
	const neededIdentifiers = new Set<string>();
	for (const text of propertyTexts) {
		// Simple regex to find identifiers in the text
		// This is a basic approach; handles most common cases
		const identifierPattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
		let match;
		while ((match = identifierPattern.exec(text)) !== null) {
			neededIdentifiers.add(match[1]);
		}
	}

	// Build dependency graph and find needed preamble
	const neededPreamble: PreambleStatement[] = [];
	const includedNames = new Set<string>();
	let changed = true;

	while (changed) {
		changed = false;
		for (const stmt of allPreamble) {
			// Check if any declared name is needed
			const isNeeded = stmt.declaredNames.some((name) => neededIdentifiers.has(name));
			const alreadyIncluded = stmt.declaredNames.some((name) => includedNames.has(name));

			if (isNeeded && !alreadyIncluded) {
				neededPreamble.push(stmt);
				for (const name of stmt.declaredNames) {
					includedNames.add(name);
				}
				// Add any identifiers this statement uses to needed set
				for (const id of stmt.usedIdentifiers) {
					if (!neededIdentifiers.has(id)) {
						neededIdentifiers.add(id);
						changed = true;
					}
				}
			}
		}
	}

	// Return in original order
	return allPreamble.filter((stmt) => neededPreamble.includes(stmt));
}

/**
 * Extract mock object properties from jest.mock call
 * Returns a map of property name -> { node, text } and whether there's a jest.requireActual spread
 */
function extractMockProperties({
	sourceCode,
	mockObjectNode,
}: {
	sourceCode: Rule.RuleContext['sourceCode'];
	mockObjectNode: TSESTree.Node;
}): {
	properties: Map<string, { node: TSESTree.Node; text: string }>;
	hasRequireActual: boolean;
} {
	const properties = new Map<string, { node: TSESTree.Node; text: string }>();
	let hasRequireActual = false;

	if (mockObjectNode.type === 'ObjectExpression') {
		for (const prop of mockObjectNode.properties) {
			if (prop.type === 'SpreadElement') {
				if (isJestRequireActual(prop.argument)) {
					hasRequireActual = true;
				}
			} else if (prop.type === 'Property') {
				let keyName: string;

				if (prop.key.type === 'Identifier') {
					keyName = prop.key.name;
				} else if (prop.key.type === 'Literal') {
					keyName = String(prop.key.value);
				} else {
					continue;
				}

				const propText = sourceCode.getText(prop as unknown as Rule.Node);
				properties.set(keyName, {
					node: prop,
					text: propText,
				});
			}
		}
	}

	return { properties, hasRequireActual };
}

/**
 * Information about an existing jest.mock call in the file
 */
interface ExistingMockInfo {
	/** The AST node for the jest.mock call */
	node: TSESTree.CallExpression;
	/** The import path being mocked */
	importPath: string;
	/** Properties defined in the mock factory */
	properties: Map<string, { node: TSESTree.Node; text: string }>;
	/** Whether the mock has a jest.requireActual spread */
	hasRequireActual: boolean;
}

/**
 * Find all jest.mock calls in the current file
 */
function findAllJestMocksInFile({
	context,
}: {
	context: Rule.RuleContext;
}): Map<string, ExistingMockInfo> {
	const allMocks = new Map<string, ExistingMockInfo>();
	const sourceCode = context.getSourceCode();
	const ast = sourceCode.ast as unknown as TSESTree.Program;

	// Use a visited set to prevent infinite recursion
	const visited = new WeakSet<TSESTree.Node>();

	// Properties to skip to avoid circular references
	const skipKeys = new Set(['parent', 'loc', 'range', 'tokens', 'comments']);

	function visitNode(node: TSESTree.Node): void {
		// Prevent revisiting nodes
		if (visited.has(node)) {
			return;
		}
		visited.add(node);

		if (node.type === 'CallExpression' && isJestMockCall(node)) {
			const importPath = extractImportPath(node);
			if (importPath) {
				const mockImpl = node.arguments[1];

				if (mockImpl) {
					const mockObjectNode = extractMockImplementation({ mockImpl: mockImpl as TSESTree.Node });
					const { properties, hasRequireActual } = extractMockProperties({
						sourceCode,
						mockObjectNode,
					});
					allMocks.set(importPath, {
						node,
						importPath,
						properties,
						hasRequireActual,
					});
				}
			}
		}

		// Recursively visit child nodes
		for (const key in node) {
			if (skipKeys.has(key)) {
				continue;
			}
			const value = node[key as keyof typeof node];
			if (value && typeof value === 'object') {
				if (Array.isArray(value)) {
					for (const child of value) {
						if (child && typeof child === 'object' && 'type' in child) {
							visitNode(child as TSESTree.Node);
						}
					}
				} else if ('type' in value) {
					visitNode(value as TSESTree.Node);
				}
			}
		}
	}

	visitNode(ast);
	return allMocks;
}

/**
 * Merge mock properties from multiple sources for the same file
 */
function mergeMockProperties({
	existingProperties,
	newProperties,
}: {
	existingProperties: Map<string, { node: TSESTree.Node; text: string }>;
	newProperties: Map<string, { node: TSESTree.Node; text: string }>;
}): Map<string, { node: TSESTree.Node; text: string }> {
	const merged = new Map(existingProperties);
	for (const [key, value] of newProperties) {
		merged.set(key, value);
	}
	return merged;
}

/**
 * Check if a node is an Object.assign call
 */
function isObjectAssignCall({ node }: { node: TSESTree.Node }): boolean {
	if (node.type !== 'CallExpression') {
		return false;
	}
	const callee = node.callee;
	if (callee.type === 'MemberExpression') {
		return (
			callee.object.type === 'Identifier' &&
			callee.object.name === 'Object' &&
			callee.property.type === 'Identifier' &&
			callee.property.name === 'assign'
		);
	}
	return false;
}

/**
 * Extract the object expression containing mock properties from an Object.assign call.
 * Pattern: Object.assign({}, jest.requireActual(...), { props... })
 * Returns the last ObjectExpression argument, or null if not found.
 */
function extractObjectFromAssign({
	callExpr,
}: {
	callExpr: TSESTree.CallExpression;
}): TSESTree.ObjectExpression | null {
	// Look for ObjectExpression arguments that are not the target (first arg)
	// The pattern is typically: Object.assign({}, jest.requireActual(...), { actual props })
	// We want the last ObjectExpression that contains the actual mock properties
	for (let i = callExpr.arguments.length - 1; i >= 0; i--) {
		const arg = callExpr.arguments[i];
		if (arg.type === 'ObjectExpression' && arg.properties.length > 0) {
			return arg;
		}
	}
	return null;
}

/**
 * Extract the mock implementation object from the jest.mock call.
 * Handles arrow functions, function expressions, and Object.assign patterns.
 */
function extractMockImplementation({ mockImpl }: { mockImpl: TSESTree.Node }): TSESTree.Node {
	// Helper to unwrap Object.assign if present
	const unwrapObjectAssign = (node: TSESTree.Node): TSESTree.Node => {
		if (node.type === 'CallExpression' && isObjectAssignCall({ node })) {
			const extracted = extractObjectFromAssign({ callExpr: node });
			if (extracted) {
				return extracted;
			}
		}
		return node;
	};

	if (mockImpl.type === 'ArrowFunctionExpression') {
		if (mockImpl.body.type === 'ObjectExpression') {
			return mockImpl.body;
		}
		// Handle arrow function returning Object.assign
		if (mockImpl.body.type === 'CallExpression' && isObjectAssignCall({ node: mockImpl.body })) {
			return unwrapObjectAssign(mockImpl.body);
		}
		if (mockImpl.body.type === 'BlockStatement') {
			const returnStmt = mockImpl.body.body.find(
				(s: TSESTree.Statement): s is TSESTree.ReturnStatement => s.type === 'ReturnStatement',
			);
			if (returnStmt?.argument) {
				return unwrapObjectAssign(returnStmt.argument);
			}
		}
	}
	if (mockImpl.type === 'FunctionExpression' && mockImpl.body.type === 'BlockStatement') {
		const returnStmt = mockImpl.body.body.find(
			(s: TSESTree.Statement): s is TSESTree.ReturnStatement => s.type === 'ReturnStatement',
		);
		if (returnStmt?.argument) {
			return unwrapObjectAssign(returnStmt.argument);
		}
	}
	return mockImpl;
}

/**
 * Trace mocked symbols to their source files and group by package.json exports.
 */
function traceSymbolsToExports({
	symbolNames,
	exportMap,
	exportsMap,
	currentExportPath,
	fs,
}: {
	symbolNames: string[];
	exportMap: Map<string, ExportInfo>;
	exportsMap: Map<string, string>;
	currentExportPath: string;
	fs: FileSystem;
}): {
	groupedByExport: Map<string, SymbolTraceResult[]>;
	crossPackageGroups: Map<string, SymbolTraceResult[]>;
	unmappedSymbols: string[];
} {
	const groupedByExport = new Map<string, SymbolTraceResult[]>();
	const crossPackageGroups = new Map<string, SymbolTraceResult[]>();
	const unmappedSymbols: string[] = [];

	for (const symbolName of symbolNames) {
		const exportInfo = exportMap.get(symbolName);

		if (!exportInfo) {
			unmappedSymbols.push(symbolName);
			continue;
		}

		// Check for cross-package source first
		if (exportInfo.crossPackageSource) {
			const key = `${exportInfo.crossPackageSource.packageName}${exportInfo.crossPackageSource.exportPath === '.' ? '' : exportInfo.crossPackageSource.exportPath.slice(1)}`;
			if (!crossPackageGroups.has(key)) {
				crossPackageGroups.set(key, []);
			}
			crossPackageGroups.get(key)!.push({
				symbolName,
				originalName: exportInfo.originalName,
				sourceFilePath: exportInfo.path,
				isTypeOnly: exportInfo.isTypeOnly,
				crossPackageSource: exportInfo.crossPackageSource,
			});
			continue;
		}

		// First try to find an export that directly exposes the source file
		let targetExportPath =
			findExportForSourceFile({
				sourceFilePath: exportInfo.path,
				exportsMap,
			})?.exportPath ?? null;

		// If no direct match, check which export can provide this symbol
		// (handles nested barrels where the symbol is re-exported through intermediate files)
		if (!targetExportPath) {
			targetExportPath = findExportForSymbol({
				symbolName,
				symbolSourcePath: exportInfo.path,
				exportsMap,
				currentExportPath,
				fs,
			});
		}

		if (targetExportPath && targetExportPath !== currentExportPath) {
			if (!groupedByExport.has(targetExportPath)) {
				groupedByExport.set(targetExportPath, []);
			}
			groupedByExport.get(targetExportPath)!.push({
				symbolName,
				originalName: exportInfo.originalName,
				sourceFilePath: exportInfo.path,
				isTypeOnly: exportInfo.isTypeOnly,
			});
		} else {
			unmappedSymbols.push(symbolName);
		}
	}

	return { groupedByExport, crossPackageGroups, unmappedSymbols };
}

/**
 * Replace the property key in property text when the export is aliased.
 * For example, if the original text is "renamedFunction: jest.fn()" and
 * the original name is "originalFunction", returns "originalFunction: jest.fn()".
 */
function replacePropertyKey({
	propText,
	mockName,
	originalName,
}: {
	propText: string;
	mockName: string;
	originalName: string;
}): string {
	// Match the property key at the start (handles both quoted and unquoted keys)
	const keyPattern = new RegExp(`^(['"]?)${escapeRegExp(mockName)}\\1\\s*:`);
	return propText.replace(keyPattern, `${originalName}:`);
}

/**
 * Escape special regex characters in a string.
 */
function escapeRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate fix text for multiple jest.mock calls
 */
function generateMockFixes({
	groups,
	crossPackageGroups,
	packageName,
	mockProperties,
	quote,
	preambleStatements,
}: {
	groups: MockPropertyGroup[];
	crossPackageGroups: MockPropertyGroup[];
	packageName: string;
	mockProperties: Map<string, { node: TSESTree.Node; text: string }>;
	quote: string;
	preambleStatements: PreambleStatement[];
}): string {
	const mockCalls: string[] = [];

	// Helper to generate a single mock call
	const generateMockCall = (group: MockPropertyGroup, fullImportPath: string): string => {
		const propTexts: string[] = [];

		propTexts.push(`...jest.requireActual(${quote}${fullImportPath}${quote})`);

		// Add __esModule: true when mocking default exports
		if (group.hasDefaultExport) {
			propTexts.push('__esModule: true');
		}

		for (const propName of group.propertyNames) {
			// First try to get from group's propertyTexts (used for merged mocks)
			const groupPropText = group.propertyTexts.get(propName);
			if (groupPropText) {
				// Check if this property needs to be renamed (aliased export)
				const originalName = group.nameMapping.get(propName);
				if (originalName && originalName !== propName) {
					const renamedText = replacePropertyKey({
						propText: groupPropText,
						mockName: propName,
						originalName,
					});
					propTexts.push(renamedText);
				} else {
					propTexts.push(groupPropText);
				}
			} else {
				// Fallback to mockProperties (shouldn't happen with properly constructed groups)
				const propInfo = mockProperties.get(propName);
				if (propInfo) {
					const originalName = group.nameMapping.get(propName);
					if (originalName && originalName !== propName) {
						const renamedText = replacePropertyKey({
							propText: propInfo.text,
							mockName: propName,
							originalName,
						});
						propTexts.push(renamedText);
					} else {
						propTexts.push(propInfo.text);
					}
				}
			}
		}

		// Determine if we need preamble for this group
		const neededPreamble = getNeededPreamble({
			propertyTexts: propTexts,
			allPreamble: preambleStatements,
		});

		if (neededPreamble.length > 0) {
			// Generate block body arrow function with preamble
			const preambleLines = neededPreamble.map((p) => `\t${p.text}`).join('\n');
			const formattedProps = propTexts.map((p) => `\t\t${p},`).join('\n');
			return `jest.mock(${quote}${fullImportPath}${quote}, () => {\n${preambleLines}\n\treturn {\n${formattedProps}\n\t};\n})`;
		} else {
			// Always use multi-line format for consistency
			const formattedProps = propTexts.map((p) => `\t${p},`).join('\n');
			return `jest.mock(${quote}${fullImportPath}${quote}, () => ({\n${formattedProps}\n}))`;
		}
	};

	// Generate mocks for cross-package groups first
	for (const group of crossPackageGroups) {
		mockCalls.push(generateMockCall(group, group.importPath));
	}

	// Generate mocks for same-package groups
	for (const group of groups) {
		const fullImportPath = `${packageName}${group.exportPath.slice(1)}`;
		mockCalls.push(generateMockCall(group, fullImportPath));
	}

	// Join with semicolons but don't add trailing semicolon
	return mockCalls.join(';\n');
}

/**
 * Context resolved for a jest.mock that may be mocking a barrel file.
 */
interface JestMockContext {
	importPath: string;
	packageName: string;
	packageDir: string;
	currentExportPath: string;
	exportsMap: Map<string, string>;
	exportMap: Map<string, ExportInfo>;
	entryFilePath: string;
}

/**
 * Resolves jest.mock context for barrel file analysis.
 * Returns null if the mock should not be processed.
 */
function resolveJestMockContext({
	importPath,
	workspaceRoot,
	fs,
	applyToImportsFrom,
}: {
	importPath: string;
	workspaceRoot: string;
	fs: FileSystem;
	applyToImportsFrom: string[];
}): JestMockContext | null {
	if (isRelativeImport(importPath)) {
		return null;
	}

	const packageNameMatch = importPath.match(/^(@[^/]+\/[^/]+)/);
	if (!packageNameMatch) {
		return null;
	}

	const packageName = packageNameMatch[1];
	const subPath = importPath.slice(packageName.length);

	// Find the package (resolution is not constrained by applyToImportsFrom)
	const packageDir = findPackageInRegistry({ packageName, workspaceRoot, fs });
	if (!packageDir) {
		return null;
	}

	// Only check mocks from packages in our applyToImportsFrom folders
	if (!isPackageInApplyToImportsFrom({ packageDir, workspaceRoot, applyToImportsFrom })) {
		return null;
	}

	const exportsMap = parsePackageExports({ packageDir, fs });
	if (exportsMap.size === 0) {
		return null;
	}

	const currentExportPath = subPath ? '.' + subPath : '.';
	const entryFilePath = exportsMap.get(currentExportPath);
	if (!entryFilePath) {
		return null;
	}

	const exportMap = parseBarrelExports({ barrelFilePath: entryFilePath, fs, workspaceRoot });
	if (exportMap.size === 0) {
		return null;
	}

	return {
		importPath,
		packageName,
		packageDir,
		currentExportPath,
		exportsMap,
		exportMap,
		entryFilePath,
	};
}

/**
 * Check if the entry file is a barrel file (re-exports from other files)
 */
function isBarrelFile({
	exportMap,
	entryFilePath,
}: {
	exportMap: Map<string, ExportInfo>;
	entryFilePath: string;
}): boolean {
	return hasReExportsFromOtherFiles({
		exportMap,
		sourceFilePath: entryFilePath,
	});
}

/**
 * Metadata for the ESLint rule
 */
const ruleMeta: Rule.RuleMetaData = {
	type: 'problem',
	docs: {
		description:
			'Disallow jest.mock calls on barrel file entry points. Mock source files directly using package.json exports.',
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
		barrelEntryMock:
			"jest.mock('{{path}}') is mocking a barrel file entry point. Split into separate mocks for each source file using package.json exports.",
		barrelEntryRequireActual:
			"jest.requireActual('{{path}}') references a barrel file entry point. Use a specific package.json export path instead.",
	},
};

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
				CallExpression(rawNode) {
					const node = rawNode as TSESTree.CallExpression;

					// Handle standalone jest.requireActual() calls that reference barrel entries.
					// e.g. jest.requireActual('@atlaskit/pkg').Foo or const { Foo } = jest.requireActual('@atlaskit/pkg')
					if (isJestRequireActual(node)) {
						const raImportPath = extractImportPath(node);
						if (!raImportPath) {
							return;
						}

						const raContext = resolveJestMockContext({
							importPath: raImportPath,
							workspaceRoot,
							fs,
							applyToImportsFrom,
						});
						if (!raContext) {
							return;
						}

						if (
							!isBarrelFile({
								exportMap: raContext.exportMap,
								entryFilePath: raContext.entryFilePath,
							})
						) {
							return;
						}

						// Skip if nested inside a jest.mock() factory that itself targets a barrel —
						// the jest.mock handler already rewrites the entire mock including inner requireActual calls.
						let ancestor: TSESTree.Node | undefined = (
							node as TSESTree.Node & { parent?: TSESTree.Node }
						).parent;
						while (ancestor) {
							if (
								ancestor.type === 'CallExpression' &&
								isJestMockCall(ancestor as TSESTree.CallExpression)
							) {
								const ancestorPath = extractImportPath(ancestor as TSESTree.CallExpression);
								if (ancestorPath) {
									const ancestorCtx = resolveJestMockContext({
										importPath: ancestorPath,
										workspaceRoot,
										fs,
										applyToImportsFrom,
									});
									if (
										ancestorCtx &&
										isBarrelFile({
											exportMap: ancestorCtx.exportMap,
											entryFilePath: ancestorCtx.entryFilePath,
										})
									) {
										return;
									}
								}
							}
							ancestor = (ancestor as TSESTree.Node & { parent?: TSESTree.Node }).parent;
						}

						// Determine which symbols are accessed from the barrel
						const parent = (node as TSESTree.Node & { parent?: TSESTree.Node }).parent;
						const accessedSymbols: string[] = [];

						if (parent?.type === 'MemberExpression' && parent.property.type === 'Identifier') {
							accessedSymbols.push(parent.property.name);
						} else if (
							parent?.type === 'VariableDeclarator' &&
							parent.id.type === 'ObjectPattern'
						) {
							for (const prop of parent.id.properties) {
								if (prop.type === 'Property' && prop.key.type === 'Identifier') {
									accessedSymbols.push(prop.key.name);
								}
							}
						}

						if (accessedSymbols.length === 0) {
							context.report({
								node: node as Rule.Node,
								messageId: 'barrelEntryRequireActual',
								data: { path: raImportPath },
							});
							return;
						}

						const { groupedByExport, crossPackageGroups } = traceSymbolsToExports({
							symbolNames: accessedSymbols,
							exportMap: raContext.exportMap,
							exportsMap: raContext.exportsMap,
							currentExportPath: raContext.currentExportPath,
							fs,
						});

						let newPath: string | null = null;
						if (groupedByExport.size === 1 && crossPackageGroups.size === 0) {
							const [exportPath] = groupedByExport.keys();
							newPath = `${raContext.packageName}${exportPath.slice(1)}`;
						} else if (crossPackageGroups.size === 1 && groupedByExport.size === 0) {
							const [cpImportPath] = crossPackageGroups.keys();
							newPath = cpImportPath;
						}

						const sourceCode = context.getSourceCode();

						if (newPath) {
							const resolvedNewPath = newPath;
							context.report({
								node: node as Rule.Node,
								messageId: 'barrelEntryRequireActual',
								data: { path: raImportPath },
								fix(fixer) {
									const firstArg = node.arguments[0];
									const quote = sourceCode.getText(firstArg as unknown as Rule.Node)[0];
									return fixer.replaceText(
										firstArg as unknown as Rule.Node,
										`${quote}${resolvedNewPath}${quote}`,
									);
								},
							});
						} else {
							context.report({
								node: node as Rule.Node,
								messageId: 'barrelEntryRequireActual',
								data: { path: raImportPath },
							});
						}
						return;
					}

					if (!isJestMockCall(node)) {
						return;
					}

					const importPath = extractImportPath(node);
					if (!importPath) {
						return;
					}

					const mockContext = resolveJestMockContext({
						importPath,
						workspaceRoot,
						fs,
						applyToImportsFrom,
					});
					if (!mockContext) {
						return;
					}

					if (
						!isBarrelFile({
							exportMap: mockContext.exportMap,
							entryFilePath: mockContext.entryFilePath,
						})
					) {
						return;
					}

					const mockImpl = node.arguments[1];
					// Ignore auto-mocks (jest.mock with only the import string and no second argument)
					// These are intentionally excluded from barrel file checks as they auto-mock all exports
					if (!mockImpl) {
						return;
					}

					const mockObjectNode = extractMockImplementation({ mockImpl: mockImpl as TSESTree.Node });
					const sourceCode = context.getSourceCode();
					const { properties: mockProperties } = extractMockProperties({
						sourceCode,
						mockObjectNode,
					});

					// Extract preamble statements (variable declarations before return)
					const preambleStatements = extractPreambleStatements({
						mockImpl: mockImpl as TSESTree.Node,
						sourceCode,
					});

					if (mockProperties.size === 0) {
						return;
					}

					const symbolNames = Array.from(mockProperties.keys());
					const { groupedByExport, crossPackageGroups, unmappedSymbols } = traceSymbolsToExports({
						symbolNames,
						exportMap: mockContext.exportMap,
						exportsMap: mockContext.exportsMap,
						currentExportPath: mockContext.currentExportPath,
						fs,
					});

					// If no symbols can be mapped to specific exports or cross-package sources,
					// there's nothing to fix so don't report an error
					if (groupedByExport.size === 0 && crossPackageGroups.size === 0) {
						return;
					}

					const groups: MockPropertyGroup[] = [];
					for (const [exportPath, symbols] of groupedByExport) {
						// Build name mapping for aliased exports
						const nameMapping = new Map<string, string>();
						for (const s of symbols) {
							if (s.originalName) {
								nameMapping.set(s.symbolName, s.originalName);
							}
						}

						// Check if any symbol in this group is a default export
						const hasDefaultExport = symbols.some((s) => s.originalName === 'default');

						groups.push({
							exportPath,
							importPath: `${mockContext.packageName}${exportPath.slice(1)}`,
							propertyNames: symbols.map((s) => s.symbolName),
							propertyTexts: new Map(
								symbols.map((s) => [s.symbolName, mockProperties.get(s.symbolName)!.text]),
							),
							nameMapping,
							hasDefaultExport,
						});
					}

					// Build cross-package groups
					const crossPackageMockGroups: MockPropertyGroup[] = [];
					for (const [importPath, symbols] of crossPackageGroups) {
						// Build name mapping for aliased exports
						const nameMapping = new Map<string, string>();
						for (const s of symbols) {
							if (s.originalName) {
								nameMapping.set(s.symbolName, s.originalName);
							}
						}

						// Check if any symbol in this group is a default export
						const hasDefaultExport = symbols.some((s) => s.originalName === 'default');

						// Get cross-package source info from the first symbol (all symbols in same group have same source)
						const crossPackageSource = symbols[0].crossPackageSource!;

						crossPackageMockGroups.push({
							exportPath: crossPackageSource.exportPath,
							importPath,
							propertyNames: symbols.map((s) => s.symbolName),
							propertyTexts: new Map(
								symbols.map((s) => [s.symbolName, mockProperties.get(s.symbolName)!.text]),
							),
							nameMapping,
							hasDefaultExport,
						});
					}

					if (unmappedSymbols.length > 0) {
						groups.push({
							exportPath: mockContext.currentExportPath,
							importPath: mockContext.importPath,
							propertyNames: unmappedSymbols,
							propertyTexts: new Map(unmappedSymbols.map((s) => [s, mockProperties.get(s)!.text])),
							nameMapping: new Map(),
							hasDefaultExport: false,
						});
					}

					context.report({
						node: node as Rule.Node,
						messageId: 'barrelEntryMock',
						data: { path: importPath },
						fix(fixer) {
							const firstArg = node.arguments[0];
							const quote = sourceCode.getText(firstArg as unknown as Rule.Node)[0];

							// Build a mapping from old import path to new import paths (with their symbols)
							// so we can update jest.requireMock() calls later
							const oldImportPath = importPath;

							// Find all existing jest.mock calls in the file
							const allExistingMocks = findAllJestMocksInFile({ context });

							// Track nodes to remove and merged mock info
							const nodesToRemove: TSESTree.CallExpression[] = [node];
							const mergedGroups: MockPropertyGroup[] = [];

							for (const group of groups) {
								const existingMock = allExistingMocks.get(group.importPath);

								if (existingMock && existingMock.node !== node) {
									// Merge properties from existing mock with new properties
									const newPropertiesMap = new Map<string, { node: TSESTree.Node; text: string }>();
									for (const propName of group.propertyNames) {
										const propInfo = mockProperties.get(propName);
										if (propInfo) {
											// Check if this property needs to be renamed (aliased export)
											const originalName = group.nameMapping.get(propName);
											if (originalName && originalName !== propName) {
												const renamedText = replacePropertyKey({
													propText: propInfo.text,
													mockName: propName,
													originalName,
												});
												newPropertiesMap.set(originalName, {
													node: propInfo.node,
													text: renamedText,
												});
											} else {
												newPropertiesMap.set(propName, propInfo);
											}
										}
									}

									const mergedProperties = mergeMockProperties({
										existingProperties: existingMock.properties,
										newProperties: newPropertiesMap,
									});

									// Create merged group with all properties
									mergedGroups.push({
										exportPath: group.exportPath,
										importPath: group.importPath,
										propertyNames: Array.from(mergedProperties.keys()),
										propertyTexts: new Map(
											Array.from(mergedProperties.entries()).map(([k, v]) => [k, v.text]),
										),
										nameMapping: new Map(), // Already applied above
										hasDefaultExport: group.hasDefaultExport,
									});

									// Mark existing mock for removal
									nodesToRemove.push(existingMock.node);
								} else {
									// No existing mock, use the group as-is
									mergedGroups.push(group);
								}
							}

							let fixText = generateMockFixes({
								groups: mergedGroups,
								crossPackageGroups: crossPackageMockGroups,
								packageName: mockContext.packageName,
								mockProperties,
								quote,
								preambleStatements,
							});

							// Build a map of symbol name -> new import path for jest.requireMock() rewriting
							const symbolToNewImportPath = new Map<string, string>();
							for (const group of [...mergedGroups, ...crossPackageMockGroups]) {
								for (const propName of group.propertyNames) {
									symbolToNewImportPath.set(propName, group.importPath);
								}
							}

							// Post-process fixText to update jest.requireActual('barrel').Symbol
							// references embedded in property texts (e.g. inside jest.fn callbacks)
							fixText = fixText.replace(
								/jest\.requireActual(?:<[^>]*>)?\((['"])([^'"]+)\1\)\.(\w+)/g,
								(match, _q, path, symbol) => {
									if (path !== oldImportPath) {
										return match;
									}
									const newPath = symbolToNewImportPath.get(symbol);
									if (newPath && newPath !== path) {
										return match.replace(path, newPath);
									}
									return match;
								},
							);

							// Sort nodes by position
							const sortedNodesToRemove = nodesToRemove.sort((a, b) => {
								return (a.range?.[0] ?? 0) - (b.range?.[0] ?? 0);
							});

							const fixes: Rule.Fix[] = [];

							if (sortedNodesToRemove.length === 1) {
								// Simple case: just replace the current node
								fixes.push(fixer.replaceText(node as Rule.Node, fixText));
							} else {
								// Complex case: replace first node, remove others
								// Replace the first node with the merged mocks
								fixes.push(fixer.replaceText(sortedNodesToRemove[0] as Rule.Node, fixText));

								// Remove remaining nodes
								for (let i = 1; i < sortedNodesToRemove.length; i++) {
									const nodeToRemove = sortedNodesToRemove[i];
									const tokenAfter = sourceCode.getTokenAfter(nodeToRemove as Rule.Node);

									let startPos = nodeToRemove.range![0];
									let endPos = nodeToRemove.range![1];

									// Include trailing semicolon if present
									if (tokenAfter && tokenAfter.type === 'Punctuator' && tokenAfter.value === ';') {
										endPos = tokenAfter.range[1];
									}

									// Include trailing whitespace and newlines
									const text = sourceCode.getText();
									while (endPos < text.length && /[\s\n]/.test(text[endPos])) {
										endPos++;
									}

									fixes.push(fixer.removeRange([startPos, endPos]));
								}
							}

							// Fix jest.requireMock() calls that reference the old barrel path.
							// When we split a jest.mock('pkg/barrel') into jest.mock('pkg/subpath'),
							// any jest.requireMock('pkg/barrel') calls also need to be updated.
							const ast = sourceCode.ast as TSESTree.Program;
							const requireMockCalls = findJestRequireMockCalls({
								ast,
								matchPath: (candidatePath) => candidatePath === oldImportPath,
							});

							for (const requireMockNode of requireMockCalls) {
								const requireMockArg = requireMockNode.arguments[0];
								if (!requireMockArg) {
									continue;
								}

								const newPath = resolveNewPathForRequireMock({
									requireMockNode,
									symbolToNewPath: symbolToNewImportPath,
								});

								if (newPath) {
									fixes.push(
										fixer.replaceText(requireMockArg as Rule.Node, `${quote}${newPath}${quote}`),
									);
								}
							}

							// Fix jest.requireActual() calls that reference the old barrel path.
							// Only fix calls OUTSIDE the replaced jest.mock node range
							// (calls inside it are handled via fixText string replacement below).
							const replacedRanges = sortedNodesToRemove.map((n) => n.range!);
							const requireActualCalls = findJestRequireActualCalls({
								ast,
								matchPath: (candidatePath) => candidatePath === oldImportPath,
							});

							for (const raNode of requireActualCalls) {
								const raArg = raNode.arguments[0];
								if (!raArg || !raNode.range) {
									continue;
								}

								// Skip calls inside any node being replaced (ranges overlap)
								const insideReplacedNode = replacedRanges.some(
									([start, end]) => raNode.range![0] >= start && raNode.range![1] <= end,
								);
								if (insideReplacedNode) {
									continue;
								}

								const newPath = resolveNewPathForRequireMock({
									requireMockNode: raNode,
									symbolToNewPath: symbolToNewImportPath,
								});

								if (newPath) {
									fixes.push(fixer.replaceText(raArg as Rule.Node, `${quote}${newPath}${quote}`));
								}
							}

							return fixes;
						},
					});
				},
			};
		},
	};
}

const rule: Rule.RuleModule = createRule(realFileSystem);

export default rule;
