/**
 * Largely taken from analytics-web-react
 */

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { extractFromEventContext } from './extract-from-event-context';

export const getActionSubject = (event: UIAnalyticsEvent): any => {
	const overrides = extractFromEventContext('actionSubjectOverride', event);

	const closestContext = event.context.length > 0 ? event.context[event.context.length - 1] : {};

	const actionSubject = event.payload.actionSubject || closestContext.component;

	return overrides.length > 0 ? overrides[0] : actionSubject;
};
