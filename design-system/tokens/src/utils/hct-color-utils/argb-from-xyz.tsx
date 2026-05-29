import { argbFromRgb } from './argb-from-rgb';
import { delinearized } from './delinearized';

/**
 * Color science utilities.
 *
 * Utility methods for color science constants and color space
 * conversions that aren't HCT or CAM16.
 */
const XYZ_TO_SRGB = [
	[3.2413774792388685, -1.5376652402851851, -0.49885366846268053],
	[-0.9691452513005321, 1.8758853451067872, 0.04156585616912061],
	[0.05562093689691305, -0.20395524564742123, 1.0571799111220335],
];

/**
 * Converts a color from ARGB to XYZ.
 */
export function argbFromXyz(x: number, y: number, z: number): number {
	const matrix = XYZ_TO_SRGB;
	const linearR = matrix[0][0] * x + matrix[0][1] * y + matrix[0][2] * z;
	const linearG = matrix[1][0] * x + matrix[1][1] * y + matrix[1][2] * z;
	const linearB = matrix[2][0] * x + matrix[2][1] * y + matrix[2][2] * z;
	const r = delinearized(linearR);
	const g = delinearized(linearG);
	const b = delinearized(linearB);
	return argbFromRgb(r, g, b);
}
