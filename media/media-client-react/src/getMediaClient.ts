import { MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

export const mediaClientsMap = new Map<MediaClientConfig, MediaClient>();

export const getMediaClient = (mediaClientConfig: MediaClientConfig): MediaClient => {
	// The Provider defines mediaClientConfig as required,
	// but integrators may skip it when using Media Card to display external images
	// i.e. a Media Client is not needed.
	// An empty mediaClientConfig object `{}` won't fall into this case,
	// but that case is handled internally by Media Client.
	if (!mediaClientConfig) {
		return new MediaClient({
			authProvider: () =>
				Promise.resolve({
					clientId: '',
					token: '',
					baseUrl: '',
				}),
		});
	}
	let mediaClient: MediaClient | undefined = mediaClientsMap.get(mediaClientConfig);

	if (!mediaClient) {
		mediaClient = new MediaClient(mediaClientConfig);
		mediaClientsMap.set(mediaClientConfig, mediaClient);
	}
	return mediaClient;
};
