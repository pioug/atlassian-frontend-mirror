/**
 * Converts a length to a CSS length string. A number becomes `${value}px`, and a
 * string passes through unchanged. Apply at the API boundary, so internal code
 * only deals with strings.
 */
export function toCssLengthString({ value }: { value: number | string }): string {
	if (typeof value === 'number') {
		return `${value}px`;
	}
	return value;
}
