import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import type { Node } from 'estree-jsx';

import { getSourceCode } from './get-source-code';

export function getAncestors(context: Rule.RuleContext, node: Node): Node[];
export function getAncestors<
	TMessageIds extends string = string,
	TOptions extends readonly unknown[] = unknown[],
>(context: TSESLint.RuleContext<TMessageIds, TOptions>, node: TSESTree.Node): TSESTree.Node[];
export function getAncestors(
	context: Rule.RuleContext | TSESLint.RuleContext<string, unknown[]>,
	node: Node | TSESTree.Node,
): TSESTree.Node[] | Node[] {
	// `context.getAncestors()` is only available in ESLint v8.40.0+.
	// @ts-expect-error difference in types between typescript eslint and eslint
	const sourceCode = getSourceCode(context);
	// @ts-expect-error platform uses typescript-eslint v6 which doesn't have `context.sourceCode.getAncestors` yet
	return sourceCode.getAncestors ? sourceCode.getAncestors(node) : context.getAncestors();
}
