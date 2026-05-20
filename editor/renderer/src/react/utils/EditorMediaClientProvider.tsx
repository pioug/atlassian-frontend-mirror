import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { MediaClientContext, getMediaClient } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { useProviderFactory, useProviderLayout } from '@atlaskit/editor-common/provider-factory';

import type { MediaSSR } from '../../types/mediaOptions';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

export const EditorMediaClientProvider = ({
	children,
	ssr,
}: React.PropsWithChildren<{ ssr?: MediaSSR }>): React.JSX.Element => {
	const [mediaClientConfig, setMediaClientConfig] = useState<MediaClientConfig | undefined>(() =>
		expValEquals('platform_editor_media_reliability_enhancements', 'isEnabled', true)
			? ssr?.config
			: undefined,
	);

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

	// When the experiment is enabled, use useEffect instead of useLayoutEffect because:
	// - For the ssr.config branch: useState is already initialised with ssr.config, so this
	//   effect is a no-op on first render — the "before paint" guarantee is irrelevant.
	// - For the mediaProvider branch: the actual work happens inside a Promise callback which
	//   resolves asynchronously, so it can never run before paint regardless of which hook
	//   schedules it — useLayoutEffect's guarantee is equally irrelevant here.
	// The legacy path keeps useLayoutEffect to preserve existing behaviour when the experiment is off.
	//
	// The two hooks below are mutually exclusive — only one runs per render — so there is no
	// actual chaining of state updates at runtime. The lint rule cannot statically prove this.
	useEffect(() => {
		if (!expValEquals('platform_editor_media_reliability_enhancements', 'isEnabled', true)) {
			return;
		}
		if (ssr?.config) {
			// eslint-disable-next-line @atlassian/perf-linting/no-chain-state-updates
			setMediaClientConfig(ssr.config);
		} else if (mediaProvider) {
			let cancelled = false;
			// Cancellation flag prevents setMediaClientConfig from being called after
			// unmount or when mediaProvider changes mid-flight (stale promise fix).
			// No .catch() is needed — the media provider is not expected to reject,
			// and a catch handler would be a no-op anyway.
			mediaProvider.then((provider) => {
				if (!cancelled) {
					setMediaClientConfig(provider.viewMediaClientConfig);
				}
			});
			return () => {
				cancelled = true;
			};
		}
	}, [mediaProvider, ssr?.config]);

	// Legacy path (experiment off): keep useLayoutEffect to preserve existing behaviour.
	// remove this when clean up platform_editor_media_reliability_enhancements
	useLayoutEffect(() => {
		if (expValEquals('platform_editor_media_reliability_enhancements', 'isEnabled', true)) {
			return;
		}
		if (ssr?.config) {
			setMediaClientConfig(ssr.config);
		} else if (mediaProvider) {
			mediaProvider.then((provider) => {
				setMediaClientConfig(provider.viewMediaClientConfig);
			});
		}
	}, [mediaProvider, ssr?.config]);

	return (
		<MediaClientContext.Provider value={shouldSkipContext ? mediaClient : contextMediaClient}>
			{children}
		</MediaClientContext.Provider>
	);
};
