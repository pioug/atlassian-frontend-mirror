export const isObject = (value: unknown): value is Record<string | number | symbol, unknown> =>
	typeof value === 'object' && value !== null;
