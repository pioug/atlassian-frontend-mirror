// eslint-disable-line import/no-namespace

import { isHex } from './is-hex';

/**
 * Converts hex color format to rgb.
 * Works well with full hex color format and shortcut as well.
 *
 * @param hex - hex color string (#xxx, or #xxxxxx)
 */
export function hexToRgb(color: string): string | null {
	if (!isHex(color)) {
		return null;
	}

	let colorBits = color.substring(1).split('');
	if (colorBits.length === 3) {
		colorBits = [
			colorBits[0],
			colorBits[0],
			colorBits[1],
			colorBits[1],
			colorBits[2],
			colorBits[2],
		];
	}

	const rgb = Number(`0x${colorBits.join('')}`);

	return `rgb(${(rgb >> 16) & 255},${(rgb >> 8) & 255},${rgb & 255})`;
}
