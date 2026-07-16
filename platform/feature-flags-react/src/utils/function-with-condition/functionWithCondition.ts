/**
 * Returns one of functions depending on a boolean condition.
 * Both functions should have the same signature.
 * @see {@link functionUnionWithCondition} for functions with different return types
 */
export function functionWithCondition<Fn extends (...args: any[]) => any>(
	condition: () => boolean,
	functionTrue: Fn,
	functionFalse: Fn,
): Fn {
	const fnWithCondition = ((...args) =>
		condition() ? functionTrue(...args) : functionFalse(...args)) as Fn;
	// Improvement: set name on a function. Requires external helper, not required for production

	return fnWithCondition;
}
