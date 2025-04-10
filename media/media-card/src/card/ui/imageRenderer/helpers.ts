import { type ImageResizeMode } from '@atlaskit/media-client';

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

export const calculateInitialDimensions = (resizeMode: ImageResizeMode): React.CSSProperties => {
	if (resizeMode === 'fit' || resizeMode === 'full-fit') {
		return { maxWidth: `100%`, maxHeight: `100%` };
	}

	if (resizeMode === 'stretchy-fit') {
		// assume the image is landscape
		return { width: '100%', maxHeight: '100%' };
	}

	// resizeMode === 'crop'
	// assume the image is landscape
	return { width: '100%' };
};
