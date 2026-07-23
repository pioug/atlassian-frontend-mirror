/**
 * Collapses literal types to their primitive equivalents.
 * Prevents callers from accidentally passing string/number/boolean
 * literals as the default value — which would cause the return type
 * to be unexpectedly narrow.
 *
 * e.g. `AssurePrimitives<'control'>` → `string`
 *      `AssurePrimitives<true>`      → `boolean`
 *      `AssurePrimitives<42>`        → `number`
 */
export type AssurePrimitives<T> = T extends string
	? string
	: T extends number
		? number
		: T extends boolean
			? boolean
			: T;
