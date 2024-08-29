import { MediaClient, type MediaClientConfig, type MediaStore } from '@atlaskit/media-client';

import { mediaClientsMap } from '../MediaClientProvider';

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
