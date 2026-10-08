import { calculateAccessibleForegroundColor } from './vendor/calculate-accessible-foreground-color';
import { argbFromRgb } from './vendor/hct-color-utils/argb-from-rgb';
import { Hct } from './vendor/hct-color-utils/hct';
import { rgbaFromArgb } from './vendor/hct-color-utils/rgba-from-argb';
import { hexToRgb } from './vendor/hex-to-rgb';

const clampTone = (tone: number): number => Math.max(0, Math.min(100, tone));

function rgbToHex(rgb: [number, number, number]): string {
	return (
		'#' +
		rgb
			.map((c) =>
				Math.round(Math.max(0, Math.min(255, c)))
					.toString(16)
					.padStart(2, '0'),
			)
			.join('')
	);
}

/**
 * Convert a hex colour to HCT, set a new tone derived from its current tone, and convert back.
 * HCT automatically caps chroma per hue and tone to stay within gamut.
 * Returns the original colour if conversion fails.
 */
function withHctTone(hexColor: string, getTone: (currentTone: number) => number): string {
	try {
		const [r, g, b] = hexToRgb(hexColor);
		const hct = Hct.fromInt(argbFromRgb(r, g, b));
		hct.tone = clampTone(getTone(hct.tone));
		const rgba = rgbaFromArgb(hct.toInt());
		return rgbToHex([rgba.r, rgba.g, rgba.b]);
	} catch {
		return hexColor;
	}
}

/**
 * Adjust a color's lightness by a relative amount using HCT tone (WCAG lightness)
 * This preserves the relative lightness relationship between colors
 * @param hexColor The color to adjust
 * @param toneIncrease The amount to increase the tone by (typically 15-25, can be negative to darken)
 * @param isDarkMode Whether we're in dark mode (inverts the calculation)
 * @returns An adjusted version of the color
 */
export function lightenColorByHct(
	hexColor: string,
	toneIncrease: number,
	isDarkMode: boolean = false,
): string {
	// In dark mode, we want to darken (decrease tone), so we subtract
	return withHctTone(hexColor, (tone) => (isDarkMode ? tone - toneIncrease : tone + toneIncrease));
}

/**
 * Set a color's lightness to an absolute HCT tone (WCAG lightness)
 * @param hexColor The color to adjust
 * @param targetTone The tone to set (0-100)
 * @param isDarkMode Whether we're in dark mode: inverts the tone, e.g. 98 in light mode becomes 2
 * @returns An adjusted version of the color
 */
export function setColorLightnessByHct(
	hexColor: string,
	targetTone: number,
	isDarkMode: boolean = false,
): string {
	return withHctTone(hexColor, () => (isDarkMode ? 100 - targetTone : targetTone));
}

// Re-exported from the vendored colour utilities so consumers have a single import path
export { calculateAccessibleForegroundColor };
