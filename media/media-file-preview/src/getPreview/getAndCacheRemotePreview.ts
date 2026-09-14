import {
	type MediaBlobUrlAttrs,
	type MediaClient,
	type MediaStoreGetFileImageParams,
} from '@atlaskit/media-client';
import { type MediaTraceContext } from '@atlaskit/media-common';

import { type MediaFilePreview, type MediaFilePreviewDimensions } from '../types';

import { enrichAttrsWithClientId } from './enrichAttrsWithClientId';
import { extendAndCachePreview } from './extendAndCachePreview';
import { getRemotePreview } from './getRemotePreview';

export const getAndCacheRemotePreview = async (
	mediaClient: MediaClient,
	id: string,
	dimensions: MediaFilePreviewDimensions,
	params: MediaStoreGetFileImageParams,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	traceContext?: MediaTraceContext,
): Promise<MediaFilePreview> => {
	const [remotePreview, enrichedAttrs] = await Promise.all([
		getRemotePreview(mediaClient, id, params, traceContext),
		enrichAttrsWithClientId(mediaClient, id, mediaBlobUrlAttrs, params.collection),
	]);

	return extendAndCachePreview(id, params.mode, { ...remotePreview, dimensions }, enrichedAttrs);
};
