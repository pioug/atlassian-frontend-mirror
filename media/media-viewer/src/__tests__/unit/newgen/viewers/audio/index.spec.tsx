jest.mock('../../../../../utils/isIE', () => ({
	isIE: () => false,
}));

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { ProcessedFileState } from '@atlaskit/media-state/file-state';
import { fakeMediaClient } from '@atlaskit/media-test-helpers/fakeMediaClient';
import { CustomMediaPlayer } from '@atlaskit/media-ui/customMediaPlayer';

import { InsetViewerProvider } from '../../../../../insetViewerContext';
import { AudioViewer } from '../../../../../viewers/audio';
import { InsetAudioFrame } from '../../../../../viewers/inset-audio-frame';

jest.mock('@atlaskit/media-ui/customMediaPlayer', () => ({
	...jest.requireActual('@atlaskit/media-ui/customMediaPlayer'),
	CustomMediaPlayer: jest.fn(() => null),
}));

const mockControlsPortalElement = document.createElement('div');

// The frame renders the cover and the player it's given, with a footer element of the test's own.
jest.mock('../../../../../viewers/inset-audio-frame', () => {
	const { createElement } = jest.requireActual('react');
	return {
		...jest.requireActual('../../../../../viewers/inset-audio-frame'),
		InsetAudioFrame: jest.fn(({ cover, renderPlayer }) =>
			createElement(
				'div',
				{ 'data-testid': 'inset-audio-frame' },
				cover,
				renderPlayer({ controlsPortalElement: mockControlsPortalElement }),
			),
		),
	};
});

const audioItem: ProcessedFileState = {
	id: 'some-id',
	status: 'processed',
	name: 'my audio',
	size: 11222,
	mediaType: 'audio',
	mimeType: 'mp3',
	artifacts: {
		'audio.mp3': {
			url: '/audio',
			processingStatus: 'succeeded',
		},
	},
	representations: {},
};

function setup(isInsetViewer: boolean, coverUrl?: string) {
	const mediaClient = fakeMediaClient();
	jest.spyOn(mediaClient.file, 'getArtifactURL').mockResolvedValue('some-base-url/audio');
	if (coverUrl) {
		jest.spyOn(mediaClient, 'getImageUrl').mockResolvedValue(coverUrl);
	}

	render(
		<IntlProvider locale="en">
			<InsetViewerProvider isInsetViewer={isInsetViewer}>
				<AudioViewer
					onCanPlay={() => {}}
					onError={() => {}}
					mediaClient={mediaClient}
					item={audioItem}
					previewCount={0}
					traceContext={{ traceId: 'some-trace-id' }}
				/>
			</InsetViewerProvider>
		</IntlProvider>,
	);
}

const waitForContent = () =>
	waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

describe('Audio viewer with the custom player', () => {
	const originalImage = global.Image;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		global.Image = originalImage;
	});

	describe('when the inset viewer is enabled', () => {
		it('should render the player in the inset frame with the default cover when there is no artwork', async () => {
			setup(true);
			await waitForContent();

			expect(screen.getByTestId('inset-audio-frame')).toBeInTheDocument();
			expect(screen.getByLabelText('cover')).toBeInTheDocument();
			expect(CustomMediaPlayer).toHaveBeenLastCalledWith(
				expect.objectContaining({
					type: 'audio',
					src: 'some-base-url/audio',
					fileId: 'some-id',
					isAutoPlay: true,
					isShortcutEnabled: true,
					controlsPortalElement: mockControlsPortalElement,
				}),
				expect.anything(),
			);
		});

		it('should render the artwork as the cover in the inset frame when there is artwork', async () => {
			// The viewer preloads the artwork with an Image and waits for its onload, which it sets after
			// src, as native-audio.spec.tsx does.
			global.Image = jest.fn().mockImplementation(() => ({
				onload: null,
				set src(_value: string) {
					setTimeout(() => this.onload?.(), 0);
				},
			})) as unknown as typeof Image;
			setup(true, 'http://localhost/some-cover-image');

			const artwork = await screen.findByAltText('my audio');

			expect(artwork).toHaveAttribute('src', 'http://localhost/some-cover-image');
			expect(screen.queryByLabelText('cover')).not.toBeInTheDocument();
		});
	});

	describe('when the inset viewer is not enabled', () => {
		it('should not use the inset frame', async () => {
			setup(false);
			await waitForContent();

			expect(InsetAudioFrame).not.toHaveBeenCalled();
			expect(CustomMediaPlayer).toHaveBeenCalled();
		});
	});

	it('should be accessible', async () => {
		setup(false);
		await waitForContent();

		await expect(document.body).toBeAccessible();
	});
});
