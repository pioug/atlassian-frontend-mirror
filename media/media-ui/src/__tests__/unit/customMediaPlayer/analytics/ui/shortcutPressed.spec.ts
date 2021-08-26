import {
  createMediaShortcutPressedEvent,
  PlaybackState,
} from '../../../../../customMediaPlayer/analytics';

describe('createMediaShortcutPressedEvent', () => {
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

  it('with video type, Shortcut type and fileId', () => {
    expect(
      createMediaShortcutPressedEvent(
        'video',
        playbackState,
        'some-shortcut',
        'some-file-Id',
      ),
    ).toEqual({
      eventType: 'ui',
      action: 'pressed',
      actionSubject: 'shortcut',
      actionSubjectId: 'some-shortcut',
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
