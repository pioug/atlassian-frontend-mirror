export const isBoolean = (x: unknown): x is boolean =>
	x === true || x === false || toString.call(x) === '[object Boolean]';
