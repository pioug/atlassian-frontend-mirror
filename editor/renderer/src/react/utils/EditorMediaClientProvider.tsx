import React, { useContext, useLayoutEffect, useMemo, useState } from 'react';
import { MediaClientContext, getMediaClient } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { useProviderLayout } from '@atlaskit/editor-common/provider-factory';

import type { MediaSSR } from '../../types/mediaOptions';

export const EditorMediaClientProvider = ({
	children,
	ssr,
}: React.PropsWithChildren<{ ssr?: MediaSSR }>): React.JSX.Element => {
	const [mediaClientConfig, setMediaClientConfig] = useState<MediaClientConfig | undefined>();

	const mediaProvider = useProviderLayout('mediaProvider');

	/**
	 * If a mediaClientConfig is provided then we will force
	 * skip the mediaClient from context
	 */
	const shouldSkipContext = Boolean(ssr?.config || mediaProvider);

	const contextMediaClient = useContext(MediaClientContext);

	// MediaClientProvider currently requires a mediaClientConfig
	// And inserting the MediaClientProvider will cause a re-render
	// We should use MediaClientProvider once it no longer requires a config
	const mediaClient = useMemo(
		() => (mediaClientConfig ? getMediaClient(mediaClientConfig) : undefined),
		[mediaClientConfig],
	);

	// Consumers can override the mediaClient for renderer,
	// by not providing both SSR config and mediaProvider,
	// and provide a top level mediaClient context
	// This is useful for testing and creating examples.

	useLayoutEffect(() => {
		if (ssr?.config) {
			setMediaClientConfig(ssr.config);
		} else if (mediaProvider) {
			mediaProvider.then((provider) => {
				setMediaClientConfig(provider.viewMediaClientConfig);
			});
		}
	}, [mediaProvider, ssr]);

	return (
		<MediaClientContext.Provider value={shouldSkipContext ? mediaClient : contextMediaClient}>
			{children}
		</MediaClientContext.Provider>
	);
};
