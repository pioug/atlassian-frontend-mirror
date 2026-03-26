import { dirname, relative } from 'path';

import type { TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import * as ts from 'typescript';

import { hasReExportsFromOtherFiles, parseBarrelExports } from '../shared/barrel-parsing';
import { findWorkspaceRoot, isRelativeImport, resolveImportPath } from '../shared/file-system';
import {
	extractImportPath,
	findJestRequireMockCalls,
	isJestMockCall,
	isJestRequireActual,
	resolveNewPathForRequireMock,
} from '../shared/jest-utils';
import { findPackageInRegistry } from '../shared/package-registry';
import { findExportForSourceFile, parsePackageExports } from '../shared/package-resolution';
import { type ExportInfo, type FileSystem, realFileSystem } from '../shared/types';

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

/**
 * Information about a mock factory's preamble (statements before the return)
 */
interface MockFactoryPreamble {
	/** The source text of all statements before the return statement */
	text: string;
	/** Whether the factory has a preamble (non-return statements) */
	hasPreamble: boolean;
	/** Individual preamble statements with their text and defined identifiers */
	statements: Array<{
		text: string;
		/** Identifiers defined by this statement (e.g., variable names) */
		definedIdentifiers: Set<string>;
	}>;
}

/**
 * Extract identifiers defined by a statement (e.g., variable declarations)
 * Uses TypeScript AST to find declared identifiers.
 */
function extractDefinedIdentifiers(statementText: string): Set<string> {
	const identifiers = new Set<string>();

	try {
		// Parse the statement as a mini source file
		const sourceFile = ts.createSourceFile('temp.ts', statementText, ts.ScriptTarget.Latest, true);

		const visit = (node: ts.Node): void => {
			if (ts.isVariableStatement(node)) {
				for (const decl of node.declarationList.declarations) {
					if (ts.isIdentifier(decl.name)) {
						identifiers.add(decl.name.text);
					} else if (ts.isObjectBindingPattern(decl.name)) {
						// Handle destructuring: const { a, b } = ...
						for (const element of decl.name.elements) {
							if (ts.isBindingElement(element) && ts.isIdentifier(element.name)) {
								identifiers.add(element.name.text);
							}
						}
					} else if (ts.isArrayBindingPattern(decl.name)) {
						// Handle array destructuring: const [a, b] = ...
						for (const element of decl.name.elements) {
							if (ts.isBindingElement(element) && ts.isIdentifier(element.name)) {
								identifiers.add(element.name.text);
							}
						}
					}
				}
			} else if (ts.isFunctionDeclaration(node) && node.name) {
				identifiers.add(node.name.text);
			} else if (ts.isClassDeclaration(node) && node.name) {
				identifiers.add(node.name.text);
			}
			ts.forEachChild(node, visit);
		};

		ts.forEachChild(sourceFile, visit);
	} catch {
		// Ignore parsing errors
	}

	return identifiers;
}

/**
 * Find all identifiers used in a given text string.
 * Uses a simple regex approach to find potential identifier references.
 */
function findUsedIdentifiers(text: string, potentialIdentifiers: Set<string>): Set<string> {
	const used = new Set<string>();

	for (const identifier of potentialIdentifiers) {
		// Use word boundary matching to find identifier usage
		// This matches the identifier as a whole word (not part of another word)
		const regex = new RegExp(`\\b${escapeRegExpForIdentifier(identifier)}\\b`);
		if (regex.test(text)) {
			used.add(identifier);
		}
	}

	return used;
}

/**
 * Escape special regex characters for identifier matching
 */
function escapeRegExpForIdentifier(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Filter preamble statements to only include those whose defined identifiers
 * are used in the given property texts.
 */
function filterPreambleForProperties(
	preamble: MockFactoryPreamble,
	propertyTexts: string[],
): MockFactoryPreamble {
	if (!preamble.hasPreamble || preamble.statements.length === 0) {
		return preamble;
	}

	// Collect all identifiers defined in the preamble
	const allDefinedIdentifiers = new Set<string>();
	for (const stmt of preamble.statements) {
		for (const id of stmt.definedIdentifiers) {
			allDefinedIdentifiers.add(id);
		}
	}

	// Find which identifiers are used in the property texts
	const combinedPropertyText = propertyTexts.join('\n');
	const usedIdentifiers = findUsedIdentifiers(combinedPropertyText, allDefinedIdentifiers);

	// Filter statements to only those that define used identifiers
	const filteredStatements = preamble.statements.filter((stmt) => {
		// Include statement if any of its defined identifiers are used
		for (const id of stmt.definedIdentifiers) {
			if (usedIdentifiers.has(id)) {
				return true;
			}
		}
		return false;
	});

	if (filteredStatements.length === 0) {
		return { text: '', hasPreamble: false, statements: [] };
	}

	return {
		text: filteredStatements.map((s) => s.text).join('\n\t'),
		hasPreamble: true,
		statements: filteredStatements,
	};
}

/**
 * Convert absolute file path to an import path, handling cross-package resolution.
 * If the export comes from a cross-package source, returns the package path (e.g., '@atlassian/package-b/utils').
 * Otherwise, returns a relative path.
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
			? findExportForSourceFile({ sourceFilePath, exportsMap })?.exportPath
			: null;

		return targetExportPath ? crossPackageName + targetExportPath.slice(1) : crossPackageName;
	}

	return getRelativeImportPath({ basedir, absolutePath: sourceFilePath, originalImportPath });
}

/**
 * Convert absolute file path back to relative import path
 */
function getRelativeImportPath({
	basedir,
	absolutePath,
	originalImportPath,
}: {
	basedir: string;
	absolutePath: string;
	originalImportPath: string;
}): string {
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
 * Check if a node is an Object.assign call
 */
function isObjectAssignCall(node: TSESTree.Node): node is TSESTree.CallExpression {
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
 * Extract mock object from Object.assign pattern
 * Pattern: Object.assign({}, jest.requireActual(...), { mockProps })
 * Returns the properties object and whether it has requireActual
 */
function extractObjectAssignMock(node: TSESTree.CallExpression): {
	propertiesObject: TSESTree.ObjectExpression | null;
	hasRequireActual: boolean;
} {
	const args = node.arguments;

	// Object.assign typically has at least 2 arguments: target and source(s)
	// Pattern: Object.assign({}, jest.requireActual(...), { mockProps })
	// or: Object.assign({}, jest.requireActual(...), { mockProps1 }, { mockProps2 })
	if (args.length < 2) {
		return { propertiesObject: null, hasRequireActual: false };
	}

	let hasRequireActual = false;
	let lastObjectExpression: TSESTree.ObjectExpression | null = null;

	// Scan through arguments to find jest.requireActual and the last object literal
	for (const arg of args) {
		if (isJestRequireActual(arg as TSESTree.Node)) {
			hasRequireActual = true;
		}
		if (arg.type === 'ObjectExpression') {
			// Skip empty objects (the first {} in Object.assign({}, ...))
			if (arg.properties.length > 0) {
				lastObjectExpression = arg;
			}
		}
	}

	return { propertiesObject: lastObjectExpression, hasRequireActual };
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
	properties: Map<string, { node: TSESTree.Node; text: string; valueText: string }>;
	hasRequireActual: boolean;
} {
	const properties = new Map<string, { node: TSESTree.Node; text: string; valueText: string }>();
	let hasRequireActual = false;

	// Handle Object.assign pattern: Object.assign({}, jest.requireActual(...), { props })
	if (isObjectAssignCall(mockObjectNode)) {
		const { propertiesObject, hasRequireActual: objectAssignHasRequireActual } =
			extractObjectAssignMock(mockObjectNode);
		if (propertiesObject) {
			// Recursively extract properties from the properties object
			const result = extractMockProperties({ sourceCode, mockObjectNode: propertiesObject });
			return {
				properties: result.properties,
				hasRequireActual: objectAssignHasRequireActual || result.hasRequireActual,
			};
		}
		return { properties, hasRequireActual: objectAssignHasRequireActual };
	}

	if (mockObjectNode.type === 'ObjectExpression') {
		for (const prop of mockObjectNode.properties) {
			if (prop.type === 'SpreadElement') {
				// Check if this is ...jest.requireActual(...)
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
				const valueText = sourceCode.getText(prop.value as unknown as Rule.Node);
				properties.set(keyName, {
					node: prop,
					text: propText,
					valueText,
				});
			}
		}
	}

	return { properties, hasRequireActual };
}

/**
 * Validate and resolve a barrel file from an import path
 * Returns null if not a valid relative barrel import
 */
export function validateAndResolveBarrelFile({
	importPath,
	basedir,
	workspaceRoot,
	fs,
}: {
	importPath: string;
	basedir: string;
	workspaceRoot: string;
	fs: FileSystem;
}): { resolvedPath: string; exportMap: Map<string, ExportInfo> } | null {
	if (!isRelativeImport(importPath)) {
		return null;
	}

	const resolvedPath = resolveImportPath({ basedir, importPath, fs });
	if (!resolvedPath) {
		return null;
	}

	const exportMap = parseBarrelExports({ barrelFilePath: resolvedPath, workspaceRoot, fs });
	if (exportMap.size === 0) {
		return null;
	}

	// A file is considered a barrel file if it has re-exports from other files.
	// This is the semantic check - we don't care about the filename.
	if (!hasReExportsFromOtherFiles({ exportMap, sourceFilePath: resolvedPath })) {
		return null;
	}

	return { resolvedPath, exportMap };
}

/**
 * Extract the mock implementation object from the jest.mock call
 */
function extractMockImplementation(mockImpl: TSESTree.Node): TSESTree.Node {
	if (mockImpl.type === 'ArrowFunctionExpression') {
		if (mockImpl.body.type === 'ObjectExpression') {
			return mockImpl.body;
		}
		// Handle arrow functions that return a call expression directly (e.g., Object.assign)
		if (mockImpl.body.type === 'CallExpression') {
			return mockImpl.body;
		}
		if (mockImpl.body.type === 'BlockStatement') {
			const returnStmt = mockImpl.body.body.find(
				(s: TSESTree.Statement): s is TSESTree.ReturnStatement => s.type === 'ReturnStatement',
			);
			if (returnStmt?.argument) {
				return returnStmt.argument;
			}
		}
	}
	if (mockImpl.type === 'FunctionExpression' && mockImpl.body.type === 'BlockStatement') {
		const returnStmt = mockImpl.body.body.find(
			(s: TSESTree.Statement): s is TSESTree.ReturnStatement => s.type === 'ReturnStatement',
		);
		if (returnStmt?.argument) {
			return returnStmt.argument;
		}
	}
	return mockImpl;
}

/**
 * Extract the preamble (statements before the return) from a mock factory function.
 * This captures variable declarations, assignments, etc. that need to be preserved.
 */
function extractMockFactoryPreamble({
	mockImpl,
	sourceCode,
}: {
	mockImpl: TSESTree.Node;
	sourceCode: Rule.RuleContext['sourceCode'];
}): MockFactoryPreamble {
	const emptyPreamble: MockFactoryPreamble = { text: '', hasPreamble: false, statements: [] };

	// Get the block statement body from the mock factory
	let blockBody: TSESTree.Statement[] | null = null;

	if (
		(mockImpl.type === 'ArrowFunctionExpression' || mockImpl.type === 'FunctionExpression') &&
		mockImpl.body.type === 'BlockStatement'
	) {
		blockBody = mockImpl.body.body;
	}

	if (!blockBody) {
		return emptyPreamble;
	}

	// Find the return statement index
	const returnIndex = blockBody.findIndex(
		(s): s is TSESTree.ReturnStatement => s.type === 'ReturnStatement',
	);

	if (returnIndex <= 0) {
		// No preamble (return is first statement or not found)
		return emptyPreamble;
	}

	// Extract all statements before the return
	const preambleStatements = blockBody.slice(0, returnIndex);
	const statementsWithIdentifiers = preambleStatements.map((stmt) => {
		const text = sourceCode.getText(stmt as unknown as Rule.Node);
		const definedIdentifiers = extractDefinedIdentifiers(text);
		return { text, definedIdentifiers };
	});

	const preambleTexts = statementsWithIdentifiers.map((s) => s.text);

	return {
		text: preambleTexts.join('\n\t'),
		hasPreamble: true,
		statements: statementsWithIdentifiers,
	};
}

/**
 * Rewrite jest.requireActual paths in a text string from the original barrel path to a new path.
 */
function rewriteRequireActualPaths({
	text,
	originalPath,
	newPath,
	quote,
}: {
	text: string;
	originalPath: string;
	newPath: string;
	quote: string;
}): string {
	// Match jest.requireActual('originalPath') or jest.requireActual("originalPath")
	// Also handle the 'as Object' or 'as any' type assertions
	const patterns = [
		// With single quotes
		new RegExp(
			`jest\\.requireActual\\(\\s*'${escapeRegExp(originalPath)}'\\s*\\)(?:\\s+as\\s+\\w+)?`,
			'g',
		),
		// With double quotes
		new RegExp(
			`jest\\.requireActual\\(\\s*"${escapeRegExp(originalPath)}"\\s*\\)(?:\\s+as\\s+\\w+)?`,
			'g',
		),
	];

	let result = text;
	for (const pattern of patterns) {
		result = result.replace(pattern, `jest.requireActual(${quote}${newPath}${quote})`);
	}
	return result;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Group mocked properties by their source file
 */
function groupPropertiesBySource({
	mockProperties,
	exportMap,
}: {
	mockProperties: Map<string, { node: TSESTree.Node; text: string }>;
	exportMap: Map<string, ExportInfo>;
}): Map<string, string[]> {
	const propertiesBySource = new Map<string, string[]>();

	for (const [propName] of mockProperties) {
		const exportInfo = exportMap.get(propName);
		if (!exportInfo) {
			continue;
		}

		if (!propertiesBySource.has(exportInfo.path)) {
			propertiesBySource.set(exportInfo.path, []);
		}
		propertiesBySource.get(exportInfo.path)!.push(propName);
	}

	return propertiesBySource;
}

/**
 * Determine if we should report a barrel mock violation
 */
function shouldReportBarrelMock({
	propertiesBySource,
	barrelFilePath,
}: {
	propertiesBySource: Map<string, string[]>;
	barrelFilePath: string;
}): boolean {
	// Report if any mocked property is a re-export (comes from a different file than the barrel)
	// This catches both:
	// 1. Properties from multiple source files
	// 2. Properties from a single source file that isn't the barrel itself
	for (const sourcePath of propertiesBySource.keys()) {
		if (sourcePath !== barrelFilePath) {
			return true;
		}
	}
	return false;
}

/**
 * Generate auto-fix for auto-mock case (no mock implementation)
 */
function generateAutoMockFix({
	exportMap,
	basedir,
	importPath,
	quote,
	workspaceRoot,
	fs,
}: {
	exportMap: Map<string, ExportInfo>;
	basedir: string;
	importPath: string;
	quote: string;
	workspaceRoot: string;
	fs: FileSystem;
}): string {
	// Group exports by source file, filtering out type-only source files
	// Also track the ExportInfo for cross-package resolution
	const sourceFilesWithInfo = new Map<string, ExportInfo>();
	for (const [, info] of exportMap) {
		if (!info.isTypeOnly && !sourceFilesWithInfo.has(info.path)) {
			sourceFilesWithInfo.set(info.path, info);
		}
	}

	const sourceFileArray = Array.from(sourceFilesWithInfo.entries());
	return sourceFileArray
		.map(([sourceFile, exportInfo]) => {
			const mockPath = getImportPathForSourceFile({
				sourceFilePath: sourceFile,
				basedir,
				originalImportPath: importPath,
				exportInfo,
				workspaceRoot,
				fs,
			});
			return `jest.mock(${quote}${mockPath}${quote})`;
		})
		.join(';\n');
}

/**
 * Normalize a path for comparison (resolve to absolute path)
 */
function normalizePathForComparison({
	basedir,
	importPath,
	fs,
}: {
	basedir: string;
	importPath: string;
	fs: FileSystem;
}): string {
	if (!isRelativeImport(importPath)) {
		// For non-relative imports, just return as-is for comparison
		return importPath;
	}
	const resolved = resolveImportPath({ basedir, importPath, fs });
	return resolved || importPath;
}

/**
 * Scan the entire file for all existing jest.mock calls
 * Returns a map of normalized path -> { node, properties, hasRequireActual }
 */
function findAllJestMocksInFile({
	context,
	basedir,
	fs,
}: {
	context: Rule.RuleContext;
	basedir: string;
	fs: FileSystem;
}): Map<
	string,
	{
		node: TSESTree.CallExpression;
		importPath: string;
		properties: Map<string, { node: TSESTree.Node; text: string; valueText: string }>;
		hasRequireActual: boolean;
	}
> {
	const allMocks = new Map();
	const sourceCode = context.getSourceCode();
	const ast = sourceCode.ast as unknown as TSESTree.Program;

	// Use a visited set to prevent infinite recursion
	const visited = new Set<TSESTree.Node>();

	// Properties to skip to avoid circular references
	const skipKeys = new Set(['parent', 'loc', 'range', 'tokens', 'comments']);

	function visitNode(node: TSESTree.Node) {
		// Prevent revisiting nodes
		if (visited.has(node)) {
			return;
		}
		visited.add(node);

		if (node.type === 'CallExpression' && isJestMockCall(node)) {
			const importPath = extractImportPath(node);
			if (importPath) {
				const normalizedPath = normalizePathForComparison({ basedir, importPath, fs });
				const mockImpl = node.arguments[1];

				if (mockImpl) {
					const mockObjectNode = extractMockImplementation(mockImpl);
					const { properties, hasRequireActual } = extractMockProperties({
						sourceCode,
						mockObjectNode,
					});
					allMocks.set(normalizedPath, {
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
			const value = (node as any)[key];
			if (value && typeof value === 'object') {
				if (Array.isArray(value)) {
					value.forEach((child) => {
						if (child && typeof child === 'object' && 'type' in child) {
							visitNode(child);
						}
					});
				} else if ('type' in value) {
					visitNode(value);
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
	existingProperties: Map<string, { node: TSESTree.Node; text: string; valueText: string }>;
	newProperties: Map<string, { node: TSESTree.Node; text: string; valueText: string }>;
}): Map<string, { node: TSESTree.Node; text: string; valueText: string }> {
	const merged = new Map(existingProperties);
	for (const [key, value] of newProperties) {
		merged.set(key, value);
	}
	return merged;
}

/**
 * Generate mock call text for a specific file with given properties
 */
function generateMockCallText({
	relativePath,
	properties,
	hasRequireActual,
	quote,
	exportMap,
	sourceFile,
	preamble,
	originalImportPath,
}: {
	relativePath: string;
	properties: Map<string, { node: TSESTree.Node; text: string; valueText: string }>;
	hasRequireActual: boolean;
	quote: string;
	exportMap: Map<string, ExportInfo>;
	sourceFile: string;
	preamble?: MockFactoryPreamble;
	originalImportPath?: string;
}): string {
	const propNames = Array.from(properties.keys());

	// Separate props by whether they're from default exports
	const defaultExportProps: string[] = [];
	const namedExportProps: string[] = [];

	for (const prop of propNames) {
		const exportInfo = Array.from(exportMap.entries()).find(
			([exportName, info]) => exportName === prop && info.path === sourceFile,
		);
		if (exportInfo && exportInfo[1].isDefaultExport) {
			defaultExportProps.push(prop);
		} else {
			namedExportProps.push(prop);
		}
	}

	// Collect all property texts for filtering the preamble
	const allPropertyTexts: string[] = [];
	for (const prop of namedExportProps) {
		const propText = properties.get(prop)?.text;
		if (propText) {
			allPropertyTexts.push(propText);
		}
	}
	for (const prop of defaultExportProps) {
		const propText = properties.get(prop)?.valueText;
		if (propText) {
			allPropertyTexts.push(propText);
		}
	}

	// Filter preamble to only include statements used by this mock's properties
	const filteredPreamble = preamble
		? filterPreambleForProperties(preamble, allPropertyTexts)
		: undefined;

	// If we have a preamble, we need to use block body syntax with return statement
	if (filteredPreamble?.hasPreamble) {
		// Rewrite any jest.requireActual paths in the preamble
		let preambleText = filteredPreamble.text;
		if (originalImportPath) {
			preambleText = rewriteRequireActualPaths({
				text: preambleText,
				originalPath: originalImportPath,
				newPath: relativePath,
				quote,
			});
		}

		// Rewrite any jest.requireActual paths in property values
		const rewrittenMockObjectProps = namedExportProps
			.map((p) => {
				let propText = properties.get(p)?.text;
				if (propText && originalImportPath) {
					propText = rewriteRequireActualPaths({
						text: propText,
						originalPath: originalImportPath,
						newPath: relativePath,
						quote,
					});
				}
				return propText;
			})
			.filter((p): p is string => !!p);

		const mockContentLines: string[] = [];
		if (hasRequireActual) {
			mockContentLines.push(`...jest.requireActual(${quote}${relativePath}${quote})`);
		}
		mockContentLines.push(...rewrittenMockObjectProps);

		const formattedContent = mockContentLines.map((line) => `\t\t${line},`).join('\n');
		return `jest.mock(${quote}${relativePath}${quote}, () => {\n\t${preambleText}\n\treturn {\n${formattedContent}\n\t};\n})`;
	}

	// Generate the mock (original logic for simple cases without preamble)
	let mockCall: string;

	if (defaultExportProps.length > 0 && namedExportProps.length === 0) {
		// All props are from default export
		if (defaultExportProps.length === 1) {
			// Single default export - use __esModule pattern
			const mockText = properties.get(defaultExportProps[0])?.valueText || '';
			mockCall = `jest.mock(${quote}${relativePath}${quote}, () => ({\n\t__esModule: true,\n\tdefault: ${mockText}\n}))`;
		} else {
			// Multiple props from same default - shouldn't happen, but handle it
			const mockTexts = defaultExportProps.map((p) => properties.get(p)?.text).join(',\n\t');
			mockCall = `jest.mock(${quote}${relativePath}${quote}, () => ({\n\t${mockTexts}\n}))`;
		}
	} else if (defaultExportProps.length === 0 && namedExportProps.length > 0) {
		// All props are named exports
		const mockObjectProps = namedExportProps
			.map((p) => properties.get(p)?.text)
			.filter((p): p is string => !!p);

		const mockContentLines: string[] = [];
		if (hasRequireActual) {
			mockContentLines.push(`...jest.requireActual(${quote}${relativePath}${quote})`);
		}
		mockContentLines.push(...mockObjectProps);

		if (mockContentLines.length === 1 && mockContentLines[0].length < 60) {
			mockCall = `jest.mock(${quote}${relativePath}${quote}, () => ({ ${mockContentLines[0]} }))`;
		} else {
			const formattedContent = mockContentLines.map((line) => `\t${line},`).join('\n');
			mockCall = `jest.mock(${quote}${relativePath}${quote}, () => ({\n${formattedContent}\n}))`;
		}
	} else {
		// Mixed: has both default and named exports
		const defaultMock = defaultExportProps.map((p) => properties.get(p)?.valueText).join(', ');
		const namedMocks = namedExportProps
			.map((p) => properties.get(p)?.text)
			.filter((p): p is string => !!p);

		const mockContentLines: string[] = [
			`__esModule: true`,
			`default: ${defaultMock}`,
			...namedMocks,
		];
		if (hasRequireActual) {
			mockContentLines.unshift(`...jest.requireActual(${quote}${relativePath}${quote})`);
		}

		const formattedContent = mockContentLines.map((line) => `\t${line},`).join('\n');
		mockCall = `jest.mock(${quote}${relativePath}${quote}, () => ({\n${formattedContent}\n}))`;
	}

	return mockCall;
}

/**
 * Generate auto-fix for mock with implementation
 */
function generateMockImplementationFix({
	propertiesBySource,
	mockProperties,
	hasRequireActual,
	basedir,
	importPath,
	quote,
	exportMap,
	context,
	currentNode,
	preamble,
	workspaceRoot,
	fs,
}: {
	propertiesBySource: Map<string, string[]>;
	mockProperties: Map<string, { node: TSESTree.Node; text: string; valueText: string }>;
	hasRequireActual: boolean;
	basedir: string;
	importPath: string;
	quote: string;
	exportMap: Map<string, ExportInfo>;
	context: Rule.RuleContext;
	currentNode: TSESTree.CallExpression;
	preamble: MockFactoryPreamble;
	workspaceRoot: string;
	fs: FileSystem;
}): Rule.Fix[] {
	const sourceFilesToMock = Array.from(propertiesBySource.entries());

	// Find all existing jest.mock calls in the file
	const allExistingMocks = findAllJestMocksInFile({ context, basedir, fs });

	// Track which nodes we need to remove and what mock calls to generate
	const nodesToRemove = new Set<TSESTree.CallExpression>();
	const mergedMocks = new Map<
		string,
		{
			mockPath: string;
			properties: Map<string, { node: TSESTree.Node; text: string; valueText: string }>;
			hasRequireActual: boolean;
		}
	>();

	// Always remove the current barrel mock node
	nodesToRemove.add(currentNode);

	// Process each source file we're creating mocks for
	for (const [sourceFile, props] of sourceFilesToMock) {
		// Find the ExportInfo for this source file to get cross-package info
		const exportInfoForSource = Array.from(exportMap.values()).find(
			(info) => info.path === sourceFile,
		);
		const mockPath = getImportPathForSourceFile({
			sourceFilePath: sourceFile,
			basedir,
			originalImportPath: importPath,
			exportInfo: exportInfoForSource ?? null,
			workspaceRoot,
			fs,
		});
		const normalizedPath = normalizePathForComparison({ basedir, importPath: mockPath, fs });

		// Get properties for this source file from the barrel mock
		const newProperties = new Map<
			string,
			{ node: TSESTree.Node; text: string; valueText: string }
		>();
		for (const prop of props) {
			const propInfo = mockProperties.get(prop);
			if (propInfo) {
				newProperties.set(prop, propInfo);
			}
		}

		// Check if there's already a mock for this path
		const existingMock = allExistingMocks.get(normalizedPath);
		if (existingMock && existingMock.node !== currentNode) {
			// Merge properties from existing mock with new properties
			const mergedProperties = mergeMockProperties({
				existingProperties: existingMock.properties,
				newProperties,
			});
			mergedMocks.set(normalizedPath, {
				mockPath,
				properties: mergedProperties,
				hasRequireActual: existingMock.hasRequireActual || hasRequireActual,
			});
			// Mark the existing mock node for removal
			nodesToRemove.add(existingMock.node);
		} else {
			// No existing mock, just use the new properties
			// For newly created mocks from barrel file splits, always include jest.requireActual.
			// This ensures that any properties not explicitly mocked will still be included from the original module.
			mergedMocks.set(normalizedPath, {
				mockPath,
				properties: newProperties,
				hasRequireActual: true,
			});
		}
	}

	// Generate mock calls for all merged mocks
	const replacementParts: string[] = [];
	for (const [, mockInfo] of mergedMocks) {
		// Find the source file for this mock path (may be relative or cross-package)
		// For cross-package paths (starting with @), we don't need to resolve
		const isCrossPackagePath = mockInfo.mockPath.startsWith('@');
		const absolutePath = isCrossPackagePath
			? null
			: resolveImportPath({ basedir, importPath: mockInfo.mockPath, fs });
		if (!isCrossPackagePath && !absolutePath) {
			continue;
		}

		const mockCall = generateMockCallText({
			relativePath: mockInfo.mockPath,
			properties: mockInfo.properties,
			hasRequireActual: mockInfo.hasRequireActual,
			quote,
			exportMap,
			sourceFile: absolutePath ?? mockInfo.mockPath,
			preamble,
			originalImportPath: importPath,
		});
		replacementParts.push(mockCall);
	}

	const replacementText = replacementParts.join(';\n');

	// Build a map of symbol name -> new mock path for jest.requireMock() rewriting
	const symbolToNewMockPath = new Map<string, string>();
	for (const [, mockInfo] of mergedMocks) {
		for (const propName of mockInfo.properties.keys()) {
			symbolToNewMockPath.set(propName, mockInfo.mockPath);
		}
	}

	// Create fixes: remove all nodes except the first, replace the first with merged mocks
	const fixes: Rule.Fix[] = [];
	const sortedNodesToRemove = Array.from(nodesToRemove).sort((a, b) => {
		return (a.range?.[0] ?? 0) - (b.range?.[0] ?? 0);
	});

	if (sortedNodesToRemove.length > 0) {
		// Replace the first node with all the merged mocks
		const firstNode = sortedNodesToRemove[0];
		fixes.push({
			range: firstNode.range as [number, number],
			text: replacementText,
		});

		// Remove all other nodes (subsequent duplicates)
		for (let i = 1; i < sortedNodesToRemove.length; i++) {
			const nodeToRemove = sortedNodesToRemove[i];
			// Find the statement that contains this node to remove the entire line
			const sourceCode = context.getSourceCode();
			const tokenAfter = sourceCode.getTokenAfter(nodeToRemove as Rule.Node);

			// Try to remove the entire statement including semicolon and newline
			let startPos = nodeToRemove.range![0];
			let endPos = nodeToRemove.range![1];

			// Include trailing semicolon if present
			if (tokenAfter && tokenAfter.type === 'Punctuator' && tokenAfter.value === ';') {
				endPos = tokenAfter.range[1];
			}

			// Include trailing/leading whitespace and newlines
			const text = sourceCode.getText();
			while (endPos < text.length && /[\s\n]/.test(text[endPos])) {
				endPos++;
			}

			fixes.push({
				range: [startPos, endPos] as [number, number],
				text: '',
			});
		}
	}

	// Fix jest.requireMock() calls that reference the old barrel path.
	// When we split a jest.mock('./barrel') into jest.mock('./specific-file'),
	// any jest.requireMock('./barrel') calls also need to be updated.
	const ast = context.getSourceCode().ast as TSESTree.Program;
	const normalizedTarget = normalizePathForComparison({ basedir, importPath, fs });
	const requireMockCalls = findJestRequireMockCalls({
		ast,
		matchPath: (candidatePath) =>
			normalizePathForComparison({ basedir, importPath: candidatePath, fs }) === normalizedTarget,
	});

	for (const requireMockNode of requireMockCalls) {
		const requireMockArg = requireMockNode.arguments[0];
		if (!requireMockArg) {
			continue;
		}

		const newPath = resolveNewPathForRequireMock({
			requireMockNode,
			symbolToNewPath: symbolToNewMockPath,
		});

		if (newPath) {
			fixes.push({
				range: requireMockArg.range as [number, number],
				text: `${quote}${newPath}${quote}`,
			});
		}
	}

	return fixes;
}

/**
 * Metadata for the ESLint rule
 */
const ruleMeta: Rule.RuleMetaData = {
	type: 'problem',
	docs: {
		description:
			'Warn when jest.mock is used on a relative import path from a barrel file, and provide an auto-fix to split mocks by source file.',
		category: 'Best Practices',
		recommended: false,
	},
	fixable: 'code',
	messages: {
		barrelMock:
			"jest.mock('{{path}}') is mocking a barrel file. This should be split into separate mocks for each source file to improve performance. Use auto-fix to resolve.",
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
			return {
				CallExpression(rawNode) {
					const node = rawNode as TSESTree.CallExpression;

					// Step 1: Validate this is a jest.mock call
					if (!isJestMockCall(node)) {
						return;
					}

					// Step 2: Extract the import path
					const importPath = extractImportPath(node);
					if (!importPath) {
						return;
					}

					// Step 3: Validate and resolve barrel file
					const basedir = dirname(context.filename);
					const workspaceRoot = findWorkspaceRoot({ startPath: basedir, fs });
					const barrelInfo = validateAndResolveBarrelFile({
						importPath,
						basedir,
						workspaceRoot,
						fs,
					});
					if (!barrelInfo) {
						return;
					}

					const { exportMap, resolvedPath: barrelFilePath } = barrelInfo;
					const sourceCode = context.getSourceCode();
					const firstArg = node.arguments[0];

					// Step 4: Handle auto-mock case (no mock implementation)
					const mockImpl = node.arguments[1];
					if (!mockImpl) {
						// Group exports by source file, filtering out type-only source files
						const sourceFilesWithNonTypeExports = new Set<string>();
						for (const [, info] of exportMap) {
							if (!info.isTypeOnly) {
								sourceFilesWithNonTypeExports.add(info.path);
							}
						}

						if (sourceFilesWithNonTypeExports.size === 0) {
							return;
						}

						context.report({
							node: node as Rule.Node,
							messageId: 'barrelMock',
							data: { path: importPath },
							fix(fixer) {
								const quote = sourceCode.getText(firstArg as Rule.Node)[0];
								const replacement = generateAutoMockFix({
									exportMap,
									basedir,
									importPath,
									quote,
									workspaceRoot,
									fs,
								});
								return fixer.replaceText(node as Rule.Node, replacement);
							},
						});
						return;
					}

					// Step 5: Extract mock implementation and properties
					const mockObjectNode = extractMockImplementation(mockImpl);
					const { properties: mockProperties, hasRequireActual } = extractMockProperties({
						sourceCode,
						mockObjectNode,
					});

					// Extract preamble (variable declarations, etc.) from the mock factory
					const preamble = extractMockFactoryPreamble({
						mockImpl: mockImpl as TSESTree.Node,
						sourceCode,
					});

					if (mockProperties.size === 0) {
						return;
					}

					// Step 6: Group properties by their source files
					const propertiesBySource = groupPropertiesBySource({ mockProperties, exportMap });

					// Step 7: Determine if we should report
					if (!shouldReportBarrelMock({ propertiesBySource, barrelFilePath })) {
						return;
					}

					// Step 8: Report with auto-fix
					context.report({
						node: node as Rule.Node,
						messageId: 'barrelMock',
						data: { path: importPath },
						fix(_fixer) {
							const quote = sourceCode.getText(firstArg as Rule.Node)[0];
							const fixes = generateMockImplementationFix({
								propertiesBySource,
								mockProperties,
								hasRequireActual,
								basedir,
								importPath,
								quote,
								exportMap,
								context,
								currentNode: node,
								preamble,
								workspaceRoot,
								fs,
							});
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
