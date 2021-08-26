import { VideoState, VideoStatus } from 'react-video-renderer';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';

export type WithPlaybackProps = {
  readonly isAutoPlay: boolean;
  readonly isHDAvailable?: boolean;
  readonly isHDActive?: boolean;
};

export type WithMediaPlayerState = {
  isLargePlayer: boolean;
  isFullScreenEnabled: boolean;
  playbackSpeed: number;
};

export type PlaybackState = WithPlaybackProps &
  WithMediaPlayerState &
  Partial<VideoState>;

export type PlaybackAttributes = WithPlaybackProps &
  WithMediaPlayerState & {
    durationInSec?: number;
    absoluteTimeInSec?: number;
    relativeTime?: number;
    status?: VideoStatus;
    volume?: number;
    isMuted?: boolean;
  };

export type WithPlaybackAttributes = {
  playbackAttributes: Partial<PlaybackAttributes>;
};

export function createPlaybackAttributes(
  playbackState: PlaybackState,
): Partial<PlaybackAttributes> {
  const {
    isAutoPlay,
    isHDAvailable,
    isHDActive,
    isLargePlayer,
    isFullScreenEnabled,
    playbackSpeed,
    status,
    currentTime,
    volume,
    duration,
    isMuted,
  } = playbackState;

  return omitBy(
    {
      isAutoPlay,
      isHDAvailable,
      isHDActive,
      playbackSpeed,
      isLargePlayer,
      isFullScreenEnabled,
      durationInSec: duration && parseInt(`${duration}`, 10),
      absoluteTimeInSec: currentTime && parseInt(`${currentTime}`, 10),
      relativeTime:
        duration && currentTime && duration > 0
          ? Math.round((currentTime / duration) * 100) / 100
          : undefined,
      status,
      volume,
      isMuted,
    },
    isUndefined,
  );
}
