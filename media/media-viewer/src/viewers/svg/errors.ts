import type { MediaSVGErrorReason } from '@atlaskit/media-svg/media-svg-error';

import type { MediaViewerErrorReason } from '../../MediaViewerError';

export const getErrorReason = (svgReason: MediaSVGErrorReason): MediaViewerErrorReason => {
	switch (svgReason) {
		case 'img-error':
			return 'svg-img-error';
		case 'binary-fetch':
			return 'svg-binary-fetch';
		case 'blob-to-datauri':
			return 'svg-blob-to-datauri';
		default:
			return 'svg-unknown-error';
	}
};
