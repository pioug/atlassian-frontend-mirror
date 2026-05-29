import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { Rule } from 'eslint';
import type { Comment } from 'estree-jsx';

import { getSourceCode } from './get-source-code';

// compatibility layer for `context.getAllComments()` -> `context.sourceCode.getAllComments()`
export function getAllComments(context: Rule.RuleContext): Comment[];
export function getAllComments<
	TMessageIds extends string = string,
	TOptions extends readonly unknown[] = unknown[],
>(context: TSESLint.RuleContext<TMessageIds, TOptions>): TSESTree.Comment[];
export function getAllComments(
	context: Rule.RuleContext | TSESLint.RuleContext<string, unknown[]>,
): TSESTree.Comment[] | Comment[] {
	// `context.getAllComments()` is only available in ESLint v8.40.0+.
	// @ts-expect-error difference in types between typescript eslint and eslint
	const sourceCode = getSourceCode(context);
	// @ts-expect-error type mismatch between the overloads
	return sourceCode.getAllComments ? sourceCode.getAllComments() : context.getAllComments();
}
