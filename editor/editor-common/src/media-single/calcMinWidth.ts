import { MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH, MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH } from './constants';

/**
 * Retuns minimum value for media single node
 * @param isVideoFile is child media of video type
 * @param contentWidth parent content width
 */
export const calcMinWidth = (isVideoFile: boolean, contentWidth: number): number => {
	return Math.min(
		contentWidth,
		isVideoFile ? MEDIA_SINGLE_VIDEO_MIN_PIXEL_WIDTH : MEDIA_SINGLE_DEFAULT_MIN_PIXEL_WIDTH,
	);
};
