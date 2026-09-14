import type { ImageLoadPrimaryReason } from './errors';
import { MediaFilePreviewError } from './MediaFilePreviewError';
import { type MediaFilePreview } from './types';

const getImageLoadPrimaryReason = (source?: MediaFilePreview['source']): ImageLoadPrimaryReason => {
	switch (source) {
		case 'cache-remote':
			return 'cache-remote-uri';
		case 'cache-local':
			return 'cache-local-uri';
		case 'external':
			return 'external-uri';
		case 'local':
			return 'local-uri';
		case 'remote':
			return 'remote-uri';
		case 'ssr-client':
			return 'ssr-client-uri';
		case 'ssr-server':
		case 'ssr-data':
			return 'ssr-server-uri';
		// This fail reason will come from a bug, most likely.
		default:
			return `unknown-uri`;
	}
};

export class ImageLoadError extends MediaFilePreviewError {
	constructor(source?: MediaFilePreview['source']) {
		super(getImageLoadPrimaryReason(source));
	}
}
