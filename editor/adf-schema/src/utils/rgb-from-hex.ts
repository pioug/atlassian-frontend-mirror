import { expandShorthandHex } from './expand-shorthand-hex';
import { FULL_HEX_REGEX } from './lch-color-inversion';
import type { RGB } from './lch-color-inversion';

export const rgbFromHex = (input: string): RGB | null => {
	const fullHex = expandShorthandHex(input);
	const result = FULL_HEX_REGEX.exec(fullHex);
	return result === null
		? null
		: {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			};
};
