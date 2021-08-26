import React, { useState } from 'react';
import { act } from 'react-dom/test-utils';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { asMock, mountWithIntlContext } from '@atlaskit/media-test-helpers';
import { WidthObserver } from '@atlaskit/width-detector';
import MediaPlayer, { VideoProps, VideoState } from 'react-video-renderer';

import {
  CustomMediaPlayer,
  CustomMediaPlayerBase,
  CustomMediaPlayerProps,
  CustomMediaPlayerState,
} from '../../../../customMediaPlayer';

type mockWidthObserver = typeof WidthObserver;

jest.mock('@atlaskit/width-detector', () => {
  return {
    WidthObserver: ((props) => {
      return null;
    }) as mockWidthObserver,
  };
});

jest.mock('react-video-renderer', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const MOCK_DURATION = 100;

describe('CustomMediaPlayer Analytics', () => {
  const setup = (
    analyticsHandler: jest.Mock<void, any[]>,
    props?: Partial<CustomMediaPlayerProps>,
    opts: { currentTime?: number; duration?: number; volume?: number } = {},
  ) => {
    const { currentTime = 0, duration = 10, volume = 1 } = opts;

    let updatePlayerMockCurrentTime:
      | React.Dispatch<React.SetStateAction<number>>
      | undefined;

    const MockMediaPlayer: React.FC<VideoProps> = (
      props: React.PropsWithChildren<VideoProps>,
    ) => {
      const { children } = props;
      const [mockedCurrentTime, setMockedCurrentTime] = useState(currentTime);

      updatePlayerMockCurrentTime = setMockedCurrentTime;

      const actions = {
        play: jest.fn(),
        pause: jest.fn(),
        navigate: jest.fn(),
        setVolume: jest.fn(),
        setPlaybackSpeed: jest.fn(),
        requestFullscreen: jest.fn(),
        mute: jest.fn(),
        unmute: jest.fn(),
        toggleMute: jest.fn(),
      };

      const videoState = {
        status: 'playing',
        currentTime: mockedCurrentTime,
        volume,
        duration: duration,
        buffered: duration,
        isMuted: false,
        isLoading: false,
      } as VideoState;

      return (
        <div>
          {children(
            <div></div>,
            { ...videoState, currentTime: mockedCurrentTime },
            actions,
            {
              current: null,
            },
          )}
        </div>
      );
    };

    asMock(MediaPlayer).mockImplementation(MockMediaPlayer);

    const component = mountWithIntlContext<
      CustomMediaPlayerProps,
      CustomMediaPlayerState,
      CustomMediaPlayerBase
    >(
      <AnalyticsListener
        channel={FabricChannel.media}
        onEvent={analyticsHandler}
      >
        <CustomMediaPlayer
          type="video"
          isAutoPlay={true}
          isHDAvailable={false}
          src="video-src"
          {...props}
        />
      </AnalyticsListener>,
    );

    return {
      component,
      MockMediaPlayer,
      updatePlayerMockCurrentTime,
    };
  };

  it('should emit screen event on component mount', () => {
    const onAnalyticsEvent = jest.fn();

    setup(onAnalyticsEvent, {
      type: 'audio',
      fileId: 'some-file-id',
    });

    expect(onAnalyticsEvent).toBeCalledWith(
      expect.objectContaining({
        payload: {
          eventType: 'screen',
          actionSubject: 'customMediaPlayerScreen',
          actionSubjectId: 'some-file-id',
          name: 'customMediaPlayerScreen',
          attributes: {
            type: 'audio',
            playbackAttributes: {
              isAutoPlay: true,
              isHDAvailable: false,
              isFullScreenEnabled: false,
              isLargePlayer: true,
              playbackSpeed: 1,
            },
            fileAttributes: {
              fileId: 'some-file-id',
            },
          },
        },
      }),
      FabricChannel.media,
    );
  });

  it('should emit "played" track event every 2s when playing', async () => {
    const onAnalyticsEvent = jest.fn();

    const { updatePlayerMockCurrentTime } = setup(
      onAnalyticsEvent,
      {
        type: 'video',
        fileId: 'some-file-id',
      },
      { currentTime: 0, duration: MOCK_DURATION },
    );

    if (!updatePlayerMockCurrentTime) {
      return expect(updatePlayerMockCurrentTime).toBeDefined();
    }

    // simulate playback at 2s
    act(() => {
      updatePlayerMockCurrentTime(2);
    });

    // simulate playback at 3s
    act(() => {
      updatePlayerMockCurrentTime(3);
    });

    // simulate playback at 4s
    act(() => {
      updatePlayerMockCurrentTime(4);
    });

    // simulate playback at 2s
    act(() => {
      updatePlayerMockCurrentTime(2);
    });

    // simulate playback at 3s
    act(() => {
      updatePlayerMockCurrentTime(3);
    });

    // simulate playback at 5s
    act(() => {
      updatePlayerMockCurrentTime(5);
    });

    const expectedAnalyticsPayloadForAbsoluteTime = (
      absoluteTimeInSec: number,
    ) => ({
      eventType: 'track',
      action: 'played',
      actionSubject: 'customMediaPlayer',
      actionSubjectId: 'some-file-id',
      attributes: {
        type: 'video',
        playbackAttributes: {
          status: 'playing',
          durationInSec: MOCK_DURATION,
          absoluteTimeInSec,
          relativeTime: absoluteTimeInSec / MOCK_DURATION,
          volume: 1,
          isAutoPlay: true,
          isHDAvailable: false,
          isFullScreenEnabled: false,
          isLargePlayer: true,
          isMuted: false,
          playbackSpeed: 1,
        },
        fileAttributes: {
          fileId: 'some-file-id',
        },
      },
    });

    // difference with previous currentTime >= 2sec => "played" track event emitted
    expect(onAnalyticsEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        payload: expectedAnalyticsPayloadForAbsoluteTime(2),
      }),
      FabricChannel.media,
    );

    // difference with previous currentTime >= 2sec => "played" track event emitted (we've skipped currentTime=3)
    expect(onAnalyticsEvent).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        payload: expectedAnalyticsPayloadForAbsoluteTime(4),
      }),
      FabricChannel.media,
    );

    // difference with  previous currentTime is negative => "played" track event emitted
    expect(onAnalyticsEvent).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        payload: expectedAnalyticsPayloadForAbsoluteTime(2),
      }),
      FabricChannel.media,
    );

    // difference with previous currentTime >= 2sec => "played" track event emitted
    expect(onAnalyticsEvent).toHaveBeenNthCalledWith(
      5,
      expect.objectContaining({
        payload: expectedAnalyticsPayloadForAbsoluteTime(5),
      }),
      FabricChannel.media,
    );
  });
});
