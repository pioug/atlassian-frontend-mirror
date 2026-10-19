jest.mock('../../../../../utils/isIE', () => ({
	isIE: () => false,
}));

import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { ProcessedFileState } from '@atlaskit/media-state/file-state';
import { fakeMediaClient } from '@atlaskit/media-test-helpers/fakeMediaClient';

import {
	InsetViewerProvider,
	useHasMediaFooterPlayerControls,
} from '../../../../../insetViewerContext';
import { AudioViewer } from '../../../../../viewers/audio';

jest.mock('../../../../../styleWrappers', () => {
	const { createElement } = jest.requireActual('react');
	return {
		...jest.requireActual('../../../../../styleWrappers'),
		CustomMediaPlayerWrapper: ({ children }: { children?: React.ReactNode }) =>
			createElement('div', { 'data-testid': 'custom-media-player-wrapper' }, children),
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

const HasPlayerControlsProbe = () => (
	<span data-testid="has-player-controls">{String(useHasMediaFooterPlayerControls())}</span>
);

function setup(isInsetViewer: boolean) {
	const mediaClient = fakeMediaClient();
	jest.spyOn(mediaClient.file, 'getArtifactURL').mockResolvedValue('some-base-url/audio');

	const tree = (showViewer: boolean) => (
		<IntlProvider locale="en">
			<InsetViewerProvider isInsetViewer={isInsetViewer}>
				<HasPlayerControlsProbe />
				{showViewer && (
					<AudioViewer
						onCanPlay={() => {}}
						onError={() => {}}
						mediaClient={mediaClient}
						item={audioItem}
						previewCount={0}
						traceContext={{ traceId: 'some-trace-id' }}
					/>
				)}
			</InsetViewerProvider>
		</IntlProvider>
	);
	const { rerender } = render(tree(true));
	const unmountViewer = () => rerender(tree(false));

	return { unmountViewer };
}

const waitForContent = () =>
	waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

describe('Audio viewer with the custom player', () => {
	describe('when the inset viewer is enabled', () => {
		it('should tell the media footer it has player controls and render the player in the wrapper', async () => {
			setup(true);
			await waitForContent();

			expect(screen.getByTestId('has-player-controls')).toHaveTextContent('true');
			expect(screen.getByTestId('custom-media-player-wrapper')).toBeInTheDocument();
		});

		it('should tell the media footer the player controls are gone once unmounted', async () => {
			const { unmountViewer } = setup(true);
			await waitForContent();

			unmountViewer();

			expect(screen.getByTestId('has-player-controls')).toHaveTextContent('false');
		});
	});

	describe('when the inset viewer is not enabled', () => {
		it('should not tell the media footer about player controls or use the wrapper', async () => {
			setup(false);
			await waitForContent();

			expect(screen.getByTestId('has-player-controls')).toHaveTextContent('false');
			expect(screen.queryByTestId('custom-media-player-wrapper')).not.toBeInTheDocument();
		});
	});

	it('should be accessible', async () => {
		setup(false);
		await waitForContent();

		await expect(document.body).toBeAccessible();
	});
});
