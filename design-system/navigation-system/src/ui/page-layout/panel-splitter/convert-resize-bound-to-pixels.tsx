import type { ResizeBound } from './types';

/**
 * Resize bounds can either be provided in `vw` or `px` units. This function will convert the value into pixels.
 *
 * It accesses the `window` object to get the viewport width, so should only be used in the browser.
 */
export function convertResizeBoundToPixels(resizeBound: ResizeBound): number {
	if (resizeBound.endsWith('vw')) {
		// Max width was provided in `vw` units, so is relative to the viewport width.
		// e.g. 50vw = 50% of the viewport width.
		// `parseInt` will remove the `vw` suffix.
		const maxWidthFraction = parseInt(resizeBound) / 100;
		return Math.floor(window.innerWidth * maxWidthFraction);
	}

	// Max width was provided in `px` units, so we can parse it directly.
	// `parseInt` will remove the `px` suffix.
	return Math.floor(parseInt(resizeBound));
}
