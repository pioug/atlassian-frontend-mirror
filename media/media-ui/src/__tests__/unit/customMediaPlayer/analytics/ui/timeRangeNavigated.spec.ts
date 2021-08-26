import {
  createTimeRangeNavigatedEvent,
  PlaybackState,
} from '../../../../../customMediaPlayer/analytics';

describe('createTimeRangeNavigatedEvent', () => {
  const playbackState: PlaybackState = {
    status: 'playing',
    currentTime: 60,
    volume: 1,
    duration: 120,
    isMuted: false,
    buffered: 0,
    isLoading: false,
    isAutoPlay: true,
    isFullScreenEnabled: false,
    isLargePlayer: true,
    playbackSpeed: 1,
  };

  it('with video type, timeRange type and fileId', () => {
    expect(
      createTimeRangeNavigatedEvent(
        'video',
        playbackState,
        'some-range',
        'some-file-Id',
      ),
    ).toEqual({
      eventType: 'ui',
      action: 'navigated',
      actionSubject: 'timeRange',
      actionSubjectId: 'some-range',
      attributes: {
        type: 'video',
        playbackAttributes: {
          status: 'playing',
          durationInSec: 120,
          absoluteTimeInSec: 60,
          relativeTime: 0.5,
          volume: 1,
          isMuted: false,
          isAutoPlay: true,
          isFullScreenEnabled: false,
          isLargePlayer: true,
          playbackSpeed: 1,
        },
        fileAttributes: {
          fileId: 'some-file-Id',
        },
      },
    });
  });
});
