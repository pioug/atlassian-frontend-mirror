import { type MediaFilePreviewDimensions } from './types';

/** Verifies if the current screen is retina display */
function isRetina(): boolean {
	const mediaQuery =
		'(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';

	return (
		window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia(mediaQuery).matches)
	);
}

export const createRequestDimensions = (
	dimensions: Partial<MediaFilePreviewDimensions>,
): Partial<MediaFilePreviewDimensions> | undefined => {
	if (!dimensions) {
		return;
	}
	const retinaFactor = isRetina() ? 2 : 1;
	const { width, height } = dimensions;

	const result: Partial<MediaFilePreviewDimensions> = {};
	if (width) {
		result.width = width * retinaFactor;
	}
	if (height) {
		result.height = height * retinaFactor;
	}
	return result;
};
