jest.mock('../../../../../utils/isIE', () => ({
	isIE: jest.fn(() => false),
}));

import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

import type { MediaViewedEventPayload } from '@atlaskit/media-client/events';
import { globalMediaEventEmitter } from '@atlaskit/media-client/global-media-event-emitter';
import type { ProcessedFileState } from '@atlaskit/media-state/file-state';
import { fakeMediaClient } from '@atlaskit/media-test-helpers/fakeMediaClient';
import {
	expectFunctionToHaveBeenCalledWith,
	expectToEqual,
	asMockFunction,
} from '@atlaskit/media-test-helpers/jestHelpers';
import { CustomMediaPlayer } from '@atlaskit/media-ui/customMediaPlayer';
import { MediaPlayer } from '@atlaskit/media-ui/mediaPlayer';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getErrorDetail } from '../../../../../getErrorDetail';
import { getSecondaryErrorReason } from '../../../../../getSecondaryErrorReason';
import {
	InsetViewerProvider,
	useHasMediaFooterPlayerControls,
} from '../../../../../insetViewerContext';
import { MediaViewerError } from '../../../../../MediaViewerError';
import { MediaFooterBar, Video } from '../../../../../styleWrappers';
import { isIE } from '../../../../../utils/isIE';
import { InsetVideoFrame } from '../../../../../viewers/inset-video-frame';
import { VideoViewer } from '../../../../../viewers/video';

jest.mock('../../../../../styleWrappers', () => {
	const original = jest.requireActual('../../../../../styleWrappers');
	return {
		...original,
		Video: jest.fn(original.Video),
	};
});
jest.mock('@atlaskit/media-ui/customMediaPlayer', () => {
	const { createElement } = jest.requireActual('react');
	const original = jest.requireActual('@atlaskit/media-ui/customMediaPlayer');
	return {
		...original,
		CustomMediaPlayer: jest.fn((props: any) => createElement(original.CustomMediaPlayer, props)),
	};
});
jest.mock('../../../../../viewers/inset-video-frame', () => {
	const { createElement } = jest.requireActual('react');
	const original = jest.requireActual('../../../../../viewers/inset-video-frame');
	return {
		...original,
		InsetVideoFrame: jest.fn((props: any) => createElement(original.InsetVideoFrame, props)),
	};
});
jest.mock('@atlaskit/media-ui/mediaPlayer', () => ({
	...jest.requireActual('@atlaskit/media-ui/mediaPlayer'),
	MediaPlayer: jest.fn(() => null),
}));

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

const HasPlayerControlsProbe = () => (
	<span data-testid="has-video-controls">{String(useHasMediaFooterPlayerControls())}</span>
);

interface SetupOptions {
	props?: Partial<React.ComponentProps<typeof VideoViewer>>;
	isInsetViewer?: boolean;
	withMediaFooter?: boolean;
	probe?: React.ReactNode;
	item?: ProcessedFileState;
	mockReturnGetArtifactURL?: Promise<string>;
	shouldInit?: boolean;
}

function setup(options: SetupOptions = {}) {
	const { props, item, mockReturnGetArtifactURL, isInsetViewer, withMediaFooter, probe } = options;
	const authPromise = Promise.resolve({ token, clientId, baseUrl });
	const mediaClient = fakeMediaClient({
		authProvider: () => authPromise,
	});

	const getArtifactURLResult: ReturnType<typeof mediaClient.file.getArtifactURL> =
		mockReturnGetArtifactURL ||
		Promise.resolve('some-base-url/video_hd?client=some-client-id&token=some-token');

	jest.spyOn(mediaClient.file, 'getArtifactURL').mockReturnValue(getArtifactURLResult);

	const onError = jest.fn();

	const tree = (showViewer: boolean) => (
		<IntlProvider locale="en">
			<InsetViewerProvider isInsetViewer={!!isInsetViewer}>
				{withMediaFooter && <MediaFooterBar />}
				{probe}
				{showViewer && (
					<VideoViewer
						identifier={props?.identifier || { id: 'some-id', mediaItemType: 'file' }}
						onCanPlay={() => {}}
						onError={onError}
						mediaClient={mediaClient}
						item={item || videoItem}
						previewCount={(props && props.previewCount) || 0}
						traceContext={{ traceId: 'some-trace-id' }}
						{...props}
					/>
				)}
			</InsetViewerProvider>
		</IntlProvider>
	);
	const el = render(tree(true));
	const unmountViewer = () => el.rerender(tree(false));

	return { mediaClient, el, item: item || videoItem, onError, unmountViewer };
}

const waitForContent = () =>
	waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

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
		await waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

		expectToEqual(
			asMockFunction(mediaClient.file.getArtifactURL).mock.calls[0][1],
			'video_1280.mp4',
		);
	});

	describe('SD fallback (platform_media_video_sd_fallback)', () => {
		// Resolves an artifact URL only when that artifact actually exists on the item,
		// mirroring the real getArtifactURL behaviour (undefined/'' when missing).
		function setupWithArtifactResolver(item: ProcessedFileState) {
			const authPromise = Promise.resolve({ token, clientId, baseUrl });
			const mediaClient = fakeMediaClient({ authProvider: () => authPromise });

			jest
				.spyOn(mediaClient.file, 'getArtifactURL')
				.mockImplementation((artifacts, artifactName) =>
					Promise.resolve(
						artifacts[artifactName as keyof typeof artifacts]
							? `${baseUrl}/${artifactName}?client=${clientId}&token=${token}`
							: '',
					),
				);

			const el = render(
				<IntlProvider locale="en">
					<VideoViewer
						identifier={{ id: 'some-id', mediaItemType: 'file' }}
						onCanPlay={() => {}}
						onError={jest.fn()}
						mediaClient={mediaClient}
						item={item}
						previewCount={0}
						traceContext={{ traceId: 'some-trace-id' }}
					/>
				</IntlProvider>,
			);

			return { mediaClient, el };
		}

		const sdOnlyItem: ProcessedFileState = {
			...videoItem,
			artifacts: {
				'video_640.mp4': {
					url: '/video',
					processingStatus: 'succeeded',
				},
			},
		};

		it('falls back to the SD artifact when the HD artifact is missing', async () => {
			passGate('platform_media_video_sd_fallback');

			const { mediaClient, el } = setupWithArtifactResolver(sdOnlyItem);
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);

			// The viewer requested the SD artifact rather than throwing.
			expectToEqual(
				asMockFunction(mediaClient.file.getArtifactURL).mock.calls[0][1],
				'video_640.mp4',
			);
			// A playable <video> element is rendered (no "Something went wrong" error).
			expect(el.container.querySelector('video')?.src).toEqual(
				'http://localhost/some-base-url/video_640.mp4?client=some-client-id&token=some-token',
			);
			expect(
				screen.queryByText("We couldn't generate a preview for this file."),
			).not.toBeInTheDocument();
		});

		it('still prefers the HD artifact when both HD and SD are available', async () => {
			passGate('platform_media_video_sd_fallback');

			const { mediaClient } = setupWithArtifactResolver(videoItem);
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);

			expectToEqual(
				asMockFunction(mediaClient.file.getArtifactURL).mock.calls[0][1],
				'video_1280.mp4',
			);
		});

		it('when the flag is off, requests only the HD artifact (legacy behaviour)', async () => {
			failGate('platform_media_video_sd_fallback');

			const { mediaClient } = setupWithArtifactResolver(sdOnlyItem);
			await waitFor(() =>
				expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument(),
			);

			// Legacy path only ever asks for the HD artifact and shows the error screen.
			expectToEqual(
				asMockFunction(mediaClient.file.getArtifactURL).mock.calls[0][1],
				'video_1280.mp4',
			);
			expect(screen.getByText("We couldn't generate a preview for this file.")).toBeInTheDocument();
		});
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

	describe('playback error diagnostics', () => {
		it('reports the native MediaError in the videoviewer-playback secondaryError', async () => {
			const { onError } = setup({ item: { ...videoItem, mimeType: 'video/mp4' } });

			let videoEl!: HTMLVideoElement;
			await waitFor(() => {
				expect((videoEl = document.querySelector('video')!)).toBeInTheDocument();
			});

			// Simulate the browser exposing a native decode error on the element.
			Object.defineProperty(videoEl, 'error', {
				configurable: true,
				value: { code: 3, message: 'PIPELINE_ERROR_DECODE' } as MediaError,
			});

			await act(async () => fireEvent.error(videoEl));

			expect(onError).toHaveBeenCalled();
			const error = onError.mock.calls[0][0] as MediaViewerError;
			expect(error).toBeInstanceOf(MediaViewerError);
			expect(error.primaryReason).toBe('videoviewer-playback');
			// No longer opaque: secondaryReason + detail carry the native diagnostics.
			expect(getSecondaryErrorReason(error)).toBe('nativeError');
			const detail = getErrorDetail(error);
			expect(detail).not.toBe('unknown');
			expect(detail).toContain('mediaErrorCode=3');
			expect(detail).toContain('mediaErrorName=MEDIA_ERR_DECODE');
			expect(detail).toContain('mediaErrorMessage=PIPELINE_ERROR_DECODE');
			expect(detail).toContain('mimeType=video/mp4');
			expect(detail).toContain('isBrowserPlayable=true');
		});

		it('still emits videoviewer-playback when no native MediaError is available', async () => {
			const { onError } = setup({ item: { ...videoItem, mimeType: 'video/mp4' } });

			let videoEl!: HTMLVideoElement;
			await waitFor(() => {
				expect((videoEl = document.querySelector('video')!)).toBeInTheDocument();
			});

			await act(async () => fireEvent.error(videoEl));

			expect(onError).toHaveBeenCalled();
			const error = onError.mock.calls[0][0] as MediaViewerError;
			expect(error.primaryReason).toBe('videoviewer-playback');
			// File context is still captured even without a native MediaError.
			const detail = getErrorDetail(error);
			expect(detail).toContain('mimeType=video/mp4');
			expect(detail).not.toContain('mediaErrorCode');
		});
	});

	describe('inset viewer', () => {
		it('should not tell the media footer about video controls when the inset viewer is not enabled', async () => {
			setup({ isInsetViewer: false, probe: <HasPlayerControlsProbe /> });
			await waitForContent();

			expect(screen.getByTestId('has-video-controls')).toHaveTextContent('false');
			expect(InsetVideoFrame).not.toHaveBeenCalled();
		});

		const players = [
			{
				name: 'custom player',
				setGate: () => failGate('platform_media_video_captions'),
				player: CustomMediaPlayer,
				otherPlayer: MediaPlayer,
			},
			{
				name: 'captions player',
				setGate: () => passGate('platform_media_video_captions'),
				player: MediaPlayer,
				otherPlayer: CustomMediaPlayer,
			},
		];

		it.each(players)(
			'should render the $name in an InsetVideoFrame with the footer, the video element callback and its usual props when the inset viewer is enabled',
			async ({ setGate, player, otherPlayer }) => {
				setGate();

				setup({ isInsetViewer: true, withMediaFooter: true });
				await waitForContent();
				const footer = screen.getByTestId('media-viewer-media-footer');

				expect(InsetVideoFrame).toHaveBeenCalledWith(
					expect.objectContaining({
						'data-testid': 'media-viewer-video-content',
						renderPlayer: expect.any(Function),
					}),
					expect.anything(),
				);
				expect(jest.mocked(player).mock.lastCall![0]).toEqual(
					expect.objectContaining({
						type: 'video',
						src: expect.stringContaining('video_hd'),
						isAutoPlay: true,
						isHDActive: true,
						isHDAvailable: true,
						isShortcutEnabled: true,
						controlsPortalElement: footer,
						onVideoElementChange: expect.any(Function),
						lastWatchTimeConfig: { contentId: 'some-id' },
					}),
				);
				expect(otherPlayer).not.toHaveBeenCalled();
			},
		);

		it.each(players)(
			'should not give the $name a video element callback when the inset viewer is not enabled',
			async ({ setGate, player }) => {
				setGate();

				setup({ isInsetViewer: false });
				await waitForContent();

				expect(jest.mocked(player).mock.lastCall![0].onVideoElementChange).toBeUndefined();
			},
		);

		it('should render the custom player when the identifier is not a file', async () => {
			setup({
				isInsetViewer: true,
				props: { identifier: { mediaItemType: 'external-image', dataURI: 'some-uri' } },
			});
			await waitForContent();

			expect(CustomMediaPlayer).toHaveBeenCalled();
			expect(MediaPlayer).not.toHaveBeenCalled();
		});

		describe('on IE', () => {
			beforeEach(() => {
				jest.mocked(isIE).mockReturnValue(true);
			});

			afterEach(() => {
				jest.mocked(isIE).mockReturnValue(false);
			});

			it('should render the native video in an InsetVideoFrame when the inset viewer is enabled', async () => {
				setup({ isInsetViewer: true });
				await waitForContent();

				expect(InsetVideoFrame).toHaveBeenCalled();
				expect(jest.mocked(Video).mock.lastCall![0]).toEqual(
					expect.objectContaining({
						autoPlay: true,
						controls: true,
						src: expect.stringContaining('video_hd'),
						onVideoElementChange: expect.any(Function),
					}),
				);
				expect(CustomMediaPlayer).not.toHaveBeenCalled();
			});

			it('should render the native video without an InsetVideoFrame when the inset viewer is not enabled', async () => {
				setup({ isInsetViewer: false });
				await waitForContent();

				expect(InsetVideoFrame).not.toHaveBeenCalled();
				expect(jest.mocked(Video).mock.lastCall![0].onVideoElementChange).toBeUndefined();
			});
		});
	});
});
