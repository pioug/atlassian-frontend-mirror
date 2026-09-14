import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

import { type AnalyticsPayload } from '../types';
import { ANALYTICS_CHANNEL } from './analytics';

export const fireSmartLinkEvent = (
	payload: AnalyticsPayload,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
): void => {
	if (createAnalyticsEvent) {
		createAnalyticsEvent(payload).fire(ANALYTICS_CHANNEL);
	}
};
