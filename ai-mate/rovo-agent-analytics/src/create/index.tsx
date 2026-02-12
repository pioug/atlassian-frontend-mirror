import { useCallback, useMemo } from 'react';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import { useRovoAgentCSID } from '../common/csid';
import { getDefaultTrackEventConfig } from '../common/utils';

type CommonAnalyticsAttributes = {
	touchPoint?: string;
} & Record<string, any>;

export enum AgentCreateActions {
	/* Start create flow when user clicks on "Create agent" button */
	START = 'createFlowStart',
	/* Skip natural language */
	SKIP_NL = 'createFlowSkipNL',
	/* Review natural language */
	REVIEW_NL = 'createFlowReviewNL',
	/* Activate agent */
	ACTIVATE = 'createFlowActivate',
	/* Restart create flow */
	RESTART = 'createFlowRestart',
	/* Error occurred */
	ERROR = 'createFlowError',
	/* Land in studio */
	LAND = 'createLandInStudio',
	/* Discard agent */
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

	const trackCreateSession = useCallback(
		(action: AgentCreateActions, attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgent',
				action,
				attributes,
			});
		},
		[fireAnalyticsEvent],
	);

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
