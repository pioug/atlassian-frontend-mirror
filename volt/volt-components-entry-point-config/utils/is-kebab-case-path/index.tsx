import { entryPointLeaf } from '../entry-point-leaf';

export function isKebabCasePath(entryPoint: string): boolean {
	const leaf = entryPointLeaf(entryPoint);
	return leaf === leaf.toLowerCase() && !/[A-Z]/.test(leaf);
}
