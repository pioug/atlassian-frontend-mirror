import { hexToRgb } from './hex-to-rgb';
import { isValidHex } from './is-valid-hex';

function relativeLuminanceW3C(r: number, g: number, b: number): number {
	const RsRGB = r / 255;
	const GsRGB = g / 255;
	const BsRGB = b / 255;

	const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
	const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
	const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

	// For the sRGB colorspace, the relative luminance of a color is defined as:
	const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

	return L;
}

function getContrastRatio(foreground: string, background: string): number {
	if (!isValidHex(foreground) || !isValidHex(background)) {
		throw new Error('Invalid HEX');
	}

	const foregroundRgb = hexToRgb(foreground);
	const backgroundRgb = hexToRgb(background);
	const foregroundLuminance = relativeLuminanceW3C(
		foregroundRgb[0],
		foregroundRgb[1],
		foregroundRgb[2],
	);
	const backgroundLuminance = relativeLuminanceW3C(
		backgroundRgb[0],
		backgroundRgb[1],
		backgroundRgb[2],
	);
	// calculate the color contrast ratio
	var brightest = Math.max(foregroundLuminance, backgroundLuminance);
	var darkest = Math.min(foregroundLuminance, backgroundLuminance);
	return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Calculate accessible foreground color (white or black) based on background color contrast.
 * Uses WCAG contrast ratio to determine which color provides better contrast.
 */
export function calculateAccessibleForegroundColor(backgroundColor: string): string {
	try {
		const whiteContrast = getContrastRatio('#ffffff', backgroundColor);
		const blackContrast = getContrastRatio('#000000', backgroundColor);
		return whiteContrast > blackContrast ? '#ffffff' : '#000000';
	} catch {
		return '#ffffff';
	}
}
