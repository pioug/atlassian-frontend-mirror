import { type TSESLint } from '@typescript-eslint/utils';

/**
 * Resolve the scope that actually owns the file's top-level bindings.
 *
 * For an ES module, `getScope(context, programNode)` returns the outer `global`
 * scope; the `let`/`const`/`import` bindings declared at the top level live in
 * a descendant `module` scope. With `ecmaFeatures.globalReturn`, the parser
 * inserts an intermediate `function` scope, so search recursively rather than
 * assuming the module is an immediate child. Fall back to the original scope
 * for non-module sources, whose top-level bindings remain there.
 */
export function resolveModuleScope(scope: TSESLint.Scope.Scope): TSESLint.Scope.Scope {
	const scopes = [scope];

	while (scopes.length > 0) {
		const current = scopes.shift();
		if (current == null) {
			break;
		}
		if (current.type === 'module') {
			return current;
		}
		scopes.push(...current.childScopes);
	}

	// Non-module sources (`sourceType: 'script'`) keep top-level bindings on the
	// global/function scope, so use the scope as-is.
	return scope;
}
