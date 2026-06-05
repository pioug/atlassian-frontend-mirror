import { akEditorDefaultLayoutWidth } from '@atlaskit/editor-shared-styles';

import { DEFAULT_IMAGE_WIDTH, MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH } from './constants';

/**
 * Calculate initial media single pixel width.
 * Make it fall between max width and min width
 * @param origWidth original width of image (media node width)
 * @param maxWidth default to akEditorDefaultLayoutWidth (760)
 * @param minWidth default to MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH (24)
 */
export const getMediaSingleInitialWidth = (
	origWidth: number = DEFAULT_IMAGE_WIDTH,
	maxWidth: number = akEditorDefaultLayoutWidth,
	minWidth: number = MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
): number => {
	return Math.max(Math.min(origWidth, maxWidth), minWidth);
};
