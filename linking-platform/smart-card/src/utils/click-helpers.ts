/**
 * Returns true for genuine middle-clicks (button === 1).
 * Filters out Windows right-clicks, which fire onAuxClick with button === 2
 * in addition to onContextMenu, to prevent double-counting.
 */
export const isAuxClick = (e: { button: number }): boolean => {
	return e.button === 1;
};
