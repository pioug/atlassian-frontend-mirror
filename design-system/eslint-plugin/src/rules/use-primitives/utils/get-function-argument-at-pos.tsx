import type { Scope } from 'eslint';

export const getFunctionArgumentAtPos = (node: Scope.Definition | undefined, pos: number) =>
	node?.node?.init?.arguments?.[pos];
