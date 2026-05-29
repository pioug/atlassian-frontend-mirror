import { hexToRgb } from './hex-to-rgb';
import { isValidHex } from './is-valid-hex';
import { relativeLuminanceW3C } from './relative-luminance-w3-c';

export function getContrastRatio(foreground: string, background: string): number {
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
