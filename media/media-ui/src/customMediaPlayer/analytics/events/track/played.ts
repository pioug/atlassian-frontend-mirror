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

export type PlayedTrackEventPayload = TrackEventPayload<
  TrackAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
  'played',
  'customMediaPlayer'
>;

export const createPlayedTrackEvent = (
  type: CustomMediaPlayerType,
  playbackState: PlaybackState,
  fileId?: string,
): PlayedTrackEventPayload => ({
  eventType: 'track',
  action: 'played',
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
