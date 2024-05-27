import { type TrackAttributes, type TrackEventPayload } from '@atlaskit/media-common';

import {
  createPlaybackAttributes,
  type PlaybackState,
  type WithPlaybackAttributes,
} from '../../utils/playbackAttributes';
import {
  type CustomMediaPlayerType,
  type WithCustomMediaPlayerType,
} from '../../../types';

export type FirstPlayedTrackEventPayload = TrackEventPayload<
  TrackAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
  'firstPlayed',
  'customMediaPlayer'
>;

export const createFirstPlayedTrackEvent = (
  type: CustomMediaPlayerType,
  playbackState: PlaybackState,
  fileId?: string,
): FirstPlayedTrackEventPayload => ({
  eventType: 'track',
  action: 'firstPlayed',
  actionSubject: 'customMediaPlayer',
  actionSubjectId: fileId,
  attributes: {
    type,
    playbackAttributes: createPlaybackAttributes(playbackState),
    ...(fileId && {
      fileAttributes: {
        fileId,
      },
    }),
  },
});
