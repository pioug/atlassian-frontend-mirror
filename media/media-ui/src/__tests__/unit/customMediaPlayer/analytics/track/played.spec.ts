import { createPlayedTrackEvent } from '../../../../../customMediaPlayer/analytics';

describe('createPlayedTrackEvent', () => {
  it('should create event payload', () =>
    expect(
      createPlayedTrackEvent(
        'video',
        {
          status: 'playing',
          currentTime: 60,
          volume: 1,
          duration: 120,
          isHDAvailable: true,
          isHDActive: false,
          isAutoPlay: true,
          isFullScreenEnabled: false,
          isLargePlayer: true,
          playbackSpeed: 1,
        },
        'file-id',
      ),
    ).toEqual({
      eventType: 'track',
      action: 'played',
      actionSubject: 'customMediaPlayer',
      actionSubjectId: 'file-id',
      attributes: {
        type: 'video',
        playbackAttributes: {
          status: 'playing',
          durationInSec: 120,
          absoluteTimeInSec: 60,
          relativeTime: 0.5,
          volume: 1,
          isHDAvailable: true,
          isHDActive: false,
          isAutoPlay: true,
          isFullScreenEnabled: false,
          isLargePlayer: true,
          playbackSpeed: 1,
        },
        fileAttributes: {
          fileId: 'file-id',
        },
      },
    }));
});
