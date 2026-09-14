import { type MediaFilePreviewDimensions } from './types';

export const isWider = (
	current?: MediaFilePreviewDimensions,
	next?: MediaFilePreviewDimensions,
): boolean => {
	if (current === undefined && next !== undefined) {
		return true;
	}

	const currentWidth = current?.width || 0;
	const nextWidth = next?.width || 0;

	return currentWidth < nextWidth;
};
