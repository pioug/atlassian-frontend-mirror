import { parseHex } from './formats/hex';
import { parseHsl } from './formats/hsl';
import { parseRgb } from './formats/rgb';
import type { RGB } from './types';

/**
 * Attempts to parse a CSS color string into a standard RGB format.
 *
 * Supported formats:
 *
 * - Hex
 * - RGB
 * - HSL
 *
 * Returns `null` on failure.
 */
export function parseUserColor(color: string): RGB | null {
	if (color.startsWith('#')) {
		return parseHex(color);
	}

	if (color.startsWith('rgb(')) {
		return parseRgb(color);
	}

	if (color.startsWith('hsl(')) {
		return parseHsl(color);
	}

	return null;
}
