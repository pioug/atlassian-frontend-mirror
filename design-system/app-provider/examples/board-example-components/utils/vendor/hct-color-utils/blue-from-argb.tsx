/**
 * Returns the blue component of a color in ARGB format.
 */
export function blueFromArgb(argb: number): number {
	return argb & 255;
}
