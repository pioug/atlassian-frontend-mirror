import { UIAttributes, UIEventPayload } from '@atlaskit/media-common';

import {
  createPlaybackAttributes,
  PlaybackState,
  WithPlaybackAttributes,
} from '../../utils/playbackAttributes';
import {
  CustomMediaPlayerType,
  WithCustomMediaPlayerType,
} from '../../../types';

export type PlayPauseBlanketClickEventPayload = UIEventPayload<
  UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
  'clicked',
  'playPauseBlanket'
>;

export function createPlayPauseBlanketClickedEvent(
  type: CustomMediaPlayerType,
  playbackState: PlaybackState,
  fileId?: string,
): PlayPauseBlanketClickEventPayload {
  return {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'playPauseBlanket',
    attributes: {
      type,
      playbackAttributes: createPlaybackAttributes(playbackState),
      ...(fileId && {
        fileAttributes: {
          fileId,
        },
      }),
    },
  };
}
