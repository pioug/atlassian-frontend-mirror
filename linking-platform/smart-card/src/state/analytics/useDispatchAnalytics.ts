import { useMemo } from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';

import { type AnalyticsHandler, type AnalyticsPayload } from '../../index';
import { ANALYTICS_CHANNEL } from '../../utils/analytics';

/**
 * Hook designed to use a handler if provided (ideally not)
 * Use this for the short-term to support deprecating `analyticsHandler`s that are being provided externally,
 * but fallback to the dispatch provided by `useAnalyticsEvents`
 *
 * In future, potentially use this hook to feature flag the channel we are dispatching to
 */
export const useDispatchAnalytics = (handler?: AnalyticsHandler) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	return {
		dispatchAnalytics: useMemo(() => {
			if (handler) {
				return handler;
			}

			return (payload: AnalyticsPayload) => {
				createAnalyticsEvent(payload).fire(ANALYTICS_CHANNEL);
			};
		}, [handler, createAnalyticsEvent]),
	};
};
