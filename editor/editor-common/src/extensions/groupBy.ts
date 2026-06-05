export const groupBy = <T>(
	arr: T[],
	attr: keyof T,
	keyRenamer: (key: T[keyof T]) => string,
): {
	[k: string]: T;
} =>
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	arr.reduce<any>((acc, item) => {
		acc[keyRenamer(item[attr])] = item;
		return acc;
	}, {});
