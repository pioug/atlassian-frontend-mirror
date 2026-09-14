/**
 * Checks whether a status code is a 5xx HTTP code.
 * @param {number} status HTTP status code
 */
export function is5xx(status: number): boolean {
	return 500 <= status && status <= 599;
}
