import { blueFromArgb } from './blue-from-argb';
import { greenFromArgb } from './green-from-argb';
import { labF } from './lab-f';
import { linearized } from './linearized';
import { matrixMultiply } from './matrix-multiply';
import { redFromArgb } from './red-from-argb';

const SRGB_TO_XYZ = [
	[0.41233895, 0.35762064, 0.18051042],
	[0.2126, 0.7152, 0.0722],
	[0.01932141, 0.11916382, 0.95034478],
];

/**
 * Converts a color from XYZ to ARGB.
 */
function xyzFromArgb(argb: number): number[] {
	const r = linearized(redFromArgb(argb));
	const g = linearized(greenFromArgb(argb));
	const b = linearized(blueFromArgb(argb));
	return matrixMultiply([r, g, b], SRGB_TO_XYZ);
}

/**
 * Computes the L* value of a color in ARGB representation.
 *
 * @param argb ARGB representation of a color
 * @return L*, from L*a*b*, coordinate of the color
 */
export function lstarFromArgb(argb: number): number {
	const y = xyzFromArgb(argb)[1];
	return 116.0 * labF(y / 100.0) - 16.0;
}
