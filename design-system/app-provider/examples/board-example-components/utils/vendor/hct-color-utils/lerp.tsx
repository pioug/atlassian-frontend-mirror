/**
 * The linear interpolation function.
 *
 * @return start if amount = 0 and stop if amount = 1
 */
export function lerp(start: number, stop: number, amount: number): number {
	return (1.0 - amount) * start + amount * stop;
}
