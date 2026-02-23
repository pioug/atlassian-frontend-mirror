import { useCallback, useContext, useRef } from 'react';

import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import type { BaseAgentAnalyticsAttributes, RemainingRequired } from '../common/types';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

import type { AgentToolActions, ToolsExecutionAttributes } from './tool-actions';

export enum AgentDebugActions {
	/* View debug modal - https://data-portal.internal.atlassian.com/analytics/registry/97183 */
	VIEW = 'debugView',
	/* Copy all debug data - https://data-portal.internal.atlassian.com/analytics/registry/97186 */
	COPY_ALL = 'debugCopyAll',
	/* Copy debug data - https://data-portal.internal.atlassian.com/analytics/registry/97184 */
	COPY = 'debugCopy',
	/* Toggle skill info - https://data-portal.internal.atlassian.com/analytics/registry/97185 */
	TOGGLE_SKILL_INFO = 'debugToggleSkillInfo',
}

export enum AgentCommonActions {
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

type EmptyAttributes = {};

type ActionAttributes = {
	/* Common agent actions attributes */
	[AgentCommonActions.VIEW]: BaseAgentAnalyticsAttributes;
	[AgentCommonActions.EDIT]: BaseAgentAnalyticsAttributes;
	[AgentCommonActions.UPDATED]: BaseAgentAnalyticsAttributes & { agentType: string; field: string };
	[AgentCommonActions.COPY_LINK]: BaseAgentAnalyticsAttributes;
	[AgentCommonActions.DELETE]: BaseAgentAnalyticsAttributes;
	[AgentCommonActions.DUPLICATE]: BaseAgentAnalyticsAttributes;
	[AgentCommonActions.STAR]: BaseAgentAnalyticsAttributes;
	[AgentCommonActions.CHAT]: BaseAgentAnalyticsAttributes;
	[AgentCommonActions.VERIFY]: BaseAgentAnalyticsAttributes;
	[AgentCommonActions.UNVERIFY]: BaseAgentAnalyticsAttributes;

	/* Debug modal actions attributes */
	[AgentDebugActions.COPY_ALL]: EmptyAttributes;
	[AgentDebugActions.COPY]: EmptyAttributes;
	[AgentDebugActions.TOGGLE_SKILL_INFO]: { toolId: string; isExpanded: boolean };
	[AgentDebugActions.VIEW]: EmptyAttributes;

	/* Tool actions attributes */
	[AgentToolActions.TOOLS_EXECUTION_CONFIRMED]: ToolsExecutionAttributes;
	[AgentToolActions.TOOLS_EXECUTION_STREAM_STOPPED]: ToolsExecutionAttributes;
	[AgentToolActions.TOOLS_EXECUTION_RESULT_VIEWED]: ToolsExecutionAttributes;
	[AgentToolActions.TOOLS_EXECUTION_RESULT_ERROR]: ToolsExecutionAttributes;
};

const globalEventConfig = getDefaultTrackEventConfig();

export const useRovoAgentActionAnalytics = <T extends {}>(commonAttributes: T) => {
	const analyticsContext = useContext(AnalyticsReactContext);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const commonAttributesRef = useRef(commonAttributes);

	const fireAnalyticsEvent = useCallback(
		(event: AnalyticsEventPayload) => {
			const attributes = {
				...getAttributesFromContexts(analyticsContext.getAtlaskitAnalyticsContext()),
				...commonAttributesRef.current,
				...event.attributes,
			};

			createAnalyticsEvent({
				...globalEventConfig,
				...event,
				attributes,
			}).fire(ANALYTICS_CHANNEL);
		},
		[createAnalyticsEvent, analyticsContext], // keep number of dependencies minimal to prevent re-rendering
	);

	const trackAgentAction = useCallback(
		<A extends keyof ActionAttributes>(
			action: A,
			attributes: RemainingRequired<ActionAttributes[A], T>,
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
		<A extends keyof ActionAttributes>(
			action: A,
			error: Error,
			attributes?: RemainingRequired<ActionAttributes[A], T>,
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
