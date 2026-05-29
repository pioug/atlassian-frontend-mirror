import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { Rule, Scope } from 'eslint';
import type { Node } from 'estree-jsx';

import { getSourceCode } from './get-source-code';

// `context.getDeclaredVariables()` -> `context.sourceCode.getDeclaredVariables(node)`
export function getDeclaredVariables(context: Rule.RuleContext, node: Node): Scope.Variable[];
export function getDeclaredVariables<
	TMessageIds extends string = string,
	TOptions extends readonly unknown[] = unknown[],
>(
	context: TSESLint.RuleContext<TMessageIds, TOptions>,
	node: TSESTree.Node,
): TSESLint.Scope.Variable[];
export function getDeclaredVariables(
	context: Rule.RuleContext | TSESLint.RuleContext<string, unknown[]>,
	node: Node | TSESTree.Node,
): Scope.Variable[] | TSESLint.Scope.Variable[] {
	// `context.getDeclaredVariables()` is only available in ESLint v8.40.0+.
	// @ts-expect-error difference in types between typescript eslint and eslint
	const sourceCode = getSourceCode(context);
	// @ts-ignore - TS2322 TypeScript 5.9.2 upgrade
	return sourceCode.getDeclaredVariables
		? // @ts-expect-error mismatch between the overloads and ts eslint/eslint
			sourceCode.getDeclaredVariables(node)
		: // @ts-expect-error mismatch between the overloads and ts eslint/eslint
			context.getDeclaredVariables(node);
}
