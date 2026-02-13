import { useCallback, useMemo } from 'react';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import { useRovoAgentCSID } from '../common/csid';
import { getDefaultTrackEventConfig } from '../common/utils';

type CommonAnalyticsAttributes = {
	touchPoint?: string;
} & Record<string, any>;

export enum AgentCreateActions {
	/* Start create flow when user clicks on "Create agent" button - https://data-portal.internal.atlassian.com/analytics/registry/97089 */
	START = 'createFlowStart',
	/* Skip natural language - https://data-portal.internal.atlassian.com/analytics/registry/97127 */
	SKIP_NL = 'createFlowSkipNL',
	/* Review natural language - https://data-portal.internal.atlassian.com/analytics/registry/97124 */
	REVIEW_NL = 'createFlowReviewNL',
	/* Activate agent - https://data-portal.internal.atlassian.com/analytics/registry/97123 */
	ACTIVATE = 'createFlowActivate',
	/* Restart create flow - https://data-portal.internal.atlassian.com/analytics/registry/97131 */
	RESTART = 'createFlowRestart',
	/* Error occurred - https://data-portal.internal.atlassian.com/analytics/registry/97132 */
	ERROR = 'createFlowError',
	/* Land in studio - https://data-portal.internal.atlassian.com/analytics/registry/97136 */
	LAND = 'createLandInStudio',
	/* Discard agent - https://data-portal.internal.atlassian.com/analytics/registry/97137 */
	DISCARD = 'createDiscard',
}

export const useRovoAgentCreateAnalytics = (commonAttributes: CommonAnalyticsAttributes) => {
	const [csid, { refresh: refreshCSID }] = useRovoAgentCSID();

	const { createAnalyticsEvent } = useAnalyticsEvents();
	const eventConfig = useMemo(() => getDefaultTrackEventConfig(), []);

	const fireAnalyticsEvent = useCallback(
		(event: AnalyticsEventPayload) => {
			const referrer = typeof window !== 'undefined' ? window.document.referrer : 'unknown';

			createAnalyticsEvent({
				...eventConfig,
				...event,
				attributes: {
					csid,
					referrer,
					...commonAttributes,
					...event.attributes,
				},
			}).fire(ANALYTICS_CHANNEL);
		},
		[createAnalyticsEvent, eventConfig, csid, commonAttributes],
	);

	/**
	 * This will fire analytics event for intermediate steps in the create agent flow funnel
	 * To start the create agent flow, use trackCreateSessionStart
	 */
	const trackCreateSession = useCallback(
		(action: Omit<AgentCreateActions, AgentCreateActions.START>, attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgent',
				action,
				attributes,
			});
		},
		[fireAnalyticsEvent],
	);

	/**
	 * This should be used ONLY in the beginning of the funnel of create agent flow, it will create a new CSID (CSID = create session ID)
	 */
	const trackCreateSessionStart = useCallback(
		(attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgent',
				action: AgentCreateActions.START,
				attributes,
			});
			refreshCSID();
		},
		[fireAnalyticsEvent, refreshCSID],
	);

	const trackCreateSessionError = useCallback(
		(error: Error, attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgent',
				action: AgentCreateActions.ERROR,
				attributes: {
					error: {
						message: error.message,
					},
					...attributes,
				},
			});
		},
		[fireAnalyticsEvent],
	);

	return [
		csid,
		{
			trackCreateSession,
			trackCreateSessionStart,
			trackCreateSessionError,
		},
	] as const;
};
