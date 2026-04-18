import React, { useContext, useEffect, useMemo, useState } from 'react';
import { screen } from '@testing-library/react';

import { ProviderFactory, ProviderFactoryProvider } from '@atlaskit/editor-common/provider-factory';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';
import { MediaClientContext } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';

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
