export const isPlainObject = (x: unknown): boolean =>
	typeof x === 'object' && x !== null && !Array.isArray(x);
