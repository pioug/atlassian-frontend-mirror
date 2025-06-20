import type { RGB } from '../types';

/**
 * Attempts to parse a legacy notation CSS `rgb()` color string.
 *
 * Returns `null` on failure.
 */
export function parseRgb(color: string): RGB | null {
	/**
	 * I was creating increasingly complex regular expressions, aiming for correct parsing.
	 *
	 * I decided to be pragmatic and just opt for what Nav 3 does (through the `chromatism` library),
	 * with some slight improvements.
	 *
	 * We can refine it as needed.
	 *
	 * Known limitations of this approach:
	 *
	 * - It is overly permissive and will allow some invalid syntax,
	 *   for example `rgb(1, 2, 3, 4, 5, 6, 7)` where it would just extract the first 3 parameters
	 * - Only the integer parts of non-integers will be parsed
	 * - Only supports the legacy, comma-separated syntax
	 */
	const [r, g, b] = color
		.replace(/rgb\(|[)\s]/g, '')
		.split(',')
		.map((value) => parseInt(value, 10))
		// Clamping to align with CSS behavior
		.map((value) => Math.max(0, Math.min(value, 255)));

	if ([r, g, b].some((n) => !Number.isInteger(n))) {
		if (process.env.NODE_ENV !== 'production') {
			// eslint-disable-next-line no-console
			console.error(`parseRgb failed to parse input: '${color}'`);
		}

		return null;
	}

	return { r, g, b };
}
