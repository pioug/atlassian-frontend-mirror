import { useCallback, useContext, useRef } from 'react';

import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import type { RemainingRequired } from '../common/types';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

import { AgentInteractionActions } from './groups/agent-interactions';
import { AgentDebugActions as AgentDebugActionsEnum } from './groups/debug';
import { AgentEditingActions } from './groups/editing';
import type { ActionAttributes } from './registry';
import { ACTION_TO_GROUP } from './registry';

// Backward-compatible aliases
// TODO: migrate consumers to use group-specific imports, then remove
export const AgentCommonActions = {
	...AgentInteractionActions,
	...AgentEditingActions,
} as const;

// TODO: Remove the alias, will be breaking change, this is just for backward compatibility
export const AgentDebugActions = AgentDebugActionsEnum;

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
				attributes: {
					...attributes,
					actionGroup: ACTION_TO_GROUP[action as string],
				},
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
					actionGroup: ACTION_TO_GROUP[action as string],
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
