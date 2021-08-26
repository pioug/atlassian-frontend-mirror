import {
  CreateUIAnalyticsEvent,
  createAndFireEvent,
} from '@atlaskit/analytics-next';

import {
  ANALYTICS_MEDIA_CHANNEL,
  MediaFeatureFlags,
  UIAttributes,
  UIEventPayload,
} from '@atlaskit/media-common';

import { CustomMediaPlayerScreenEventPayload } from '../events/screen/customMediaPlayer';
import { MediaButtonClickEventPayload } from '../events/ui/mediaButtonClicked';
import { PlaybackSpeedChangeEventPayload } from '../events/ui/playbackSpeedChanged';
import { PlayPauseBlanketClickEventPayload } from '../events/ui/playPauseBlanketClicked';
import { ShortcutPressEventPayload } from '../events/ui/shortcutPressed';
import { TimeRangeNavigateEventPayload } from '../events/ui/timeRangeNavigated';
import { FirstPlayedTrackEventPayload } from '../events/track/playCount';
import { PlayedTrackEventPayload } from '../events/track/played';
import { CustomMediaPlayerType } from '../../types';

export type CustomMediaPlayerUIEventPayload = UIEventPayload<
  UIAttributes & {
    type: CustomMediaPlayerType;
  },
  'default',
  'customMediaPlayer'
>;

export type CustomMediaPlayerUIEvent =
  | 'mediaButtonClick'
  | 'shortcutPress'
  | 'playPauseBlanketClick'
  | 'timeRangeNavigate'
  | 'volumeRangeNavigate'
  | 'playbackSpeedChange';

export type CustomMediaPlayerAnalyticsEventPayload =
  | CustomMediaPlayerScreenEventPayload
  | MediaButtonClickEventPayload
  | PlaybackSpeedChangeEventPayload
  | PlayPauseBlanketClickEventPayload
  | ShortcutPressEventPayload
  | TimeRangeNavigateEventPayload
  | CustomMediaPlayerUIEventPayload
  | FirstPlayedTrackEventPayload
  | PlayedTrackEventPayload;

export const relevantFeatureFlagNames: Array<keyof MediaFeatureFlags> = [];

// can be called in a component whose props extend WithAnalyticsEventsProps
export function fireAnalyticsEvent(
  payload: CustomMediaPlayerAnalyticsEventPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEvent,
) {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent(payload);
    event.fire(ANALYTICS_MEDIA_CHANNEL);
  }
}

// can be used inside withAnalyticsEvents() hook
export const createAndFireMediaCustomMediaPlayerEvent = (
  payload: CustomMediaPlayerAnalyticsEventPayload,
) => {
  return createAndFireEvent(ANALYTICS_MEDIA_CHANNEL)(payload);
};
