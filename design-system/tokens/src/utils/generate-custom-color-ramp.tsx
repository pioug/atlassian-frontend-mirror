import rawTokensDark from '../artifacts/atlassian-dark-token-value-for-contrast-check';
import type tokens from '../artifacts/token-names';
import { type CSSColor, type ThemeColorModes } from '../theme-config';

import {
	deltaE,
	getContrastRatio,
	hexToHSL,
	hexToRgb,
	hexToRgbA,
	HSLToRGB,
	relativeLuminanceW3C,
	rgbToHex,
} from './color-utils';
import { additionalContrastChecker } from './custom-theme-token-contrast-check';
import { argbFromRgba, Contrast, Hct, rgbaFromArgb } from './hct-color-utils';

const lowLuminanceContrastRatios = [1.12, 1.33, 2.03, 2.73, 3.33, 4.27, 5.2, 6.62, 12.46, 14.25];
const highLuminanceContrastRatios = [1.08, 1.24, 1.55, 1.99, 2.45, 3.34, 4.64, 6.1, 10.19, 12.6];
type Token = keyof typeof tokens;
type TokenMap = { [key in Token]?: number | string };
type Mode = 'light' | 'dark';

export const getClosestColorIndex = (themeRamp: CSSColor[], brandColor: CSSColor) => {
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

/**
 * Return the interaction tokens for a color, given its ramp position and the number of
 * needed interaction states. Use higher-indexed colors (i.e. darker colors) if possible;
 * if there's not enough room to shift up for the required number of interaction tokens,
 * it goes as far as it can, then returns lighter colors lower down the ramp instead.
 *
 * Returns an array of the resulting colors
 */
function getInteractionStates(rampPosition: number, number: number, colors: CSSColor[]) {
	const result: number[] = [];
	for (let i = 1; i <= number; i++) {
		if (rampPosition + i < colors.length) {
			result.push(rampPosition + i);
		} else {
			result.push(rampPosition - (i - (colors.length - 1 - rampPosition)));
		}
	}
	return result;
}

export const generateTokenMap = (
	brandColor: CSSColor,
	mode: ThemeColorModes,
	themeRamp?: CSSColor[],
): { [mode in Mode]?: TokenMap } => {
	const { ramp, replacedColor } = generateColors(brandColor);
	const colors = themeRamp || ramp;
	const closestColorIndex = getClosestColorIndex(colors, brandColor);

	let customThemeTokenMapLight: TokenMap = {};
	let customThemeTokenMapDark: TokenMap = {};

	const inputContrast = getContrastRatio(brandColor, '#FFFFFF');
	// Branch based on brandColor's contrast against white
	if (inputContrast >= 4.5) {
		/**
		 * Generate interaction tokens for
		 * - color.background.brand.bold
		 * - color.background.selected.bold
		 */
		const [brandBoldSelectedHoveredIndex, brandBoldSelectedPressedIndex] = getInteractionStates(
			closestColorIndex,
			2,
			colors,
		);

		let brandTextIndex = closestColorIndex;
		if (inputContrast < 5.4 && inputContrast >= 4.8 && closestColorIndex === 6) {
			// Use the one-level darker closest color (X800) for color.text.brand
			// and color.link to avoid contrast breaches
			brandTextIndex = closestColorIndex + 1;
		}

		/**
		 * Generate interaction token for color.link:
		 * If inputted color replaces X1000
		 * - Pressed = X900
		 *
		 * If inputted color replaces X700-X900
		 * - Shift one 1 step darker
		 */
		const [linkPressed] = getInteractionStates(brandTextIndex, 1, colors);

		customThemeTokenMapLight = {
			'color.text.brand': brandTextIndex,
			'color.icon.brand': closestColorIndex,
			'color.background.brand.subtlest': 0,
			'color.background.brand.subtlest.hovered': 1,
			'color.background.brand.subtlest.pressed': 2,
			'color.background.brand.bold': closestColorIndex,
			'color.background.brand.bold.hovered': brandBoldSelectedHoveredIndex,
			'color.background.brand.bold.pressed': brandBoldSelectedPressedIndex,
			'color.background.brand.boldest': 9,
			'color.background.brand.boldest.hovered': 8,
			'color.background.brand.boldest.pressed': 7,
			'color.border.brand': closestColorIndex,
			'color.text.selected': brandTextIndex,
			'color.icon.selected': closestColorIndex,
			'color.background.selected.bold': closestColorIndex,
			'color.background.selected.bold.hovered': brandBoldSelectedHoveredIndex,
			'color.background.selected.bold.pressed': brandBoldSelectedPressedIndex,
			'color.border.selected': closestColorIndex,
			'color.link': brandTextIndex,
			'color.link.pressed': linkPressed,
			'color.chart.brand': 5,
			'color.chart.brand.hovered': 6,
			'color.background.selected': 0,
			'color.background.selected.hovered': 1,
			'color.background.selected.pressed': 2,
		};
	} else {
		let brandBackgroundIndex: CSSColor | number = 6;
		if (inputContrast < 4.5 && inputContrast >= 4 && closestColorIndex === 6) {
			// Use the generated closest color instead of the input brand color for
			// color.background.selected.bold and color.background.brand.bold
			// to avoid contrast breaches
			brandBackgroundIndex = replacedColor;
		}

		customThemeTokenMapLight = {
			'color.background.brand.subtlest': 0,
			'color.background.brand.subtlest.hovered': 1,
			'color.background.brand.subtlest.pressed': 2,
			'color.background.brand.bold': brandBackgroundIndex,
			'color.background.brand.bold.hovered': 7,
			'color.background.brand.bold.pressed': 8,
			'color.background.brand.boldest': 9,
			'color.background.brand.boldest.hovered': 8,
			'color.background.brand.boldest.pressed': 7,
			'color.border.brand': 6,
			'color.background.selected.bold': brandBackgroundIndex,
			'color.background.selected.bold.hovered': 7,
			'color.background.selected.bold.pressed': 8,
			'color.text.brand': 6,
			'color.icon.brand': 6,
			'color.chart.brand': 5,
			'color.chart.brand.hovered': 6,
			'color.text.selected': 6,
			'color.icon.selected': 6,
			'color.border.selected': 6,
			'color.background.selected': 0,
			'color.background.selected.hovered': 1,
			'color.background.selected.pressed': 2,
			'color.link': 6,
			'color.link.pressed': 7,
		};
	}

	if (mode === 'light') {
		return { light: customThemeTokenMapLight };
	}

	/**
	 * Generate dark mode values using rule of symmetry
	 */
	Object.entries(customThemeTokenMapLight).forEach(([key, value]) => {
		customThemeTokenMapDark[key as Token] =
			9 - (typeof value === 'string' ? closestColorIndex : value);
	});

	/**
	 * If the input brand color < 4.5, and it meets 4.5 contrast again inverse text color
	 * in dark mode, shift color.background.brand.bold to the brand color
	 */
	if (inputContrast < 4.5) {
		const inverseTextColor = rawTokensDark['color.text.inverse'];

		if (getContrastRatio(inverseTextColor as string, brandColor) >= 4.5 && closestColorIndex >= 2) {
			customThemeTokenMapDark['color.background.brand.bold'] = closestColorIndex;
			customThemeTokenMapDark['color.background.brand.bold.hovered'] = closestColorIndex - 1;
			customThemeTokenMapDark['color.background.brand.bold.pressed'] = closestColorIndex - 2;
		}
	}

	if (mode === 'dark') {
		return { dark: customThemeTokenMapDark };
	}

	return { light: customThemeTokenMapLight, dark: customThemeTokenMapDark };
};

export const generateTokenMapWithContrastCheck = (
	brandColor: CSSColor,
	mode: ThemeColorModes,
	themeRamp?: CSSColor[],
): { [mode in Mode]?: TokenMap } => {
	const colors = themeRamp || generateColors(brandColor).ramp;
	const tokenMaps = generateTokenMap(brandColor, mode, colors);

	const result: { [mode in Mode]?: TokenMap } = {};
	Object.entries(tokenMaps).forEach(([mode, map]) => {
		if (mode === 'light' || mode === 'dark') {
			result[mode] = {
				...map,
				...additionalContrastChecker({
					customThemeTokenMap: map,
					mode,
					themeRamp: colors,
				}),
			};
		}
	});
	return result;
};
