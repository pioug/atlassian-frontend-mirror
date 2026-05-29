/* eslint-disable @atlaskit/volt-strict-mode/no-multiple-exports */
import type { TSESLint } from '@typescript-eslint/utils';
import type { Rule, SourceCode } from 'eslint';

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
