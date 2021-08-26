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

export type ShortcutPressEventPayload = UIEventPayload<
  UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
  'pressed',
  'shortcut'
>;

export function createMediaShortcutPressedEvent(
  type: CustomMediaPlayerType,
  playbackState: PlaybackState,
  shortcutType?: string,
  fileId?: string,
): ShortcutPressEventPayload {
  return {
    eventType: 'ui',
    action: 'pressed',
    actionSubject: 'shortcut',
    actionSubjectId: shortcutType,
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
