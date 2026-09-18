import {
	addFileAttrsToUrl,
	type MediaBlobUrlAttrs,
	type MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';

import { type MediaFilePreview } from '../types';
import { mediaFilePreviewCache } from './cache';

export const extendAndCachePreview = (
	id: string,
	mode: MediaStoreGetFileImageParams['mode'] | undefined,
	preview: MediaFilePreview,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
): MediaFilePreview => {
	let source: MediaFilePreview['source'];
	switch (preview.source) {
		case 'local':
			source = 'cache-local';
			break;
		case 'remote':
			source = 'cache-remote';
			break;
		default:
			source = preview.source;
	}
	// We want to embed some meta context into dataURI for Copy/Paste to work.
	const dataURI = mediaBlobUrlAttrs
		? addFileAttrsToUrl(preview.dataURI, mediaBlobUrlAttrs)
		: preview.dataURI;
	// We store new cardPreview into cache
	mediaFilePreviewCache.set(id, mode, { ...preview, source, dataURI });
	return { ...preview, dataURI };
};
