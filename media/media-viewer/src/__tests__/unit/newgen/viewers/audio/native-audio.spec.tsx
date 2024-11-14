jest.mock('../../../../../utils/isIE', () => ({
	isIE: () => true,
}));

import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { render, screen, waitFor } from '@testing-library/react';
import { type ProcessedFileState } from '@atlaskit/media-client';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import { AudioViewer } from '../../../../../viewers/audio';
import { type Auth } from '@atlaskit/media-core';

const token = 'some-token';
const clientId = 'some-client-id';
const baseUrl = 'some-base-url';

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

const traceContext = { traceId: 'some-trace-id' };

function createFixture(
	authPromise: Promise<Auth>,
	collectionName?: string,
	item?: ProcessedFileState,
	mockReturnGetArtifactURL?: Promise<string>,
	mockGetImageUrl?: Promise<string>,
) {
	const mediaClient = fakeMediaClient({
		authProvider: () => authPromise,
	});

	jest
		.spyOn(mediaClient.file, 'getArtifactURL')
		.mockReturnValue(
			mockReturnGetArtifactURL ||
				Promise.resolve('some-base-url/audio?client=some-client-id&token=some-token'),
		);

	if (mockGetImageUrl) {
		jest.spyOn(mediaClient, 'getImageUrl').mockReturnValue(mockGetImageUrl);
	}

	const el = render(
		<IntlProvider locale="en">
			<AudioViewer
				onCanPlay={() => {}}
				onError={() => {}}
				mediaClient={mediaClient}
				item={item || audioItem}
				collectionName={collectionName}
				previewCount={0}
				traceContext={traceContext}
			/>
		</IntlProvider>,
	);
	return { mediaClient, el };
}

describe('Audio viewer', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('assigns a src for audio files when successful', async () => {
		const authPromise = Promise.resolve({ token, clientId, baseUrl });
		const {
			el: { container },
		} = createFixture(authPromise);
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(container.querySelector('audio')?.src).toBe(
			'http://localhost/some-base-url/audio?client=some-client-id&token=some-token',
		);
	});

	it('shows spinner when pending', async () => {
		const authPromise = Promise.resolve({ token, clientId, baseUrl });
		createFixture(authPromise);
		expect(screen.getByLabelText('Loading file...')).toBeInTheDocument();
	});

	it('shows error message with a download button if there is an error displaying the preview', async () => {
		const mockGetArtifactUrlReturn = Promise.resolve('');

		createFixture(new Promise(() => {}), undefined, undefined, mockGetArtifactUrlReturn);

		await mockGetArtifactUrlReturn;

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expect(screen.getByText(`We couldn't generate a preview for this file.`)).toBeInTheDocument();

		// download button
		expect(screen.getByText('Try downloading the file to view it.')).toBeInTheDocument();
		expect(
			screen.getByRole('button', {
				name: /Download/i,
			}),
		).toBeInTheDocument();
	});

	describe('cover', () => {
		it('it should show the default cover while the audio cover is loading', async () => {
			const authPromise = Promise.resolve({ token, clientId, baseUrl });
			createFixture(authPromise);
			const component = await screen.findByLabelText('cover');
			expect(component).toBeInTheDocument();
		});

		it('it should show the default cover when the audio cover is errored', async () => {
			const authPromise = Promise.resolve({ token, clientId, baseUrl });
			createFixture(authPromise, undefined, undefined, undefined, Promise.resolve(''));
			const component = await screen.findByLabelText('cover');
			expect(component).toBeInTheDocument();
		});

		it('it should show the audio cover if exists', async () => {
			const authPromise = Promise.resolve({ token, clientId, baseUrl });
			global.Image = jest.fn().mockImplementation(() => {
				return {
					// Implement the onload property
					onload: null,
					// Simulate the behavior when the image loads
					set src(value: any) {
						setTimeout(() => {
							if (this.onload) {
								this.onload(); // Call onload handler
							}
						}, 0);
					},
				};
			});
			createFixture(
				authPromise,
				undefined,
				undefined,
				undefined,
				Promise.resolve('http://localhost/some-cover-image'),
			);
			await screen.findByAltText('my audio');
			expect(screen.getByAltText('my audio').getAttribute('src')).toBe(
				'http://localhost/some-cover-image',
			);
		});

		describe('AutoPlay', () => {
			function createAutoPlayFixture(previewCount: number) {
				const mediaClient = fakeMediaClient();

				jest
					.spyOn(mediaClient.file, 'getArtifactURL')
					.mockReturnValue(
						Promise.resolve('some-base-url/audio?client=some-client-id&token=some-token'),
					);

				const el = render(
					<IntlProvider locale="en">
						<AudioViewer
							onCanPlay={() => {}}
							onError={() => {}}
							mediaClient={mediaClient}
							item={audioItem}
							collectionName="collectionName"
							previewCount={previewCount}
							traceContext={traceContext}
						/>
						,
					</IntlProvider>,
				);
				return el;
			}

			it('should auto play when it is the first preview', async () => {
				const { container } = createAutoPlayFixture(0);
				await waitFor(() =>
					expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
				);

				expect(container.querySelector('audio')).toHaveAttribute('autoPlay');
			});

			it('should not auto play when it is not the first preview', async () => {
				const { container } = await createAutoPlayFixture(1);
				await waitFor(() =>
					expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
				);
				expect(container.querySelector('audio')).not.toHaveAttribute('autoPlay');
			});
		});
	});
});
