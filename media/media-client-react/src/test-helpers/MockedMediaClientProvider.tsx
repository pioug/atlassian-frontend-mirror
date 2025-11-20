import React, { useMemo } from 'react';

import {
	type MediaStore as MediaApi,
	MediaClient,
	type MediaClientConfig,
} from '@atlaskit/media-client';
import { createMediaStore, type MediaStore } from '@atlaskit/media-state';

import { MediaClientContext } from '../MediaClientProvider';

export interface MockedMediaClientProviderProps {
	children: React.ReactNode;
	mockedMediaApi: Partial<MediaApi>;
	mediaStore?: MediaStore;
	mediaClientConfig?: Partial<MediaClientConfig>;
}

export const mockedMediaClientConfig = {
	authProvider: async () => {
		return {
			clientId: 'MockedMediaClientProvider-client-id',
			token: 'MockedMediaClientProvider-token',
			baseUrl: 'MockedMediaClientProvider-service-host',
		};
	},
};

export const MockedMediaClientProvider = ({
	children,
	mediaStore,
	mockedMediaApi,
	mediaClientConfig,
}: MockedMediaClientProviderProps): React.JSX.Element => {
	// WARNING: when mediaStore is updated externally, it gets out of sync with FileStreamCache. This resutls in unexpected behaviour.
	const currentStore = useMemo(() => mediaStore || createMediaStore(), [mediaStore]);
	const resolvedMediaClientConfig = useMemo(
		(): MediaClientConfig => ({ ...mockedMediaClientConfig, ...mediaClientConfig }),
		[mediaClientConfig],
	);

	const mediaClient = useMemo(
		() => new MediaClient(resolvedMediaClientConfig, currentStore, mockedMediaApi as MediaApi),
		[mockedMediaApi, currentStore, resolvedMediaClientConfig],
	);

	return <MediaClientContext.Provider value={mediaClient}>{children}</MediaClientContext.Provider>;
};
