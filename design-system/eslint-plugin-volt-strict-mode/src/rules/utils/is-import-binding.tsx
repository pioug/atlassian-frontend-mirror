import type { Scope } from '@typescript-eslint/utils/ts-eslint';

export function isImportBinding(variable: Scope.Variable): boolean {
	return variable.defs.some((d) => d.type === 'ImportBinding');
}
