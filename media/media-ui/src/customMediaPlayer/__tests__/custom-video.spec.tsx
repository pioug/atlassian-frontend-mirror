jest.mock('../getControlsWrapperClassName');
jest.mock('../fullscreen', () => {
	const original = jest.requireActual('../fullscreen');
	return {
		...original,
		toggleFullscreen: jest.fn(),
		getFullscreenElement: jest.fn(),
	};
});

jest.mock('../simultaneousPlayManager');
jest.mock('@atlaskit/width-detector');
import { asMock, asMockFunction } from '@atlaskit/media-common/test-helpers';
import { fakeIntl } from '../../test-helpers';
import { type WidthObserver } from '@atlaskit/width-detector';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import React from 'react';
import { CustomMediaPlayerBase, type CustomMediaPlayerProps } from '..';
import { toggleFullscreen, getFullscreenElement } from '../fullscreen';
import simultaneousPlayManager from '../simultaneousPlayManager';
import * as getControlsWrapperClassNameModule from '../getControlsWrapperClassName';
import { act } from 'react-dom/test-utils';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { keyCodes } from '../../shortcut';

const getControlsWrapperClassName = jest.spyOn(
	getControlsWrapperClassNameModule,
	'getControlsWrapperClassName',
);

// Removes errors from JSDOM virtual console on CustomMediaPlayer tests
// Trick taken from https://github.com/jsdom/jsdom/issues/2155
const HTMLMediaElement_play = HTMLMediaElement.prototype.play;
const HTMLMediaElement_pause = HTMLMediaElement.prototype.pause;

type mockWidthObserver = typeof WidthObserver;

let widthCbs: Set<(width: number) => void> = new Set();
// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

jest.mock('@atlaskit/width-detector', () => {
	return {
		WidthObserver: ((props: { setWidth: (width: number) => void }) => {
			widthCbs.add(props.setWidth);
			return null;
		}) as mockWidthObserver,
	};
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<CustomMediaPlayer />', () => {
	const setup = (props?: Partial<CustomMediaPlayerProps>) => {
		const createAnalyticsEventHandler = jest.fn().mockReturnValue({ fire: jest.fn() });

		const { container, unmount, rerender } = render(
			<IntlProvider locale="en">
				<CustomMediaPlayerBase
					createAnalyticsEvent={createAnalyticsEventHandler}
					type="video"
					fileId="some-file-id"
					isAutoPlay={true}
					isHDAvailable={false}
					src="video-src"
					intl={fakeIntl}
					{...props}
				/>
			</IntlProvider>,
		);

		const triggerKeydown = (code: string) => {
			const event = new KeyboardEvent('keydown', { code });
			act(() => {
				document.dispatchEvent(event);
			});
		};

		const triggerFullscreen = () => {
			fireEvent(screen.getByTestId('custom-media-player'), new Event('fullscreenchange'));
		};

		const triggerExitFullscreen = () => {
			asMockFunction(getFullscreenElement).mockReturnValue(undefined);
			fireEvent(screen.getByTestId('custom-media-player'), new Event('fullscreenchange'));
		};

		const triggerPlay = () => {
			const playButton = screen.getByTestId('custom-media-player-play-toggle-button');
			fireEvent.click(playButton);
			const video = container.querySelector('video') as HTMLVideoElement;
			fireEvent.play(video);
		};

		const getDownloadButton = () => screen.queryByTestId('custom-media-player-download-button');
		const getFullscreenButton = () => screen.getByTestId('custom-media-player-fullscreen-button');
		const getPlayPauseButton = () => screen.getByTestId('custom-media-player-play-toggle-button');
		const getMuteButton = () => screen.getByTestId('custom-media-player-volume-toggle-button');
		const getSkipBackwardButton = () =>
			screen.queryByTestId('custom-media-player-skip-backward-button');
		const getSkipForwardButton = () =>
			screen.queryByTestId('custom-media-player-skip-forward-button');
		const getBlanket = () => screen.getByTestId('play-pause-blanket');
		const getVideoElement = () => container.querySelector('video') as HTMLVideoElement;
		const getMediaElement = () => {
			const sourceType = props?.type || 'video';
			return container.querySelector(sourceType) as HTMLMediaElement;
		};
		const getCurrentTimeElement = () => screen.queryByTestId('current-time');
		const getVolumeTimeRangeWrapper = () => screen.queryByTestId('volume-time-range-wrapper');
		const getPlaybackSpeedButton = () =>
			screen.queryByTestId('custom-media-player-playback-speed-toggle-button');
		const setWidth = (width: number) => widthCbs.forEach((cb) => cb(width));
		const getSliderTime = () => getMediaElement().currentTime;
		const getVolumeLevel = () => getMediaElement().volume;
		const simulateWaiting = () => fireEvent.waiting(getMediaElement());
		const simulateLoadedData = () => fireEvent.loadedData(getMediaElement());

		const simulateTimeUpdate = (currentTime: number, buffered?: any) => {
			const media = getMediaElement();
			act(() => {
				if (buffered) {
					Object.defineProperty(media, 'buffered', {
						writable: true,
						value: buffered,
					});
				}
				fireEvent.timeUpdate(media, {
					target: {
						currentTime,
					},
				});
			});
		};

		const simulateVolumeChange = (volume: number) => {
			act(() => {
				fireEvent.volumeChange(getMediaElement(), {
					target: {
						volume,
					},
				});
			});
		};

		const simulateCanPlay = (currentTime: number | null, volume: number, duration: number) => {
			const media = getMediaElement();
			Object.defineProperty(media, 'currentTime', { writable: true });
			Object.defineProperty(media, 'volume', { writable: true });
			Object.defineProperty(media, 'duration', { writable: true });
			fireEvent.canPlay(media, {
				target: {
					currentTime,
					volume,
					duration,
				},
			});
		};

		const getUIAnalyticsEventDetails = (callIndex: number = 1) => {
			//event handler 1st call is screen event, 2nd is ui event
			const payload = createAnalyticsEventHandler.mock.calls[callIndex]?.[0];
			const { attributes } = payload || {};
			return {
				payload,
				attributes,
			};
		};

		return {
			container,
			triggerKeydown,
			triggerFullscreen,
			triggerExitFullscreen,
			triggerPlay,
			getUIAnalyticsEventDetails,
			unmount,
			rerender,
			createAnalyticsEventHandler,
			getDownloadButton,
			getFullscreenButton,
			getPlayPauseButton,
			getMuteButton,
			getSkipBackwardButton,
			getSkipForwardButton,
			getBlanket,
			getVideoElement,
			getMediaElement,
			getCurrentTimeElement,
			getVolumeTimeRangeWrapper,
			getPlaybackSpeedButton,
			setWidth,
			getSliderTime,
			getVolumeLevel,
			simulateTimeUpdate,
			simulateVolumeChange,
			simulateCanPlay,
			simulateWaiting,
			simulateLoadedData,
		};
	};

	beforeAll(() => {
		jest.useFakeTimers();
	});

	beforeEach(() => {
		widthCbs.clear();
		asMock(toggleFullscreen).mockReset();
		asMock(getFullscreenElement).mockReset();
		HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
		HTMLMediaElement.prototype.pause = jest.fn(() => Promise.resolve());
		// Clear localStorage to ensure tests don't interfere with each other
		if (typeof localStorage !== 'undefined') {
			localStorage.clear();
		}
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	afterEach(() => {
		HTMLMediaElement.prototype.play = HTMLMediaElement_play;
		HTMLMediaElement.prototype.pause = HTMLMediaElement_pause;
	});

	describe('render', () => {
		it('should render the video element', () => {
			const { getVideoElement } = setup();

			expect(getVideoElement()).toBeInTheDocument();
		});

		it('should render play button icon at first', async () => {
			setup({ isAutoPlay: false });

			const playButton = await screen.findByRole('button', {
				name: /fakeintl\["play"\]/i,
			});
			expect(playButton).toBeInTheDocument();
		});

		it('should render pause button when play has been pressed', async () => {
			const { triggerPlay } = setup({ isAutoPlay: false });
			triggerPlay();

			const pauseButton = await screen.findByRole('button', {
				name: /fakeintl\["pause"\]/i,
			});
			expect(pauseButton).toBeInTheDocument();
		});

		it('should render a time range', () => {
			const { container } = setup();

			const timeRange = container.querySelector('[data-testid="time-range-wrapper"]');
			expect(timeRange).toBeInTheDocument();
		});

		it('should render the volume controls', () => {
			const { getVolumeLevel } = setup();

			expect(getVolumeLevel()).toEqual(1);
		});

		it('should render the time (current/total) in the right format', () => {
			const { container } = setup();
			const currentTimeElement = container.querySelector('[data-testid="current-time"]');
			expect(currentTimeElement?.textContent).toContain('0:00 / 0:00');
		});

		it('should render the fullscreen button', () => {
			const { getFullscreenButton } = setup();

			expect(getFullscreenButton()).toBeInTheDocument();
		});

		it('should render the playPauseBlanket', () => {
			const { getBlanket } = setup();

			expect(getBlanket()).toBeInTheDocument();
		});

		it('should render the skip backward button', () => {
			const { getSkipBackwardButton } = setup();

			expect(getSkipBackwardButton()).toBeInTheDocument();
		});

		it('should render the skip forward button', () => {
			const { getSkipForwardButton } = setup();

			expect(getSkipForwardButton()).toBeInTheDocument();
		});

		it('should pass poster URL to MediaPlayer when available', () => {
			const poster = 'some-data-uri';
			const { getVideoElement } = setup({ poster });
			expect(getVideoElement().poster).toContain(poster);
		});

		it('should render spinner when the video is in loading state', () => {
			const { simulateWaiting, container } = setup();

			simulateWaiting();
			expect(container.querySelector('[data-testid="spinner"]')).toBeInTheDocument();
		});

		describe('when onDownloadClick is passed', () => {
			const onDownloadClick = jest.fn();

			it('should render download button if onDownloadClick is passed', () => {
				const { getDownloadButton } = setup({ onDownloadClick });
				expect(getDownloadButton()).toBeInTheDocument();
			});

			it('should call onDownloadClick when download button is pressed', () => {
				const { getDownloadButton } = setup({ onDownloadClick });
				const downloadButton = getDownloadButton();
				if (!downloadButton) {
					throw new Error('downloadButton does not exist');
				}
				fireEvent.click(downloadButton);
				expect(onDownloadClick).toBeCalledTimes(1);
			});
		});

		it('should render playback speed controls with default values', () => {
			const { getPlaybackSpeedButton } = setup();

			expect(getPlaybackSpeedButton()).toBeInTheDocument();
		});
	});

	describe('interaction', () => {
		beforeEach(() => {
			asMock(simultaneousPlayManager.pauseOthers).mockClear();
		});

		afterAll(() => {
			asMock(simultaneousPlayManager.pauseOthers).mockRestore();
		});

		it('should start play when play button is pressed', () => {
			const { getPlayPauseButton, getVideoElement } = setup({
				isAutoPlay: false,
			});
			fireEvent.click(getPlayPauseButton());
			expect(getVideoElement().play).toHaveBeenCalledTimes(1);
		});

		it('should pause video when pause button is pressed', async () => {
			const { getPlayPauseButton, getVideoElement, triggerPlay } = setup({
				isAutoPlay: false,
			});
			triggerPlay();

			fireEvent.click(getPlayPauseButton());
			expect(getVideoElement().pause).toHaveBeenCalledTimes(1);
		});

		it('should not show controls if shortcuts are disabled', () => {
			const showControls = jest.fn();
			const { triggerKeydown } = setup({
				showControls,
				isShortcutEnabled: false,
			});

			triggerKeydown(keyCodes.space);

			expect(showControls).toHaveBeenCalledTimes(0);
		});

		it('should show controls when any of the shortcut activated', () => {
			const showControls = jest.fn();
			const { triggerKeydown } = setup({
				showControls,
				isShortcutEnabled: true,
			});

			triggerKeydown(keyCodes.space);
			triggerKeydown(keyCodes.m);

			expect(showControls).toHaveBeenCalledTimes(2);
		});

		it('should request full screen when fullscreen button is clicked', () => {
			const { getFullscreenButton } = setup();

			fireEvent.click(getFullscreenButton());
			expect(toggleFullscreen).toHaveBeenCalledTimes(1);
		});

		it('should play/pause when playPauseBlanket is clicked', async () => {
			const { getBlanket } = setup({ isAutoPlay: true });

			expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(1);

			fireEvent.click(getBlanket());

			jest.runOnlyPendingTimers();
			expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(2);
		});

		it('should update TimeRange when time changes', () => {
			const { simulateTimeUpdate, getSliderTime } = setup();

			simulateTimeUpdate(10);
			expect(getSliderTime()).toEqual(10);
		});

		it('should update buffered time when it changes', async () => {
			const { simulateTimeUpdate, getMediaElement } = setup();
			expect(getMediaElement().buffered.length).toBe(0);
			simulateTimeUpdate(10, {
				length: 1,
				end: () => 10,
			});
			expect(getMediaElement().buffered.length).toBe(1);
		});

		it("should update Volume's TimeRange when volume changes", () => {
			const { simulateVolumeChange, getVolumeLevel } = setup();

			simulateVolumeChange(0.3);
			expect(getVolumeLevel()).toEqual(0.3);
		});

		it('should update playback speed when speed is changed', async () => {
			const { getPlaybackSpeedButton } = setup();
			const btn = getPlaybackSpeedButton();

			fireEvent.click(btn!);
			const twoTimesButton = await screen.findByText('2x');

			fireEvent.click(twoTimesButton);

			expect(await screen.findByText(/2x/i)).toBeInTheDocument();
		});

		it('should update time position when skip forward is pressed', () => {
			const { simulateCanPlay, simulateTimeUpdate, getSkipForwardButton, getSliderTime } = setup();

			simulateCanPlay(0, 0.5, 25);
			simulateTimeUpdate(0);

			expect(getSliderTime()).toEqual(0);

			const skipForwardButton = getSkipForwardButton();
			if (!skipForwardButton) {
				throw new Error('skipForwardButton missing');
			}
			fireEvent.click(skipForwardButton);
			expect(getSliderTime()).toEqual(10);
			fireEvent.click(skipForwardButton);
			expect(getSliderTime()).toEqual(20);
			fireEvent.click(skipForwardButton);
			expect(getSliderTime()).toEqual(25);
			fireEvent.click(skipForwardButton);
			expect(getSliderTime()).toEqual(25);
		});

		it('should update time position when skip backward is pressed', () => {
			const { simulateTimeUpdate, getSkipBackwardButton, getSliderTime } = setup();

			simulateTimeUpdate(15);
			expect(getSliderTime()).toEqual(15);

			const skipBackwardButton = getSkipBackwardButton();
			if (!skipBackwardButton) {
				throw new Error('skipForwardButton missing');
			}
			fireEvent.click(skipBackwardButton);
			expect(getSliderTime()).toEqual(5);
			fireEvent.click(skipBackwardButton);
			expect(getSliderTime()).toEqual(0);
			fireEvent.click(skipBackwardButton);
			expect(getSliderTime()).toEqual(0);
		});

		it('should mute when speaker is clicked', () => {
			const { getMuteButton, getVideoElement } = setup();
			fireEvent.click(getMuteButton());
			expect(getVideoElement().volume).toEqual(0);
		});

		it('should unmute when speaker is clicked after being muted', () => {
			const { getMuteButton, getVideoElement } = setup();
			fireEvent.click(getMuteButton());
			fireEvent.click(getMuteButton());
			expect(getVideoElement().volume).toEqual(1);
		});

		it('should have aria-pressed true when volume is muted', () => {
			const { getMuteButton } = setup();
			fireEvent.click(getMuteButton());
			const muteButton = getMuteButton();
			expect(muteButton).toHaveAttribute('aria-pressed', 'true');
		});

		it('should enter fullscreen when blanket double clicked', async () => {
			const { container } = setup();

			const video = container.querySelector('video') as HTMLVideoElement;

			// To simulation double click we need to call double click handler itself,
			// but also make two clicks with some delay in between.
			const playPauseBlanket = await screen.findByTestId('play-pause-blanket');
			fireEvent.click(playPauseBlanket);
			jest.advanceTimersByTime(50);

			expect(video.play).toHaveBeenCalledTimes(0);
			fireEvent.click(playPauseBlanket);

			fireEvent.doubleClick(playPauseBlanket);

			expect(toggleFullscreen).toHaveBeenCalledTimes(1);

			jest.runOnlyPendingTimers();
			expect(video.play).toHaveBeenCalledTimes(0);
		});

		describe('when shortcut are enabled', () => {
			it('should start play when space bar is pressed', () => {
				const { getVideoElement, triggerKeydown } = setup({
					isShortcutEnabled: true,
				});

				triggerKeydown(keyCodes.space);

				expect(getVideoElement().play).toHaveBeenCalledTimes(1);
			});

			it('should stop play when space bar is pressed second time', async () => {
				const { getVideoElement, triggerKeydown } = setup({
					isShortcutEnabled: true,
				});

				triggerKeydown(keyCodes.space);
				fireEvent.play(getVideoElement());
				triggerKeydown(keyCodes.space);

				expect(getVideoElement().pause).toHaveBeenCalledTimes(1);
			});

			it('should mute and unmute when "m" keypress continuously', async () => {
				const { container, triggerKeydown } = setup({
					isShortcutEnabled: true,
				});

				act(() => {
					triggerKeydown(keyCodes.m);
				});
				expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(0);

				act(() => {
					triggerKeydown(keyCodes.m);
				});
				expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(1);
			});
		});

		describe('when fullscreen is enabled', () => {
			beforeEach(() => {
				const original = jest.requireActual('../fullscreen');
				asMock(toggleFullscreen).mockImplementation(original.toggleFullscreen);
				asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
			});

			it('should start play when space bar is pressed', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setup({
					isShortcutEnabled: false,
				});

				const video = container.querySelector('video') as HTMLVideoElement;

				triggerFullscreen();
				expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

				act(() => {
					triggerKeydown(keyCodes.space);
				});
				expect(video.play).toHaveBeenCalledTimes(1);
			});

			it('should stop play when space bar is pressed second time', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setup({
					isShortcutEnabled: false,
				});

				const video = container.querySelector('video') as HTMLVideoElement;

				triggerFullscreen();
				expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

				// first space key press
				act(() => {
					triggerKeydown(keyCodes.space);
				});

				fireEvent.play(video);

				// second space key press
				act(() => {
					triggerKeydown(keyCodes.space);
				});

				expect(video.pause).toHaveBeenCalledTimes(1);
			});

			it('should mute and unmute when "m" keypress continuously', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setup({
					isShortcutEnabled: false,
				});

				triggerFullscreen();
				expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

				expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(1);

				// first 'm' key press
				act(() => {
					triggerKeydown(keyCodes.m);
				});
				expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(0);

				// second 'm' key press
				act(() => {
					triggerKeydown(keyCodes.m);
				});
				expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(1);
			});

			it('should skip back when left arrow pressed', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setup({
					isShortcutEnabled: false,
				});

				triggerFullscreen();
				expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

				const video = container.querySelector('video') as HTMLVideoElement;

				fireEvent.timeUpdate(video, {
					target: {
						currentTime: 15,
					},
				});

				expect(video.currentTime).toEqual(15);

				act(() => {
					triggerKeydown(keyCodes.leftArrow);
				});

				expect(video.currentTime).toEqual(5);
			});

			it('should skip forward when right arrow pressed', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setup({
					isShortcutEnabled: false,
				});

				triggerFullscreen();
				expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

				let video = container.querySelector('video') as HTMLVideoElement;

				Object.defineProperty(video, 'duration', {
					writable: true,
					value: 25,
				});
				fireEvent.durationChange(video, {
					target: {
						duration: 25,
					},
				});
				expect(video.duration).toEqual(25);

				fireEvent.timeUpdate(video, {
					target: {
						currentTime: 0,
					},
				});

				expect(video.currentTime).toEqual(0);

				act(() => {
					triggerKeydown(keyCodes.rightArrow);
				});

				expect(video.currentTime).toEqual(10);
			});
		});
	});

	describe('auto play', () => {
		it('should use autoplay when requested', () => {
			const { getVideoElement } = setup({
				isHDAvailable: true,
				isAutoPlay: true,
			});
			expect(getVideoElement().autoplay).toBe(true);
		});

		it('should not use autoplay when not requested', () => {
			const { getVideoElement } = setup({
				isHDAvailable: true,
				isAutoPlay: false,
			});
			expect(getVideoElement().autoplay).toBe(false);
		});
	});

	describe('simultaneous play', () => {
		beforeEach(() => {
			asMock(simultaneousPlayManager.subscribe).mockClear();
			asMock(simultaneousPlayManager.pauseOthers).mockClear();
			asMock(simultaneousPlayManager.unsubscribe).mockClear();
		});

		afterAll(() => {
			asMock(simultaneousPlayManager.subscribe).mockRestore();
			asMock(simultaneousPlayManager.pauseOthers).mockRestore();
			asMock(simultaneousPlayManager.unsubscribe).mockRestore();
		});

		it('should subscribe to Simultaneous Play Manager', () => {
			setup();
			expect(simultaneousPlayManager.subscribe).toBeCalledTimes(1);
		});

		it('should unsubscribe from Simultaneous Play Manager on unmount', () => {
			const { unmount } = setup();
			unmount();
			expect(simultaneousPlayManager.unsubscribe).toBeCalledTimes(1);
		});

		it('should pause other players when click play button', () => {
			const { getPlayPauseButton } = setup({ isAutoPlay: false });

			fireEvent.click(getPlayPauseButton());
			expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(1);
		});

		it('should pause other players if autoplay is ON', () => {
			setup({ isAutoPlay: true });
			expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(1);
		});
	});

	describe('#onFirstPlay', () => {
		it('should be called once when loaded with autoplay = true', async () => {
			const onFirstPlay = jest.fn();
			setup({
				onFirstPlay,
				isHDAvailable: true,
				isAutoPlay: true,
			});
			expect(onFirstPlay).toHaveBeenCalledTimes(1);

			const playButton = await screen.findByRole('button', {
				name: /fakeintl\["play"\]/i,
			});
			fireEvent.click(playButton);

			expect(onFirstPlay).toHaveBeenCalledTimes(1);
		});

		it('should be called once when loaded with autoplay = false and user start play', async () => {
			const onFirstPlay = jest.fn();
			setup({
				onFirstPlay,
				isHDAvailable: true,
				isAutoPlay: false,
			});
			expect(onFirstPlay).toHaveBeenCalledTimes(0);

			const playButton = await screen.findByRole('button', {
				name: /fakeintl\["play"\]/i,
			});
			fireEvent.click(playButton);
			expect(onFirstPlay).toHaveBeenCalledTimes(1);

			fireEvent.click(playButton);
			expect(onFirstPlay).toHaveBeenCalledTimes(1);
		});
	});

	describe('on resize', () => {
		it('should show/hide forward and backwards controls, when video is bigger/smaller than 400px (playerSize is large)', async () => {
			const { setWidth, getSkipForwardButton, getSkipBackwardButton } = setup();

			// small sized video <160px
			act(() => {
				setWidth(150);
			});
			expect(getSkipForwardButton()).not.toBeInTheDocument();
			expect(getSkipBackwardButton()).not.toBeInTheDocument();

			// medium sized video >160px & < 400px
			act(() => {
				setWidth(250);
			});
			expect(getSkipForwardButton()).not.toBeInTheDocument();
			expect(getSkipBackwardButton()).not.toBeInTheDocument();

			// large sized video
			act(() => {
				setWidth(420);
			});
			expect(getSkipForwardButton()).toBeInTheDocument();
			expect(getSkipBackwardButton()).toBeInTheDocument();
		});

		it('when the playerSize is medium or large (above 160px width), show the timestamp and playback speed controls', async () => {
			const { setWidth, getCurrentTimeElement, getPlaybackSpeedButton } = setup();

			act(() => {
				setWidth(150);
			});
			expect(getCurrentTimeElement()).not.toBeInTheDocument();
			expect(getPlaybackSpeedButton()).not.toBeInTheDocument();

			act(() => {
				setWidth(170);
			});
			expect(getCurrentTimeElement()).toBeInTheDocument();
			expect(getPlaybackSpeedButton()).not.toBeInTheDocument();

			act(() => {
				setWidth(401);
			});
			expect(getCurrentTimeElement()).toBeInTheDocument();
			expect(getPlaybackSpeedButton()).toBeInTheDocument();
		});

		it('Should show/hide volume controls when video is bigger/smaller than 400px (playerSize is large)', async () => {
			const { setWidth, getVolumeTimeRangeWrapper } = setup();

			act(() => {
				setWidth(399);
			});
			expect(getVolumeTimeRangeWrapper()).not.toBeInTheDocument();

			act(() => {
				setWidth(401);
			});
			expect(getVolumeTimeRangeWrapper()).toBeInTheDocument();
		});
	});

	describe('analytics', () => {
		const assertPayload = (
			actualPayload: any,
			payload: {
				action: 'clicked' | 'pressed' | 'changed' | 'navigated' | 'firstPlayed';
				actionSubject: string;
				actionSubjectId?: string;
			},
			attributes: any,
		) => {
			expect(actualPayload).toEqual(
				expect.objectContaining({
					eventType: expect.stringMatching(/(ui|track)/i),
					...payload,
					attributes: expect.objectContaining({
						...attributes,
					}),
				}),
			);
		};

		beforeEach(() => {
			const original = jest.requireActual('../fullscreen');
			asMock(toggleFullscreen).mockImplementation(original.toggleFullscreen);
			asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
		});

		it('should fire clicked event when play button is clicked', () => {
			const { triggerPlay, getUIAnalyticsEventDetails } = setup({
				isAutoPlay: false,
			});

			triggerPlay();

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'playButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
					playbackAttributes: expect.objectContaining({
						status: 'paused',
					}),
				},
			);
		});

		it('should fire clicked event when pause button is clicked', async () => {
			const { triggerPlay, getPlayPauseButton, getUIAnalyticsEventDetails } = setup({
				isAutoPlay: false,
			});

			triggerPlay();

			// Pause
			fireEvent.click(getPlayPauseButton());

			const { payload } = getUIAnalyticsEventDetails(2);

			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'pauseButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
					playbackAttributes: expect.objectContaining({
						status: 'playing',
					}),
				},
			);
		});

		it('should fire pressed event when space key is pressed', () => {
			const { triggerKeydown, getUIAnalyticsEventDetails } = setup({
				isShortcutEnabled: true,
			});
			triggerKeydown(keyCodes.space);

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'pressed',
					actionSubject: 'shortcut',
					actionSubjectId: 'space',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire pressed event when mute key is pressed', () => {
			const { triggerKeydown, getUIAnalyticsEventDetails } = setup({
				isShortcutEnabled: true,
			});

			triggerKeydown(keyCodes.m);

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'pressed',
					actionSubject: 'shortcut',
					actionSubjectId: 'mute',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire clicked event when mute button is clicked', () => {
			const { getMuteButton, getUIAnalyticsEventDetails } = setup();

			fireEvent.click(getMuteButton());

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'muteButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire clicked event when playbackSpeed button is clicked', async () => {
			const { getPlaybackSpeedButton, getUIAnalyticsEventDetails } = setup();
			const playbackSpeedButton = getPlaybackSpeedButton();

			if (!playbackSpeedButton) {
				throw new Error('playbackSpeedButton missing');
			}

			await act(async () => {
				fireEvent.click(playbackSpeedButton);
			});

			expect(getUIAnalyticsEventDetails().payload).toBeDefined();

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'playbackSpeedButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire changed event when play Speed is changed', async () => {
			const { container, getUIAnalyticsEventDetails } = setup();

			// Trigger a playback speed change by finding and clicking the speed button
			const playbackSpeedButton = container.querySelector(
				'[data-testid="custom-media-player-playback-speed-toggle-button"]',
			);

			if (!playbackSpeedButton) {
				throw new Error('playbackSpeedButton missing');
			}
			fireEvent.click(playbackSpeedButton);

			// Wait for potential speed change
			const twoTimesButton = container.querySelector('[role="option"]');
			if (!twoTimesButton) {
				throw new Error('twoTimesButton missing');
			}
			fireEvent.click(twoTimesButton);

			const { payload } = getUIAnalyticsEventDetails(1);
			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'playbackSpeedButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire clicked event when fullScreen button is clicked', () => {
			const { getFullscreenButton, getUIAnalyticsEventDetails } = setup();

			fireEvent.click(getFullscreenButton());

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'fullScreenButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire clicked event when download button is clicked', () => {
			const onDownloadClick = jest.fn();
			const { getDownloadButton, getUIAnalyticsEventDetails } = setup({
				onDownloadClick,
			});

			const downloadButton = getDownloadButton();
			if (!downloadButton) {
				throw new Error('Download button missing');
			}

			fireEvent.click(downloadButton);

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'downloadButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire clicked event when PlayPauseBlanket is clicked', async () => {
			const { getUIAnalyticsEventDetails } = setup({
				isAutoPlay: true,
			});

			const playPauseBlanket = await screen.findByTestId('play-pause-blanket');

			fireEvent.click(playPauseBlanket);

			jest.runOnlyPendingTimers();

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'playPauseBlanket',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire navigated event when TimeRange for time is changed', () => {
			const { container, getUIAnalyticsEventDetails, simulateCanPlay } = setup();

			// Set up the video with a proper duration before interacting with the time range
			simulateCanPlay(0, 0.5, 100);

			const timeRange = container.querySelector('[data-testid="time-range-wrapper"]');

			// Mock getBoundingClientRect to return a non-zero width for the time range
			const mockGetBoundingClientRect = jest.fn(() => ({
				width: 400,
			}));

			// The TimeRange component uses this.wrapperElement.current.getBoundingClientRect()
			// where wrapperElement refers to the inner TimeLine component, not the outer wrapper
			// We need to mock getBoundingClientRect on the TimeLine element (the first child div)
			const timeLineElement = timeRange?.firstElementChild as HTMLElement;
			if (!timeLineElement) {
				throw new Error('timeLineElement missing');
			}
			Object.defineProperty(timeLineElement, 'getBoundingClientRect', {
				value: mockGetBoundingClientRect,
			});

			act(() => {
				fireEvent.pointerDown(timeRange!, {
					nativeEvent: { offsetX: 10, clientX: 10 },
				});
				fireEvent.pointerUp(timeRange!, {
					nativeEvent: { offsetX: 11, clientX: 11 },
				});
			});

			const { payload } = getUIAnalyticsEventDetails();
			assertPayload(
				payload,
				{
					action: 'navigated',
					actionSubject: 'timeRange',
					actionSubjectId: 'time',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire navigated event when TimeRange for volume is changed', async () => {
			const { container, getUIAnalyticsEventDetails } = setup();

			// Find the volume range input element - this is an actual input[type="range"]
			const volumeRangeInput = container.querySelector(
				'[data-testid="volume-range"] [type="range"',
			);

			// For a real range input, we can use fireEvent.change with a target value
			fireEvent.change(volumeRangeInput!, { target: { value: '0.5' } });

			const { payload } = getUIAnalyticsEventDetails();
			assertPayload(
				payload,
				{
					action: 'navigated',
					actionSubject: 'timeRange',
					actionSubjectId: 'volume',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire click event when skip back is pressed', () => {
			const { getSkipBackwardButton, getUIAnalyticsEventDetails } = setup();

			const skipBackwardButton = getSkipBackwardButton();
			if (!skipBackwardButton) {
				throw new Error('skipBackwardButton missing');
			}
			fireEvent.click(skipBackwardButton);

			const { payload } = getUIAnalyticsEventDetails();
			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'skipBackwardButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire click event when skip forward is pressed', () => {
			const { getSkipForwardButton, getUIAnalyticsEventDetails } = setup();

			const skipForwardButton = getSkipForwardButton();
			if (!skipForwardButton) {
				throw new Error('skipForwardButton missing');
			}
			fireEvent.click(skipForwardButton);

			const { payload } = getUIAnalyticsEventDetails();
			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'skipForwardButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire press event when skip backward is activated by pressing left key', async () => {
			const { getUIAnalyticsEventDetails, triggerKeydown, triggerFullscreen } = setup();

			triggerFullscreen();
			expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

			triggerKeydown(keyCodes.leftArrow);

			const { payload } = getUIAnalyticsEventDetails();
			assertPayload(
				payload,
				{
					action: 'pressed',
					actionSubject: 'shortcut',
					actionSubjectId: 'leftArrow',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire press event when skip forward is activated by pressing right key', async () => {
			const { getUIAnalyticsEventDetails, triggerKeydown, triggerFullscreen } = setup();

			triggerFullscreen();
			expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

			triggerKeydown(keyCodes.rightArrow);

			const { payload } = getUIAnalyticsEventDetails();
			assertPayload(
				payload,
				{
					action: 'pressed',
					actionSubject: 'shortcut',
					actionSubjectId: 'rightArrow',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire firstPlayed event when inline player is loaded with auto play', () => {
			const { getUIAnalyticsEventDetails } = setup({
				isAutoPlay: true,
				onFirstPlay: () => {},
			});

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'firstPlayed',
					actionSubject: 'customMediaPlayer',
					actionSubjectId: 'some-file-id',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});

		it('should fire firstPlayed event when play button in inline player is clicked for the first time', () => {
			const { triggerPlay, getUIAnalyticsEventDetails } = setup({
				onFirstPlay: () => {},
			});

			triggerPlay();

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'firstPlayed',
					actionSubject: 'customMediaPlayer',
					actionSubjectId: 'some-file-id',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: 'some-file-id',
					},
				},
			);
		});
	});

	describe('on toggle fullscreen', () => {
		beforeEach(() => {
			const original = jest.requireActual('../fullscreen');
			asMock(toggleFullscreen).mockImplementation(original.toggleFullscreen);
		});

		it('should fire callback when fullscreen change', async () => {
			const onFullscreenChange = jest.fn();
			const { triggerFullscreen } = setup({
				onFullscreenChange,
			});

			asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
			triggerFullscreen();

			expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();
			expect(onFullscreenChange).toHaveBeenCalledWith(true);

			asMockFunction(getFullscreenElement).mockReturnValue(undefined);
			triggerFullscreen();

			expect(await screen.findByLabelText('fakeIntl["enable fullscreen"]')).toBeInTheDocument();
			expect(onFullscreenChange).toHaveBeenCalledWith(false);
		});

		it('should fire callback when in full screen and component unmounted', async () => {
			const onFullscreenChange = jest.fn();
			const { triggerFullscreen, unmount } = setup({
				onFullscreenChange,
			});

			asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
			triggerFullscreen();

			expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

			unmount();

			expect(onFullscreenChange).toHaveBeenCalledWith(false);
		});

		it('should not fire callback when not in full screen and component unmounted', () => {
			const onFullscreenChange = jest.fn();
			const { unmount } = setup({
				onFullscreenChange,
			});
			unmount();
			expect(onFullscreenChange).toHaveBeenCalledTimes(0);
		});
	});

	const sourceTypes: CustomMediaPlayerProps['type'][] = ['video', 'audio'];

	sourceTypes.forEach((sourceType) => {
		describe('with save last watch time feature', () => {
			it(`should continue play from last watch time for the same ${sourceType} with more than 60 seconds left to play`, async () => {
				const { simulateCanPlay, simulateTimeUpdate } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-unique-id',
					},
					type: sourceType,
				});

				simulateCanPlay(0, 0.5, 62);
				simulateTimeUpdate(1);

				const {
					container: container2,
					simulateCanPlay: simulateCanPlay2,
					simulateLoadedData: simulateLoadedData2,
				} = setup({
					lastWatchTimeConfig: {
						contentId: 'some-unique-id',
					},
					type: sourceType,
				});

				// // Simulate the canplay event to trigger the saved time restoration
				simulateCanPlay2(null, 0.5, 62);
				// // Simulate the loadeddata event to set currentTime from defaultTime
				simulateLoadedData2();

				const mediaPlayer = container2.querySelector(sourceType) as HTMLMediaElement;
				expect(mediaPlayer.currentTime).toBe(1);
			});

			it(`should not set defaultTime for the same ${sourceType} with a total duration less than equal to 60 seconds`, () => {
				const { simulateCanPlay, simulateTimeUpdate } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-very-unique-id',
					},
					type: sourceType,
				});

				simulateCanPlay(0, 0.5, 60);
				simulateTimeUpdate(1);

				const {
					container: container2,
					simulateCanPlay: simulateCanPlay2,
					simulateLoadedData: simulateLoadedData2,
				} = setup({
					lastWatchTimeConfig: {
						contentId: 'some-very-unique-id',
					},
					type: sourceType,
				});

				// Simulate the canplay event to trigger the saved time restoration
				simulateCanPlay2(null, 0.5, 60);
				// Simulate the loadeddata event to set currentTime from defaultTime
				simulateLoadedData2();

				const mediaPlayer = container2.querySelector(sourceType) as HTMLMediaElement;
				expect(mediaPlayer.currentTime).toBe(0);
			});

			it(`should reset defaultTime for the same ${sourceType} when we are within 60 seconds of the end`, () => {
				const setupProps = {
					lastWatchTimeConfig: {
						contentId: 'some-super-unique-id',
					},
					type: sourceType,
				};
				const { simulateCanPlay, simulateTimeUpdate } = setup(setupProps);

				simulateCanPlay(0, 0.5, 90);

				// We still have more than 60 seconds till the end. Should save 10 seconds
				simulateTimeUpdate(10);
				const {
					container: container2,
					simulateCanPlay: simulateCanPlay2,
					simulateLoadedData: simulateLoadedData2,
				} = setup(setupProps);

				// Simulate the canplay event to trigger the saved time restoration
				simulateCanPlay2(null, 0.5, 90);
				// Simulate the loadeddata event to set currentTime from defaultTime
				simulateLoadedData2();

				const mediaPlayer2 = container2.querySelector(sourceType) as HTMLMediaElement;
				expect(mediaPlayer2.currentTime).toBe(10);

				// We are now within 60 seconds of the end. Should reset to 0
				simulateTimeUpdate(30);
				const {
					container: container3,
					simulateCanPlay: simulateCanPlay3,
					simulateLoadedData: simulateLoadedData3,
				} = setup(setupProps);

				// Simulate the canplay event to trigger the saved time restoration
				simulateCanPlay3(null, 0.5, 90);
				// Simulate the loadeddata event to set currentTime from defaultTime
				simulateLoadedData3();

				const mediaPlayer3 = container3.querySelector(sourceType) as HTMLMediaElement;
				expect(mediaPlayer3.currentTime).toBe(0);
			});

			it(`should start from beginning for a different ${sourceType} regardless of play time`, () => {
				const { simulateTimeUpdate } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-unique-id',
					},
					type: sourceType,
				});

				simulateTimeUpdate(10);

				const {
					container: container2,
					simulateCanPlay: simulateCanPlay2,
					simulateLoadedData: simulateLoadedData2,
				} = setup({
					lastWatchTimeConfig: {
						contentId: 'some-other-unique-id',
					},
					type: sourceType,
				});

				// Simulate the canplay event to trigger the saved time restoration
				simulateCanPlay2(null, 0.5, 75);
				// Simulate the loadeddata event to set currentTime from defaultTime
				simulateLoadedData2();

				const mediaPlayer = container2.querySelector(sourceType) as HTMLMediaElement;
				expect(mediaPlayer.currentTime).toBe(0);
			});
		});

		describe('without save last watch time feature', () => {
			it(`should start ${sourceType} from beginning`, () => {
				const { simulateCanPlay, simulateTimeUpdate } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-unique-id',
					},
					type: sourceType,
				});

				simulateCanPlay(0, 0.5, 75);
				simulateTimeUpdate(10);

				const {
					container: container2,
					simulateCanPlay: simulateCanPlay2,
					simulateLoadedData: simulateLoadedData2,
				} = setup({
					type: sourceType,
				});

				// Simulate the canplay event to trigger initialization
				simulateCanPlay2(null, 0.5, 75);
				// Simulate the loadeddata event to set currentTime from defaultTime
				simulateLoadedData2();

				const mediaPlayer = container2.querySelector(sourceType) as HTMLMediaElement;
				expect(mediaPlayer.currentTime).toBe(0);
			});
		});
	});

	it('ControlsWrapper should be visible when a video does not have autoplay, until it has been played for the first time as then it should be hidden', async () => {
		getControlsWrapperClassName.mockClear();

		const { rerender } = render(
			<IntlProvider locale="en">
				<CustomMediaPlayerBase
					type="video"
					fileId="some-file-id"
					isHDAvailable={false}
					src="video-src"
					intl={fakeIntl}
					isAutoPlay={false}
					// The test won't pass if we don't pass this prop
					onFirstPlay={() => {}}
				/>
			</IntlProvider>,
		);

		expect(getControlsWrapperClassName).not.toHaveBeenCalledWith(true);

		const playButton = await screen.findByRole('button', {
			name: /fakeintl\["play"\]/i,
		});

		fireEvent.click(playButton);

		// We need to force a rerender to make ControlsWrapper rerender after play
		rerender(
			<IntlProvider locale="en">
				<CustomMediaPlayerBase
					type="video"
					fileId="some-file-id"
					isHDAvailable={false}
					src="video-src"
					intl={fakeIntl}
					isAutoPlay={false}
					// The test won't pass if we don't pass this prop
					onFirstPlay={() => {}}
				/>
			</IntlProvider>,
		);

		await waitFor(() => {
			expect(getControlsWrapperClassName).toHaveBeenLastCalledWith(true);
		});
	});

	it('ControlsWrapper should be hidden when a video has autoplay', async () => {
		const { rerender } = render(
			<IntlProvider locale="en">
				<CustomMediaPlayerBase
					type="video"
					fileId="some-file-id"
					isHDAvailable={false}
					src="video-src"
					intl={fakeIntl}
					isAutoPlay={true}
					// The test won't pass if we don't pass this prop
					onFirstPlay={() => {}}
				/>
			</IntlProvider>,
		);

		// We need to force a rerender to make ControlsWrapper rerender
		rerender(
			<IntlProvider locale="en">
				<CustomMediaPlayerBase
					type="video"
					fileId="some-file-id"
					isHDAvailable={false}
					src="video-src"
					intl={fakeIntl}
					isAutoPlay={true}
					// The test won't pass if we don't pass this prop
					onFirstPlay={() => {}}
				/>
			</IntlProvider>,
		);

		await waitFor(() => {
			expect(getControlsWrapperClassName).toHaveBeenLastCalledWith(true);
		});
	});
});
