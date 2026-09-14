import { type MediaBlobUrlAttrs } from '@atlaskit/media-client';

/**
 * Merges a clientId into mediaBlobUrlAttrs for cross-client copy support.
 * Returns the original attrs unchanged if clientId is not available or the feature flag is off.
 */
export const mergeClientIdIntoAttrs = (
	clientId: string | undefined,
	id: string,
	mediaBlobUrlAttrs?: MediaBlobUrlAttrs,
	collectionName?: string,
): MediaBlobUrlAttrs | undefined => {
	if (!clientId) {
		return mediaBlobUrlAttrs;
	}

	if (mediaBlobUrlAttrs) {
		return { ...mediaBlobUrlAttrs, clientId };
	}

	// Construct minimal attrs when none provided
	return {
		id,
		clientId,
		contextId: collectionName || '',
		collection: collectionName,
	};
};
