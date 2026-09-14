import { type ImageResizeMode } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { DEFAULT_CROP_DIMENSIONS } from './default-crop-dimensions';
import { DEFAULT_STRETCHY_FIT_DIMENSIONS } from './default-stretchy-fit-dimensions';

export const calculateInitialDimensions = (resizeMode: ImageResizeMode): React.CSSProperties => {
	if (resizeMode === 'fit' || resizeMode === 'full-fit') {
		return { maxWidth: `100%`, maxHeight: `100%` };
	}

	if (resizeMode === 'stretchy-fit') {
		// assume the image is landscape
		return DEFAULT_STRETCHY_FIT_DIMENSIONS;
	}

	// resizeMode === 'crop'
	// assume the image is landscape
	return fg('media-perf-uplift-mutation-fix') ? DEFAULT_CROP_DIMENSIONS : { width: '100%' };
};
