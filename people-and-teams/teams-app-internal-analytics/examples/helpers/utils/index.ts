export const uiExampleEvent = {
	action: 'clicked',
	actionSubject: 'button',
	actionSubjectId: 'analyticsExample',
	attributes: {
		testAttribute: 'testValue',
	},
};
export const operationalExampleEvent = {
	action: 'fired',
	actionSubject: 'automation',
	actionSubjectId: 'analyticsExample',
	attributes: {
		testAttribute: 'testValue',
	},
};
export const trackExampleEvent = {
	action: 'triggered',
	actionSubject: 'automation',
	actionSubjectId: 'analyticsExample',
	attributes: {
		testAttribute: 'testValue',
	},
};

export const screenExampleEvent = {
	name: 'analyticsExampleScreen',
	attributes: {
		testAttribute: 'testValue',
	},
};

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';

import { EVENT_CHANNEL } from '../../../src/common/utils/constants';

import type { AnalyticsEventPayload, AnalyticsScreenEventPayload } from './types';

function fireEvent(
	kind: 'screen',
): (
	createAnalyticsEvent: CreateUIAnalyticsEvent | undefined,
	body: AnalyticsScreenEventPayload,
) => void;
function fireEvent(
	kind: 'operational' | 'track' | 'ui',
): (createAnalyticsEvent: CreateUIAnalyticsEvent | undefined, body: AnalyticsEventPayload) => void;
function fireEvent(kind: 'operational' | 'screen' | 'track' | 'ui') {
	return (
		createAnalyticsEvent: CreateUIAnalyticsEvent | undefined,
		body: AnalyticsEventPayload | AnalyticsScreenEventPayload,
	) => {
		if (!createAnalyticsEvent) {
			return;
		}
		createAnalyticsEvent({
			eventType: kind,
			...body,
		}).fire(EVENT_CHANNEL);
	};
}

export const fireOperationalEvent: (createAnalyticsEvent: CreateUIAnalyticsEvent | undefined, body: AnalyticsEventPayload) => void = fireEvent('operational');
export const fireScreenEvent: (createAnalyticsEvent: CreateUIAnalyticsEvent | undefined, body: AnalyticsScreenEventPayload) => void = fireEvent('screen');
export const fireTrackEvent: (createAnalyticsEvent: CreateUIAnalyticsEvent | undefined, body: AnalyticsEventPayload) => void = fireEvent('track');
export const fireUIEvent: (createAnalyticsEvent: CreateUIAnalyticsEvent | undefined, body: AnalyticsEventPayload) => void = fireEvent('ui');
