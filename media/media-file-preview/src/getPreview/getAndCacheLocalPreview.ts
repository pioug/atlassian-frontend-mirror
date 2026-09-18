import {
	type FilePreview,
	type MediaBlobUrlAttrs,
	type MediaClient,
	type MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';

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
