import { TrackAttributes, TrackEventPayload } from '@atlaskit/media-common';

import {
  createPlaybackAttributes,
  PlaybackState,
  WithPlaybackAttributes,
} from '../../utils/playbackAttributes';
import {
  CustomMediaPlayerType,
  WithCustomMediaPlayerType,
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
