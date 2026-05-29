import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { Rule, Scope } from 'eslint';
import type { Node } from 'estree-jsx';

import { getSourceCode } from './get-source-code';

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
	// `context.sourceCode.getScope()` is the preferred way to access Scope, as
	// `context.getScope()` was removed in v9.
	// @ts-expect-error difference in types between typescript eslint and eslint
	return getSourceCode(context)?.getScope?.(node) ?? context.getScope();
}
