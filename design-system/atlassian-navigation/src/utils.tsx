/**
 * Returns a new object with only non-empty properties of the input object.
 *
 * In this context, "empty" refers to properties with `null`, `undefined`, or `""`
 * (empty string) values.
 *
 * @param obj - The input object.
 * @returns A new object with non-empty properties of the input object.
 */
export function stripEmptyProperties<T extends object>(obj: T): Partial<T> {
	return Object.entries(obj).reduce((acc: Partial<T>, [key, value]) => {
		if (value !== null && value !== undefined && value !== '') {
			acc[key as keyof T] = value;
		}
		return acc;
	}, {} as Partial<T>);
}
