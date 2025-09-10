import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { usePeopleTeamsAnalyticsSubcontext } from '@atlaskit/people-teams-ui-public/analytics';

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

/**
 * @private
 * @deprecated Analytics events should be fired using the `@atlaskit/teams-app-internal-analytics` package.
 */
export const usePeopleAndTeamAnalytics = () => {
	const [{ eventAttributes: injectedEventAttributes }] = usePeopleTeamsAnalyticsSubcontext();
	const fireEvent =
		(kind: 'operational' | 'screen' | 'track' | 'ui') =>
		(createAnalyticsEvent: CreateUIAnalyticsEvent | undefined, body: AnalyticsEvent) => {
			if (!createAnalyticsEvent) {
				return;
			}

			runItLater(() => {
				const eventWithSubcontextAttributes = {
					...body.attributes,
					...injectedEventAttributes,
				};

				createAnalyticsEvent({
					eventType: kind,
					...body,
					attributes: eventWithSubcontextAttributes,
				}).fire(ANALYTICS_CHANNEL);
			});
		};

	return {
		fireOperationalEvent: fireEvent('operational'),
		fireScreenEvent: fireEvent('screen'),
		fireTrackEvent: fireEvent('track'),
		fireUIEvent: fireEvent('ui'),
	};
};

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
