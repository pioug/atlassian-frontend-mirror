const IS_TESTING_ENV =
	typeof process !== 'undefined' &&
	(process?.env?.NODE_ENV === 'test' || process?.env?.JEST_WORKER_ID !== undefined);

export function oneOf<T extends string>(values: T[]): (value: unknown) => value is T {
	function typeGuard(value: unknown): value is T {
		return values.includes(value as T);
	}
	/**
	 * This is used by test utils to get the variants when running describe.each
	 */
	if (IS_TESTING_ENV) {
		typeGuard.values = values;
	}

	return typeGuard;
}
