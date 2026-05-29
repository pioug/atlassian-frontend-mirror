import { type CSSColor } from '../theme-config';

import { getClosestColorIndex } from './get-closest-color-index';
import { argbFromRgba, Contrast, Hct, rgbaFromArgb } from './hct-color-utils';
import { hexToHSL } from './hex-to-hsl';
import { hexToRgbA } from './hex-to-rgb-a';
import { HSLToRGB } from './hsl-to-rgb';
import { relativeLuminanceW3C } from './relative-luminance-w3-c';
import { rgbToHex } from './rgb-to-hex';

const lowLuminanceContrastRatios = [1.12, 1.33, 2.03, 2.73, 3.33, 4.27, 5.2, 6.62, 12.46, 14.25];
const highLuminanceContrastRatios = [1.08, 1.24, 1.55, 1.99, 2.45, 3.34, 4.64, 6.1, 10.19, 12.6];

export const generateColors = (
	brandColor: CSSColor,
): { ramp: CSSColor[]; replacedColor: CSSColor } => {
	// Determine luminance
	const HSLBrandColorHue = hexToHSL(brandColor)[0];
	const baseRgb = HSLToRGB(HSLBrandColorHue, 100, 60);
	const isLowLuminance = relativeLuminanceW3C(baseRgb[0], baseRgb[1], baseRgb[2]) < 0.4;
	// Choose right palette
	const themeRatios = isLowLuminance ? lowLuminanceContrastRatios : highLuminanceContrastRatios;
	const brandRgba = hexToRgbA(brandColor);
	const hctColor = Hct.fromInt(
		argbFromRgba({
			r: brandRgba[0],
			g: brandRgba[1],
			b: brandRgba[2],
			a: brandRgba[3],
		}),
	);
	const themeRamp = themeRatios.map((contrast) => {
		const rgbaColor = rgbaFromArgb(
			Hct.from(
				hctColor.hue,
				hctColor.chroma,
				Contrast.darker(100, contrast) + 0.25, // Material's utils provide an offset
			).toInt(),
		);
		return rgbToHex(rgbaColor.r, rgbaColor.g, rgbaColor.b) as CSSColor;
	});

	const closestColorIndex = getClosestColorIndex(themeRamp, brandColor);

	// Replace closet color with brandColor
	const updatedThemeRamp = [...themeRamp];
	updatedThemeRamp[closestColorIndex] = brandColor;

	return {
		ramp: updatedThemeRamp,
		// add the replaced color into the result
		replacedColor: themeRamp[closestColorIndex],
	};
};
