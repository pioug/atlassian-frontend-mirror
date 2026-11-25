export const shallowEquals = (objectA?: object, objectB?: object): boolean => {
	if (!objectA && !objectB) {
		return true;
	}

	if (!objectA || !objectB) {
		return false;
	}

	const aEntries: [string, unknown][] = Object.entries(objectA);
	const bEntries: [string, unknown][] = Object.entries(objectB);
	if (aEntries.length !== bEntries.length) {
		return false;
	}

	const ascendingKeyOrder = ([key1]: [string, unknown], [key2]: [string, unknown]) =>
		key1.localeCompare(key2);
	aEntries.sort(ascendingKeyOrder);
	bEntries.sort(ascendingKeyOrder);

	for (let i = 0; i < aEntries.length; i++) {
		// @ts-ignore - TS2488 - Type '[string, unknown] | undefined' must have a '[Symbol.iterator]()' method that returns an iterator.
		const [, aValue] = aEntries[i];
		// @ts-ignore - TS2488 - Type '[string, unknown] | undefined' must have a '[Symbol.iterator]()' method that returns an iterator.
		const [, bValue] = bEntries[i];
		if (aValue !== bValue) {
			return false;
		}
	}

	return true;
};
