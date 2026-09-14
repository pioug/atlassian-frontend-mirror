/**
 * Runtime membership check for string literal tuples.
 * Keeps guard logic aligned with tuple-derived union types.
 */
export const isOneOf = <T extends readonly string[]>(
	values: T,
	value: unknown,
): value is T[number] => typeof value === 'string' && (values as readonly string[]).includes(value);
