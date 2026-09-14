import React from 'react';

import { render, screen } from '@testing-library/react';

import type { MediaClient } from '@atlaskit/media-client';
import type { MediaSettings } from '@atlaskit/media-client-react/media-parsed-settings';
import { MediaContext, MediaProvider } from '@atlaskit/media-client-react/media-provider';

describe('MediaProvider', () => {
	const mockMediaClientConfig = {
		authProvider: () =>
			Promise.resolve({
				clientId: 'test-client',
				token: 'test-token',
				baseUrl: 'https://test-url',
			}),
	};

	const mockMediaSettings = {
		someSetting: true,
		another: 'setting',
	} as MediaSettings;

	const TestComponent = () => {
		const context = React.useContext(MediaContext);
		return (
			<div>
				<div data-testid="has-media-client">
					{context?.mediaClient ? 'has-client' : 'no-client'}
				</div>
				<div data-testid="has-settings">{context?.settings ? 'has-settings' : 'no-settings'}</div>
			</div>
		);
	};

	it('should provide MediaClient to children', async () => {
		render(
			<MediaProvider mediaClientConfig={mockMediaClientConfig}>
				<TestComponent />
			</MediaProvider>,
		);

		expect(screen.getByTestId('has-media-client')).toHaveTextContent('has-client');

		await expect(document.body).toBeAccessible();
	});

	it('should provide settings to children when provided', async () => {
		render(
			<MediaProvider mediaClientConfig={mockMediaClientConfig} mediaSettings={mockMediaSettings}>
				<TestComponent />
			</MediaProvider>,
		);

		expect(screen.getByTestId('has-settings')).toHaveTextContent('has-settings');

		await expect(document.body).toBeAccessible();
	});

	it('should create MediaClient only once for the same config', async () => {
		let firstClient: MediaClient | undefined;
		let secondClient: MediaClient | undefined;

		const Capture = ({ onCapture }: { onCapture: (c: MediaClient) => void }) => {
			const context = React.useContext(MediaContext);
			if (context?.mediaClient) {
				onCapture(context.mediaClient);
			}
			return null;
		};

		const { rerender } = render(
			<MediaProvider mediaClientConfig={mockMediaClientConfig}>
				<Capture
					onCapture={(c) => {
						firstClient = c;
					}}
				/>
			</MediaProvider>,
		);

		// Force a re-render with the same config
		rerender(
			<MediaProvider mediaClientConfig={mockMediaClientConfig}>
				<Capture
					onCapture={(c) => {
						secondClient = c;
					}}
				/>
			</MediaProvider>,
		);

		// Same instance = only created once (useMemo preserved it)
		expect(firstClient).toBeDefined();
		expect(firstClient).toBe(secondClient);

		await expect(document.body).toBeAccessible();
	});
});
