import { type MediaFilePreviewDimensions } from './types';

/**
 * Checks if at least one of next dimensions is bigger than current
 * If a single dimension is undefined, returns false
 */
export const isBigger = (
	current?: MediaFilePreviewDimensions,
	next?: MediaFilePreviewDimensions,
): boolean => {
	const { width: currentWidth, height: currentHeight } = current || {};
	const { width: nextWidth, height: nextHeight } = next || {};

	if (!!currentWidth && !!currentHeight && !!nextWidth && !!nextHeight) {
		const nextIsWider = currentWidth < nextWidth;
		const nextIsHigher = currentHeight < nextHeight;
		return nextIsHigher || nextIsWider;
	} else {
		return false;
	}
};
