jest.mock('../../customMediaPlayer/fullscreen');
import Button from '@atlaskit/button/custom-theme-button';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import FullScreenIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import VidHdCircleIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import { asMock, fakeIntl } from '@atlaskit/media-test-helpers';
import Spinner from '@atlaskit/spinner';
import { WidthObserver } from '@atlaskit/width-detector';
import MediaPlayer from 'react-video-renderer';
import { mount } from 'enzyme';
import React from 'react';
import { Shortcut } from '../../';
import {
  CustomMediaPlayer,
  CustomMediaPlayerProps,
  CustomMediaPlayerState,
} from '../../customMediaPlayer';
import { toggleFullscreen } from '../../customMediaPlayer/fullscreen';
import simultaneousPlayManager from '../../customMediaPlayer/simultaneousPlayManager';
import {
  CurrentTime,
  VolumeTimeRangeWrapper,
} from '../../customMediaPlayer/styled';
import { TimeRange, TimeRangeProps } from '../../customMediaPlayer/timeRange';
jest.mock('../../customMediaPlayer/simultaneousPlayManager');

// Removes errors from JSDOM virtual console on CustomMediaPlayer tests
// Trick taken from https://github.com/jsdom/jsdom/issues/2155
const HTMLMediaElement_play = HTMLMediaElement.prototype.play;
const HTMLMediaElement_pause = HTMLMediaElement.prototype.pause;

let innerSetWidth: Function | undefined;

const setWidth = (width: number) =>
  typeof innerSetWidth === 'function' ? innerSetWidth(width) : undefined;

jest.mock('@atlaskit/width-detector', () => {
  return {
    WidthObserver: (props => {
      innerSetWidth = props.setWidth;
      return null;
    }) as typeof WidthObserver,
  };
});

beforeAll(() => {
  HTMLMediaElement.prototype.play = () => Promise.resolve();
  HTMLMediaElement.prototype.pause = () => Promise.resolve();
});

afterAll(() => {
  HTMLMediaElement.prototype.play = HTMLMediaElement_play;
  HTMLMediaElement.prototype.pause = HTMLMediaElement_pause;
});

describe('<CustomMediaPlayer />', () => {
  const setup = (props?: Partial<CustomMediaPlayerProps>) => {
    const onChange = jest.fn();
    const component = mount<
      CustomMediaPlayer,
      CustomMediaPlayerProps,
      CustomMediaPlayerState
    >(
      <CustomMediaPlayer
        type="video"
        isAutoPlay={true}
        isHDAvailable={false}
        src="video-src"
        intl={fakeIntl}
        {...props}
      />,
    );

    return {
      component,
      onChange,
    };
  };

  describe('render', () => {
    it('should render the video element', () => {
      const { component } = setup();

      expect(component.find('video')).toHaveLength(1);
    });

    it('should render the right icon based on the video state (play/pause)', () => {
      const { component } = setup();
      const button = component.find(Button).first() as any;

      expect(button.prop('iconBefore').type).toEqual(VidPlayIcon);
    });

    it('should render a time range with the time properties', () => {
      const { component } = setup();

      expect(component.find(TimeRange).length).toBeGreaterThan(1);
      const expectedProps: Partial<TimeRangeProps> = {
        currentTime: 0,
        duration: 0,
        bufferedTime: 0,
      };
      expect(component.find(TimeRange).at(0).props()).toEqual(
        expect.objectContaining(expectedProps),
      );
    });

    it('should render the volume controls', () => {
      const { component } = setup();

      expect(component.find(TimeRange).at(1).prop('currentTime')).toEqual(1);
    });

    it('should render the time (current/total) in the right format', () => {
      const { component } = setup();

      expect(component.find(CurrentTime).text()).toEqual('0:00 / 0:00');
    });

    it('should render the fullscreen button', () => {
      const { component } = setup();

      expect(
        (component.find(Button).last().prop('iconBefore') as any).type,
      ).toEqual(FullScreenIcon);
    });

    it('should render hd button if available', () => {
      const { component } = setup({
        isHDAvailable: true,
      });

      expect(component.find(Button)).toHaveLength(4);
      expect(
        (component.find(Button).at(2).prop('iconBefore') as any).type,
      ).toEqual(VidHdCircleIcon);
      component.setProps({
        isHDAvailable: false,
      });
      expect(component.find(Button)).toHaveLength(3);
    });

    it('should render spinner when the video is in loading state', () => {
      const { component } = setup();

      component.find('video').simulate('waiting');
      expect(component.find(Spinner)).toHaveLength(1);
    });

    it('should render download button if onDownloadClick is passed', () => {
      const onDownloadClick = jest.fn();
      const { component } = setup({ onDownloadClick });

      expect(component.find(DownloadIcon)).toHaveLength(1);
      component.find(DownloadIcon).simulate('click');
      expect(onDownloadClick).toBeCalledTimes(1);
    });
  });

  describe('interaction', () => {
    it('should use keyboard shortcuts to toggle video state', () => {
      const showControls = jest.fn();
      const { component } = setup({ showControls, isShortcutEnabled: true });

      component.find(Shortcut).first().prop('handler')();
      component.find(Shortcut).last().prop('handler')();

      expect(component.find(Shortcut)).toHaveLength(2);
      expect(showControls).toHaveBeenCalledTimes(2);
    });

    it('should fire callback when hd button is clicked', () => {
      const onHDToggleClick = jest.fn();
      const { component } = setup({
        isHDAvailable: true,
        onHDToggleClick,
      });

      component.find(Button).at(2).simulate('click');
      expect(onHDToggleClick).toHaveBeenCalledTimes(1);
    });

    it('should request full screen when fullscreen button is clicked', () => {
      const { component } = setup();

      component.find(Button).last().simulate('click');
      expect(toggleFullscreen).toHaveBeenCalledTimes(1);
    });

    it('should update TimeRange when time changes', () => {
      const { component } = setup();

      component.find('video').simulate('timeUpdate', {
        target: {
          currentTime: 10,
          buffered: [],
        },
      });
      expect(component.find(TimeRange).at(0).prop('currentTime')).toEqual(10);
    });

    it('should update buffered time when it changes', () => {
      const { component } = setup();

      component.find('video').simulate('timeUpdate', {
        target: {
          currentTime: 10,
          buffered: {
            length: 1,
            end: () => 10,
          },
        },
      });
      expect(component.find(TimeRange).at(0).prop('bufferedTime')).toEqual(10);
    });

    it("should update Volume's TimeRange when volume changes", () => {
      const { component } = setup();

      component.find('video').simulate('volumeChange', {
        target: {
          volume: 0.3,
        },
      });
      expect(component.find(TimeRange).at(1).prop('currentTime')).toEqual(0.3);
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
      const { component } = setup({ isAutoPlay: false });

      component.find(Button).at(0).simulate('click');
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
      const { component } = setup();

      setWidth(399);
      component.update();

      expect(component.find(CurrentTime)).toHaveLength(0);

      setWidth(401);
      component.update();

      expect(component.find(CurrentTime)).toHaveLength(1);
    });

    it('Should show/hide volume controls when video is bigger/smaller than 400px', async () => {
      const { component } = setup();

      setWidth(399);
      component.update();

      expect(component.find(VolumeTimeRangeWrapper)).toHaveLength(0);

      setWidth(401);
      component.update();

      expect(component.find(VolumeTimeRangeWrapper)).toHaveLength(1);
    });
  });

  const sourceTypes: CustomMediaPlayerProps['type'][] = ['video', 'audio'];

  sourceTypes.forEach(sourceType => {
    describe('with save last watch time feature', () => {
      it(`should continue play from last watch time for the same ${sourceType}`, () => {
        const { component } = setup({
          lastWatchTimeConfig: {
            contentId: 'some-unique-id',
          },
          type: sourceType,
        });

        component.find(sourceType).simulate('timeUpdate', {
          target: {
            currentTime: 10,
            buffered: [],
          },
        });

        const { component: component2 } = setup({
          lastWatchTimeConfig: {
            contentId: 'some-unique-id',
          },
          type: sourceType,
        });

        expect(component2.find(MediaPlayer).props().defaultTime).toEqual(10);
      });

      it(`should start from beginning for a different ${sourceType}`, () => {
        const { component } = setup({
          lastWatchTimeConfig: {
            contentId: 'some-unique-id',
          },
          type: sourceType,
        });

        component.find(sourceType).simulate('timeUpdate', {
          target: {
            currentTime: 10,
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
