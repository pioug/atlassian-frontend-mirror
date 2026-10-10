import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { ANALYTICS_MEDIA_CHANNEL } from '@atlaskit/media-common/constants';
import { sanitiseAnalyticsPayload } from '@atlaskit/media-common/sanitisePayload';

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
