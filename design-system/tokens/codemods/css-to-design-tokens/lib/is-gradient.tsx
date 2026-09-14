const GRADIENT_TYPES = ['linear', 'radial', 'conic'] as const;

export function isGradient(value: string): boolean {
	return GRADIENT_TYPES.some((gradient) => value.startsWith(`${gradient}-gradient(`));
}
