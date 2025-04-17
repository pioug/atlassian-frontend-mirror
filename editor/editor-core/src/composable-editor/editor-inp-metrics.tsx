import { useEffect } from 'react';

import debounce from 'lodash/debounce';

import {
	useAnalyticsEvents,
	type UseAnalyticsEventsHook,
} from '@atlaskit/analytics-next/useAnalyticsEvents';
import { ACTION_SUBJECT, EVENT_TYPE, fireAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import { setupINPTracking } from '@atlaskit/editor-performance-metrics/inp';
import { getActiveInteraction } from '@atlaskit/react-ufo/interaction-metrics';

export const EditorINPMetrics = () => {
	const analyticsEvents = useAnalyticsEvents();

	// onMount lifecycle hook
	useEffect(() => {
		let cleanupFn: ReturnType<typeof setupINPTracking>;
		const cleanupIdleCallback = createIdleCallback(() => {
			cleanupFn = setupINPTracking(({ value }) => {
				const interaction = getActiveInteraction();
				const ufoName = interaction?.ufoName;
				sendAnalytics(analyticsEvents.createAnalyticsEvent, value, ufoName);
			});
		});

		// Cleanup function that will be called when the component unmounts
		return () => {
			cleanupIdleCallback();
			cleanupFn?.();
		};
		// Using hook as mount lifecycle hook.
		// We do not need to set dependency on analyticsEvents since we are using the analyticsEvents object reference
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// This component doesn't render anything
	return null;
};

const sendAnalytics = debounce(
	(
		createAnalyticsEvent: UseAnalyticsEventsHook['createAnalyticsEvent'],
		value: number,
		ufoName?: string,
	) => {
		fireAnalyticsEvent(createAnalyticsEvent)({
			payload: {
				// @ts-expect-error Temporary data
				action: 'inp',
				actionSubject: ACTION_SUBJECT.EDITOR,
				eventType: EVENT_TYPE.TRACK,
				attributes: {
					inp: value,
					ufoName,
				},
			},
		});
	},
	1_000,
	{ trailing: true },
);

const createIdleCallback = (callback: IdleRequestCallback): (() => void) => {
	if (typeof window.requestIdleCallback === 'function') {
		const id = window.requestIdleCallback(callback);
		return () => window.cancelIdleCallback(id);
	}
	// Fallback to setTimeout with 0 delay if requestIdleCallback is not available
	const id = window.setTimeout(callback, 0);
	return () => window.clearTimeout(id);
};
