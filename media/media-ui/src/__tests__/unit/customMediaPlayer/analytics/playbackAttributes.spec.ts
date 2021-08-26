import {
  PlaybackAttributes,
  PlaybackState,
  createPlaybackAttributes,
} from '../../../../customMediaPlayer/analytics/utils/playbackAttributes';

const playbackState: PlaybackState = {
  status: 'playing',
  currentTime: 60,
  volume: 1,
  duration: 120,
  isMuted: false,
  buffered: 0,
  isLoading: false,
  isAutoPlay: true,
  isHDActive: true,
  isHDAvailable: true,
  isFullScreenEnabled: true,
  isLargePlayer: false,
  playbackSpeed: 2,
};

const playbackStateWithUndefined: PlaybackState = {
  isAutoPlay: true,
  isFullScreenEnabled: false,
  isHDAvailable: false,
  isLargePlayer: true,
  playbackSpeed: 1,
};

const playbackAttributes: PlaybackAttributes = {
  status: 'playing',
  durationInSec: 120,
  absoluteTimeInSec: 60,
  relativeTime: 0.5,
  volume: 1,
  isMuted: false,
  isAutoPlay: true,
  isHDActive: true,
  isHDAvailable: true,
  isFullScreenEnabled: true,
  isLargePlayer: false,
  playbackSpeed: 2,
};

describe('createPlaybackAttributes', () => {
  it('with Playback state', () => {
    expect(createPlaybackAttributes(playbackState)).toEqual(playbackAttributes);
  });

  it('with Partial Playback state', () => {
    expect(createPlaybackAttributes(playbackStateWithUndefined)).toEqual({
      isAutoPlay: true,
      isFullScreenEnabled: false,
      isHDAvailable: false,
      isLargePlayer: true,
      playbackSpeed: 1,
    });
  });
});
