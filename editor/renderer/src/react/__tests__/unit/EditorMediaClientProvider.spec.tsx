import React, { useContext, useEffect, useMemo, useState } from 'react';
import { screen } from '@testing-library/react';

import {
	ProviderFactory,
	ProviderFactoryProvider,
	type MediaProvider,
} from '@atlaskit/editor-common/provider-factory';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { MediaClientContext } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { EditorMediaClientProvider } from '../../utils/EditorMediaClientProvider';

function MediaClientConsumer({ testIdPrefix }: { testIdPrefix: string }) {
	const mediaClient = useContext(MediaClientContext);
	const [token, setToken] = useState('');

	useEffect(() => {
		if (mediaClient) {
			mediaClient.config.authProvider().then((auth) => {
				// we only want to capture the token once,
				// so that we know if we're using the parent or child context
				setToken((token) => {
					return token ? token : auth.token;
				});
			});
		}
	}, [mediaClient]);

	return token ? (
		<div data-testid={`${testIdPrefix}-token`}>{token}</div>
	) : (
		<div data-testid={`${testIdPrefix}-no-token`}>no media token</div>
	);
}

function createMediaClientConfig(token: string): MediaClientConfig {
	return {
		authProvider: () => Promise.resolve({ clientId: '', token, baseUrl: '' }),
	};
}

function createMediaProvider(token: string) {
	return Promise.resolve({
		viewMediaClientConfig: createMediaClientConfig(token),
	});
}

function createMediaProviderWithViewAndUploadConfig() {
	return Promise.resolve({
		viewMediaClientConfig: createMediaClientConfig('view-token'),
		viewAndUploadMediaClientConfig: createMediaClientConfig('view-and-upload-token'),
	});
}

function createProviderFactory(token: string) {
	return ProviderFactory.create({
		mediaProvider: createMediaProvider(token),
	});
}

function NestedMediaClientContext() {
	const parentProviderFactory = useMemo(() => {
		return createProviderFactory('parent-media-token');
	}, []);

	const childProviderFactory = useMemo(() => {
		return createProviderFactory('child-media-token');
	}, []);

	return (
		<ProviderFactoryProvider value={parentProviderFactory}>
			<EditorMediaClientProvider>
				<MediaClientConsumer testIdPrefix="parent" />
				<ProviderFactoryProvider value={childProviderFactory}>
					<EditorMediaClientProvider>
						<MediaClientConsumer testIdPrefix="child" />
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>
			</EditorMediaClientProvider>
		</ProviderFactoryProvider>
	);
}

// if a nested MediaClientContext has its own provider,
// it should not use the mediaClient from the parent context,
// because each config has its own media token
describe('child MediaClientContext with config should not use mediaClient from parent', () => {
	eeTest('platform_editor_media_reliability_enhancements', {
		true: async () => {
			renderWithIntl(<NestedMediaClientContext />);

			expect(await screen.findByTestId('parent-token')).toHaveTextContent('parent-media-token');
			expect(await screen.findByTestId('child-token')).toHaveTextContent('child-media-token');
		},
		false: async () => {
			// When the experiment is off, the old behaviour (mediaClient ?? contextMediaClient) is used.
			// Both contexts will resolve to some token.
			renderWithIntl(<NestedMediaClientContext />);

			expect(await screen.findByTestId('parent-token')).toBeInTheDocument();
			expect(await screen.findByTestId('child-token')).toBeInTheDocument();
		},
	});
});

// Fix 1: Stale promise cancellation — when mediaProvider changes mid-flight, the stale
// promise must not overwrite the state set by the new provider.
describe('stale mediaProvider promise should not overwrite state from the new provider', () => {
	eeTest('platform_editor_media_reliability_enhancements', {
		true: async () => {
			let resolveFirstProvider!: (value: any) => void;
			const firstProvider = new Promise<any>((resolve) => {
				resolveFirstProvider = resolve;
			});

			const firstProviderFactory = new ProviderFactory();
			firstProviderFactory.setProvider('mediaProvider', firstProvider);

			const secondProviderFactory = createProviderFactory('second-token');

			const { rerender } = renderWithIntl(
				<ProviderFactoryProvider value={firstProviderFactory}>
					<EditorMediaClientProvider>
						<MediaClientConsumer testIdPrefix="consumer" />
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>,
			);

			// Switch to the second provider before the first resolves —
			// this re-runs the effect and sets cancelled=true on the first promise's closure.
			rerender(
				<ProviderFactoryProvider value={secondProviderFactory}>
					<EditorMediaClientProvider>
						<MediaClientConsumer testIdPrefix="consumer" />
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>,
			);

			// Wait for the second provider to resolve and set state.
			await screen.findByTestId('consumer-token');
			expect(screen.getByTestId('consumer-token')).toHaveTextContent('second-token');

			// Now resolve the first (stale) provider — the cancelled flag must prevent it
			// from overwriting the correct 'second-token' state.
			resolveFirstProvider({ viewMediaClientConfig: createMediaClientConfig('stale-token') });
			await Promise.resolve();

			// State must still reflect the second provider, not the stale first one.
			expect(screen.getByTestId('consumer-token')).toHaveTextContent('second-token');
		},
		false: async () => {
			// Old path — no cancellation, smoke test only
			let resolveProvider!: (value: any) => void;
			const lazyMediaProvider = new Promise<any>((resolve) => {
				resolveProvider = resolve;
			});
			const providerFactory = new ProviderFactory();
			providerFactory.setProvider('mediaProvider', lazyMediaProvider);

			const { unmount } = renderWithIntl(
				<ProviderFactoryProvider value={providerFactory}>
					<EditorMediaClientProvider>
						<div data-testid="child" />
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>,
			);

			expect(screen.getByTestId('child')).toBeInTheDocument();

			unmount();
			resolveProvider({ viewMediaClientConfig: createMediaClientConfig('token') });
			await Promise.resolve();
		},
	});
});

// Fix 2: mediaClient must be available on first render when ssr.config is provided
describe('mediaClient should be available on first render when ssr.config is provided', () => {
	eeTest('platform_editor_media_reliability_enhancements', {
		true: () => {
			const firstRenderClients: Array<unknown> = [];

			function CapturingConsumer() {
				const mediaClient = useContext(MediaClientContext);
				// Only capture on first render
				if (firstRenderClients.length === 0) {
					firstRenderClients.push(mediaClient);
				}
				return <div data-testid="consumer" />;
			}

			const ssrConfig = createMediaClientConfig('ssr-token');
			const providerFactory = new ProviderFactory();

			renderWithIntl(
				<ProviderFactoryProvider value={providerFactory}>
					<EditorMediaClientProvider ssr={{ config: ssrConfig, mode: 'server' }}>
						<CapturingConsumer />
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>,
			);

			// mediaClient must be defined on the very first render — no waiting for useLayoutEffect
			expect(firstRenderClients[0]).toBeDefined();
		},
		false: () => {
			const firstRenderClients: Array<unknown> = [];

			function CapturingConsumer() {
				const mediaClient = useContext(MediaClientContext);
				if (firstRenderClients.length === 0) {
					firstRenderClients.push(mediaClient);
				}
				return <div data-testid="consumer" />;
			}

			const ssrConfig = createMediaClientConfig('ssr-token');
			const providerFactory = new ProviderFactory();

			renderWithIntl(
				<ProviderFactoryProvider value={providerFactory}>
					<EditorMediaClientProvider ssr={{ config: ssrConfig, mode: 'server' }}>
						<CapturingConsumer />
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>,
			);

			// Old path — mediaClient is undefined on first render (known limitation)
			expect(firstRenderClients[0]).toBeUndefined();
		},
	});
});

// Regression test for EDITOR-679:
// When the ProviderFactory already has a mediaProvider registered before the
// EditorMediaClientProvider mounts (the common case in nested/include-page renderers),
// hasOwnProvider must be true on the VERY FIRST render. If it isn't, the child
// renderer inherits the outer renderer's MediaClientContext (wrong media token) on
// that first render — and media nodes that resolve during that window get the wrong client.
//
// This test captures the mediaClient value seen on the first render synchronously,
// before any async resolution has occurred, to confirm the child never inherits the parent.
describe('child MediaClientContext should not inherit parent mediaClient on first render when provider is pre-registered', () => {
	eeTest('platform_editor_media_reliability_enhancements', {
		true: () => {
			const firstRenderValues: Array<{ hasClient: boolean; prefix: string }> = [];

			function CapturingConsumer({ testIdPrefix }: { testIdPrefix: string }) {
				const mediaClient = useContext(MediaClientContext);
				firstRenderValues.push({ prefix: testIdPrefix, hasClient: mediaClient !== undefined });
				return <div data-testid={`${testIdPrefix}-rendered`} />;
			}

			const parentProviderFactory = ProviderFactory.create({
				mediaProvider: createMediaProvider('parent-media-token'),
			});

			// Simulate what happens when the child ProviderFactory is fully set up before
			// the component mounts — i.e. the provider is pre-registered, not lazy-loaded.
			const childProviderFactory = ProviderFactory.create({
				mediaProvider: createMediaProvider('child-media-token'),
			});

			renderWithIntl(
				<ProviderFactoryProvider value={parentProviderFactory}>
					<EditorMediaClientProvider>
						{/* Outer renderer — establishes the parent MediaClientContext */}
						<ProviderFactoryProvider value={childProviderFactory}>
							<EditorMediaClientProvider>
								{/* Inner renderer — must NOT inherit parent's context on first render */}
								<CapturingConsumer testIdPrefix="child" />
							</EditorMediaClientProvider>
						</ProviderFactoryProvider>
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>,
			);

			// The child renderer's EditorMediaClientProvider must set hasOwnProvider=true
			// on the very first render (because the provider was pre-registered). This means
			// the child's MediaClientContext.Provider value is its own mediaClient (possibly
			// undefined while viewMediaClientConfig resolves) — NOT the parent's mediaClient.
			const childFirstRender = firstRenderValues.find((v) => v.prefix === 'child');
			expect(childFirstRender).toBeDefined();
			// The child's own mediaClient is not yet resolved on first render (async promise),
			// so it should be undefined — confirming it did NOT inherit the parent's resolved client.
			expect(childFirstRender!.hasClient).toBe(false);
		},
		false: () => {
			// When the experiment is off, the child may inherit the parent's client. Smoke test only.
			const firstRenderValues: Array<{ hasClient: boolean; prefix: string }> = [];

			function CapturingConsumer({ testIdPrefix }: { testIdPrefix: string }) {
				const mediaClient = useContext(MediaClientContext);
				firstRenderValues.push({ prefix: testIdPrefix, hasClient: mediaClient !== undefined });
				return <div data-testid={`${testIdPrefix}-rendered`} />;
			}

			const parentProviderFactory = ProviderFactory.create({
				mediaProvider: createMediaProvider('parent-media-token'),
			});
			const childProviderFactory = ProviderFactory.create({
				mediaProvider: createMediaProvider('child-media-token'),
			});

			renderWithIntl(
				<ProviderFactoryProvider value={parentProviderFactory}>
					<EditorMediaClientProvider>
						<ProviderFactoryProvider value={childProviderFactory}>
							<EditorMediaClientProvider>
								<CapturingConsumer testIdPrefix="child" />
							</EditorMediaClientProvider>
						</ProviderFactoryProvider>
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>,
			);

			// Experiment is off — child rendered successfully (no crash).
			const childFirstRender = firstRenderValues.find((v) => v.prefix === 'child');
			expect(childFirstRender).toBeDefined();
		},
	});
});

eeTest
	.describe('platform_editor_media_reliability_enhancements', 'video captions media client config')
	.variant(true, () => {
		function renderWithCaptionProvider(
			mediaProvider: Promise<MediaProvider> = createMediaProviderWithViewAndUploadConfig(),
		) {
			const providerFactory = ProviderFactory.create({
				mediaProvider,
			});

			renderWithIntl(
				<ProviderFactoryProvider value={providerFactory}>
					<EditorMediaClientProvider>
						<MediaClientConsumer testIdPrefix="consumer" />
					</EditorMediaClientProvider>
				</ProviderFactoryProvider>,
			);
		}

		it('uses viewAndUploadMediaClientConfig when both caption gates are on', async () => {
			passGate('platform_media_video_captions');
			passGate('platform_editor_video_caption_commit');

			renderWithCaptionProvider();

			expect(await screen.findByTestId('consumer-token')).toHaveTextContent(
				'view-and-upload-token',
			);
		});

		it('uses viewMediaClientConfig when viewAndUploadMediaClientConfig is absent', async () => {
			renderWithCaptionProvider(createMediaProvider('view-only-token'));

			expect(await screen.findByTestId('consumer-token')).toHaveTextContent('view-only-token');
		});

		it('uses viewMediaClientConfig when the media captions gate is off', async () => {
			failGate('platform_media_video_captions');

			renderWithCaptionProvider();

			expect(await screen.findByTestId('consumer-token')).toHaveTextContent('view-token');
		});

		it('uses viewMediaClientConfig when the editor caption commit gate is off', async () => {
			passGate('platform_media_video_captions');
			failGate('platform_editor_video_caption_commit');

			renderWithCaptionProvider();

			expect(await screen.findByTestId('consumer-token')).toHaveTextContent('view-token');
		});
	});
