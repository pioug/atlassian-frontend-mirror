const colorFunctionSet = new Set([
	'rgb',
	'rgba',
	'hsl',
	'hsla',
	'hwb',
	'lab',
	'lch',
	'color',
	'device-cmyk',
]);

export const isColorFunction = (value: string): boolean => colorFunctionSet.has(value);
