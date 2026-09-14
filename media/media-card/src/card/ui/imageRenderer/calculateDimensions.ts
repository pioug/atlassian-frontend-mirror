import { type ImageResizeMode } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { DEFAULT_CROP_DIMENSIONS } from './default-crop-dimensions';
import { DEFAULT_STRETCHY_FIT_DIMENSIONS } from './default-stretchy-fit-dimensions';

const roundedRatio = (ratio: number): number => {
	return Math.round(ratio * 100) / 100;
};

export const calculateDimensions = (
	imgElement: HTMLImageElement,
	parentElement: HTMLElement,
	resizeMode: ImageResizeMode,
): React.CSSProperties => {
	const { naturalWidth, width, naturalHeight, height } = imgElement;
	// Firefox & Safari can't always read the "natural" dimensions correctly.
	// When these are undefined or zero, we replace them with the rendered values
	const imgWidth = naturalWidth || width;
	const imgHeight = naturalHeight || height;

	const { width: parentWidth, height: parentHeight } = parentElement.getBoundingClientRect();

	if (resizeMode === 'fit' || resizeMode === 'full-fit') {
		return { maxWidth: `min(100%, ${imgWidth}px)`, maxHeight: `min(100%, ${imgHeight}px)` };
	}

	const imgRatio = imgWidth / imgHeight;
	const cardRatio = parentWidth / parentHeight;

	if (fg('media-perf-uplift-mutation-fix')) {
		const isSameRatio = fg('media-perf-ratio-calc-fix')
			? Math.abs(imgWidth / parentWidth - imgHeight / parentHeight) < 0.1
			: roundedRatio(imgWidth / parentWidth) === roundedRatio(imgHeight / parentHeight);
		if (isSameRatio) {
			if (resizeMode === 'stretchy-fit') {
				return DEFAULT_STRETCHY_FIT_DIMENSIONS;
			}
			return DEFAULT_CROP_DIMENSIONS;
		}
	}

	const isImageLandscapier = imgRatio > cardRatio;

	if (resizeMode === 'stretchy-fit') {
		if (isImageLandscapier) {
			return { width: '100%', maxHeight: '100%' };
		} else {
			return { height: '100%', maxWidth: '100%' };
		}
	}

	if (resizeMode === 'crop') {
		if (isImageLandscapier) {
			return { height: imgHeight, maxHeight: '100%' };
		} else {
			return { width: imgWidth, maxWidth: '100%' };
		}
	}

	return {};
};
