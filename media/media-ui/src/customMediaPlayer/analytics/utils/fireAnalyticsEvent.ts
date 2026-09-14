import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common';

import type { CustomMediaPlayerAnalyticsEventPayload } from './analytics';

// can be called in a component whose props extend WithAnalyticsEventsProps
export function fireAnalyticsEvent(
	payload: CustomMediaPlayerAnalyticsEventPayload,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void {
	if (createAnalyticsEvent) {
		const event = createAnalyticsEvent(payload);
		event.fire(ANALYTICS_MEDIA_CHANNEL);
	}
}
