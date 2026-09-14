import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { Rule, Scope } from 'eslint';
import type { Node } from 'estree-jsx';

import { getSourceCode } from './get-source-code';

const scopeCache = new WeakMap<object, WeakMap<object, Scope.Scope>>();

/**
 * Returns the Scope object from the ESLint rule context.
 * Compatibility layer to support older versions of ESLint.
 * @param context - The ESLint rule context
 * @param node - The node to get the scope for
 */
export function getScope(context: Rule.RuleContext, node: Node): Scope.Scope;
export function getScope<
	TMessageIds extends string = string,
	TOptions extends readonly unknown[] = readonly unknown[],
>(context: TSESLint.RuleContext<TMessageIds, TOptions>, node: TSESTree.Node): TSESLint.Scope.Scope;
export function getScope(
	context: Rule.RuleContext | TSESLint.RuleContext<string, unknown[]>,
	node: Node | TSESTree.Node,
): Scope.Scope | TSESLint.Scope.Scope {
	const sourceCode = getSourceCode(context as Rule.RuleContext);
	const getScopeFromSourceCode = (sourceCode as { getScope?: (node: Node) => Scope.Scope })
		.getScope;

	if (getScopeFromSourceCode) {
		let sourceCodeCache = scopeCache.get(sourceCode);
		if (!sourceCodeCache) {
			sourceCodeCache = new WeakMap();
			scopeCache.set(sourceCode, sourceCodeCache);
		}

		const cachedScope = sourceCodeCache.get(node);
		if (cachedScope) {
			return cachedScope;
		}

		const scope = getScopeFromSourceCode.call(sourceCode, node as Node);
		sourceCodeCache.set(node, scope);
		return scope;
	}

	return context.getScope();
}
