import type { Rule, Scope, SourceCode } from 'eslint';
import type { Node } from 'estree';

/**
 * TODO: Consider whether this should be replaced by ESLint's compat library.
 * Either way, this should be removed once we no longer need to support ESLint versions less than 8.40.
 */

/**
 * A compatibility layer to support older versions of ESLint.
 * `context.sourceCode` is the preferred way to access SourceCode, as
 * `context.getSourceCode()` is deprecated in v8 and removed in v9.
 * @param context - The ESLint rule context
 */
const getSourceCode = (context: Rule.RuleContext): SourceCode => {
	return context.sourceCode ?? context.getSourceCode();
};

/**
 * A compatibility layer to support older versions of ESLint.
 * `context.sourceCode.getScope()` is the preferred way to access Scope, as
 * `context.getScope()` was removed in v9.
 * @param context - The ESLint rule context
 * @param node - The node to get the scope for
 */
export const getScope = (context: Rule.RuleContext, node: Node): Scope.Scope => {
	return getSourceCode(context)?.getScope(node) ?? context.getScope();
};
