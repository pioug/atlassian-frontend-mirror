import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import {
	ANALYTICS_MEDIA_CHANNEL,
	sanitiseAnalyticsPayload,
} from '@atlaskit/media-common/analytics';

import { type MediaViewerEventPayload } from './events';

export function fireAnalytics(
	payload: MediaViewerEventPayload,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void {
	if (createAnalyticsEvent) {
		const ev = createAnalyticsEvent(sanitiseAnalyticsPayload(payload));
		ev.fire(ANALYTICS_MEDIA_CHANNEL);
	}
}
