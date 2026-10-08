/**
 * Returns the red component of a color in ARGB format.
 */
export function redFromArgb(argb: number): number {
	return (argb >> 16) & 255;
}
