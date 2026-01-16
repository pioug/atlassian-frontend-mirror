import type { Scope } from 'eslint';

export const getFunctionArgumentAtPos = (node: Scope.Definition | undefined, pos: number): any =>
	node?.node?.init?.arguments?.[pos];
