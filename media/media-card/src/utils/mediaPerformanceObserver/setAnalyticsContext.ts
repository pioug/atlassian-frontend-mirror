import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

import { MEDIA_CARD_PERF_STATE_KEY } from './mediaPerformanceObserver';

export const setAnalyticsContext = (newAnalyticsContext: CreateUIAnalyticsEvent): void => {
	if (!window[MEDIA_CARD_PERF_STATE_KEY]) {
		window[MEDIA_CARD_PERF_STATE_KEY] = {};
	}
	window[MEDIA_CARD_PERF_STATE_KEY].mediaCardCreateAnalyticsEvent = newAnalyticsContext;
};
