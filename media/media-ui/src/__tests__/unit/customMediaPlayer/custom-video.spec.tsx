jest.mock('../../../customMediaPlayer/fullscreen', () => {
  const original = jest.requireActual('../../../customMediaPlayer/fullscreen');
  return {
    ...original,
    toggleFullscreen: jest.fn(),
    getFullscreenElement: jest.fn(),
  };
});

jest.mock('../../../customMediaPlayer/simultaneousPlayManager');
jest.mock('@atlaskit/width-detector');

import Button from '@atlaskit/button/custom-theme-button';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import FullScreenIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import VidHdCircleIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import {
  SkipTenBackwardIcon,
  SkipTenForwardIcon,
} from '../../../customMediaPlayer/icons';
import {
  asMock,
  asMockFunction,
  fakeIntl,
  mountWithIntlContext,
} from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';
import { WidthObserver } from '@atlaskit/width-detector';
import Tooltip from '@atlaskit/tooltip';
import MediaPlayer from 'react-video-renderer';
import React from 'react';
import { keyCodes, Shortcut } from '../../..';
import {
  CustomMediaPlayerBase,
  CustomMediaPlayerProps,
  CustomMediaPlayerState,
} from '../../../customMediaPlayer';
import {
  toggleFullscreen,
  getFullscreenElement,
} from '../../../customMediaPlayer/fullscreen';
import simultaneousPlayManager from '../../../customMediaPlayer/simultaneousPlayManager';
import {
  CurrentTime,
  VolumeTimeRangeWrapper,
} from '../../../customMediaPlayer/styled';
import {
  TimeRange,
  TimeRangeProps,
} from '../../../customMediaPlayer/timeRange';
import { PlaybackSpeedControls } from '../../../customMediaPlayer/playbackSpeedControls';
import { PlayPauseBlanket } from '../../../customMediaPlayer/playPauseBlanket';
import { ReactWrapper } from 'enzyme';

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
      CustomMediaPlayerBase
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
      videoWrapperRef.dispatchEvent(event);
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

    const downloadButton = component
      .find(Button)
      .filter({ testId: 'custom-media-player-download-button' });

    const hdButton = component
      .find(Button)
      .filter({ testId: 'custom-media-player-hd-button' });

    const fullscreenButton = component
      .find(Button)
      .filter({ testId: 'custom-media-player-fullscreen-button' });

    const getPlayPauseButton = () =>
      component
        .find(Button)
        .filter({ testId: 'custom-media-player-play-toggle-button' });

    const muteButton = component
      .find(Button)
      .filter({ testId: 'custom-media-player-volume-toggle-button' });

    const skipBackwardButton = component
      .find(Button)
      .filter({ testId: 'custom-media-player-skip-backward-button' });

    const skipForwardButton = component
      .find(Button)
      .filter({ testId: 'custom-media-player-skip-forward-button' });

    const blanket = component.find(PlayPauseBlanket);

    const getTimeRange = () => component.find(TimeRange).at(0);
    const getVolumeRange = () => component.find(TimeRange).at(1);
    const getSliderTime = () => getTimeRange().prop('currentTime');
    const getVolumeLevel = () => getVolumeRange().prop('currentTime');

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

      let iconBefore = getPlayPauseButton().prop('iconBefore');
      expect(iconBefore.type).toEqual(VidPlayIcon);
      expect(iconBefore.props.label).toEqual('fakeIntl["Play"]');
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

      let iconBefore = getPlayPauseButton().prop('iconBefore');
      expect(iconBefore.type).toEqual(VidPauseIcon);
      expect(iconBefore.props.label).toEqual('fakeIntl["Pause"]');
    });

    it('should render a time range with the time properties', () => {
      const { getTimeRange } = setup();

      expect(getTimeRange()).toHaveLength(1);
      const expectedProps: Partial<TimeRangeProps> = {
        currentTime: 0,
        duration: 0,
        bufferedTime: 0,
      };
      expect(getTimeRange().props()).toEqual(
        expect.objectContaining(expectedProps),
      );
    });

    it('should render the volume controls', () => {
      const { getVolumeLevel } = setup();

      expect(getVolumeLevel()).toEqual(1);
    });

    it('should render the time (current/total) in the right format', () => {
      const { component } = setup();

      expect(component.find(CurrentTime).text()).toEqual('0:00 / 0:00');
    });

    it('should render the fullscreen button', () => {
      const { fullscreenButton } = setup();

      expect(fullscreenButton.props().iconBefore.type).toEqual(FullScreenIcon);
    });

    it('should render the playPauseBlanket', () => {
      const { blanket } = setup();

      expect(blanket).toHaveLength(1);
    });

    it('should render the skip backward button', () => {
      const { skipBackwardButton } = setup();

      expect(skipBackwardButton).toHaveLength(1);
      const beforeIcon = skipBackwardButton.props().iconBefore;
      expect(beforeIcon.type).toEqual(SkipTenBackwardIcon);
      expect(beforeIcon.props.label).toEqual('fakeIntl["Back 10 seconds"]');
    });

    it('should render the skip forward button', () => {
      const { skipForwardButton } = setup();

      expect(skipForwardButton).toHaveLength(1);
      const beforeIcon = skipForwardButton.props().iconBefore;
      expect(beforeIcon.type).toEqual(SkipTenForwardIcon);
      expect(beforeIcon.props.label).toEqual('fakeIntl["Forward 10 seconds"]');
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

    describe('when hd is available', () => {
      it('should render hd button when available', () => {
        const { hdButton } = setup({
          isHDAvailable: true,
        });

        expect(hdButton.props().iconBefore.type).toEqual(VidHdCircleIcon);
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
        expect(downloadButton.props().iconBefore.type).toEqual(DownloadIcon);
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
        const shortcut = component
          .find(Shortcut)
          .filter({ code: keyCodes.space });
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
      let component: ReturnType<typeof setup>['component'];
      let triggerFullScreen: ReturnType<typeof setup>['triggerFullscreen'];

      beforeEach(() => {
        const res = setup({
          isShortcutEnabled: false,
        });
        component = res.component;
        triggerFullScreen = res.triggerFullscreen;
      });

      it('should not render any shortcut', () => {
        const { component } = setup({
          isShortcutEnabled: false,
        });
        expect(component.find(Shortcut)).toHaveLength(0);
      });

      describe('and in fullscreen mode', () => {
        beforeEach(() => {
          triggerFullScreen();
        });

        it('should render play/pause shortcut ', () => {
          const shortcut = component
            .find(Shortcut)
            .filter({ code: keyCodes.space });
          expect(shortcut).toHaveLength(1);
        });

        it('should render mute shortcut', () => {
          const shortcut = component
            .find(Shortcut)
            .filter({ code: keyCodes.m });
          expect(shortcut).toHaveLength(1);
        });

        it('should render skip backward shortcut', () => {
          const shortcut = component
            .find(Shortcut)
            .filter({ code: keyCodes.leftArrow });
          expect(shortcut).toHaveLength(1);
        });

        it('should render skip forward shortcut', () => {
          const shortcut = component
            .find(Shortcut)
            .filter({ code: keyCodes.rightArrow });
          expect(shortcut).toHaveLength(1);
        });
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
      expect(
        (getVideoElement().getDOMNode() as HTMLVideoElement).play,
      ).toHaveBeenCalledTimes(1);
    });

    it('should pause video when pause button is pressed', () => {
      const { getPlayPauseButton, getVideoElement, triggerPlay } = setup({
        isAutoPlay: false,
      });
      triggerPlay();

      getPlayPauseButton().simulate('click');
      expect(
        (getVideoElement().getDOMNode() as HTMLVideoElement).pause,
      ).toHaveBeenCalledTimes(1);
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

    it('should play/pause when playPauseBlanket is clicked', () => {
      const { blanket } = setup({ isAutoPlay: true });

      expect(simultaneousPlayManager.pauseOthers).toHaveBeenCalledTimes(1);
      blanket.simulate('click');
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

    it('should update playback speed when speed is changed', () => {
      const { component } = setup();

      component.find(PlaybackSpeedControls).prop('onPlaybackSpeedChange')(2);
      component.update();
      expect(
        component.find(PlaybackSpeedControls).prop('playbackSpeed'),
      ).toEqual(2);
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
      expect(
        (getVideoElement().getDOMNode() as HTMLVideoElement).volume,
      ).toEqual(0);
    });

    it('should unmute when speaker is clicked after being muted', () => {
      const { muteButton, getVideoElement } = setup();
      muteButton.simulate('click');
      muteButton.simulate('click');
      expect(
        (getVideoElement().getDOMNode() as HTMLVideoElement).volume,
      ).toEqual(1);
    });

    it('should enter fullscreen when blanket double clicked', () => {
      const { getVideoElement, blanket } = setup();

      // To simulation double click we need to call double click handler itself,
      // but also make two clicks with some delay in between.
      blanket.simulate('click');
      jest.advanceTimersByTime(50);
      // Making sure first of two clicks didn't trigger play while double clicking prcedure
      expect(
        (getVideoElement().getDOMNode() as HTMLVideoElement).play,
      ).toHaveBeenCalledTimes(0);
      blanket.simulate('click');

      blanket.simulate('doubleClick');

      expect(toggleFullscreen).toHaveBeenCalledTimes(1);

      jest.runOnlyPendingTimers();
      // Still no play toggle happened
      expect(
        (getVideoElement().getDOMNode() as HTMLVideoElement).play,
      ).toHaveBeenCalledTimes(0);
    });

    describe('when shortcut are enabled', () => {
      it('should start play when space bar is pressed', () => {
        const { getVideoElement, triggerKeydown } = setup({
          isShortcutEnabled: true,
        });

        triggerKeydown(keyCodes.space);

        expect(
          (getVideoElement().getDOMNode() as HTMLVideoElement).play,
        ).toHaveBeenCalledTimes(1);
      });

      it('should stop play when space bar is pressed second time', () => {
        const { getVideoElement, triggerKeydown } = setup({
          isShortcutEnabled: true,
        });

        triggerKeydown(keyCodes.space);
        getVideoElement().simulate('play');
        triggerKeydown(keyCodes.space);

        expect(
          (getVideoElement().getDOMNode() as HTMLVideoElement).pause,
        ).toHaveBeenCalledTimes(1);
      });

      it('should mute and unmute when "m" keypress continuously', () => {
        const { getVideoElement, triggerKeydown } = setup({
          isShortcutEnabled: true,
        });

        triggerKeydown(keyCodes.m);
        expect(
          (getVideoElement().getDOMNode() as HTMLVideoElement).volume,
        ).toEqual(0);
        triggerKeydown(keyCodes.m);
        expect(
          (getVideoElement().getDOMNode() as HTMLVideoElement).volume,
        ).toEqual(1);
      });
    });

    describe('when fullscreen is enabled', () => {
      let triggerKeydown: ReturnType<typeof setup>['triggerKeydown'];
      let getSliderTime: ReturnType<typeof setup>['getSliderTime'];

      beforeEach(() => {
        const res = setup();
        const getVideoElement = res.getVideoElement;
        const triggerFullScreen = res.triggerFullscreen;
        getSliderTime = res.getSliderTime;
        triggerKeydown = res.triggerKeydown;
        triggerFullScreen();

        getVideoElement().simulate('canPlay', {
          target: {
            currentTime: 15,
            volume: 0.5,
            duration: 40,
          },
        });

        getVideoElement().simulate('timeUpdate', {
          target: {
            currentTime: 15,
            buffered: [],
          },
        });
      });

      it('should skip back when left arrow pressed', () => {
        triggerKeydown(keyCodes.leftArrow);
        expect(getSliderTime()).toEqual(5);
      });

      it('should skip forward when right arrow pressed', () => {
        triggerKeydown(keyCodes.rightArrow);
        expect(getSliderTime()).toEqual(25);
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
    it('should be called once when loaded with autoplay = true', () => {
      const onFirstPlay = jest.fn();
      const { component } = setup({
        onFirstPlay,
        isHDAvailable: true,
        isAutoPlay: true,
      });
      expect(onFirstPlay).toHaveBeenCalledTimes(1);

      // Accessing private variable since there are no other way to simulate user starting play
      // via external MediaPlayer component.
      (component.instance() as any).play();
      expect(onFirstPlay).toHaveBeenCalledTimes(1);
    });

    it('should be called once when loaded with autoplay = false and user start play', () => {
      const onFirstPlay = jest.fn();
      const { component } = setup({
        onFirstPlay,
        isHDAvailable: true,
        isAutoPlay: false,
      });
      expect(onFirstPlay).toHaveBeenCalledTimes(0);

      // Accessing private variable since there are no other way to simulate user starting play
      // via external MediaPlayer component.
      (component.instance() as any).play();
      expect(onFirstPlay).toHaveBeenCalledTimes(1);

      (component.instance() as any).play();
      expect(onFirstPlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('on resize', () => {
    it('Should show/hide current time when video is bigger/smaller than 400px', async () => {
      const { component, setWidth } = setup();
      setWidth(399);
      component.update();

      expect(component.find(CurrentTime)).toHaveLength(0);

      setWidth(401);
      component.update();

      expect(component.find(CurrentTime)).toHaveLength(1);
    });

    it('Should show/hide volume controls when video is bigger/smaller than 400px', async () => {
      const { component, setWidth } = setup();

      setWidth(399);
      component.update();

      expect(component.find(VolumeTimeRangeWrapper)).toHaveLength(0);

      setWidth(401);
      component.update();

      expect(component.find(VolumeTimeRangeWrapper)).toHaveLength(1);
    });
  });

  describe('analytics', () => {
    const assertPayload = (
      actualPayload: any,
      payload: {
        action: 'clicked' | 'pressed' | 'changed' | 'navigated';
        actionSubject: string;
        actionSubjectId?: string;
      },
      attributes: any,
    ) => {
      expect(actualPayload).toEqual(
        expect.objectContaining({
          eventType: 'ui',
          ...payload,
          attributes: expect.objectContaining({
            ...attributes,
          }),
        }),
      );
    };

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
      const {
        triggerPlay,
        getPlayPauseButton,
        getUIAnalyticsEventDetails,
      } = setup({
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
      const playbackSpeedButton = component
        .find(Button)
        .filter({ testId: 'custom-media-player-playback-speed-toggle-button' });

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

    it('should fire clicked event when PlayPauseBlanket is clicked', () => {
      const { blanket, getUIAnalyticsEventDetails } = setup({
        isAutoPlay: true,
      });

      blanket.simulate('click');
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

    it('should fire press event when skip backward is activated by pressing left key', () => {
      const {
        getUIAnalyticsEventDetails,
        triggerFullscreen,
        triggerKeydown,
      } = setup();
      triggerFullscreen();
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

    it('should fire press event when skip forward is activated by pressing right key', () => {
      const {
        getUIAnalyticsEventDetails,
        triggerFullscreen,
        triggerKeydown,
      } = setup();
      triggerFullscreen();
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
});
