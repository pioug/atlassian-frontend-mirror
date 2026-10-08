/**
 * The signum function.
 *
 * @return 1 if num > 0, -1 if num < 0, and 0 if num = 0
 */
export function signum(num: number): number {
	if (num < 0) {
		return -1;
	} else if (num === 0) {
		return 0;
	} else {
		return 1;
	}
}
