/**
 * Compares two container lists for deep equality, ignoring order.
 *
 * 1. Sorts both lists by `id`.
 * 2. Serialises each and compares the results, so a change to any field counts as a difference.
 *
 * Contrast with `containersEqual` in `./containers-equal`, which compares `id` alone and so
 * treats two lists of the same containers as equal even when their contents differ.
 */
export function containersDeepEqual<T extends { id: string }>(arr1: T[], arr2: T[]): boolean {
	const sortById = (a: T, b: T) => a.id.localeCompare(b.id);
	return JSON.stringify([...arr1].sort(sortById)) === JSON.stringify([...arr2].sort(sortById));
}
