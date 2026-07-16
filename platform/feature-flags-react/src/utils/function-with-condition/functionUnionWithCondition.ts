import { functionWithCondition } from './functionWithCondition';

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
