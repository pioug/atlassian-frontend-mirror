import { type AnalyticsEventPayload } from '../events/AnalyticsEvent';
import type UIAnalyticsEvent from '../events/UIAnalyticsEvent';
import { type CreateUIAnalyticsEvent } from '../types';

export default (channel?: string) =>
	(payload: AnalyticsEventPayload) =>
	(createAnalyticsEvent: CreateUIAnalyticsEvent): UIAnalyticsEvent => {
		const consumerEvent = createAnalyticsEvent(payload);
		const clonedEvent = consumerEvent.clone();

		if (clonedEvent) {
			clonedEvent.fire(channel);
		}

		return consumerEvent;
	};
