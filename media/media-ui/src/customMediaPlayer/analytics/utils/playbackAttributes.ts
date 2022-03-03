import { VideoState, VideoStatus } from 'react-video-renderer';
import { isUndefined, omitBy } from '@atlaskit/media-common';

export type WithPlaybackProps = {
  readonly isAutoPlay: boolean;
  readonly isHDAvailable?: boolean;
  readonly isHDActive?: boolean;
};

export type WithMediaPlayerState = {
  playerSize: 'small' | 'medium' | 'large';
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
    playerSize,
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
      playerSize,
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
