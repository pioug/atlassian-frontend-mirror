import React, { useMemo } from 'react';

import {
	type MediaStore as MediaApi,
	MediaClient,
	type MediaClientConfig,
} from '@atlaskit/media-client';
import { createMediaStore, type MediaStore } from '@atlaskit/media-state';

import { MediaContext } from '../MediaProvider';
import { type MediaSettings, useMediaParsedSettings } from '../mediaSettings';

export interface MockedMediaProviderProps {
	children: React.ReactNode;
	mockedMediaApi: Partial<MediaApi>;
	mediaStore?: MediaStore;
	mediaClientConfig?: Partial<MediaClientConfig>;
	mediaSettings?: MediaSettings;
}

export const mockedMediaClientConfig = {
	authProvider: async () => {
		return {
			clientId: 'MockedMediaProvider-client-id',
			token: 'MockedMediaProvider-token',
			baseUrl: 'MockedMediaProvider-service-host',
		};
	},
};

/** Generates a MediaProvider with mediaClient using a mocked MediaApi and MediaStore */
export const MockedMediaProvider = ({
	children,
	mediaStore,
	mockedMediaApi,
	mediaClientConfig,
	mediaSettings,
}: MockedMediaProviderProps): React.JSX.Element => {
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

	const settings = useMediaParsedSettings(mediaSettings);

	return (
		<MediaContext.Provider value={{ mediaClient, settings }}>{children}</MediaContext.Provider>
	);
};
