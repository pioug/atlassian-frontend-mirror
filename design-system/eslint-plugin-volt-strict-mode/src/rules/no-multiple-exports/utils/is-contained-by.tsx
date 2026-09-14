/**
 * True if `range` is fully contained within `container`. Both are `[start, end]`
 * source ranges. Used to attribute an identifier reference to the export subtree
 * (or declaration subtree) that contains it.
 */
export function isContainedBy(
	range: readonly [number, number],
	container: readonly [number, number],
): boolean {
	return range[0] >= container[0] && range[1] <= container[1];
}
