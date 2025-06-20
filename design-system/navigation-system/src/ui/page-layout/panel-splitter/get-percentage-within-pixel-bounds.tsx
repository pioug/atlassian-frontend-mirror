import type { PixelResizeBounds } from './types';

/**
 * Returns the percentage of the current width within the resize bounds.
 * It expects the resize bounds to already have been converted into numeric values, in pixel units.
 *
 * The return value is clamped between 0 and 100. This is to prevent the screen reader text (aria-valuetext)
 * from announcing an out-of-bounds percentage when the user is resizing the viewport.
 *
 * Examples:
 * - if the current width is 200px, and the resize bounds are 100px and 300px,
 * the percentage is 50%, and the function will return the number 50.
 * - if the current value is 400, and the resize bounds are 100 and 300, the
 * "percentage" is 100% and the function will return the number 100.
 */
export function getPercentageWithinPixelBounds({
	currentWidth,
	resizeBounds,
}: {
	currentWidth: number;
	resizeBounds: PixelResizeBounds;
}): number {
	const resizeRange = resizeBounds.max - resizeBounds.min;
	const widthAsPercentage = ((currentWidth - resizeBounds.min) / resizeRange) * 100;

	if (widthAsPercentage < 0) {
		return 0;
	}

	if (widthAsPercentage > 100) {
		return 100;
	}

	return Math.floor(widthAsPercentage);
}
