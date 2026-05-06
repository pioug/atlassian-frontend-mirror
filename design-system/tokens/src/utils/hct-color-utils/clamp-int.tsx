/**
 * Clamps an integer between two integers.
 *
 * @return input when min <= input <= max, and either min or max
 * otherwise.
 */
export function clampInt(min: number, max: number, input: number): number {
	if (input < min) {
		return min;
	} else if (input > max) {
		return max;
	}

	return input;
}
