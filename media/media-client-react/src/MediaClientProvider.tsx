import React, { useMemo } from 'react';

import { type MediaClient, type MediaClientConfig } from '@atlaskit/media-client';

import { getMediaClient } from './getMediaClient';

export const MediaClientContext = React.createContext<MediaClient | undefined>(undefined);

interface MediaClientProviderProp {
	children: React.ReactNode;
	clientConfig: MediaClientConfig;
}

/** @deprecated Use MediaProvider instead */
export const MediaClientProvider = ({
	children,
	clientConfig,
}: MediaClientProviderProp): React.JSX.Element => {
	const mediaClient = useMemo(() => getMediaClient(clientConfig), [clientConfig]);
	return <MediaClientContext.Provider value={mediaClient}>{children}</MediaClientContext.Provider>;
};
