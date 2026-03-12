import type { TSESTree } from '@typescript-eslint/utils';

/**
 * Shared utilities for jest.mock-related lint rules.
 *
 * These helpers are used by both `no-barrel-entry-jest-mock` (cross-package)
 * and `no-jest-mock-barrel-files` (relative imports).
 */

/**
 * Check if a CallExpression node is a jest.mock() call
 */
export function isJestMockCall(node: TSESTree.CallExpression): boolean {
	const callee = node.callee;
	if (callee.type === 'MemberExpression') {
		return (
			callee.object.type === 'Identifier' &&
			callee.object.name === 'jest' &&
			callee.property.type === 'Identifier' &&
			callee.property.name === 'mock'
		);
	}
	if (callee.type === 'Identifier') {
		return callee.name === 'jest.mock';
	}
	return false;
}

/**
 * Check if a node is a jest.requireActual() call
 */
export function isJestRequireActual(node: TSESTree.Node): boolean {
	if (node.type !== 'CallExpression') {
		return false;
	}
	const callee = node.callee;
	if (callee.type === 'MemberExpression') {
		return (
			callee.object.type === 'Identifier' &&
			callee.object.name === 'jest' &&
			callee.property.type === 'Identifier' &&
			callee.property.name === 'requireActual'
		);
	}
	return false;
}

/**
 * Check if a node is a jest.requireMock() call
 */
export function isJestRequireMock(node: TSESTree.Node): boolean {
	if (node.type !== 'CallExpression') {
		return false;
	}
	const callee = node.callee;
	if (callee.type === 'MemberExpression') {
		return (
			callee.object.type === 'Identifier' &&
			callee.object.name === 'jest' &&
			callee.property.type === 'Identifier' &&
			callee.property.name === 'requireMock'
		);
	}
	return false;
}

/**
 * Extract the import path string from a jest.mock/jest.requireMock/jest.requireActual call's arguments.
 * Returns null if the path cannot be statically determined.
 */
export function extractImportPath(node: TSESTree.CallExpression): string | null {
	if (node.arguments.length === 0) {
		return null;
	}

	const firstArg = node.arguments[0];
	if (firstArg.type === 'Literal') {
		return String(firstArg.value);
	}
	if (firstArg.type === 'TemplateLiteral' && firstArg.expressions.length === 0) {
		return firstArg.quasis[0].value.raw;
	}
	return null;
}

/**
 * Find all jest.requireMock() calls in the AST whose import path matches a given target.
 *
 * The `matchPath` callback allows callers to provide their own path-matching strategy:
 * - Cross-package rules can use simple string equality
 * - Relative import rules can use normalized/resolved path comparison
 */
export function findJestRequireMockCalls({
	ast,
	matchPath,
}: {
	ast: TSESTree.Program;
	matchPath: (candidatePath: string) => boolean;
}): TSESTree.CallExpression[] {
	const results: TSESTree.CallExpression[] = [];
	const visited = new WeakSet<TSESTree.Node>();
	const skipKeys = new Set(['parent', 'loc', 'range', 'tokens', 'comments']);

	function visit(node: TSESTree.Node): void {
		if (visited.has(node)) {
			return;
		}
		visited.add(node);

		if (node.type === 'CallExpression' && isJestRequireMock(node)) {
			const path = extractImportPath(node);
			if (path && matchPath(path)) {
				results.push(node);
			}
		}

		for (const key in node) {
			if (skipKeys.has(key)) {
				continue;
			}
			const value = node[key as keyof typeof node];
			if (value && typeof value === 'object') {
				if (Array.isArray(value)) {
					for (const child of value) {
						if (child && typeof child === 'object' && 'type' in child) {
							visit(child as TSESTree.Node);
						}
					}
				} else if ('type' in value) {
					visit(value as TSESTree.Node);
				}
			}
		}
	}

	visit(ast);
	return results;
}

/**
 * Determine the best new import path for a jest.requireMock() call by inspecting
 * the destructured symbols or property access at the call site.
 *
 * @param requireMockNode - The jest.requireMock() CallExpression node
 * @param symbolToNewPath - Map from symbol name to the new mock path that provides it
 * @returns The resolved new path, or null if it cannot be determined
 */
export function resolveNewPathForRequireMock({
	requireMockNode,
	symbolToNewPath,
}: {
	requireMockNode: TSESTree.CallExpression;
	symbolToNewPath: Map<string, string>;
}): string | null {
	const parent = (requireMockNode as TSESTree.Node & { parent?: TSESTree.Node }).parent;

	if (parent) {
		// Check for destructuring pattern: const { foo } = jest.requireMock('...')
		const declarator =
			parent.type === 'VariableDeclarator'
				? parent
				: (parent as TSESTree.Node & { parent?: TSESTree.Node }).parent?.type ===
					  'VariableDeclarator'
					? (parent as TSESTree.Node & { parent?: TSESTree.Node }).parent
					: null;

		if (
			declarator &&
			declarator.type === 'VariableDeclarator' &&
			declarator.id.type === 'ObjectPattern'
		) {
			for (const prop of declarator.id.properties) {
				if (prop.type === 'Property' && prop.key.type === 'Identifier') {
					const matchedPath = symbolToNewPath.get(prop.key.name);
					if (matchedPath) {
						return matchedPath;
					}
				}
			}
		}

		// Check for property access pattern: jest.requireMock('...').foo
		if (parent.type === 'MemberExpression' && parent.property.type === 'Identifier') {
			const matchedPath = symbolToNewPath.get(parent.property.name);
			if (matchedPath) {
				return matchedPath;
			}
		}
	}

	// Fallback: if only one new path exists, use it
	const uniquePaths = new Set(symbolToNewPath.values());
	if (uniquePaths.size === 1) {
		return uniquePaths.values().next().value ?? null;
	}

	return null;
}
