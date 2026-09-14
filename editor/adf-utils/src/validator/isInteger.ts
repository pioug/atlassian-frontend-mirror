export const isInteger = (x: unknown): x is number =>
	typeof x === 'number' && isFinite(x) && Math.floor(x) === x;
