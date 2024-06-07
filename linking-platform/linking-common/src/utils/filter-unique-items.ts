/**
 * Filters array to a set of unique items given a predicate/comparator function
 * @param arr Initial array of items
 * @param comparator Predicate function
 * @returns Array of filtered / unique items
 */
export function filterUniqueItems<T>(
	arr: Array<T>,
	comparator?: (firstItem: T, secondItem: T) => boolean,
): Array<T> {
	return arr.filter((firstItem, index, self) => {
		return (
			self.findIndex((secondItem) =>
				comparator ? comparator(firstItem, secondItem) : firstItem === secondItem,
			) === index
		);
	});
}
