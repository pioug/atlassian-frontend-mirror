export function filterNull<T>(x?: T): x is Exclude<T, null> {
	return !!x;
}
