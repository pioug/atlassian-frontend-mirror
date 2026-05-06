import { type CSSColor } from '../theme-config';

import { deltaE, hexToRgb } from './color-utils';

export const getClosestColorIndex = (themeRamp: CSSColor[], brandColor: CSSColor): number => {
	// Iterate over themeRamp and find whichever color is closest to brandColor
	let closestColorIndex = 0;
	let closestColorDistance: number | null = null;

	themeRamp.forEach((value: CSSColor, index: number) => {
		const distance = deltaE(hexToRgb(value), hexToRgb(brandColor));
		if (closestColorDistance === null || distance < (closestColorDistance as number)) {
			closestColorIndex = index;
			closestColorDistance = distance;
		}
	});
	return closestColorIndex;
};
