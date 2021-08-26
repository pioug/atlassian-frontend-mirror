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

export type MediaButtonClickEventPayload = UIEventPayload<
  UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
  'clicked',
  'button'
>;

export function createMediaButtonClickedEvent(
  type: CustomMediaPlayerType,
  playbackState: PlaybackState,
  buttonType?: string,
  fileId?: string,
): MediaButtonClickEventPayload {
  return {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: buttonType,
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
