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

import DownloadIcon from '@atlaskit/icon/core/migration/download';
import FullScreenIcon from '@atlaskit/icon/core/migration/fullscreen-enter--vid-full-screen-on';
import VidHdCircleIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import VidPlayIcon from '@atlaskit/icon/core/migration/video-play--vid-play';
import VidPauseIcon from '@atlaskit/icon/core/migration/video-pause--vid-pause';
import { asMock, asMockFunction } from '@atlaskit/media-common/test-helpers';
import { fakeIntl, mountWithIntlContext } from '../../test-helpers';
import Spinner from '@atlaskit/spinner';
import { WidthObserver } from '@atlaskit/width-detector';
import Tooltip from '@atlaskit/tooltip';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import MediaPlayer from '../react-video-renderer';
import React from 'react';
import { keyCodes, Shortcut } from '../..';
import {
	CustomMediaPlayerBase,
	type CustomMediaPlayerProps,
	type CustomMediaPlayerState,
} from '..';
import { type CustomMediaPlayerBase as EmotionCustomMediaPlayerBase } from '../index-emotion';
import { toggleFullscreen, getFullscreenElement } from '../fullscreen';
import simultaneousPlayManager from '../simultaneousPlayManager';
import { CurrentTime, VolumeTimeRangeWrapper } from '../styled';
import { TimeRange, type TimeRangeProps } from '../timeRange';
import VolumeRange from '../volumeRange';
import { PlaybackSpeedControls } from '../playbackSpeedControls';
import { type ReactWrapper } from 'enzyme';
import * as getControlsWrapperClassNameModule from '../getControlsWrapperClassName';
import MediaButton from '../../MediaButton';
import { act } from 'react-dom/test-utils';
import { waitFor, render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import VideoSkipForwardTenIcon from '@atlaskit/icon/core/video-skip-forward-ten';
import VideoSkipBackwardTenIcon from '@atlaskit/icon/core/video-skip-backward-ten';

const getControlsWrapperClassName = jest.spyOn(
	getControlsWrapperClassNameModule,
	'getControlsWrapperClassName',
);

// Removes errors from JSDOM virtual console on CustomMediaPlayer tests
// Trick taken from https://github.com/jsdom/jsdom/issues/2155
const HTMLMediaElement_play = HTMLMediaElement.prototype.play;
const HTMLMediaElement_pause = HTMLMediaElement.prototype.pause;

type mockWidthObserver = typeof WidthObserver;

jest.mock('@atlaskit/width-detector', () => {
	return {
		WidthObserver: ((props) => {
			return null;
		}) as mockWidthObserver,
	};
});

describe('<CustomMediaPlayer />', () => {
	let componentToBeUnmounted: ReactWrapper<any>;

	const setup = (props?: Partial<CustomMediaPlayerProps>) => {
		const onChange = jest.fn();
		const createAnalyticsEventHandler = jest.fn();
		createAnalyticsEventHandler.mockReturnValue({ fire: jest.fn() });

		const component = mountWithIntlContext<
			CustomMediaPlayerProps,
			CustomMediaPlayerState,
			EmotionCustomMediaPlayerBase
		>(
			<CustomMediaPlayerBase
				createAnalyticsEvent={createAnalyticsEventHandler}
				type="video"
				fileId="some-file-id"
				isAutoPlay={true}
				isHDAvailable={false}
				src="video-src"
				intl={fakeIntl}
				{...props}
			/>,
		);
		componentToBeUnmounted = component;

		const triggerFullscreen = () => {
			const videoWrapperRef = component.instance().videoWrapperRef;
			if (!videoWrapperRef) {
				return expect(videoWrapperRef).toBeDefined();
			}
			asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
			const event = new Event('fullscreenchange');
			videoWrapperRef.current?.dispatchEvent(event);
			component.update();
		};

		const triggerExitFullscreen = () => {
			const videoWrapperRef = component.instance().videoWrapperRef;
			if (!videoWrapperRef) {
				return expect(videoWrapperRef).toBeDefined();
			}
			asMockFunction(getFullscreenElement).mockReturnValue(undefined);
			const event = new Event('fullscreenchange');
			videoWrapperRef.current?.dispatchEvent(event);
			component.update();
		};

		const triggerPlay = () => {
			getPlayPauseButton().simulate('click');
			getVideoElement().simulate('play');
		};

		const triggerKeydown = (code: string) => {
			const event = new KeyboardEvent('keydown', {
				code,
			});
			document.dispatchEvent(event);
			component.update();
		};

		const downloadButton = component.find(
			'button[type="button"][data-testid="custom-media-player-download-button"]',
		);

		const hdButton = component.find(
			'button[type="button"][data-testid="custom-media-player-hd-button"]',
		);

		const fullscreenButton = component.find(
			'button[type="button"][data-testid="custom-media-player-fullscreen-button"]',
		);

		const getPlayPauseButton = () =>
			component.find('button[type="button"][data-testid="custom-media-player-play-toggle-button"]');

		const muteButton = component.find(
			'button[type="button"][data-testid="custom-media-player-volume-toggle-button"]',
		);

		const skipBackwardButton = component.find(
			'button[type="button"][data-testid="custom-media-player-skip-backward-button"]',
		);

		const skipForwardButton = component.find(
			'button[type="button"][data-testid="custom-media-player-skip-forward-button"]',
		);

		const blanket = component.find('[data-testid="play-pause-blanket"]').at(1);

		const getTimeRange = () => component.find(TimeRange);
		const getVolumeRange = () => component.find(VolumeRange);
		const getSliderTime = () => getTimeRange().prop('currentTime');
		const getVolumeLevel = () => getVolumeRange().prop('currentVolume');

		const getVideoElement = () => component.find('video');

		const setWidth = component.find(WidthObserver).at(0).props().setWidth;

		const getUIAnalyticsEventDetails = (callIndex: number = 1) => {
			//event handler 1st call is screen event, 2nd is ui event
			const payload = createAnalyticsEventHandler.mock.calls[callIndex][0];
			const { attributes } = payload || {};
			return {
				payload,
				attributes,
			};
		};

		return {
			component,
			onChange,
			createAnalyticsEventHandler,
			triggerFullscreen,
			triggerExitFullscreen,
			triggerPlay,
			downloadButton,
			hdButton,
			fullscreenButton,
			getPlayPauseButton,
			muteButton,
			setWidth,
			skipBackwardButton,
			skipForwardButton,
			getTimeRange,
			getSliderTime,
			getVolumeLevel,
			getVolumeRange,
			getVideoElement,
			triggerKeydown,
			blanket,
			getUIAnalyticsEventDetails,
		};
	};

	const setupRTL = (props?: Partial<CustomMediaPlayerProps>) => {
		const createAnalyticsEventHandler = jest.fn();
		createAnalyticsEventHandler.mockReturnValue({ fire: jest.fn() });

		const { container, unmount } = render(
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
			const event = new KeyboardEvent('keydown', {
				code,
			});
			document.dispatchEvent(event);
		};

		const getUIAnalyticsEventDetails = (callIndex: number = 1) => {
			//event handler 1st call is screen event, 2nd is ui event
			const payload = createAnalyticsEventHandler.mock.calls[callIndex][0];
			const { attributes } = payload || {};
			return {
				payload,
				attributes,
			};
		};

		const triggerFullscreen = () => {
			fireEvent(screen.getByTestId('custom-media-player'), new Event('fullscreenchange'));
		};

		return {
			container,
			triggerKeydown,
			triggerFullscreen,
			getUIAnalyticsEventDetails,
			unmount,
		};
	};

	beforeAll(() => {
		jest.useFakeTimers();
	});

	beforeEach(() => {
		asMock(toggleFullscreen).mockReset();
		asMock(getFullscreenElement).mockReset();
		HTMLMediaElement.prototype.play = jest.fn(() => Promise.resolve());
		HTMLMediaElement.prototype.pause = jest.fn(() => Promise.resolve());
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	afterEach(() => {
		HTMLMediaElement.prototype.play = HTMLMediaElement_play;
		HTMLMediaElement.prototype.pause = HTMLMediaElement_pause;
		if (componentToBeUnmounted && componentToBeUnmounted.length) {
			componentToBeUnmounted.unmount();
		}
	});

	describe('render', () => {
		it('should render the video element', () => {
			const { getVideoElement } = setup();

			expect(getVideoElement()).toHaveLength(1);
		});

		it('should render play button icon at first', async () => {
			const { getPlayPauseButton } = setup({ isAutoPlay: false });

			const iconBefore = getPlayPauseButton().find(VidPlayIcon);
			expect(iconBefore).toHaveLength(1);
			expect(iconBefore.getElement().props.label).toEqual('fakeIntl["Play"]');
		});

		it('should have tooltip around play button', () => {
			const { getPlayPauseButton } = setup({ isAutoPlay: false });
			const tooltip = getPlayPauseButton().parents(Tooltip);
			expect(tooltip).toHaveLength(1);
			expect(tooltip.prop('content')).toEqual('fakeIntl["Play"]');
		});

		it('should have tooltip around pause button', () => {
			const { getPlayPauseButton, triggerPlay } = setup({ isAutoPlay: false });
			triggerPlay();

			const tooltip = getPlayPauseButton().parents(Tooltip);
			expect(tooltip).toHaveLength(1);
			expect(tooltip.prop('content')).toEqual('fakeIntl["Pause"]');
		});

		it('should render pause button when play has been pressed', () => {
			const { getPlayPauseButton, triggerPlay } = setup({ isAutoPlay: false });
			triggerPlay();

			const iconBefore = getPlayPauseButton().find(VidPauseIcon);
			expect(iconBefore.getElement().props.label).toEqual('fakeIntl["Pause"]');
		});

		it('should render a time range with the time properties', () => {
			const { getTimeRange } = setup();

			expect(getTimeRange()).toHaveLength(1);
			const expectedProps: Partial<TimeRangeProps> = {
				currentTime: 0,
				duration: 0,
				bufferedTime: 0,
			};
			expect(getTimeRange().props()).toEqual(expect.objectContaining(expectedProps));
		});

		it('should render the volume controls', () => {
			const { getVolumeLevel } = setup();

			expect(getVolumeLevel()).toEqual(1);
		});

		it('should render the time (current/total) in the right format', () => {
			const { component } = setup();
			expect(component.find(CurrentTime).text()).toContain('0:00 / 0:00');
		});

		it('should render the fullscreen button', () => {
			const { fullscreenButton } = setup();

			expect(fullscreenButton.find(FullScreenIcon)).toHaveLength(1);
		});

		it('should render the playPauseBlanket', () => {
			const { blanket } = setup();

			expect(blanket).toHaveLength(1);
		});

		it('should render the skip backward button', () => {
			const { skipBackwardButton } = setup();

			expect(skipBackwardButton).toHaveLength(1);
			const beforeIcon = skipBackwardButton.find(VideoSkipBackwardTenIcon);
			expect(beforeIcon).toHaveLength(1);
			expect(beforeIcon.getElement().props.label).toEqual('fakeIntl["Back 10 seconds"]');
		});

		it('should render the skip forward button', () => {
			const { skipForwardButton } = setup();

			expect(skipForwardButton).toHaveLength(1);
			const beforeIcon = skipForwardButton.find(VideoSkipForwardTenIcon);
			expect(beforeIcon).toHaveLength(1);
			expect(beforeIcon.getElement().props.label).toEqual('fakeIntl["Forward 10 seconds"]');
		});

		it('should render tooltip around skip backward button', () => {
			const { skipBackwardButton } = setup();

			const tooltip = skipBackwardButton.parents(Tooltip);
			expect(tooltip).toHaveLength(1);
			expect(tooltip.prop('content')).toEqual('fakeIntl["Back 10 seconds"]');
		});

		it('should render tooltip around skip forward button', () => {
			const { skipForwardButton } = setup();

			const tooltip = skipForwardButton.parents(Tooltip);
			expect(tooltip).toHaveLength(1);
			expect(tooltip.prop('content')).toEqual('fakeIntl["Forward 10 seconds"]');
		});

		it('should pass poster URL to MediaPlayer when available', () => {
			const poster = 'some-data-uri';
			const { component } = setup({ poster });
			expect(component.find(MediaPlayer).props().poster).toEqual(poster);
		});

		describe('when hd is available', () => {
			it('should render hd button when available', () => {
				const { hdButton } = setup({
					isHDAvailable: true,
				});
				//TODO: https://product-fabric.atlassian.net/browse/DSP-20900
				// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
				expect(hdButton.find(VidHdCircleIcon)).toHaveLength(1);
			});
			it('should fire callback when hd button is clicked', () => {
				const onHDToggleClick = jest.fn();
				const { hdButton } = setup({
					isHDAvailable: true,
					onHDToggleClick,
				});

				hdButton.simulate('click');
				expect(onHDToggleClick).toHaveBeenCalledTimes(1);
			});

			ffTest(
				'platform_media_disable_video_640p_artifact_usage',
				() => {
					const { hdButton } = setup({
						isHDAvailable: true,
					});
					// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
					expect(hdButton.find(VidHdCircleIcon)).not.toBeDefined;
				},
				() => {
					const { hdButton } = setup({
						isHDAvailable: true,
					});
					// eslint-disable-next-line @atlaskit/design-system/no-legacy-icons
					expect(hdButton.find(VidHdCircleIcon)).toBeDefined;
				},
			);
		});

		describe('when hd is not available', () => {
			it('should not render hd button when not available', () => {
				const { hdButton } = setup({
					isHDAvailable: false,
				});

				expect(hdButton).toHaveLength(0);
			});
		});

		it('should render spinner when the video is in loading state', () => {
			const { component, getVideoElement } = setup();

			getVideoElement().simulate('waiting');
			expect(component.find(Spinner)).toHaveLength(1);
		});

		describe('when onDownloadClick is passed', () => {
			const onDownloadClick = jest.fn();

			it('should render download button if onDownloadClick is passed', () => {
				const { downloadButton } = setup({ onDownloadClick });
				expect(downloadButton.find(DownloadIcon)).toHaveLength(1);
			});

			it('should call onDownloadClick when download button is pressed', () => {
				const { downloadButton } = setup({ onDownloadClick });
				downloadButton.simulate('click');
				expect(onDownloadClick).toBeCalledTimes(1);
			});
		});

		it('should render playback speed controls with default values', () => {
			const { component } = setup();
			const { playbackSpeed } = component.find(PlaybackSpeedControls).props();

			expect(playbackSpeed).toEqual(1);
		});

		describe('when shortcut are enabled', () => {
			it('should render two shortcuts', () => {
				const { component } = setup({
					isShortcutEnabled: true,
				});
				expect(component.find(Shortcut)).toHaveLength(2);
			});

			it('should render play/pause shortcut', () => {
				const { component } = setup({
					isShortcutEnabled: true,
				});
				const shortcut = component.find(Shortcut).filter({ code: keyCodes.space });
				expect(shortcut).toHaveLength(1);
			});

			it('should render mute shortcut', () => {
				const { component } = setup({
					isShortcutEnabled: true,
				});
				const shortcut = component.find(Shortcut).filter({ code: keyCodes.m });
				expect(shortcut).toHaveLength(1);
			});
		});

		describe('when shortcut are disabled', () => {
			it('should not render any shortcut', () => {
				const { component } = setup({
					isShortcutEnabled: false,
				});
				expect(component.find(Shortcut)).toHaveLength(0);
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

		it('should start play when play button is pressed', () => {
			const { getPlayPauseButton, getVideoElement } = setup({
				isAutoPlay: false,
			});
			getPlayPauseButton().simulate('click');
			expect((getVideoElement().getDOMNode() as HTMLVideoElement).play).toHaveBeenCalledTimes(1);
		});

		it('should pause video when pause button is pressed', () => {
			const { getPlayPauseButton, getVideoElement, triggerPlay } = setup({
				isAutoPlay: false,
			});
			triggerPlay();

			getPlayPauseButton().simulate('click');
			expect((getVideoElement().getDOMNode() as HTMLVideoElement).pause).toHaveBeenCalledTimes(1);
		});

		it('should show controls when any of the shortcut activated', () => {
			const showControls = jest.fn();
			const { component } = setup({ showControls, isShortcutEnabled: true });

			const shortcuts = component.find(Shortcut);
			shortcuts.forEach((comp) => comp.prop('handler')());

			expect(showControls).toHaveBeenCalledTimes(shortcuts.length);
		});

		it('should fire callback when hd button is clicked', () => {
			const onHDToggleClick = jest.fn();
			const { hdButton } = setup({
				isHDAvailable: true,
				onHDToggleClick,
			});

			hdButton.simulate('click');
			expect(onHDToggleClick).toHaveBeenCalledTimes(1);
		});

		it('should request full screen when fullscreen button is clicked', () => {
			const { fullscreenButton } = setup();

			fullscreenButton.simulate('click');
			expect(toggleFullscreen).toHaveBeenCalledTimes(1);
		});

		it('should play/pause when playPauseBlanket is clicked', async () => {
			setupRTL({ isAutoPlay: true });

			expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(1);

			const playPauseBlanket = await screen.findByTestId('play-pause-blanket');

			fireEvent.click(playPauseBlanket);

			jest.runOnlyPendingTimers();
			expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(2);
		});

		it('should update TimeRange when time changes', () => {
			const { getVideoElement, getTimeRange } = setup();

			getVideoElement().simulate('timeUpdate', {
				target: {
					currentTime: 10,
					buffered: [],
				},
			});
			expect(getTimeRange().prop('currentTime')).toEqual(10);
		});

		it('should update buffered time when it changes', () => {
			const { getVideoElement, getTimeRange } = setup();

			getVideoElement().simulate('timeUpdate', {
				target: {
					currentTime: 10,
					buffered: {
						length: 1,
						end: () => 10,
					},
				},
			});
			expect(getTimeRange().prop('bufferedTime')).toEqual(10);
		});

		it("should update Volume's TimeRange when volume changes", () => {
			const { getVideoElement, getVolumeLevel } = setup();

			getVideoElement().simulate('volumeChange', {
				target: {
					volume: 0.3,
				},
			});
			expect(getVolumeLevel()).toEqual(0.3);
		});

		it('should update playback speed when speed is changed', async () => {
			setupRTL();

			const playbackSpeedButton = await screen.findByTestId(
				'custom-media-player-playback-speed-toggle-button',
			);

			fireEvent.click(playbackSpeedButton);

			const twoTimesButton = await screen.findByText('2x');

			fireEvent.click(twoTimesButton);

			expect(await screen.findByText(/2x/i)).toBeInTheDocument();
		});

		it('should update time position when skip forward is pressed', () => {
			const { getVideoElement, skipForwardButton, getSliderTime } = setup();
			getVideoElement().simulate('canPlay', {
				target: {
					currentTime: 0,
					volume: 0.5,
					duration: 25,
				},
			});

			getVideoElement().simulate('timeUpdate', {
				target: {
					currentTime: 0,
					buffered: [],
				},
			});

			expect(getSliderTime()).toEqual(0);
			skipForwardButton.simulate('click');
			expect(getSliderTime()).toEqual(10);
			skipForwardButton.simulate('click');
			expect(getSliderTime()).toEqual(20);
			skipForwardButton.simulate('click');
			expect(getSliderTime()).toEqual(25);
			skipForwardButton.simulate('click');
			expect(getSliderTime()).toEqual(25);
		});

		it('should update time position when skip backward is pressed', () => {
			const { getVideoElement, skipBackwardButton, getSliderTime } = setup();

			getVideoElement().simulate('timeUpdate', {
				target: {
					currentTime: 15,
					buffered: {
						length: 1,
						end: () => 15,
					},
				},
			});
			expect(getSliderTime()).toEqual(15);
			skipBackwardButton.simulate('click');
			expect(getSliderTime()).toEqual(5);
			skipBackwardButton.simulate('click');
			expect(getSliderTime()).toEqual(0);
			skipBackwardButton.simulate('click');
			expect(getSliderTime()).toEqual(0);
		});

		it('should mute when speaker is clicked', () => {
			const { muteButton, getVideoElement } = setup();
			muteButton.simulate('click');
			expect((getVideoElement().getDOMNode() as HTMLVideoElement).volume).toEqual(0);
		});

		it('should unmute when speaker is clicked after being muted', () => {
			const { muteButton, getVideoElement } = setup();
			muteButton.simulate('click');
			muteButton.simulate('click');
			expect((getVideoElement().getDOMNode() as HTMLVideoElement).volume).toEqual(1);
		});

		it('should enter fullscreen when blanket double clicked', async () => {
			const { container } = setupRTL();

			const video = container.querySelector('video') as HTMLVideoElement;

			// To simulation double click we need to call double click handler itself,
			// but also make two clicks with some delay in between.
			const playPauseBlanket = await screen.findByTestId('play-pause-blanket');
			fireEvent.click(playPauseBlanket);
			jest.advanceTimersByTime(50);

			// Making sure first of two clicks didn't trigger play while double clicking prcedure
			await waitFor(() => {
				expect(video.play).toHaveBeenCalledTimes(0);
			});
			fireEvent.click(playPauseBlanket);

			fireEvent.doubleClick(playPauseBlanket);

			expect(toggleFullscreen).toHaveBeenCalledTimes(1);

			jest.runOnlyPendingTimers();
			// Still no play toggle happened
			await waitFor(() => {
				expect(video.play).toHaveBeenCalledTimes(0);
			});
		});

		describe('when shortcut are enabled', () => {
			it('should start play when space bar is pressed', () => {
				const { getVideoElement, triggerKeydown } = setup({
					isShortcutEnabled: true,
				});

				triggerKeydown(keyCodes.space);

				expect((getVideoElement().getDOMNode() as HTMLVideoElement).play).toHaveBeenCalledTimes(1);
			});

			it('should stop play when space bar is pressed second time', () => {
				const { getVideoElement, triggerKeydown } = setup({
					isShortcutEnabled: true,
				});

				triggerKeydown(keyCodes.space);
				getVideoElement().simulate('play');
				triggerKeydown(keyCodes.space);

				expect((getVideoElement().getDOMNode() as HTMLVideoElement).pause).toHaveBeenCalledTimes(1);
			});

			it('should mute and unmute when "m" keypress continuously', async () => {
				const { container, triggerKeydown } = setupRTL({
					isShortcutEnabled: true,
				});

				act(() => {
					triggerKeydown(keyCodes.m);
				});
				await waitFor(() => {
					expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(0);
				});

				act(() => {
					triggerKeydown(keyCodes.m);
				});
				await waitFor(() => {
					expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(1);
				});
			});
		});

		describe('when fullscreen is enabled', () => {
			beforeEach(() => {
				const original = jest.requireActual('../fullscreen');
				asMock(toggleFullscreen).mockImplementation(original.toggleFullscreen);
				asMockFunction(getFullscreenElement).mockReturnValue({} as HTMLElement);
			});

			it('should start play when space bar is pressed', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setupRTL({
					isShortcutEnabled: false,
				});

				const video = container.querySelector('video') as HTMLVideoElement;

				triggerFullscreen();
				expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

				act(() => {
					triggerKeydown(keyCodes.space);
				});
				await waitFor(() => {
					expect(video.play).toHaveBeenCalledTimes(1);
				});
			});

			it('should stop play when space bar is pressed second time', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setupRTL({
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

				await waitFor(() => {
					expect(video.pause).toHaveBeenCalledTimes(1);
				});
			});

			it('should mute and unmute when "m" keypress continuously', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setupRTL({
					isShortcutEnabled: false,
				});

				triggerFullscreen();
				expect(await screen.findByLabelText('fakeIntl["disable fullscreen"]')).toBeInTheDocument();

				await waitFor(() => {
					expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(1);
				});

				// first 'm' key press
				act(() => {
					triggerKeydown(keyCodes.m);
				});
				await waitFor(() => {
					expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(0);
				});

				// second 'm' key press
				act(() => {
					triggerKeydown(keyCodes.m);
				});
				await waitFor(() => {
					expect((container.querySelector('video') as HTMLVideoElement).volume).toEqual(1);
				});
			});

			it('should skip back when left arrow pressed', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setupRTL({
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

				await waitFor(() => {
					expect(video.currentTime).toEqual(15);
				});

				act(() => {
					triggerKeydown(keyCodes.leftArrow);
				});

				await waitFor(() => {
					expect(video.currentTime).toEqual(5);
				});
			});

			it('should skip forward when right arrow pressed', async () => {
				const { container, triggerKeydown, triggerFullscreen } = setupRTL({
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
				await waitFor(() => {
					expect(video.duration).toEqual(25);
				});

				fireEvent.timeUpdate(video, {
					target: {
						currentTime: 0,
					},
				});

				await waitFor(() => {
					expect(video.currentTime).toEqual(0);
				});

				act(() => {
					triggerKeydown(keyCodes.rightArrow);
				});

				await waitFor(() => {
					expect(video.currentTime).toEqual(10);
				});
			});
		});
	});

	describe('auto play', () => {
		it('should use autoplay when requested', () => {
			const { component } = setup({
				isHDAvailable: true,
				isAutoPlay: true,
			});
			expect(component.find({ autoPlay: true })).toHaveLength(2);
		});

		it('should not use autoplay when not requested', () => {
			const { component } = setup({
				isHDAvailable: true,
				isAutoPlay: false,
			});
			expect(component.find({ autoPlay: true })).toHaveLength(0);
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
			const { component } = setup();
			component.unmount();
			expect(simultaneousPlayManager.unsubscribe).toBeCalledTimes(1);
		});

		it('should pause other players when click play button', () => {
			const { getPlayPauseButton } = setup({ isAutoPlay: false });

			getPlayPauseButton().simulate('click');
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
			setupRTL({
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
			setupRTL({
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
			const { component, setWidth } = setup();

			// small sized video <160px
			act(() => {
				setWidth(150);
			});
			component.update();

			expect(
				component.find(MediaButton).filter('[testId="custom-media-player-skip-forward-button"]'),
			).toHaveLength(0);

			expect(
				component.find(MediaButton).filter('[testId="custom-media-player-skip-backward-button"]'),
			).toHaveLength(0);

			// medium sized video >160px & < 400px

			act(() => {
				setWidth(250);
			});
			component.update();

			expect(
				component.find(MediaButton).filter('[testId="custom-media-player-skip-forward-button"]'),
			).toHaveLength(0);

			expect(
				component.find(MediaButton).filter('[testId="custom-media-player-skip-backward-button"]'),
			).toHaveLength(0);

			// large sized video

			act(() => {
				setWidth(420);
			});
			component.update();

			expect(
				component.find(MediaButton).filter('[testId="custom-media-player-skip-forward-button"]'),
			).toHaveLength(1);

			expect(
				component.find(MediaButton).filter('[testId="custom-media-player-skip-backward-button"]'),
			).toHaveLength(1);
		});

		it('when the playerSize is medium or large (above 160px width), show the timestamp and playback speed controls', async () => {
			const { component, setWidth } = setup();
			act(() => {
				setWidth(150);
			});
			component.update();

			expect(component.find(CurrentTime)).toHaveLength(0);
			expect(component.find(PlaybackSpeedControls)).toHaveLength(0);

			act(() => {
				setWidth(170);
			});
			component.update();

			expect(component.find(CurrentTime)).toHaveLength(1);
			expect(component.find(PlaybackSpeedControls)).toHaveLength(0);

			act(() => {
				setWidth(401);
			});
			component.update();

			expect(component.find(CurrentTime)).toHaveLength(1);
			expect(component.find(PlaybackSpeedControls)).toHaveLength(1);
		});

		it('Should show/hide volume controls when video is bigger/smaller than 400px (playerSize is large)', async () => {
			const { component, setWidth } = setup();

			act(() => {
				setWidth(399);
			});
			component.update();

			expect(component.find(VolumeTimeRangeWrapper)).toHaveLength(0);

			act(() => {
				setWidth(401);
			});
			component.update();

			expect(component.find(VolumeTimeRangeWrapper)).toHaveLength(1);
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

		it('should fire clicked event when pause button is clicked', () => {
			const { triggerPlay, getPlayPauseButton, getUIAnalyticsEventDetails } = setup({
				isAutoPlay: false,
			});

			triggerPlay();

			// Pause
			getPlayPauseButton().simulate('click');

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
			const { muteButton, getUIAnalyticsEventDetails } = setup();

			muteButton.simulate('click');

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

		it('should fire clicked event when playbackSpeed button is clicked', () => {
			const { component, getUIAnalyticsEventDetails } = setup();
			const playbackSpeedButton = component.find(
				'button[type="button"][data-testid="custom-media-player-playback-speed-toggle-button"]',
			);

			playbackSpeedButton.simulate('click');

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

		it('should fire changed event when play Speed is changed', () => {
			const { component, getUIAnalyticsEventDetails } = setup();
			component.find(PlaybackSpeedControls).prop('onPlaybackSpeedChange')(2);

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'changed',
					actionSubject: 'playbackSpeed',
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
			const { fullscreenButton, getUIAnalyticsEventDetails } = setup();

			fullscreenButton.simulate('click');

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
			const { downloadButton, getUIAnalyticsEventDetails } = setup({
				onDownloadClick,
			});

			downloadButton.simulate('click');

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

		it('should fire clicked event when HD button is clicked', () => {
			const onHDToggleClick = jest.fn();
			const { hdButton, getUIAnalyticsEventDetails } = setup({
				isHDAvailable: true,
				onHDToggleClick,
			});

			hdButton.simulate('click');

			const { payload } = getUIAnalyticsEventDetails();

			assertPayload(
				payload,
				{
					action: 'clicked',
					actionSubject: 'button',
					actionSubjectId: 'HDButton',
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
			const { getUIAnalyticsEventDetails } = setupRTL({
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
			const { getTimeRange, getUIAnalyticsEventDetails } = setup();

			const onChanged = getTimeRange().prop('onChanged');
			if (onChanged) {
				onChanged();
			}

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

		it('should fire navigated event when TimeRange for volume is changed', () => {
			const { getVolumeRange, getUIAnalyticsEventDetails } = setup();

			const onChanged = getVolumeRange().prop('onChanged');
			if (onChanged) {
				onChanged();
			}

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
			const { skipBackwardButton, getUIAnalyticsEventDetails } = setup();

			skipBackwardButton.simulate('click');

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
			const { skipForwardButton, getUIAnalyticsEventDetails } = setup();

			skipForwardButton.simulate('click');

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
			const { getUIAnalyticsEventDetails, triggerKeydown, triggerFullscreen } = setupRTL();

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
			const { getUIAnalyticsEventDetails, triggerKeydown, triggerFullscreen } = setupRTL();

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
			const { triggerFullscreen } = setupRTL({
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
			const { triggerFullscreen, unmount } = setupRTL({
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
			const { unmount } = setupRTL({
				onFullscreenChange,
			});
			unmount();
			expect(onFullscreenChange).toHaveBeenCalledTimes(0);
		});
	});

	const sourceTypes: CustomMediaPlayerProps['type'][] = ['video', 'audio'];

	sourceTypes.forEach((sourceType) => {
		describe('with save last watch time feature', () => {
			it(`should continue play from last watch time for the same ${sourceType} with more than 60 seconds left to play`, () => {
				const { component } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-unique-id',
					},
					type: sourceType,
				});

				component.find(sourceType).simulate('canPlay', {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 62,
					},
				});

				component.find(sourceType).simulate('timeUpdate', {
					target: {
						currentTime: 1,
						buffered: [],
					},
				});

				const { component: component2 } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-unique-id',
					},
					type: sourceType,
				});

				expect(component2.find(MediaPlayer).props().defaultTime).toEqual(1);
			});

			it(`should not set defaultTime for the same ${sourceType} with a total duration less than equal to 60 seconds`, () => {
				const { component } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-very-unique-id',
					},
					type: sourceType,
				});

				component.find(sourceType).simulate('canPlay', {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 60,
					},
				});

				component.find(sourceType).simulate('timeUpdate', {
					target: {
						currentTime: 1,
						buffered: [],
					},
				});

				const { component: component2 } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-very-unique-id',
					},
					type: sourceType,
				});

				expect(component2.find(MediaPlayer).props().defaultTime).toEqual(0);
			});

			it(`should reset defaultTime for the same ${sourceType} when we are within 60 seconds of the end`, () => {
				const setupProps = {
					lastWatchTimeConfig: {
						contentId: 'some-super-unique-id',
					},
					type: sourceType,
				};
				const { component } = setup(setupProps);
				component.find(sourceType).simulate('canPlay', {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 90,
					},
				});

				// We still have more than 60 seconds till the end. Should save 10 seconds
				component.find(sourceType).simulate('timeUpdate', {
					target: {
						currentTime: 10,
						buffered: [],
					},
				});
				const { component: component2 } = setup(setupProps);
				expect(component2.find(MediaPlayer).props().defaultTime).toEqual(10);

				// We are now within 60 seconds of the end. Should reset to 0
				component.find(sourceType).simulate('timeUpdate', {
					target: {
						currentTime: 30,
						buffered: [],
					},
				});
				const { component: component3 } = setup(setupProps);
				expect(component3.find(MediaPlayer).props().defaultTime).toEqual(0);
			});

			it(`should start from beginning for a different ${sourceType} regardless of play time`, () => {
				const { component } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-unique-id',
					},
					type: sourceType,
				});

				component.find(sourceType).simulate('timeUpdate', {
					target: {
						currentTime: 10,
						duration: 75,
						buffered: [],
					},
				});

				const { component: component2 } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-other-unique-id',
					},
					type: sourceType,
				});

				expect(component2.find(MediaPlayer).props().defaultTime).toEqual(0);
			});
		});

		describe('without save last watch time feature', () => {
			it(`should start ${sourceType} from beginning`, () => {
				const { component } = setup({
					lastWatchTimeConfig: {
						contentId: 'some-unique-id',
					},
					type: sourceType,
				});

				component.find(sourceType).simulate('canPlay', {
					target: {
						currentTime: 0,
						volume: 0.5,
						duration: 75,
					},
				});

				component.find(sourceType).simulate('timeUpdate', {
					target: {
						currentTime: 10,
						buffered: [],
					},
				});

				const { component: component2 } = setup({
					type: sourceType,
				});

				expect(component2.find(MediaPlayer).props().defaultTime).toEqual(0);
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
