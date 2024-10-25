import { type AnalyticsEventPayload, type UIAnalyticsEvent } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../../../../utils/analytics';
import { type AnalyticsPayload } from '../../../../../utils/types';

import { type TrackRelatedLinksLoadedEventProps } from './types';

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
