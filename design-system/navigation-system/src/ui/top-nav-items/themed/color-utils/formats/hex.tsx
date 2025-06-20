import type { RGB } from '../types';

// valid hex color (optional alpha channel) - 3, 4, 6, or 8 digits after the #
const isValidHex = (hex: string): boolean =>
	// Not using `([a-f0-9]{3,4}){1,2}` because that allows 7 digits which is invalid
	/^#(([a-f0-9]{3,4})|([a-f0-9][a-f0-9]){3,4})$/i.test(hex);

/**
 * Attempts to parse a hex color into RGB.
 *
 * Alpha channel will be accepted but ignored.
 *
 * Returns `null` on failure.
 */
export function parseHex(color: string): RGB | null {
	if (!isValidHex(color)) {
		if (process.env.NODE_ENV !== 'production') {
			// eslint-disable-next-line no-console
			console.error(`parseHex failed to parse input: '${color}'`);
		}

		return null;
	}

	let channels: { [Key in keyof RGB]: string };
	if (color.length <= 5) {
		// Hex code is shorthand - RGB channels are one digit
		channels = {
			r: color[1].repeat(2),
			g: color[2].repeat(2),
			b: color[3].repeat(2),
		};
	} else {
		// Hex code is longhand - RGB channels are two digits
		channels = {
			r: color.slice(1, 3),
			g: color.slice(3, 5),
			b: color.slice(5, 7),
		};
	}

	return {
		r: parseInt(channels.r, 16),
		g: parseInt(channels.g, 16),
		b: parseInt(channels.b, 16),
	};
}
