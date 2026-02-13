import { useCallback, useContext, useMemo } from 'react';

import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import type { RemainingRequired } from '../common/types';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

export enum AgentActions {
	/* View agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97125 */
	VIEW = 'view',
	/* Edit agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97126 */
	EDIT = 'edit',
	/* Agent updated - https://data-portal.internal.atlassian.com/analytics/registry/97122 */
	UPDATED = 'updated',
	/* Copy link clicked - https://data-portal.internal.atlassian.com/analytics/registry/97128 */
	COPY_LINK = 'copyLink',
	/* Delete agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97129 */
	DELETE = 'delete',
	/* Duplicate agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97130 */
	DUPLICATE = 'duplicate',
	/* Star agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97133 */
	STAR = 'star',
	/* Chat with agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97095 */
	CHAT = 'chat',
	/* Verify agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97134 */
	VERIFY = 'verify',
	/* Unverify agent clicked - https://data-portal.internal.atlassian.com/analytics/registry/97135 */
	UNVERIFY = 'unverify',
}

type CommonAnalyticsAttributes = {
	touchPoint: string;
	agentId: string;
};

export const useRovoAgentActionAnalytics = <T extends Partial<CommonAnalyticsAttributes>>(
	commonAttributes: T,
) => {
	const analyticsContext = useContext(AnalyticsReactContext);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const eventConfig = useMemo(() => getDefaultTrackEventConfig(), []);

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
		): void => {
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
		): void => {
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
