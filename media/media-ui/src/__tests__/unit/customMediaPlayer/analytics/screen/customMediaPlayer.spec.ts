import { createCustomMediaPlayerScreenEvent } from '../../../../../customMediaPlayer/analytics';

describe('createCustomMediaPlayerScreenEvent', () => {
  it('should create event payload', () =>
    expect(
      createCustomMediaPlayerScreenEvent(
        'video',
        {
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
      eventType: 'screen',
      actionSubject: 'customMediaPlayerScreen',
      actionSubjectId: 'file-id',
      name: 'customMediaPlayerScreen',
      attributes: {
        type: 'video',
        playbackAttributes: {
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
