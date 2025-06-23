import React, { useContext, useEffect, useMemo, useState } from 'react';
import { screen } from '@testing-library/react';

import { ProviderFactory, ProviderFactoryProvider } from '@atlaskit/editor-common/provider-factory';
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
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

// if a nested MediaClientContext has a config,
// it should not use the mediaClient from the parent context,
// because each config has its own media token
it('child MediaClientContext with config should not use mediaClient from parent', async () => {
	renderWithIntl(<NestedMediaClientContext />);

	expect(await screen.findByTestId('parent-token')).toHaveTextContent('parent-media-token');
	expect(await screen.findByTestId('child-token')).toHaveTextContent('child-media-token');
});
