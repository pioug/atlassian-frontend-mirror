export const hexToRGBAValues = (
	hex: string,
): {
	r: number;
	g: number;
	b: number;
	a: number;
} => {
	const hexColor = hex.replace('#', '');

	return {
		r: parseInt(hexColor.slice(0, 2), 16),
		g: parseInt(hexColor.slice(2, 4), 16),
		b: parseInt(hexColor.slice(4, 6), 16),
		a: parseFloat((parseInt(hexColor.slice(6, 8), 16) / 255).toFixed(2)),
	};
};
