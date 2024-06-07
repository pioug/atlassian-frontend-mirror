import React, { useMemo } from 'react';

import { type MediaStore as MediaApi, MediaClient } from '@atlaskit/media-client';
import { createMediaStore, type MediaStore } from '@atlaskit/media-state';

import { MediaClientContext } from '../MediaClientProvider';

export interface MockedMediaClientProviderProps {
	children: React.ReactNode;
	mockedMediaApi: Partial<MediaApi>;
	mediaStore?: MediaStore;
}

export const MockedMediaClientProvider = ({
	children,
	mediaStore = createMediaStore(),
	mockedMediaApi,
}: MockedMediaClientProviderProps) => {
	const mediaClient = useMemo(
		() =>
			new MediaClient(
				{
					authProvider: async () => {
						return {
							clientId: 'MockedMediaClientProvider-client-id',
							token: 'MockedMediaClientProvider-token',
							baseUrl: 'MockedMediaClientProvider-service-host',
						};
					},
				},
				mediaStore,
				mockedMediaApi as MediaApi,
			),
		[mockedMediaApi, mediaStore],
	);

	return <MediaClientContext.Provider value={mediaClient}>{children}</MediaClientContext.Provider>;
};
