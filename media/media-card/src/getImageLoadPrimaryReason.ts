import type { ImageLoadPrimaryReason } from './errors';
import { type CardPreview } from './types';

export const getImageLoadPrimaryReason = (
	source?: CardPreview['source'],
): ImageLoadPrimaryReason => {
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
		// This fail reason will come from a bug, most likely.
		default:
			return `unknown-uri`;
	}
};
