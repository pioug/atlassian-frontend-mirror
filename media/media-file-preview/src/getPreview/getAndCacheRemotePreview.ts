import type { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaStoreGetFileImageParams } from '@atlaskit/media-client/media-store/types';
import type { MediaBlobUrlAttrs } from '@atlaskit/media-client/url';
import type { MediaTraceContext } from '@atlaskit/media-common/analytics/types';

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
