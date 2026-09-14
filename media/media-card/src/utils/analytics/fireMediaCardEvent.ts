import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import {
	ANALYTICS_MEDIA_CHANNEL,
	sanitiseAnalyticsPayload,
} from '@atlaskit/media-common/analytics';

import type { MediaCardAnalyticsEventPayload } from './analytics';

export function fireMediaCardEvent(
	payload: MediaCardAnalyticsEventPayload,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void {
	if (createAnalyticsEvent) {
		const event = createAnalyticsEvent(sanitiseAnalyticsPayload(payload));
		event.fire(ANALYTICS_MEDIA_CHANNEL);
	}
}
