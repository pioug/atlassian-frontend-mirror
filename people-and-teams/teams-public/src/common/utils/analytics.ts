import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

const ANALYTICS_CHANNEL = 'peopleTeams';

const runItLater = (cb: (arg: any) => void) => {
	if ((window as any).requestIdleCallback === 'function') {
		return (window as any).requestIdleCallback(cb);
	}

	if (typeof window.requestAnimationFrame === 'function') {
		return window.requestAnimationFrame(cb);
	}

	return () => setTimeout(cb);
};

type AnalyticsAttribute = Record<string, string | number | boolean | undefined>;

interface AnalyticsEvent {
	action?: string;
	actionSubject?: string;
	actionSubjectId?: string;
	attributes?: Record<string, string | number | boolean | undefined | AnalyticsAttribute>;
	name?: string;
	source?: string;
}

const fireEvent =
	(kind: 'operational' | 'screen' | 'track' | 'ui') =>
	(createAnalyticsEvent: CreateUIAnalyticsEvent | undefined, body: AnalyticsEvent) => {
		if (!createAnalyticsEvent) {
			return;
		}

		runItLater(() => {
			createAnalyticsEvent({
				eventType: kind,
				...body,
			}).fire(ANALYTICS_CHANNEL);
		});
	};

export const fireOperationalEvent = fireEvent('operational');
export const fireScreenEvent = fireEvent('screen');
export const fireTrackEvent = fireEvent('track');
export const fireUIEvent = fireEvent('ui');

export enum AnalyticsAction {
	RENDERED = 'rendered',
	CLICKED = 'clicked',
	FAILED = 'failed',
	SUCCEEDED = 'succeeded',
	VIEWED = 'viewed',
	CLOSED = 'closed',
	ERROR = 'error',
	SUBMITED = 'submitted',
	FETCHED = 'fetched',
	SENT = 'sent',
	OPENED = 'opened',
}
