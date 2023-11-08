import {
  AnalyticsEventPayload,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import { TrackRelatedLinksLoadedEventProps } from './types';
import { AnalyticsPayload } from '../../../../../utils/types';
import { ANALYTICS_CHANNEL } from '../../../../../utils/analytics';

const createTrackRelatedLinksLoadedEventPayload = ({
  relatedLinksCount,
}: TrackRelatedLinksLoadedEventProps): AnalyticsPayload => ({
  action: 'loaded',
  actionSubject: 'relatedLinks',
  eventType: 'track',
  attributes: {
    relatedLinksCount,
  },
});

export const fireRelatedLinksLoadedEvent =
  (
    createAnalyticsEvent: (payload: AnalyticsEventPayload) => UIAnalyticsEvent,
  ): ((attributes: TrackRelatedLinksLoadedEventProps) => void) =>
  (attributes) => {
    const payload = createTrackRelatedLinksLoadedEventPayload(attributes);

    if (payload) {
      createAnalyticsEvent({
        ...payload,
      }).fire(ANALYTICS_CHANNEL);
    }
  };
