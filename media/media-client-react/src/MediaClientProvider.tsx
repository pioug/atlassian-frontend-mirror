import React, { useMemo } from 'react';

import { MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

export const MediaClientContext = React.createContext<MediaClient | undefined>(undefined);

interface MediaClientProviderProp {
	children: React.ReactNode;
	clientConfig: MediaClientConfig;
}

const mediaClientsMap = new Map<MediaClientConfig, MediaClient>();

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
export const MediaClientProvider = ({ children, clientConfig }: MediaClientProviderProp) => {
	const mediaClient = useMemo(() => getMediaClient(clientConfig), [clientConfig]);
	return <MediaClientContext.Provider value={mediaClient}>{children}</MediaClientContext.Provider>;
};

export const useMediaClient = () => {
	const mediaClient = React.useContext(MediaClientContext);
	if (!mediaClient) {
		throw new Error('No MediaClient set, use MediaClientProvider to set one');
	}
	return mediaClient;
};
