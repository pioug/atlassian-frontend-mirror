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
import * as mediaClientReactModule from '@atlaskit/media-client-react';
import { asMock, asMockFunction } from '@atlaskit/media-common/test-helpers';
import { type WidthObserver } from '@atlaskit/width-detector';
import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import React from 'react';
import { MediaPlayer } from './mediaPlayer';
import { type MediaPlayerProps } from './types';
import { toggleFullscreen, getFullscreenElement } from '../fullscreen';
import simultaneousPlayManager from '../simultaneousPlayManager';
import * as getControlsWrapperClassNameModule from '../getControlsWrapperClassName';
import { act } from 'react-dom/test-utils';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import { keyCodes } from '../../shortcut';
import { generateSampleFileItem } from '@atlaskit/media-test-data';
import { createMockedMediaProvider } from './testHelpers/_MockedMediaProvider';
import * as analyticsNextModule from '@atlaskit/analytics-next';
// import { createServerUnauthorizedError } from '@atlaskit/media-client/test-helpers';

const useMediaSettingsSpy = jest.spyOn(mediaClientReactModule, 'useMediaSettings');

const createAnalyticsEventHandler = jest.fn().mockReturnValue({ fire: jest.fn() });
jest.spyOn(analyticsNextModule, 'useAnalyticsEvents').mockReturnValue({
	createAnalyticsEvent: createAnalyticsEventHandler,
});

const getUIAnalyticsEventDetails = (callIndex: number = 1) => {
	//event handler 1st call is screen event, 2nd is ui event
	const payload = createAnalyticsEventHandler.mock.calls[callIndex]?.[0];
	const { attributes } = payload || {};
	return {
		payload,
		attributes,
	};
};

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
jest.mock('@atlaskit/width-detector', () => {
	return {
		WidthObserver: ((props: { setWidth: (width: number) => void }) => {
			widthCbs.add(props.setWidth);
			return null;
		}) as mockWidthObserver,
	};
});

type SetupOptions = {
	initialWidth?: number;
	hasCaptions?: boolean;
	canUpdateVideoCaptions?: boolean;
};

const getDownloadButton = () => screen.findByTestId('custom-media-player-download-button');
const queryDownloadButton = () => screen.queryByTestId('custom-media-player-download-button');
const getFullscreenButton = () => screen.findByTestId('custom-media-player-fullscreen-button');
const getPlayPauseButton = () => screen.findByTestId('custom-media-player-play-toggle-button');
const getMuteButton = () => screen.findByTestId('custom-media-player-volume-toggle-button');
const getSkipBackwardButton = () => screen.findByTestId('custom-media-player-skip-backward-button');
const querySkipBackwardButton = () =>
	screen.queryByTestId('custom-media-player-skip-backward-button');
const getSkipForwardButton = () => screen.findByTestId('custom-media-player-skip-forward-button');
const querySkipForwardButton = () =>
	screen.queryByTestId('custom-media-player-skip-forward-button');
const getCaptionsSelectControls = () => screen.findByRole('button', { name: 'Closed Captions' });
const queryCaptionsSelectControls = () => screen.queryByRole('button', { name: 'Closed Captions' });
const getCaptionsAdminControls = () => screen.findByRole('button', { name: 'Manage Captions' });
const queryCaptionsAdminControls = () => screen.queryByRole('button', { name: 'Manage Captions' });
const getCurrentTimeElement = () => screen.findByTestId('current-time');
const queryCurrentTimeElement = () => screen.queryByTestId('current-time');
const getVolumeTimeRangeWrapper = () => screen.findByTestId('volume-time-range-wrapper');
const queryVolumeTimeRangeWrapper = () => screen.queryByTestId('volume-time-range-wrapper');
const getPlaybackSpeedButton = () =>
	screen.findByTestId('custom-media-player-playback-speed-toggle-button');
const queryPlaybackSpeedButton = () =>
	screen.queryByTestId('custom-media-player-playback-speed-toggle-button');
const getBlanket = () => screen.getByTestId('play-pause-blanket');
const getVideoElement = () => screen.getByTestId('media-video-element') as HTMLVideoElement;

const setWidth = (width: number) => widthCbs.forEach((cb) => cb(width));

const triggerKeydown = (code: string) => {
	const event = new KeyboardEvent('keydown', { code });
	act(() => {
		document.dispatchEvent(event);
	});
};

const triggerFullscreen = () => {
	fireEvent(screen.getByTestId('custom-media-player'), new Event('fullscreenchange'));
};

const getSliderTime = () => getVideoElement().currentTime;
const getVolumeLevel = () => getVideoElement().volume;

const triggerPlay = async () => {
	const playButton = await screen.findByRole('button', { name: 'Play' });
	fireEvent.click(playButton);
	fireEvent.play(getVideoElement());
};

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('<MediaPlayer />', () => {
	const setup = (
		props?: Partial<MediaPlayerProps>,
		{ initialWidth = 1000, hasCaptions = false, canUpdateVideoCaptions = false }: SetupOptions = {},
	) => {
		useMediaSettingsSpy.mockReturnValue({
			canUpdateVideoCaptions,
		});

		const [item, identifier] = hasCaptions
			? generateSampleFileItem.videoCaptions()
			: generateSampleFileItem.workingVideo();
		const { MockedMediaProvider, uploadItem, processItem } = createMockedMediaProvider({
			initialItems: item,
		});

		const { container, unmount, rerender } = render(
			<MockedMediaProvider>
				<IntlProvider locale="en">
					<MediaPlayer
						identifier={identifier}
						type="video"
						isAutoPlay={true}
						isHDAvailable={false}
						src="video-src"
						{...props}
					/>
				</IntlProvider>
				,
			</MockedMediaProvider>,
		);

		const getMediaElement = () => {
			const sourceType = props?.type || 'video';
			return container.querySelector(sourceType) as HTMLMediaElement;
		};

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

		// Initial width
		setWidth(initialWidth);

		return {
			container,
			unmount,
			rerender,
			createAnalyticsEventHandler,
			getMediaElement,
			simulateTimeUpdate,
			simulateVolumeChange,
			simulateCanPlay,
			simulateWaiting,
			simulateLoadedData,
			identifier,
			uploadItem,
			processItem,
			item,
		};
	};

	beforeAll(() => {
		jest.useFakeTimers();
	});

	beforeEach(() => {
		createAnalyticsEventHandler.mockClear();
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
		it('should render the video element with base elements', async () => {
			setup();
			expect(getVideoElement()).toBeInTheDocument();
			expect(await getVolumeTimeRangeWrapper()).toBeInTheDocument();
			expect(getBlanket()).toBeInTheDocument();
		});

		it('should render pause button when play has been pressed', async () => {
			setup({ isAutoPlay: false });
			await triggerPlay();

			const pauseButton = await screen.findByRole('button', { name: 'Pause' });
			expect(pauseButton).toBeInTheDocument();
		});

		it('should render the volume controls', () => {
			setup();
			expect(getVolumeLevel()).toEqual(1);
		});

		it('should pass poster URL to MediaPlayer when available', () => {
			const poster = 'some-data-uri';
			setup({ poster });
			expect(getVideoElement().poster).toContain(poster);
		});

		it('should render spinner when the video is in loading state', () => {
			const { simulateWaiting } = setup();

			simulateWaiting();
			expect(screen.getByTestId('spinner')).toBeInTheDocument();
		});

		describe('when onDownloadClick is passed', () => {
			const onDownloadClick = jest.fn();

			it('should render download button if onDownloadClick is passed', async () => {
				setup({ onDownloadClick });
				expect(await getDownloadButton()).toBeInTheDocument();
			});

			it('should call onDownloadClick when download button is pressed', async () => {
				setup({ onDownloadClick });
				const downloadButton = await getDownloadButton();
				if (!downloadButton) {
					throw new Error('downloadButton does not exist');
				}
				fireEvent.click(downloadButton);
				expect(onDownloadClick).toBeCalledTimes(1);
			});
		});

		describe('Responsive Controls', () => {
			const baseProps = { onDownloadClick: jest.fn(), isHDAvailable: true };
			const baseOptions = { hasCaptions: true, canUpdateVideoCaptions: true };

			const assertControlsSmallShown = async () => {
				expect(await getPlayPauseButton()).toBeInTheDocument();
				expect(await getMuteButton()).toBeInTheDocument();
				expect(await getFullscreenButton()).toBeInTheDocument();
			};

			const assertControlsMediumShown = async () => {
				expect(await getCurrentTimeElement()).toBeInTheDocument();
			};
			const assertControlsMediumHidden = async () => {
				expect(queryCurrentTimeElement()).not.toBeInTheDocument();
			};

			const assertControlsLargeShown = async () => {
				expect(await getCaptionsSelectControls()).toBeInTheDocument();
				expect(await getDownloadButton()).toBeInTheDocument();
				expect(await getVolumeTimeRangeWrapper()).toBeInTheDocument();
			};

			const assertControlsLargeHidden = async () => {
				expect(queryDownloadButton()).not.toBeInTheDocument();
				expect(queryVolumeTimeRangeWrapper()).not.toBeInTheDocument();
			};

			const assertControlsXLargeShown = async () => {
				expect(await getSkipForwardButton()).toBeInTheDocument();
				expect(await getSkipBackwardButton()).toBeInTheDocument();
				expect(await getPlaybackSpeedButton()).toBeInTheDocument();
				expect(await getCaptionsAdminControls()).toBeInTheDocument();
			};

			const assertControlsXLargeHidden = async () => {
				expect(querySkipForwardButton()).not.toBeInTheDocument();
				expect(querySkipBackwardButton()).not.toBeInTheDocument();
				expect(queryPlaybackSpeedButton()).not.toBeInTheDocument();
				expect(queryCaptionsAdminControls()).not.toBeInTheDocument();
			};

			it('should render controls when width is in small range', async () => {
				setup({}, { ...baseOptions, initialWidth: 260 });
				await assertControlsSmallShown();
				await assertControlsMediumHidden();
				await assertControlsLargeHidden();
				await assertControlsXLargeHidden();
			});

			it.each([261, 430])(
				'should render controls when width is in medium range (%s)',
				async (width) => {
					setup({}, { ...baseOptions, initialWidth: width });
					await assertControlsSmallShown();
					await assertControlsMediumShown();
					await assertControlsLargeHidden();
					await assertControlsXLargeHidden();
				},
			);

			it.each([431, 570])(
				'should render controls when width is in large range (%s)',
				async (width) => {
					setup(baseProps, { ...baseOptions, initialWidth: width });
					await assertControlsSmallShown();
					await assertControlsMediumShown();
					await assertControlsLargeShown();
					await assertControlsXLargeHidden();
				},
			);

			it('should render controls when width is in x-large range', async () => {
				setup(baseProps, { ...baseOptions, initialWidth: 571 });
				await assertControlsSmallShown();
				await assertControlsMediumShown();
				await assertControlsLargeShown();
				await assertControlsXLargeShown();
			});

			it('should render controls when width is in x-large range (default test width)', async () => {
				setup(baseProps, { ...baseOptions });
				await assertControlsSmallShown();
				await assertControlsMediumShown();
				await assertControlsLargeShown();
				await assertControlsXLargeShown();
			});

			it('should render controls when resizing', async () => {
				setup(baseProps, { ...baseOptions, initialWidth: 260 });
				// SMALL
				await assertControlsSmallShown();
				await assertControlsMediumHidden();
				await assertControlsLargeHidden();
				await assertControlsXLargeHidden();

				// MEDIUM
				setWidth(430);
				await assertControlsSmallShown();
				await assertControlsMediumShown();
				await assertControlsLargeHidden();
				await assertControlsXLargeHidden();

				// LARGE
				setWidth(570);
				await assertControlsSmallShown();
				await assertControlsMediumShown();
				await assertControlsLargeShown();
				await assertControlsXLargeHidden();

				// XLARGE
				setWidth(571);
				await assertControlsSmallShown();
				await assertControlsMediumShown();
				await assertControlsLargeShown();
				await assertControlsXLargeShown();
			});

			it('should render the time (current/total) in the right format', async () => {
				setup();
				const currentTimeElement = await getCurrentTimeElement();
				expect(currentTimeElement.textContent).toContain('0:00 / 0:00');
			});

			it('should not render caption controls when text tracks are not available', async () => {
				setup({}, { hasCaptions: false });
				expect(queryCaptionsSelectControls()).not.toBeInTheDocument();
			});

			it('should not render caption admin controls when canUpdateVideoCaptions is false', async () => {
				setup({}, { canUpdateVideoCaptions: false });
				expect(queryCaptionsAdminControls()).not.toBeInTheDocument();
			});

			it('should not render caption admin controls while the file is uploading', async () => {
				const { uploadItem, processItem, item } = setup({}, { canUpdateVideoCaptions: true });

				uploadItem(item, 0.5);
				expect(queryCaptionsAdminControls()).not.toBeInTheDocument();

				processItem(item, 1);
				expect(await getCaptionsAdminControls()).toBeInTheDocument();
			});
		});

	});

	describe('interaction', () => {
		beforeEach(() => {
			asMock(simultaneousPlayManager.pauseOthers).mockClear();
		});

		afterAll(() => {
			asMock(simultaneousPlayManager.pauseOthers).mockRestore();
		});

		it('should start play when play button is pressed', async () => {
			setup({
				isAutoPlay: false,
			});
			fireEvent.click(await getPlayPauseButton());
			expect(getVideoElement().play).toHaveBeenCalledTimes(1);
		});

		it('should pause video when pause button is pressed', async () => {
			setup({
				isAutoPlay: false,
			});
			await triggerPlay();

			fireEvent.click(await getPlayPauseButton());
			expect(getVideoElement().pause).toHaveBeenCalledTimes(1);
		});

		it('should not show controls if shortcuts are disabled', () => {
			const showControls = jest.fn();
			setup({
				showControls,
				isShortcutEnabled: false,
			});

			triggerKeydown(keyCodes.space);

			expect(showControls).toHaveBeenCalledTimes(0);
		});

		it('should show controls when any of the shortcut activated', () => {
			const showControls = jest.fn();
			setup({
				showControls,
				isShortcutEnabled: true,
			});

			triggerKeydown(keyCodes.space);
			triggerKeydown(keyCodes.m);

			expect(showControls).toHaveBeenCalledTimes(2);
		});

		it('should request full screen when fullscreen button is clicked', async () => {
			setup();

			fireEvent.click(await getFullscreenButton());
			expect(toggleFullscreen).toHaveBeenCalledTimes(1);
		});

		it('should play/pause when playPauseBlanket is clicked', async () => {
			setup({ isAutoPlay: true });

			expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(1);

			fireEvent.click(getBlanket());

			jest.runOnlyPendingTimers();
			expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(2);
		});

		it('should update TimeRange when time changes', () => {
			const { simulateTimeUpdate } = setup();

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
			const { simulateVolumeChange } = setup();

			simulateVolumeChange(0.3);
			expect(getVolumeLevel()).toEqual(0.3);
		});

		it('should update playback speed when speed is changed', async () => {
			setup();
			const btn = await getPlaybackSpeedButton();

			fireEvent.click(btn!);
			const twoTimesButton = await screen.findByText('2x');

			fireEvent.click(twoTimesButton);

			expect(await screen.findByText(/2x/i)).toBeInTheDocument();
		});

		it('should update time position when skip forward is pressed', async () => {
			const { simulateCanPlay, simulateTimeUpdate } = setup();

			simulateCanPlay(0, 0.5, 25);
			simulateTimeUpdate(0);

			expect(getSliderTime()).toEqual(0);

			const skipForwardButton = await getSkipForwardButton();
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

		it('should update time position when skip backward is pressed', async () => {
			const { simulateTimeUpdate } = setup();

			simulateTimeUpdate(15);
			expect(getSliderTime()).toEqual(15);

			const skipBackwardButton = await getSkipBackwardButton();
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

		it('should mute when speaker is clicked', async () => {
			setup();
			fireEvent.click(await getMuteButton());
			expect(getVideoElement().volume).toEqual(0);
		});

		it('should unmute when speaker is clicked after being muted', async () => {
			setup();
			fireEvent.click(await getMuteButton());
			fireEvent.click(await getMuteButton());
			expect(getVideoElement().volume).toEqual(1);
		});

		it('should have aria-pressed true when volume is muted', async () => {
			setup();
			fireEvent.click(await getMuteButton());

			const muteButton = await getMuteButton();
			expect(muteButton).toHaveAttribute('aria-pressed', 'true');
		});

		it('should have aria-pressed false when volume is not muted', async () => {
			setup();

			const muteButton = await getMuteButton();
			expect(muteButton).toHaveAttribute('aria-pressed', 'false');
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
				setup({
					isShortcutEnabled: true,
				});

				triggerKeydown(keyCodes.space);

				expect(getVideoElement().play).toHaveBeenCalledTimes(1);
			});

			it('should stop play when space bar is pressed second time', async () => {
				setup({
					isShortcutEnabled: true,
				});

				triggerKeydown(keyCodes.space);
				fireEvent.play(getVideoElement());
				triggerKeydown(keyCodes.space);

				expect(getVideoElement().pause).toHaveBeenCalledTimes(1);
			});

			it('should mute and unmute when "m" keypress continuously', async () => {
				const { container } = setup({
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
				const { container } = setup({
					isShortcutEnabled: false,
				});

				const video = container.querySelector('video') as HTMLVideoElement;

				triggerFullscreen();
				expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();

				act(() => {
					triggerKeydown(keyCodes.space);
				});
				expect(video.play).toHaveBeenCalledTimes(1);
			});

			it('should stop play when space bar is pressed second time', async () => {
				const { container } = setup({
					isShortcutEnabled: false,
				});

				const video = container.querySelector('video') as HTMLVideoElement;

				triggerFullscreen();
				expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();

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
				const { container } = setup({
					isShortcutEnabled: false,
				});

				triggerFullscreen();
				expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();

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
				const { container } = setup({
					isShortcutEnabled: false,
				});

				triggerFullscreen();
				expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();

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
				const { container } = setup({
					isShortcutEnabled: false,
				});

				triggerFullscreen();
				expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();

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
			setup({
				isHDAvailable: true,
				isAutoPlay: true,
			});
			expect(getVideoElement().autoplay).toBe(true);
		});

		it('should not use autoplay when not requested', () => {
			setup({
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

		it('should pause other players when click play button', async () => {
			setup({ isAutoPlay: false });

			fireEvent.click(await getPlayPauseButton());
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

			const playButton = await screen.findByRole('button', { name: 'Play' });
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

			const playButton = await screen.findByRole('button', { name: 'Play' });
			fireEvent.click(playButton);
			expect(onFirstPlay).toHaveBeenCalledTimes(1);

			fireEvent.click(playButton);
			expect(onFirstPlay).toHaveBeenCalledTimes(1);
		});
	});

	describe('analytics', () => {
		const assertPayload = async (
			actualPayload: any,
			payload: {
				action: 'clicked' | 'pressed' | 'changed' | 'navigated' | 'firstPlayed';
				actionSubject: string;
				actionSubjectId?: string;
			},
			attributes: any,
		) => {
			await waitFor(() => {
				expect(actualPayload).toEqual(
					expect.objectContaining({
						eventType: expect.stringMatching(/(ui|track)/i),
						...payload,
						attributes: expect.objectContaining({
							...attributes,
						}),
					}),
				);
			});
		};

		beforeEach(() => {
			const original = jest.requireActual('../fullscreen');
			asMock(toggleFullscreen).mockImplementation(original.toggleFullscreen);
			asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
		});

		it('should fire clicked event when play button is clicked', async () => {
			const { identifier } = setup({
				isAutoPlay: false,
			});

			await triggerPlay();

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'playButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
					playbackAttributes: expect.objectContaining({
						status: 'paused',
					}),
				},
			);
		});

		it('should fire clicked event when pause button is clicked', async () => {
			const { identifier } = setup({
				isAutoPlay: false,
			});

			await triggerPlay();

			// Pause
			fireEvent.click(await getPlayPauseButton());

			const { payload } = getUIAnalyticsEventDetails(2);

			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'pauseButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
					playbackAttributes: expect.objectContaining({
						status: 'playing',
					}),
				},
			);
		});

		it('should fire pressed event when space key is pressed', async () => {
			const { identifier } = setup({
				isShortcutEnabled: true,
			});
			triggerKeydown(keyCodes.space);

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'pressed',
					actionSubject: 'shortcut',
					actionSubjectId: 'space',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire pressed event when mute key is pressed', async () => {
			const { identifier } = setup({
				isShortcutEnabled: true,
			});

			triggerKeydown(keyCodes.m);

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'pressed',
					actionSubject: 'shortcut',
					actionSubjectId: 'mute',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire clicked event when mute button is clicked', async () => {
			const { identifier } = setup();

			fireEvent.click(await getMuteButton());

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'muteButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire clicked event when playbackSpeed button is clicked', async () => {
			const { identifier } = setup();
			const playbackSpeedButton = await getPlaybackSpeedButton();

			await act(async () => {
				fireEvent.click(playbackSpeedButton);
			});

			expect(getUIAnalyticsEventDetails().payload).toBeDefined();

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'playbackSpeedButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire changed event when play Speed is changed', async () => {
			const { container, identifier } = setup();

			// Trigger a playback speed change by finding and clicking the speed button
			await waitFor(() => {
				expect(
					container.querySelector(
						'[data-testid="custom-media-player-playback-speed-toggle-button"]',
					),
				).toBeInTheDocument();
			});

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
			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'playbackSpeedButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire clicked event when fullScreen button is clicked', async () => {
			const { identifier } = setup();

			fireEvent.click(await getFullscreenButton());

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'fullScreenButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire clicked event when download button is clicked', async () => {
			const onDownloadClick = jest.fn();
			const { identifier } = setup({
				onDownloadClick,
			});

			const downloadButton = await getDownloadButton();
			if (!downloadButton) {
				throw new Error('Download button missing');
			}

			fireEvent.click(downloadButton);

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'downloadButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire clicked event when PlayPauseBlanket is clicked', async () => {
			const { identifier } = setup({
				isAutoPlay: true,
			});

			const playPauseBlanket = await screen.findByTestId('play-pause-blanket');

			fireEvent.click(playPauseBlanket);

			jest.runOnlyPendingTimers();

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'playPauseBlanket',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire navigated event when TimeRange for time is changed', async () => {
			const { container, simulateCanPlay, identifier } = setup();

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
			await assertPayload(
				payload,
				{
					action: 'navigated',
					actionSubject: 'timeRange',
					actionSubjectId: 'time',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire navigated event when TimeRange for volume is changed', async () => {
			const { container, identifier } = setup();

			// Find the volume range input element - this is an actual input[type="range"]
			await waitFor(() => {
				expect(
					container.querySelector('[data-testid="volume-range"] [type="range"]'),
				).toBeInTheDocument();
			});
			const volumeRangeInput = container.querySelector(
				'[data-testid="volume-range"] [type="range"]',
			);

			if (!volumeRangeInput) {
				throw new Error('volumeRangeInput missing');
			}

			// For a real range input, we can use fireEvent.change with a target value
			fireEvent.change(volumeRangeInput, { target: { value: '0.5' } });

			const { payload } = getUIAnalyticsEventDetails();
			await assertPayload(
				payload,
				{
					action: 'navigated',
					actionSubject: 'timeRange',
					actionSubjectId: 'volume',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire click event when skip back is pressed', async () => {
			const { identifier } = setup();

			const skipBackwardButton = await getSkipBackwardButton();
			if (!skipBackwardButton) {
				throw new Error('skipBackwardButton missing');
			}
			fireEvent.click(skipBackwardButton);

			const { payload } = getUIAnalyticsEventDetails();
			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'skipBackwardButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire click event when skip forward is pressed', async () => {
			const { identifier } = setup();

			const skipForwardButton = await getSkipForwardButton();
			if (!skipForwardButton) {
				throw new Error('skipForwardButton missing');
			}
			fireEvent.click(skipForwardButton);

			const { payload } = getUIAnalyticsEventDetails();
			await assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'skipForwardButton',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire press event when skip backward is activated by pressing left key', async () => {
			const { identifier } = setup();

			triggerFullscreen();
			expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();

			triggerKeydown(keyCodes.leftArrow);

			const { payload } = getUIAnalyticsEventDetails();
			await assertPayload(
				payload,
				{
					action: 'pressed',
					actionSubject: 'shortcut',
					actionSubjectId: 'leftArrow',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire press event when skip forward is activated by pressing right key', async () => {
			const { identifier } = setup();

			triggerFullscreen();
			expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();

			triggerKeydown(keyCodes.rightArrow);

			const { payload } = getUIAnalyticsEventDetails();
			await assertPayload(
				payload,
				{
					action: 'pressed',
					actionSubject: 'shortcut',
					actionSubjectId: 'rightArrow',
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire firstPlayed event when inline player is loaded with auto play', async () => {
			const { identifier } = setup({
				isAutoPlay: true,
				onFirstPlay: () => {},
			});

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'firstPlayed',
					actionSubject: 'customMediaPlayer',
					actionSubjectId: identifier.id,
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
					},
				},
			);
		});

		it('should fire firstPlayed event when play button in inline player is clicked for the first time', async () => {
			const { identifier } = setup({
				onFirstPlay: () => {},
			});

			await triggerPlay();

			const { payload } = getUIAnalyticsEventDetails();

			await assertPayload(
				payload,
				{
					action: 'firstPlayed',
					actionSubject: 'customMediaPlayer',
					actionSubjectId: identifier.id,
				},
				{
					type: 'video',
					fileAttributes: {
						fileId: identifier.id,
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
			setup({
				onFullscreenChange,
			});

			asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
			triggerFullscreen();

			expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();
			expect(onFullscreenChange).toHaveBeenCalledWith(true);

			asMockFunction(getFullscreenElement).mockReturnValue(undefined);
			triggerFullscreen();

			expect(await screen.findByLabelText('enable fullscreen')).toBeInTheDocument();
			expect(onFullscreenChange).toHaveBeenCalledWith(false);
		});

		it('should fire callback when in full screen and component unmounted', async () => {
			const onFullscreenChange = jest.fn();
			const { unmount } = setup({
				onFullscreenChange,
			});

			asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
			triggerFullscreen();

			expect(await screen.findByLabelText('disable fullscreen')).toBeInTheDocument();

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

	const sourceTypes: MediaPlayerProps['type'][] = ['video', 'audio'];

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
		const [initialItems, identifier] = generateSampleFileItem.videoCaptions();
		const { MockedMediaProvider } = createMockedMediaProvider({ initialItems });
		getControlsWrapperClassName.mockClear();

		const { rerender } = render(
			<MockedMediaProvider>
				<IntlProvider locale="en">
					<MediaPlayer
						type="video"
						identifier={identifier}
						isHDAvailable={false}
						src="video-src"
						isAutoPlay={false}
						// The test won't pass if we don't pass this prop
						onFirstPlay={() => {}}
					/>
				</IntlProvider>
			</MockedMediaProvider>,
		);

		expect(getControlsWrapperClassName).not.toHaveBeenCalledWith(true);

		const playButton = await screen.findByRole('button', { name: 'Play' });

		fireEvent.click(playButton);

		// We need to force a rerender to make ControlsWrapper rerender after play
		rerender(
			<MockedMediaProvider>
				<IntlProvider locale="en">
					<MediaPlayer
						type="video"
						identifier={identifier}
						isHDAvailable={false}
						src="video-src"
						isAutoPlay={false}
						// The test won't pass if we don't pass this prop
						onFirstPlay={() => {}}
					/>
				</IntlProvider>
			</MockedMediaProvider>,
		);

		await waitFor(() => {
			expect(getControlsWrapperClassName).toHaveBeenLastCalledWith(true);
		});
	});

	it('ControlsWrapper should be hidden when a video has autoplay', async () => {
		const [initialItems, identifier] = generateSampleFileItem.videoCaptions();
		const { MockedMediaProvider } = createMockedMediaProvider({ initialItems });
		getControlsWrapperClassName.mockClear();

		const { rerender } = render(
			<MockedMediaProvider>
				<IntlProvider locale="en">
					<MediaPlayer
						type="video"
						identifier={identifier}
						isHDAvailable={false}
						src="video-src"
						isAutoPlay={true}
						// The test won't pass if we don't pass this prop
						onFirstPlay={() => {}}
					/>
				</IntlProvider>
			</MockedMediaProvider>,
		);

		// We need to force a rerender to make ControlsWrapper rerender
		rerender(
			<MockedMediaProvider>
				<IntlProvider locale="en">
					<MediaPlayer
						type="video"
						identifier={identifier}
						isHDAvailable={false}
						src="video-src"
						isAutoPlay={true}
						// The test won't pass if we don't pass this prop
						onFirstPlay={() => {}}
					/>
				</IntlProvider>
			</MockedMediaProvider>,
		);

		await waitFor(() => {
			expect(getControlsWrapperClassName).toHaveBeenLastCalledWith(true);
		});
	});
});
