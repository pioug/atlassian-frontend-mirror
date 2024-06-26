import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { MediaType } from '@atlaskit/media-client';
import { getMediaClient } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';

export const checkMediaType = async (
	mediaNode: PMNode,
	mediaClientConfig: MediaClientConfig,
): Promise<MediaType | 'external' | undefined> => {
	if (mediaNode.attrs.type === 'external') {
		return 'external';
	}

	if (!mediaNode.attrs.id) {
		return;
	}

	try {
		const fileState = await getMediaClient(mediaClientConfig).file.getCurrentState(
			mediaNode.attrs.id,
			{
				collectionName: mediaNode.attrs.collection,
			},
		);

		if (fileState && fileState.status !== 'error') {
			return fileState.mediaType;
		}
	} catch (err) {
		// return undefined in case of media client error
	}
};
