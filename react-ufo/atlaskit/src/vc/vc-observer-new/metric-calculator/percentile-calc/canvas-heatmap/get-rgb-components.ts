import type { RGBColor } from './canvas-pixel';

/**
 * Converts a number into RGB components in such a way that they can be recombined
 * to form the original number using bitwise operations.
 * @param number - The input number to be split into RGB components.
 * @returns The RGB color string in the format "rgb(r, g, b)".
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getRGBComponents(n: number): RGBColor {
	// Ensure the input is within the valid range for a 24-bit color
	if (n < 0 || n > 0xffffff) {
		throw new Error('Input number must be between 0 and 16777215 (inclusive).');
	}

	// Extract blue component (bits 0-7)
	const blue = n & 0xff;

	// Extract green component (bits 8-15)
	const green = (n >> 8) & 0xff;

	// Extract red component (bits 16-23)
	const red = (n >> 16) & 0xff;

	return `rgb(${red}, ${green}, ${blue})`;
}
