import { argbFromRgb } from './argb-from-rgb';
import { delinearized } from './delinearized';

/**
 * Converts a color from linear RGB components to ARGB format.
 */
export function argbFromLinrgb(linrgb: number[]): number {
	const r = delinearized(linrgb[0]);
	const g = delinearized(linrgb[1]);
	const b = delinearized(linrgb[2]);
	return argbFromRgb(r, g, b);
}
