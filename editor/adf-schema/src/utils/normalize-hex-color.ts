import * as namedColors from 'css-color-names'; // eslint-disable-line import/no-namespace

import { isHex } from './is-hex';
import { isRgb } from './is-rgb';
import { rgbToHex } from './rgb-to-hex';

/**
 * @returns String with HEX-coded color.
 */
export function normalizeHexColor(color: string | null, defaultColor?: string): string | null {
	if (!color) {
		return null;
	}

	// Normalize to hex
	color = color.trim().toLowerCase();
	if (isHex(color)) {
		// Normalize 3-hex to 6-hex colours
		if (color.length === 4) {
			color = color
				.split('')
				.map((c) => (c === '#' ? '#' : `${c}${c}`))
				.join('');
		}
	} else if (isRgb(color)) {
		return rgbToHex(color);
	} else {
		// http://dev.w3.org/csswg/css-color/#named-colors
		if (color === 'default') {
			return null;
		} else if (
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(namedColors as any).default &&
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(namedColors as any).default[color]
		) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			color = (namedColors as any).default[color];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} else if ((namedColors as any) && (namedColors as any)[color]) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			color = (namedColors as any)[color];
		} else {
			return null;
		}
	}

	if (color === defaultColor) {
		return null;
	}

	return color;
}
