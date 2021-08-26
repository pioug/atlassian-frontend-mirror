import {
  createPlayPauseBlanketClickedEvent,
  PlaybackState,
} from '../../../../../customMediaPlayer/analytics';

describe('createPlayPauseBlanketClickedEvent', () => {
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

  it('with video type and fileId', () => {
    expect(
      createPlayPauseBlanketClickedEvent(
        'video',
        playbackState,
        'some-file-Id',
      ),
    ).toEqual({
      eventType: 'ui',
      action: 'clicked',
      actionSubject: 'playPauseBlanket',
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
