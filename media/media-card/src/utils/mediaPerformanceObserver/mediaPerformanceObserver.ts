import { type CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

export const MEDIA_CARD_PERF_STATE_KEY = '__mediaCardPerfState_asflkajsdflja' as const;

declare global {
	interface Window {
		[MEDIA_CARD_PERF_STATE_KEY]?: {
			mediaCardPerfObserver?: PerformanceObserver;
			mediaCardCreateAnalyticsEvent?: CreateUIAnalyticsEvent;
		};
	}
}
