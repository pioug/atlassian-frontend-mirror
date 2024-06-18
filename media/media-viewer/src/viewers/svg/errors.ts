import { type MediaSVGErrorReason } from '@atlaskit/media-svg';
import { type MediaViewerErrorReason } from '../../errors';

export const getErrorReason = (svgReason: MediaSVGErrorReason): MediaViewerErrorReason => {
	switch (svgReason) {
		case 'img-error':
			return 'svg-img-error';
		case 'binary-fetch':
			return 'svg-binary-fetch';
		default:
			return 'svg-unknown-error';
	}
};
