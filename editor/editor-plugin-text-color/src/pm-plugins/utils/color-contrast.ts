// from platform/packages/design-system/tokens/src/utils/get-contrast-ratio.tsx

import { isHex } from '@atlaskit/adf-schema';

function hexToRgb(hex: string): [number, number, number] {
	if (!isHex(hex)) {
		throw new Error('Invalid HEX');
	}

	const colorParts = hex.substring(1).split('');
	const color =
		colorParts.length === 3 || colorParts.length === 4
			? `${colorParts[0]}${colorParts[0]}${colorParts[1]}${colorParts[1]}${colorParts[2]}${colorParts[2]}`
			: colorParts.slice(0, 6).join('');
	const colorValue = Number(`0x${color}`);

	return [(colorValue >> 16) & 255, (colorValue >> 8) & 255, colorValue & 255];
}

function relativeLuminanceW3C(r: number, g: number, b: number): number {
	const RsRGB = r / 255;
	const GsRGB = g / 255;
	const BsRGB = b / 255;

	const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
	const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
	const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function getContrastRatio(foreground: string, background: string): number {
	if (!isHex(foreground) || !isHex(background)) {
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
	const brightest = Math.max(foregroundLuminance, backgroundLuminance);
	const darkest = Math.min(foregroundLuminance, backgroundLuminance);
	return (brightest + 0.05) / (darkest + 0.05);
}
