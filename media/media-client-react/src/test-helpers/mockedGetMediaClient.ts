import type { MediaClientConfig } from '@atlaskit/media-client';
import { MediaClient } from '@atlaskit/media-client/media-client';
import type { MediaStore } from '@atlaskit/media-client/media-store';

import { mediaClientsMap } from '../getMediaClient';

export const mockedGetMediaClient = (
	mediaClientConfig: MediaClientConfig,
	mediaStore?: MediaStore,
): MediaClient => {
	if (!mediaClientConfig) {
		return new MediaClient(
			{
				authProvider: () =>
					Promise.resolve({
						clientId: '',
						token: '',
						baseUrl: '',
					}),
			},
			undefined,
			mediaStore,
		);
	}

	let mediaClient: MediaClient | undefined = mediaClientsMap.get(mediaClientConfig);

	if (!mediaClient) {
		mediaClient = new MediaClient(mediaClientConfig, undefined, mediaStore);
		mediaClientsMap.set(mediaClientConfig, mediaClient);
	}
	return mediaClient;
};
