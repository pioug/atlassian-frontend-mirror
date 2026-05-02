import { getColorsFromAppearance } from './get-colors-from-appearance';
export const getColorsForLoom = (
	appearance?: string,
	colorMode?: string,
): {
	iconColor: string | undefined;
	textColor: string | undefined;
} => {
	let iconColor = getColorsFromAppearance(appearance, colorMode).iconColor;
	let textColor = getColorsFromAppearance(appearance, colorMode).textColor;
	if (colorMode === 'dark') {
		switch (appearance) {
			case 'brand':
				iconColor = '#625DF5';
				textColor = '#EFF0FF';
				break;
		}
	} else {
		switch (appearance) {
			case 'brand':
				iconColor = '#625DF5';
				textColor = '#252434';
				break;
		}
	}

	return {
		iconColor,
		textColor,
	};
};

export { getColorsFromAppearanceOldLogos } from './get-colors-from-appearance-old-logos';
export { getColorsFromAppearance } from './get-colors-from-appearance';
