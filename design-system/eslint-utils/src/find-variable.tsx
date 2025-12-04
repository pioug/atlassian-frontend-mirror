import type { Rule, SourceCode } from 'eslint';
import type { Scope, Variable } from 'eslint-scope';
import type * as ESTree from 'estree';

const scopeCache = new WeakMap();

/**
 * Adjusted from ESLint `https://github.com/eslint/eslint/blob/main/lib/source-code/source-code.js`
 * because the `sourceCode.getScope()` method only exists in newer versions of ESLint and we want to
 * support older ones.
 */
function getScope({
	node: currentNode,
	sourceCode,
}: {
	node: ESTree.Node;
	sourceCode: SourceCode;
}) {
	// check cache first
	const cachedScope = scopeCache.get(currentNode);

	if (cachedScope) {
		return cachedScope;
	}

	// On Program node, get the outermost scope to avoid return Node.js special function scope or ES modules scope.
	const inner = currentNode.type !== 'Program';

	const scopeManager = sourceCode.scopeManager;

	// @ts-ignore - (node as Rule.Node).parent can be null, but the loop condition handles it
	for (let node = currentNode; node; node = (node as Rule.Node).parent) {
		const scope = scopeManager.acquire(node, inner);

		if (scope) {
			if (scope.type === 'function-expression-name') {
				scopeCache.set(currentNode, scope.childScopes[0]);
				return scope.childScopes[0];
			}

			scopeCache.set(currentNode, scope);
			return scope;
		}
	}

	scopeCache.set(currentNode, scopeManager.scopes[0]);
	return scopeManager.scopes[0];
}

export function findVariable({
	identifier,
	sourceCode,
}: {
	identifier: ESTree.Identifier;
	sourceCode: SourceCode;
}): Variable | null {
	let scope: Scope | null = getScope({ node: identifier, sourceCode });

	while (scope) {
		const variable = scope.set.get(identifier.name);

		if (variable) {
			return variable;
		}

		scope = scope.upper;
	}

	return null;
}
