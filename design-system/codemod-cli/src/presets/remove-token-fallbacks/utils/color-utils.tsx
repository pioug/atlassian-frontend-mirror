import { diff, rgb_to_lab, type RGBColor } from 'color-diff';

// Compare hex values using a CIEDE2000 color difference algorithm
export const compareHex = (hex: string, hex2: string) =>
	diff(rgb_to_lab(hexToRgbA(hex)), rgb_to_lab(hexToRgbA(hex2)));

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

const namedColors: { [key: string]: string } = {
	black: '#000000',
	silver: '#C0C0C0',
	gray: '#808080',
	grey: '#808080',
	pink: '#FFC0CB',
	white: '#FFFFFF',
	maroon: '#800000',
	red: '#FF0000',
	purple: '#800080',
	fuchsia: '#FF00FF',
	green: '#008000',
	lime: '#00FF00',
	olive: '#808000',
	yellow: '#FFFF00',
	navy: '#000080',
	blue: '#0000FF',
	teal: '#008080',
	aqua: '#00FFFF',
};

export function isValidColor(color: string): boolean {
	// Check if it's a named color
	if (namedColors[color.toLowerCase()]) {
		return true;
	}
	// Check for hex colors (including those with alpha)
	if (/^#([0-9A-F]{3}){1,2}([0-9A-F]{2})?$/i.test(color)) {
		return true;
	}
	// Check for rgba() values
	if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*(?:0?\.)?\d+\s*)?\)$/i.test(color)) {
		return true;
	}
	return false;
}

export function colorToHex(color: string): string {
	// Handle named colors
	if (namedColors[color.toLowerCase()]) {
		return namedColors[color.toLowerCase()].toUpperCase() + 'FF'; // Add full opacity
	}

	if (color.startsWith('#')) {
		// If it's already a hex color
		if (color.length === 7) {
			// #RRGGBB format, add full opacity
			return (color + 'FF').toUpperCase();
		} else if (color.length === 9) {
			// #RRGGBBAA format, return as is
			return color.toUpperCase();
		} else if (color.length === 4) {
			// #RGB format, expand to #RRGGBBFF
			return (
				'#' +
				color[1] +
				color[1] +
				color[2] +
				color[2] +
				color[3] +
				color[3] +
				'FF'
			).toUpperCase();
		}
	}
	// For rgb() and rgba(), convert to hex
	const match = color.match(
		/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?\)$/i,
	);
	if (match) {
		const r = parseInt(match[1], 10);
		const g = parseInt(match[2], 10);
		const b = parseInt(match[3], 10);
		const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255) : 255;
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0')}${a.toString(16).padStart(2, '0')}`.toUpperCase();
	}
	// If conversion is not possible, return the original color
	return color;
}
