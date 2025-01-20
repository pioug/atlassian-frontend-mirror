export function median(array: number[]) {
	const middle = Math.floor(array.length / 2);
	const sortedArray = [...array].sort((a, b) => a - b);

	return array.length % 2 !== 0
		? sortedArray[middle]
		: (sortedArray[middle - 1] + sortedArray[middle]) / 2;
}
