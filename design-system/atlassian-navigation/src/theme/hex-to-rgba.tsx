import chromatism from 'chromatism';

export const hexToRGBA = (hex: string, opacity: number = 1) => {
	const rgba = { ...chromatism.convert(hex).rgb, a: opacity };

	return `rgba(${Object.values(rgba).join(', ')})`;
};
