import { useCallback } from 'react';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import { type AnalyticsEventPayload, useAnalyticsEvents } from '@atlaskit/analytics-next';

import { getDefaultTrackEventConfig } from '../common/utils';

export enum AgentActions {
	VIEW = 'view',
	EDIT = 'edit',
	UPDATED = 'updated',
	COPY = 'copy',
	DELETE = 'delete',
	DUPLICATE = 'duplicate',
	STAR = 'star',
}

type CommonAnalyticsAttributes = {
	touchPoint: string;
	agentId: string;
	scenarioId?: string;
	canEdit?: boolean;
	canDelete?: boolean;
};

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
		(action: AgentActions, attributes: CommonAnalyticsAttributes & Record<string, any>) => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgent',
				action,
				attributes,
			});
		},
		[fireAnalyticsEvent],
	);

	const trackAgentActionError = useCallback(
		(
			action: AgentActions,
			error: Error,
			attributes: CommonAnalyticsAttributes & Record<string, any>,
		) => {
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
