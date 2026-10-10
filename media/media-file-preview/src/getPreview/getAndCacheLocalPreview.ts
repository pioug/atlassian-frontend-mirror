import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaStoreGetFileImageParams } from '@atlaskit/media-client/media-store/types';
import type { MediaBlobUrlAttrs } from '@atlaskit/media-client/url';
import type { FilePreview } from '@atlaskit/media-state/file-state';

import { type MediaFilePreview, type MediaFilePreviewDimensions } from '../types';
import { enrichAttrsWithClientId } from './enrichAttrsWithClientId';
import { extendAndCachePreview } from './extendAndCachePreview';
import { getLocalPreview } from './getLocalPreview';

export const getAndCacheLocalPreview = async (
	mediaClient: MediaClient,
	id: string,
	filePreview: FilePreview | Promise<FilePreview>,
	dimensions: MediaFilePreviewDimensions,
	mode: MediaStoreGetFileImageParams['mode'],
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	collectionName?: string,
): Promise<MediaFilePreview> => {
	const [localPreview, enrichedAttrs] = await Promise.all([
		getLocalPreview(filePreview),
		enrichAttrsWithClientId(mediaClient, id, mediaBlobUrlAttrs, collectionName),
	]);

	return extendAndCachePreview(id, mode, { ...localPreview, dimensions }, enrichedAttrs);
};
