/**
 * Sanitizes a degree measure as a floating-point number.
 *
 * @return a degree measure between 0.0 (inclusive) and 360.0
 * (exclusive).
 */
export function sanitizeDegreesDouble(degrees: number): number {
	degrees = degrees % 360.0;
	if (degrees < 0) {
		degrees = degrees + 360.0;
	}
	return degrees;
}
