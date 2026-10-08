/**
 * Converts a color from RGB components to ARGB format.
 */
export function argbFromRgb(red: number, green: number, blue: number): number {
	return ((255 << 24) | ((red & 255) << 16) | ((green & 255) << 8) | (blue & 255)) >>> 0;
}
