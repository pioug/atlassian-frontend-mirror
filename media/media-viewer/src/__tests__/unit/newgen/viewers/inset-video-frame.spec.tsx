import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';

import { Rectangle } from '@atlaskit/media-ui/rectangle';

import {
	InsetViewerProvider,
	useHasMediaFooterPlayerControls,
} from '../../../../insetViewerContext';
import { MediaFooterBar } from '../../../../styleWrappers';
import { InsetVideoFrame } from '../../../../viewers/inset-video-frame';

jest.mock('../../../../styleWrappers', () => {
	const { forwardRef } = jest.requireActual('react');
	const original = jest.requireActual('../../../../styleWrappers');
	return {
		...original,
		// lazy wrappers: the mock* fns are initialised after the factory runs
		FittedVideoFrame: forwardRef((props: any, ref: any) => mockFittedVideoFrame(props, ref)),
		CustomMediaPlayerWrapper: forwardRef((props: any, ref: any) =>
			mockVideoPlayerWrapper(props, ref),
		),
	};
});
jest.mock('../../../../utils/fit-viewport', () => ({
	insetFittedViewport: () => mockInsetFittedViewport(),
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
	(
		{
			children,
			'data-testid': testId,
		}: {
			children?: React.ReactNode;
			'data-testid'?: string;
		},
		_ref?: React.Ref<HTMLDivElement>,
	) => <div data-testid={testId ?? 'video-player-wrapper'}>{children}</div>,
);

// The frame fits the video into the viewport that `insetFittedViewport` returns, which is mocked.
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

const HasPlayerControlsProbe = () => (
	<span data-testid="has-video-controls">{String(useHasMediaFooterPlayerControls())}</span>
);

const renderPlayer = jest.fn(() => <div data-testid="player" />);

const setup = (isFrameShown = true) => {
	const tree = (showFrame: boolean) => (
		<InsetViewerProvider isInsetViewer>
			<MediaFooterBar />
			<HasPlayerControlsProbe />
			{showFrame && <InsetVideoFrame data-testid="frame" renderPlayer={renderPlayer} />}
		</InsetViewerProvider>
	);
	const el = render(tree(isFrameShown));
	const showFrame = (show: boolean) => el.rerender(tree(show));
	const lastPlayerProps = () => (renderPlayer.mock.lastCall as any[])[0];

	return { el, showFrame, lastPlayerProps };
};

describe('InsetVideoFrame', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should render the player in the frame and give it the media footer and a video element callback', () => {
		const { lastPlayerProps } = setup();

		expect(screen.getByTestId('frame')).toBeInTheDocument();
		expect(screen.getByTestId('player')).toBeInTheDocument();
		expect(lastPlayerProps()).toEqual({
			controlsPortalElement: screen.getByTestId('media-viewer-media-footer'),
			onVideoElementChange: expect.any(Function),
		});
	});

	it('should tell the media footer it has player controls while mounted and not once unmounted', () => {
		const { showFrame } = setup(false);

		expect(screen.getByTestId('has-video-controls')).toHaveTextContent('false');

		showFrame(true);

		expect(screen.getByTestId('has-video-controls')).toHaveTextContent('true');

		showFrame(false);

		expect(screen.getByTestId('has-video-controls')).toHaveTextContent('false');
	});

	it('should fit the frame to the viewport once the video metadata loads', () => {
		mockInsetFittedViewport.mockReturnValue(WIDE_VIEWPORT);
		const { lastPlayerProps } = setup();

		// Before its metadata loads, a video reports no size, so there's nothing to fit yet.
		const video = createVideo(0, 0);
		act(() => lastPlayerProps().onVideoElementChange(video));

		expect(screen.getByTestId('fitted-video-frame').style.width).toBe('');

		// The metadata arrives with the video's real size, and the frame is fitted to it.
		Object.defineProperties(video, {
			videoWidth: { value: HD_VIDEO.width },
			videoHeight: { value: HD_VIDEO.height },
		});
		act(() => {
			fireEvent.loadedMetadata(video);
		});

		expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(HD_VIDEO_IN_WIDE_VIEWPORT);
	});

	it('should leave the frame unsized while the viewport has no width, and fit it once it has', () => {
		// The stage hasn't been laid out yet, so there's no width to fit the video into.
		mockInsetFittedViewport.mockReturnValue(NO_WIDTH_VIEWPORT);
		const { lastPlayerProps } = setup();
		const video = createVideo(HD_VIDEO.width, HD_VIDEO.height);

		act(() => lastPlayerProps().onVideoElementChange(video));

		expect(screen.getByTestId('fitted-video-frame').style.width).toBe('');

		// Once the stage has a width, the next fit sizes the frame.
		mockInsetFittedViewport.mockReturnValue(WIDE_VIEWPORT);
		act(() => {
			fireEvent.loadedMetadata(video);
		});

		expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(HD_VIDEO_IN_WIDE_VIEWPORT);
	});

	it('should stop listening to the previous video when the video element changes', () => {
		// Both videos are fitted to the wide viewport as they're attached.
		mockInsetFittedViewport.mockReturnValue(WIDE_VIEWPORT);
		const { lastPlayerProps } = setup();
		const firstVideo = createVideo(HD_VIDEO.width, HD_VIDEO.height);
		const secondVideo = createVideo(HD_VIDEO.width, HD_VIDEO.height);
		act(() => lastPlayerProps().onVideoElementChange(firstVideo));
		act(() => lastPlayerProps().onVideoElementChange(secondVideo));

		// Any refit from here on would size the frame for the narrow viewport.
		mockInsetFittedViewport.mockReturnValue(NARROW_VIEWPORT);

		// The replaced video's metadata event doesn't refit the frame: it's still wide.
		act(() => {
			fireEvent.loadedMetadata(firstVideo);
		});

		expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(HD_VIDEO_IN_WIDE_VIEWPORT);

		// The current video's metadata event does refit it.
		act(() => {
			fireEvent.loadedMetadata(secondVideo);
		});

		expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(
			HD_VIDEO_IN_NARROW_VIEWPORT,
		);
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

		it('should refit the frame when the stage resizes, and stop observing when unmounted', () => {
			mockInsetFittedViewport.mockReturnValue(WIDE_VIEWPORT);
			const { el, lastPlayerProps } = setup();
			// The frame observes the stage it sits in, so it can refit when the stage changes size.
			const stage = screen.getByTestId('frame');
			act(() =>
				lastPlayerProps().onVideoElementChange(createVideo(HD_VIDEO.width, HD_VIDEO.height)),
			);

			expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(
				HD_VIDEO_IN_WIDE_VIEWPORT,
			);

			// The stage narrows, for example when the sidebar opens.
			mockInsetFittedViewport.mockReturnValue(NARROW_VIEWPORT);
			act(() => observers.get(stage)!.callback([], {} as ResizeObserver));

			expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(
				HD_VIDEO_IN_NARROW_VIEWPORT,
			);
			expect(observers.get(stage)!.disconnect).not.toHaveBeenCalled();

			el.unmount();

			expect(observers.get(stage)!.disconnect).toHaveBeenCalled();
		});
	});

	it('should fit the frame without a ResizeObserver', () => {
		const OriginalResizeObserver = window.ResizeObserver;
		// @ts-expect-error simulating an environment without ResizeObserver
		delete window.ResizeObserver;
		try {
			// Without a ResizeObserver the frame can't refit when the stage resizes, but it still fits
			// when the video is attached.
			mockInsetFittedViewport.mockReturnValue(WIDE_VIEWPORT);
			const { lastPlayerProps } = setup();
			act(() =>
				lastPlayerProps().onVideoElementChange(createVideo(HD_VIDEO.width, HD_VIDEO.height)),
			);

			expect(screen.getByTestId('fitted-video-frame').style).toMatchObject(
				HD_VIDEO_IN_WIDE_VIEWPORT,
			);
		} finally {
			window.ResizeObserver = OriginalResizeObserver;
		}
	});

	it('should be accessible', async () => {
		const { el } = setup();

		await expect(el.container).toBeAccessible();
	});
});
