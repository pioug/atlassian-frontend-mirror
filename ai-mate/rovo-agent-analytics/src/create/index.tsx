import { useCallback } from 'react';

import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import { useRovoAgentCSID } from '../common/csid';
import { getDefaultTrackEventConfig } from '../common/utils';

type CommonAnalyticsAttributes = {
	touchPoint?: string;
} & Record<string, any>;

export enum AgentCreateActions {
	START = 'createFlowStart',
	SKIP_NL = 'createFlowSkipNL',
	REVIEW_NL = 'createFlowReviewNL',
	ACTIVATE = 'createFlowActivate',
	RESTART = 'createFlowRestart',
	ERROR = 'createFlowError',
}

export const useRovoAgentCreateAnalytics = (commonAttributes: CommonAnalyticsAttributes) => {
	const [csid, { refresh: refreshCSID }] = useRovoAgentCSID();

	const { createAnalyticsEvent } = useAnalyticsEvents();
	const eventConfig = getDefaultTrackEventConfig();

	const fireAnalyticsEvent = useCallback(
		(event: AnalyticsEventPayload) => {
			createAnalyticsEvent({
				...eventConfig,
				...event,
				attributes: {
					csid,
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
