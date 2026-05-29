import { clampComponent } from './clamp-component';
import type { Rgba } from './rgba';

/**
 * Return int32 color from a given RGBA component
 *
 * @param rgba RGBA representation of a int32 color.
 * @returns ARGB representation of a int32 color.
 */
export function argbFromRgba({ r, g, b, a }: Rgba): number {
	const rValue = clampComponent(r);
	const gValue = clampComponent(g);
	const bValue = clampComponent(b);
	const aValue = clampComponent(a);
	return (aValue << 24) | (rValue << 16) | (gValue << 8) | bValue;
}
