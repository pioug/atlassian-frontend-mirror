import React, { useContext, useLayoutEffect, useMemo, useState } from 'react';
import { MediaClientContext, getMediaClient } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { useProviderFactory, useProviderLayout } from '@atlaskit/editor-common/provider-factory';

import type { MediaSSR } from '../../types/mediaOptions';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const EditorMediaClientProvider = ({
	children,
	ssr,
}: React.PropsWithChildren<{ ssr?: MediaSSR }>): React.JSX.Element => {
	const [mediaClientConfig, setMediaClientConfig] = useState<MediaClientConfig | undefined>();

	const providerFactory = useProviderFactory();
	const mediaProvider = useProviderLayout('mediaProvider');

	/**
	 * Whether this renderer has its own media provider and should never inherit
	 * the mediaClient from a parent renderer's context.
	 *
	 * We use providerFactory.hasProvider() rather and checking the mediaProvider
	 * state value, because useProviderLayout subscribes via useLayoutEffect —
	 * meaning mediaProvider state is always undefined on the first render, even
	 * if the ProviderFactory already has a provider registered. This would cause
	 * shouldSkipContext to be false on the first render, incorrectly allowing the
	 * inner renderer to inherit the outer renderer's MediaClientContext (which
	 * carries the wrong media token for this page).
	 *
	 * hasProvider() is synchronous and correct from render 1, closing that window.
	 */
	const shouldSkipContext = expValEquals(
		'platform_editor_media_reliability_enhancements',
		'isEnabled',
		true,
	)
		? Boolean(ssr?.config || providerFactory.hasProvider('mediaProvider') || mediaProvider)
		: Boolean(ssr?.config || mediaProvider);

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
