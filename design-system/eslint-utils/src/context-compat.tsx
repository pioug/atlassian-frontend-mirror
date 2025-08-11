import type { TSESLint, TSESTree } from '@typescript-eslint/utils';
import type { Rule, Scope, SourceCode } from 'eslint';
import type { Comment, Node } from 'estree-jsx';

/**
 * TODO: Consider whether this should be replaced by ESLint's compat library.
 * Either way, this should be removed once we no longer need to support ESLint versions less than 8.40.
 */

/**
 * Returns the SourceCode object from the ESLint rule context.
 * Compatibility layer to support older versions of ESLint.
 * @param context - The ESLint rule context
 */
export function getSourceCode(context: Rule.RuleContext): SourceCode;
export function getSourceCode<TMessageIds extends string, TOptions extends readonly unknown[]>(
	context: TSESLint.RuleContext<TMessageIds, TOptions>,
): TSESLint.SourceCode;
export function getSourceCode(
	context: Rule.RuleContext | TSESLint.RuleContext<string, unknown[]>,
): SourceCode | TSESLint.SourceCode {
	// `context.sourceCode` is the preferred way to access SourceCode, as
	// `context.getSourceCode()` is deprecated in v8 and removed in v9.
	// this needs to be ts-ignore because if other apps use a different eslint/typescript-eslint version, it will fail in
	// those builds, but not for platform
	// @ts-ignore platform uses typescript-eslint v6 which doesn't have `context.sourceCode` yet
	return context.sourceCode ?? context.getSourceCode();
}

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
