export function entryPointLeaf(entryPoint: string): string {
	const parts = entryPoint.split('/').filter(Boolean);
	return parts[parts.length - 1] ?? '';
}
