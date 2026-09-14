import type { Scope } from '@typescript-eslint/utils/ts-eslint';

/**
 * Walks the scope chain and returns the first variable bound to `name`, if any.
 */
export function lookupVariable(scope: Scope.Scope, name: string): Scope.Variable | null {
	let current: Scope.Scope | null = scope;
	while (current) {
		const found = current.variables.find((v) => v.name === name);
		if (found) {
			return found;
		}
		current = current.upper;
	}
	return null;
}
