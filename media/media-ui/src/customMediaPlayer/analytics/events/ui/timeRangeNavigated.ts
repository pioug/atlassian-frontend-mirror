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

export type TimeRangeNavigateEventPayload = UIEventPayload<
  UIAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
  'navigated',
  'timeRange'
>;

export function createTimeRangeNavigatedEvent(
  type: CustomMediaPlayerType,
  playbackState: PlaybackState,
  actionSubjectId?: string,
  fileId?: string,
): TimeRangeNavigateEventPayload {
  return {
    eventType: 'ui',
    action: 'navigated',
    actionSubject: 'timeRange',
    actionSubjectId,
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
