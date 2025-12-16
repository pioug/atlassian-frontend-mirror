import { useCallback, useContext } from 'react';

import { FabricChannel } from '@atlaskit/analytics-listeners';
import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import type { RemainingRequired } from '../common/types';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

export enum AgentActions {
	/* View agent clicked */
	VIEW = 'view',
	/* Edit agent clicked */
	EDIT = 'edit',
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
	touchPoint: string;
	agentId: string;
};

export const ANALYTICS_CHANNEL = FabricChannel.aiMate;

export const useRovoAgentActionAnalytics = <T extends Partial<CommonAnalyticsAttributes>>(
	commonAttributes: T,
) => {
	const analyticsContext = useContext(AnalyticsReactContext);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const eventConfig = getDefaultTrackEventConfig();

	const fireAnalyticsEvent = useCallback(
		(event: AnalyticsEventPayload) => {
			const attributes = {
				...getAttributesFromContexts(analyticsContext.getAtlaskitAnalyticsContext()),
				...commonAttributes,
				...event.attributes,
			};

			createAnalyticsEvent({
				...eventConfig,
				...event,
				attributes,
			}).fire(ANALYTICS_CHANNEL);
		},
		[createAnalyticsEvent, eventConfig, commonAttributes, analyticsContext],
	);

	const trackAgentAction = useCallback(
		(
			action: AgentActions,
			attributes: RemainingRequired<CommonAnalyticsAttributes, T> & Record<string, any>,
		) => {
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
			attributes?: RemainingRequired<CommonAnalyticsAttributes, T> & Record<string, any>,
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
