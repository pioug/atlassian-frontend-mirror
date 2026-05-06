/**
 * Multiplies a 1x3 row vector with a 3x3 matrix.
 */
export function matrixMultiply(row: number[], matrix: number[][]): number[] {
	const a = row[0] * matrix[0][0] + row[1] * matrix[0][1] + row[2] * matrix[0][2];
	const b = row[0] * matrix[1][0] + row[1] * matrix[1][1] + row[2] * matrix[1][2];
	const c = row[0] * matrix[2][0] + row[1] * matrix[2][1] + row[2] * matrix[2][2];
	return [a, b, c];
}
