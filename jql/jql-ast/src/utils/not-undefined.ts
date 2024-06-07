/**
 * Type predicate to assert an argument is not undefined.
 */
export function notUndefined<T>(x: T | void): x is T {
	return x !== undefined;
}
