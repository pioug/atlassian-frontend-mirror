export const normalizeStatusColorAttr = (color: string): string =>
	color.startsWith('#') ? color.toUpperCase() : color;
