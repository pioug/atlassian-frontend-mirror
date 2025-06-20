import type { RGB, RGBA } from './types';

/**
 * Removes sRGB gamma correction from the provided channel.
 * The resulting linear channel directly corresponds to subpixel intensity.
 *
 * Expects a normalized sRGB value (between 0 and 1)
 *
 * This formula is derived from WCAG2 guidelines:
 * https://www.w3.org/WAI/WCAG22/Techniques/general/G18.html#tests
 */
function linearizeRGBChannel(channel: number): number {
	return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

/**
 * This formula is derived from WCAG2 guidelines:
 * https://www.w3.org/WAI/WCAG22/Techniques/general/G18.html#tests
 */
function relativeLuminanceW3C({ r, g, b }: RGB): number {
	/**
	 * Normalized sRGB - each channel is between 0 and 1
	 */
	const normal: RGB = {
		r: r / 255,
		g: g / 255,
		b: b / 255,
	};

	/**
	 * linear RGB - the gamma correction of sRGB is removed and
	 * the channels correspond directly to subpixel intensity
	 */
	const linear: RGB = {
		r: linearizeRGBChannel(normal.r),
		g: linearizeRGBChannel(normal.g),
		b: linearizeRGBChannel(normal.b),
	};

	// For linear RGB, the relative luminance of a color is defined as:
	const L = 0.2126 * linear.r + 0.7152 * linear.g + 0.0722 * linear.b;

	return L;
}

/**
 * This is the intersection point for W3C contrast ratio against:
 *
 * 1. black
 * 2. white
 *
 * In other words, the background luminance for which W3C contrast is equal
 * for both white and black text.
 *
 * Using a precomputed flip point means we can save a lot of calculations.
 *
 * This is only the theoretical flip point, and we can adjust it as needed.
 */
const flipLuminance = 0.179129;

export function isLight(color: RGB): boolean {
	return relativeLuminanceW3C(color) >= flipLuminance;
}

export type ColorMode = 'light' | 'dark';

export function getColorMode(backgroundColor: RGB): ColorMode {
	if (relativeLuminanceW3C(backgroundColor) >= flipLuminance) {
		return 'light';
	}
	return 'dark';
}

const textColor: Record<ColorMode, { hex: string; rgb: RGB }> = {
	light: {
		hex: '#000',
		rgb: { r: 0, g: 0, b: 0 },
	},
	dark: {
		hex: '#FFF',
		rgb: { r: 255, g: 255, b: 255 },
	},
};

export function getTextColor(backgroundColor: RGB): { hex: string; rgb: RGB } {
	const colorMode = getColorMode(backgroundColor);
	return textColor[colorMode];
}

/**
 * Simple alpha compositing as defined in
 * https://www.w3.org/TR/compositing-1/#simplealphacompositing
 *
 * This is the standard approach for alpha blending using the
 * Porter-Duff 'source over' compositing operator.
 *
 * This has been simplified to assume the background has no transparency.
 */
export function simpleAlphaComposite({
	background,
	foreground,
}: {
	background: RGB;
	foreground: RGBA;
}): RGB {
	return {
		r: foreground.a * foreground.r + background.r * (1 - foreground.a),
		g: foreground.a * foreground.g + background.g * (1 - foreground.a),
		b: foreground.a * foreground.b + background.b * (1 - foreground.a),
	};
}
