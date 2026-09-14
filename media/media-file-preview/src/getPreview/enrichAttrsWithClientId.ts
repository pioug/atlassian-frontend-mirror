import { type MediaBlobUrlAttrs, type MediaClient } from '@atlaskit/media-client';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { mergeClientIdIntoAttrs } from './mergeClientIdIntoAttrs';

/**
 * Resolves clientId (sync first, async fallback) and enriches mediaBlobUrlAttrs
 * with it for cross-client copy support.
 */
export const enrichAttrsWithClientId = async (
	mediaClient: MediaClient,
	id: string,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	collectionName?: string,
): Promise<MediaBlobUrlAttrs | undefined> => {
	if (!fg('platform_media_cross_client_copy_with_auth')) {
		return mediaBlobUrlAttrs;
	}

	// Try sync first, then async fallback
	let clientId = mediaClient.getClientIdSync();
	if (!clientId) {
		try {
			clientId = await mediaClient.getClientId(collectionName);
		} catch {
			// clientId is optional, silently fail
		}
	}

	return mergeClientIdIntoAttrs(clientId, id, mediaBlobUrlAttrs, collectionName);
};
