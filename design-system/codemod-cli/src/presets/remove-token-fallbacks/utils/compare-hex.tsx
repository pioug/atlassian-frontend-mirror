import { diff, rgb_to_lab, type RGBColor } from 'color-diff';

function hexToRgbA(hex: string): RGBColor {
	// Remove the leading '#' if present
	hex = hex.replace(/^#/, '');
	// Parse the hex string
	const r = parseInt(hex.substring(0, 2), 16);
	const g = parseInt(hex.substring(2, 4), 16);
	const b = parseInt(hex.substring(4, 6), 16);
	const a = parseInt(hex.substring(6, 8), 16) / 255;

	return { R: r, G: g, B: b, A: a };
}

export const compareHex: (hex: string, hex2: string) => number = (hex: string, hex2: string) =>
	diff(rgb_to_lab(hexToRgbA(hex)), rgb_to_lab(hexToRgbA(hex2)));
