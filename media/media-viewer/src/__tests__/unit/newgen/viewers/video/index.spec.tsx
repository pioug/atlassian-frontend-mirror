jest.mock('../../../../../utils/isIE', () => ({
	isIE: () => false,
}));

import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import {
	globalMediaEventEmitter,
	type MediaViewedEventPayload,
	type ProcessedFileState,
} from '@atlaskit/media-client';
import {
	fakeMediaClient,
	expectFunctionToHaveBeenCalledWith,
	expectToEqual,
	asMockFunction,
} from '@atlaskit/media-test-helpers';
import { VideoViewer, type Props } from '../../../../../viewers/video';

const token = 'some-token';
const clientId = 'some-client-id';
const baseUrl = 'some-base-url';

const videoItem: ProcessedFileState = {
	id: 'some-id',
	status: 'processed',
	name: 'my video',
	size: 11222,
	mediaType: 'video',
	mimeType: 'mp4',
	artifacts: {
		'video_640.mp4': {
			url: '/video',
			processingStatus: 'succeeded',
		},
		'video_1280.mp4': {
			url: '/video_hd',
			processingStatus: 'succeeded',
		},
	},
	representations: {},
};

interface SetupOptions {
	props?: Partial<Props>;
	item?: ProcessedFileState;
	mockReturnGetArtifactURL?: Promise<string>;
	shouldInit?: boolean;
}

function setup(options: SetupOptions = {}) {
	const { props, item, mockReturnGetArtifactURL } = options;
	const authPromise = Promise.resolve({ token, clientId, baseUrl });
	const mediaClient = fakeMediaClient({
		authProvider: () => authPromise,
	});

	const getArtifactURLResult: ReturnType<typeof mediaClient.file.getArtifactURL> =
		mockReturnGetArtifactURL ||
		Promise.resolve('some-base-url/video_hd?client=some-client-id&token=some-token');

	jest.spyOn(mediaClient.file, 'getArtifactURL').mockReturnValue(getArtifactURLResult);

	const el = render(
		<IntlProvider locale="en">
			<VideoViewer
				identifier={props?.identifier || { id: 'some-id', mediaItemType: 'file' }}
				onCanPlay={() => {}}
				onError={() => {}}
				mediaClient={mediaClient}
				item={item || videoItem}
				previewCount={(props && props.previewCount) || 0}
				traceContext={{ traceId: 'some-trace-id' }}
				{...props}
			/>
		</IntlProvider>,
	);

	return { mediaClient, el, item: item || videoItem };
}

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('Video viewer', () => {
	beforeEach(() => {
		jest.spyOn(globalMediaEventEmitter, 'emit');
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
		localStorage.clear();
		(localStorage.setItem as jest.Mock).mockClear();
	});

	it('assigns a src for videos when successful', async () => {
		const {
			el: { container },
		} = setup();
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(container.querySelector('video')?.src).toEqual(
			'http://localhost/some-base-url/video_hd?client=some-client-id&token=some-token',
		);
	});

	it('shows spinner when pending', async () => {
		setup();
		expect(screen.getByLabelText('Loading file...')).toBeInTheDocument();
	});

	it('shows error message when there are not video artifacts in the media item', async () => {
		setup({
			mockReturnGetArtifactURL: Promise.resolve(''),
		});
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expect(screen.getByText("We couldn't generate a preview for this file.")).toBeInTheDocument();
	});

	it('MSW-720: passes collectionName to getArtifactURL', async () => {
		const collectionName = 'some-collection';
		const { mediaClient } = setup({
			props: { collectionName },
		});

		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());
		expectToEqual(asMockFunction(mediaClient.file.getArtifactURL).mock.calls[0][2], collectionName);
	});

	it('should always use HD artifact when available', async () => {
		const { mediaClient } = setup({ item: videoItem });
		await waitFor(() =>
			expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
		);

		expectToEqual(
			asMockFunction(mediaClient.file.getArtifactURL).mock.calls[0][1],
			'video_1280.mp4',
		);
	});

	describe('AutoPlay', () => {
		it('should auto play video viewer when it is the first preview', async () => {
			const {
				el: { container },
			} = setup({
				props: {
					previewCount: 0,
					item: videoItem,
				},
			});
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);

			expect(container.querySelector('video')?.hasAttribute('autoplay')).toBeTruthy();
		});

		it('should not auto play video viewer when it is not the first preview', async () => {
			const {
				el: { container },
			} = await setup({
				props: {
					previewCount: 1,
					item: videoItem,
				},
			});
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);
			expect(container.querySelector('video')?.hasAttribute('autoplay')).toBeFalsy();
		});
	});

	it('should trigger media-viewed when video is first played', async () => {
		setup({
			props: {
				previewCount: 0,
				item: videoItem,
			},
		});
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		await waitFor(() => {
			expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		});
		expectFunctionToHaveBeenCalledWith(globalMediaEventEmitter.emit, [
			'media-viewed',
			{
				fileId: 'some-id',
				viewingLevel: 'full',
			} as MediaViewedEventPayload,
		]);
	});

	it('should use last watch time feature', async () => {
		const originLocalStorage = global.localStorage;
		global.localStorage = {
			...originLocalStorage,
			getItem: jest.fn(),
		};

		setup();
		await waitFor(() => {
			expect(globalMediaEventEmitter.emit).toHaveBeenCalledTimes(1);
		});

		let videoEl: HTMLVideoElement;
		waitFor(() => {
			expect((videoEl = document.querySelector('video')!)).toBeInTheDocument();
		});

		await act(async () => fireEvent.loadedData(videoEl));
		expect(global.localStorage.getItem).toHaveBeenLastCalledWith('time-saver-default-time-some-id');
		global.localStorage = originLocalStorage;
	});
});
