// Helpers
export const makeArray = <T>(maybeArray: T | Array<T>): T[] =>
	Array.isArray(maybeArray) ? maybeArray : [maybeArray];
