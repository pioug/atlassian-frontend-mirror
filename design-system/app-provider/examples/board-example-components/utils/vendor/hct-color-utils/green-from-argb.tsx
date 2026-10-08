/**
 * Returns the green component of a color in ARGB format.
 */
export function greenFromArgb(argb: number): number {
	return (argb >> 8) & 255;
}
