const validColorPropertyNames = new Set([
	'color',
	'background',
	'background-color',
	'border',
	'border-left',
	'border-right',
	'border-top',
	'border-bottom',
	'border-color',
	'border-left-color',
	'border-right-color',
	'border-top-color',
	'border-bottom-color',
	'outline',
	'outline-color',
	'box-shadow',
]);

const kebabize = (str: string) =>
	str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase());

export const isColorCssPropertyName = (value: string): boolean =>
	validColorPropertyNames.has(kebabize(value));
