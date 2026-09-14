import React from 'react';

import { render } from '@testing-library/react';

import { type MediaClient } from '@atlaskit/media-client';
import { useMediaSettings } from '@atlaskit/media-client-react/use-media-settings';
import type { MediaParsedSettings } from '@atlaskit/media-client-react/media-parsed-settings';
import { MediaContext } from '@atlaskit/media-client-react/media-provider';

describe('useMediaSettings', () => {
	it('should return empty object when MediaContext is not provided', async () => {
		let settings;
		function TestComponent() {
			settings = useMediaSettings();
			return null;
		}

		render(<TestComponent />);
		expect(settings).toEqual({});

		await expect(document.body).toBeAccessible();
	});

	it('should return empty object when settings is not provided in context', async () => {
		let settings;
		function TestComponent() {
			settings = useMediaSettings();
			return null;
		}

		const mockMediaClient = {} as MediaClient;
		render(
			<MediaContext.Provider value={{ mediaClient: mockMediaClient }}>
				<TestComponent />
			</MediaContext.Provider>,
		);
		expect(settings).toEqual({});

		await expect(document.body).toBeAccessible();
	});

	it('should return settings from context when provided', async () => {
		const mockSettings: MediaParsedSettings = {
			canUpdateVideoCaptions: true,
			mediaUserPreferences: {
				set: jest.fn(),
				get: jest.fn(),
			},
		};
		let settings;
		function TestComponent() {
			settings = useMediaSettings();
			return null;
		}

		const mockMediaClient = {} as MediaClient;
		render(
			<MediaContext.Provider value={{ mediaClient: mockMediaClient, settings: mockSettings }}>
				<TestComponent />
			</MediaContext.Provider>,
		);
		expect(settings).toEqual(mockSettings);

		await expect(document.body).toBeAccessible();
	});
});
