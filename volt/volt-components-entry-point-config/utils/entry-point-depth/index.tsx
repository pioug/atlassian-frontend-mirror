export function entryPointDepth(entryPoint: string): number {
	return entryPoint.split('/').filter(Boolean).length;
}
