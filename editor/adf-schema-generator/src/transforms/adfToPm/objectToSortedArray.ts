export const objectToSortedArray = <V>(resMap: Record<string, V>): [string, V][] => {
	return Object.entries(resMap).sort(([key1], [key2]) => key1.localeCompare(key2));
};
