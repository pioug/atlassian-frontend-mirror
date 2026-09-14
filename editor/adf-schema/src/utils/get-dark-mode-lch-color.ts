import { clampLightness } from './clamp-lightness';
import { rgbFromHex } from './rgb-from-hex';
import { rgbToLch } from './rgb-to-lch';

const getLightness = (color: string): number => {
	const rgb = rgbFromHex(color);
	if (rgb === null) {
		return 0;
	}

	const lch = rgbToLch(rgb);
	return lch.l;
};

export const getDarkModeLCHColor = (currentBackgroundColor: string): string => {
	const lightness = getLightness(currentBackgroundColor);
	const newLightness = Math.abs(100 - lightness);
	return clampLightness(currentBackgroundColor, newLightness).toUpperCase();
};
