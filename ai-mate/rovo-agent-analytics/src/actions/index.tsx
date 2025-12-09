import { useCallback } from 'react';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';

import { getDefaultTrackEventConfig } from '../common/utils';

export enum AgentActions {
	/* View agent clicked */
	VIEW = 'view',
	/* Edit agent clicked */
	EDIT = 'edit',
	/* Create agent clicked */
	CREATE = 'create',
	/* Agent updated */
	UPDATED = 'updated',
	/* Copy link clicked */
	COPY_LINK = 'copyLink',
	/* Delete agent clicked */
	DELETE = 'delete',
	/* Duplicate agent clicked */
	DUPLICATE = 'duplicate',
	/* Star agent clicked */
	STAR = 'star',
	/* Chat with agent clicked */
	CHAT = 'chat',
}

type CommonAnalyticsAttributes = {
	touchPoint?: string;
	agentId?: string;
	scenarioId?: string;
	canEdit?: boolean;
	canDelete?: boolean;
} & Record<string, any>;

export const ANALYTICS_CHANNEL = FabricChannel.aiMate;

export const useRovoAgentActionAnalytics = (commonAttributes: CommonAnalyticsAttributes) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const eventConfig = getDefaultTrackEventConfig();

	const fireAnalyticsEvent = useCallback(
		(event: AnalyticsEventPayload) => {
			createAnalyticsEvent({
				...eventConfig,
				...event,
				attributes: {
					...commonAttributes,
					...event.attributes,
				},
			}).fire(ANALYTICS_CHANNEL);
		},
		[createAnalyticsEvent, eventConfig, commonAttributes],
	);

	const trackAgentAction = useCallback(
		(action: AgentActions, attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgent',
				action,
				attributes,
			});
		},
		[fireAnalyticsEvent],
	);

	const trackAgentActionError = useCallback(
		(action: AgentActions, error: Error, attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgentError',
				action,
				attributes: {
					...attributes,
					error: {
						message: error.message,
					},
				},
			});
		},
		[fireAnalyticsEvent],
	);

	return {
		trackAgentAction,
		trackAgentActionError,
	};
};
