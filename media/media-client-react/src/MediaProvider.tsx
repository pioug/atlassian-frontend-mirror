import React, { useMemo } from 'react';

import { type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

import { getMediaClient } from './getMediaClient';
import {
	type MediaParsedSettings,
	type MediaSettings,
	useMediaParsedSettings,
} from './mediaSettings';

export type MediaClientAndSettings = {
	mediaClient: MediaClient;
	settings?: MediaParsedSettings;
};

export const MediaContext = React.createContext<MediaClientAndSettings | undefined>(undefined);

interface MediaProviderProps {
	children: React.ReactNode;
	mediaClientConfig: MediaClientConfig;
	mediaSettings?: MediaSettings;
}

export const MediaProvider = ({
	children,
	mediaClientConfig,
	mediaSettings,
}: MediaProviderProps) => {
	const mediaClient = useMemo(() => getMediaClient(mediaClientConfig), [mediaClientConfig]);
	const settings = useMediaParsedSettings(mediaSettings);

	return (
		<MediaContext.Provider value={{ mediaClient, settings }}>{children}</MediaContext.Provider>
	);
};
