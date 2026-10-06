jest.mock('../../../../../utils/isIE', () => ({
	isIE: jest.fn(() => false),
}));

import React from 'react';

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl';

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
import { CustomMediaPlayer } from '@atlaskit/media-ui/customMediaPlayer';
import { MediaPlayer } from '@atlaskit/media-ui/mediaPlayer';
import { Rectangle } from '@atlaskit/media-ui/rectangle';
import { failGate, passGate } from '@atlassian/feature-flags-test-utils/mock-gates';

import { getErrorDetail } from '../../../../../getErrorDetail';
import { getSecondaryErrorReason } from '../../../../../getSecondaryErrorReason';
import {
	InsetViewerProvider,
	useHasMediaFooterVideoControls,
} from '../../../../../insetViewerContext';
import { MediaViewerError } from '../../../../../MediaViewerError';
import { MediaFooterBar, Video } from '../../../../../styleWrappers';
import { isIE } from '../../../../../utils/isIE';
import { VideoViewer } from '../../../../../viewers/video';

jest.mock('../../../../../styleWrappers', () => {
	const { forwardRef } = jest.requireActual('react');
	const original = jest.requireActual('../../../../../styleWrappers');
	return {
		...original,
		Video: jest.fn(original.Video),
		// lazy wrappers: the mock* fns are initialised after the factory runs
		FittedVideoFrame: forwardRef((props: any, ref: any) => mockFittedVideoFrame(props, ref)),
		CustomVideoPlayerWrapper: forwardRef((props: any, ref: any) =>
			mockVideoPlayerWrapper(props, ref),
		),
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
jest.mock('../../../../../utils/fit-viewport', () => ({
	insetFittedViewport: () => mockInsetFittedViewport(),
}));
jest.mock('@atlaskit/media-ui/mediaPlayer', () => ({
	...jest.requireActual('@atlaskit/media-ui/mediaPlayer'),
	MediaPlayer: jest.fn(() => null),
}));

const mockInsetFittedViewport = jest.fn();
const mockFittedVideoFrame = jest.fn(
	({ children }: { children?: React.ReactNode }, ref: React.Ref<HTMLDivElement>) => (
		<div ref={ref} data-testid="fitted-video-frame">
			{children}
		</div>
	),
);
const mockVideoPlayerWrapper = jest.fn(
	({ children }: { children?: React.ReactNode }, ref: React.Ref<HTMLDivElement>) => (
		<div ref={ref} data-testid="video-player-wrapper">
			{children}
		</div>
	),
);

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

const HasVideoControlsProbe = () => (
	<span data-testid="has-video-controls">{String(useHasMediaFooterVideoControls())}</span>
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

// The viewer fits the video into the viewport that `insetFittedViewport` returns, which is mocked.
const WIDE_VIEWPORT = new Rectangle(800, 600);
const NARROW_VIEWPORT = new Rectangle(400, 600);
const NO_WIDTH_VIEWPORT = new Rectangle(0, 600);

const HD_VIDEO = { width: 1600, height: 900 };
// An HD video (16:9) scaled to fit each viewport.
const HD_VIDEO_IN_WIDE_VIEWPORT = { width: '800px', height: '450px' };
const HD_VIDEO_IN_NARROW_VIEWPORT = { width: '400px', height: '225px' };

const createVideo = (videoWidth: number, videoHeight: number) => {
	const video = document.createElement('video');
	Object.defineProperties(video, {
		videoWidth: { configurable: true, value: videoWidth },
		videoHeight: { configurable: true, value: videoHeight },
	});
	return video;
};

const waitForContent = () =>
	waitFor(() => expect(screen.queryByLabelText('Loading file...')).not.toBeInTheDocument());

const lastCustomPlayerProps = () => jest.mocked(CustomMediaPlayer).mock.lastCall![0];

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
		beforeEach(() => {
			mockInsetFittedViewport.mockReturnValue(WIDE_VIEWPORT);
		});

		it('should tell the media footer it has video controls while mounted in the inset viewer', async () => {
			setup({ isInsetViewer: true, probe: <HasVideoControlsProbe /> });
			await waitForContent();

			expect(screen.getByTestId('has-video-controls')).toHaveTextContent('true');
		});

		it('should tell the media footer the video controls are gone once unmounted', async () => {
			const { unmountViewer } = setup({ isInsetViewer: true, probe: <HasVideoControlsProbe /> });
			await waitForContent();

			unmountViewer();

			expect(screen.getByTestId('has-video-controls')).toHaveTextContent('false');
		});

		it('should not tell the media footer about video controls when the inset viewer is not enabled', async () => {
			setup({ isInsetViewer: false, probe: <HasVideoControlsProbe /> });
			await waitForContent();

			expect(screen.getByTestId('has-video-controls')).toHaveTextContent('false');
		});

		it('should fit the video frame to the viewport once the video metadata loads', async () => {
			setup({ isInsetViewer: true });
			await waitForContent();

			const video = createVideo(0, 0);
			act(() => lastCustomPlayerProps().onVideoElementChange!(video));

			expect(screen.getByTestId('fitted-video-frame').style.width).toBe('');

			Object.defineProperties(video, {
				videoWidth: { value: HD_VIDEO.width },
				videoHeight: { value: HD_VIDEO.height },
			});
			act(() => {
				fireEvent.loadedMetadata(video);
			});

			expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(
				HD_VIDEO_IN_WIDE_VIEWPORT,
			);
		});

		it('should leave the video frame unsized while the viewport has no width', async () => {
			mockInsetFittedViewport.mockReturnValue(NO_WIDTH_VIEWPORT);
			setup({ isInsetViewer: true });
			await waitForContent();

			act(() =>
				lastCustomPlayerProps().onVideoElementChange!(createVideo(HD_VIDEO.width, HD_VIDEO.height)),
			);

			expect(screen.getByTestId('fitted-video-frame').style.width).toBe('');
		});

		describe('when the stage resizes', () => {
			const observers = new Map<
				Element,
				{ callback: ResizeObserverCallback; disconnect: jest.Mock }
			>();
			class FakeResizeObserver {
				disconnect = jest.fn();
				unobserve = jest.fn();
				constructor(private callback: ResizeObserverCallback) {}
				observe = (target: Element) => {
					observers.set(target, { callback: this.callback, disconnect: this.disconnect });
				};
			}
			const OriginalResizeObserver = window.ResizeObserver;

			beforeEach(() => {
				window.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
			});

			afterEach(() => {
				window.ResizeObserver = OriginalResizeObserver;
				observers.clear();
			});

			it('should refit the video frame when the stage resizes', async () => {
				setup({ isInsetViewer: true });
				await waitForContent();
				const stage = screen.getByTestId('video-player-wrapper');
				act(() =>
					lastCustomPlayerProps().onVideoElementChange!(
						createVideo(HD_VIDEO.width, HD_VIDEO.height),
					),
				);

				mockInsetFittedViewport.mockReturnValue(NARROW_VIEWPORT);
				act(() => observers.get(stage)!.callback([], {} as ResizeObserver));

				expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(
					HD_VIDEO_IN_NARROW_VIEWPORT,
				);
			});

			it('should stop observing the stage when unmounted', async () => {
				const { el } = setup({ isInsetViewer: true });
				await waitForContent();
				const stage = screen.getByTestId('video-player-wrapper');
				act(() =>
					lastCustomPlayerProps().onVideoElementChange!(
						createVideo(HD_VIDEO.width, HD_VIDEO.height),
					),
				);

				expect(observers.get(stage)!.disconnect).not.toHaveBeenCalled();

				el.unmount();

				expect(observers.get(stage)!.disconnect).toHaveBeenCalled();
			});
		});

		describe('on IE', () => {
			beforeEach(() => {
				jest.mocked(isIE).mockReturnValue(true);
			});

			afterEach(() => {
				jest.mocked(isIE).mockReturnValue(false);
			});

			it('should fit the native video to the viewport when the inset viewer is enabled', async () => {
				setup({ isInsetViewer: true });
				await waitForContent();

				expect(mockVideoPlayerWrapper).toHaveBeenCalled();
				expect(mockFittedVideoFrame).toHaveBeenCalled();

				act(() =>
					jest.mocked(Video).mock.lastCall![0].onVideoElementChange!(
						createVideo(HD_VIDEO.width, HD_VIDEO.height),
					),
				);

				expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(
					HD_VIDEO_IN_WIDE_VIEWPORT,
				);
			});
		});

		const players = [
			{
				name: 'custom player',
				setGate: () => failGate('platform_media_video_captions'),
				player: CustomMediaPlayer,
			},
			{
				name: 'captions player',
				setGate: () => passGate('platform_media_video_captions'),
				player: MediaPlayer,
			},
		];

		it.each(players)(
			'should hand the media footer and a video element callback to the $name when the inset viewer is enabled',
			async ({ setGate, player }) => {
				setGate();

				setup({ isInsetViewer: true, withMediaFooter: true });
				await waitForContent();
				const footer = screen.getByTestId('media-viewer-media-footer');

				expect(jest.mocked(player).mock.lastCall![0]).toEqual(
					expect.objectContaining({
						controlsPortalElement: footer,
						onVideoElementChange: expect.any(Function),
					}),
				);
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
	});
});
