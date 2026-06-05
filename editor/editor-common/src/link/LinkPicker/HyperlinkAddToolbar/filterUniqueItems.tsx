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
