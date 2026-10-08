import { argbFromRgb } from './argb-from-rgb';
import { delinearized } from './delinearized';
import { yFromLstar } from './y-from-lstar';

/**
 * Converts an L* value to an ARGB representation.
 *
 * @param lstar L* in L*a*b*
 * @return ARGB representation of grayscale color with lightness
 * matching L*
 */
export function argbFromLstar(lstar: number): number {
	const y = yFromLstar(lstar);
	const component = delinearized(y);
	return argbFromRgb(component, component, component);
}
