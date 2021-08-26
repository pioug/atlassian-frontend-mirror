import { ScreenAttributes, ScreenEventPayload } from '@atlaskit/media-common';

import {
  createPlaybackAttributes,
  PlaybackState,
  WithPlaybackAttributes,
} from '../../utils/playbackAttributes';
import {
  CustomMediaPlayerType,
  WithCustomMediaPlayerType,
} from '../../../types';

export type CustomMediaPlayerScreenEventPayload = ScreenEventPayload<
  ScreenAttributes & WithPlaybackAttributes & WithCustomMediaPlayerType,
  'customMediaPlayerScreen'
>;

export const createCustomMediaPlayerScreenEvent = (
  type: CustomMediaPlayerType,
  playbackState: PlaybackState,
  fileId?: string,
): CustomMediaPlayerScreenEventPayload => ({
  eventType: 'screen',
  actionSubject: 'customMediaPlayerScreen',
  actionSubjectId: fileId,
  name: 'customMediaPlayerScreen',
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
