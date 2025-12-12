// Mock the getMediaClient function
jest.mock('./getMediaClient', () => ({
	getMediaClient: jest.fn().mockImplementation((config) => new MediaClient(config)),
}));
import React from 'react';

import { render, screen } from '@testing-library/react';

import { MediaClient } from '@atlaskit/media-client';

import { getMediaClient } from './getMediaClient';
import { MediaContext, MediaProvider } from './MediaProvider';
import type { MediaSettings } from './mediaSettings';

describe('MediaProvider', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

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
		const { rerender } = render(
			<MediaProvider mediaClientConfig={mockMediaClientConfig}>
				<TestComponent />
			</MediaProvider>,
		);

		// Force a re-render with the same config
		rerender(
			<MediaProvider mediaClientConfig={mockMediaClientConfig}>
				<TestComponent />
			</MediaProvider>,
		);

		// The getMediaClient mock should only be called once
		expect(getMediaClient).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});
});
