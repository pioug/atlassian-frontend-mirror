const hexToRgb = (hex: any) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
		: null;
};

export const rgba = (hex: any, opacity: any) => `rgba(${hexToRgb(hex)}, ${opacity})`;
