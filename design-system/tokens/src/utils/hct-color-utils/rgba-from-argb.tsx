import { alphaFromArgb } from './alpha-from-argb';
import { blueFromArgb } from './blue-from-argb';
import { greenFromArgb } from './green-from-argb';
import { redFromArgb } from './red-from-argb';
import type { Rgba } from './rgba';

/**
 * Return RGBA from a given int32 color
 *
 * @param argb ARGB representation of a int32 color.
 * @return RGBA representation of a int32 color.
 */
export function rgbaFromArgb(argb: number): Rgba {
	const r = redFromArgb(argb);
	const g = greenFromArgb(argb);
	const b = blueFromArgb(argb);
	const a = alphaFromArgb(argb);
	return { r, g, b, a };
}
