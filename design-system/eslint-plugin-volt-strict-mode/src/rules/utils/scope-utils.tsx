import type { TSESLint } from '@typescript-eslint/utils';

/**
 * Walks the scope chain and returns the first variable bound to `name`, if any.
 */
export function lookupVariable(
	scope: TSESLint.Scope.Scope,
	name: string,
): TSESLint.Scope.Variable | null {
	let current: TSESLint.Scope.Scope | null = scope;
	while (current) {
		const found = current.variables.find((v) => v.name === name);
		if (found) {
			return found;
		}
		current = current.upper;
	}
	return null;
}

export function isImportBinding(variable: TSESLint.Scope.Variable): boolean {
	return variable.defs.some((d) => d.type === 'ImportBinding');
}
