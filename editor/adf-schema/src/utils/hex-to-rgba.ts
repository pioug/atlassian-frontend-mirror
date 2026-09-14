// eslint-disable-line import/no-namespace

import { normalizeHexColor } from './normalize-hex-color';

/**
 * Converts hex color format to rgba.
 *
 * @param hex - hex color string (#xxx, or #xxxxxx)
 */
export function hexToRgba(rawColor: string, alpha: number): string | null {
	const color = normalizeHexColor(rawColor);
	if (!color) {
		return null;
	}
	const hex2rgb = (color: string) => {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return color.match(/[a-z0-9]{2}/giu)!.map((hex) => parseInt(hex, 16));
	};

	return `rgba(${hex2rgb(color).concat(alpha).join(',')})`;
}
