/**
 * Compares two container lists by id, ignoring order.
 *
 * 1. Returns false immediately if the lengths differ.
 * 2. Sorts both lists by `id` and compares ids pairwise, so field-level changes are ignored.
 *
 * Contrast with `containersDeepEqual` in `./containers-deep-equal`, which also compares contents.
 */
export function containersEqual<T extends { id: string }>(arr1: T[], arr2: T[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}
	const sortById = (a: T, b: T) => a.id.localeCompare(b.id);
	const sorted1 = [...arr1].sort(sortById);
	const sorted2 = [...arr2].sort(sortById);
	return sorted1.every((item, index) => item.id === sorted2[index].id);
}
