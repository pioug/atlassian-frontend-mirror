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

/**
 * Returns one of functions depending on a boolean condition.
 * Both functions should have the same input arguments, but might have different returns.
 * @see {@link functionWithCondition} for functions with similar return types
 */

export function functionUnionWithCondition<Arguments extends any[], R1, R2>(
	condition: () => boolean,
	functionTrue: (...args: Arguments) => R1,
	functionFalse: (...args: Arguments) => R2,
): (...args: Arguments) => R1 | R2 {
	// @ts-expect-error TS2345: Argument of type '(...args: C) => R2' is not assignable to parameter of type '(...args: C) => R1'.
	return functionWithCondition(condition, functionTrue, functionFalse);
}
