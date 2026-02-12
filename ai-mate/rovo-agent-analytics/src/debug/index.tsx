import { useCallback, useContext, useMemo } from 'react';

import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import type { RemainingRequired } from '../common/types';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

export enum AgentDebugActions {
	/* View debug modal */
	VIEW = 'debugView',
	/* Copy all debug data */
	COPY_ALL = 'debugCopyAll',
	/* Copy debug data */
	COPY = 'debugCopy',
	/* Toggle skill info */
	TOGGLE_SKILL_INFO = 'debugToggleSkillInfo',
	/* Error occurred */
	ERROR = 'debugError',
}

type CommonAnalyticsAttributes = {
	agentId: string;
};

export const useRovoAgentDebugAnalytics = <T extends Partial<CommonAnalyticsAttributes>>(
	commonAttributes?: T,
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

	const trackAgentDebug = useCallback(
		(
			action: AgentDebugActions,
			attributes?: RemainingRequired<CommonAnalyticsAttributes, T extends undefined ? {} : T> &
				Record<string, any>,
		): void => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgent',
				action,
				attributes,
			});
		},
		[fireAnalyticsEvent],
	);

	const trackAgentDebugError = useCallback(
		(
			action: AgentDebugActions,
			error?: Error,
			attributes?: RemainingRequired<CommonAnalyticsAttributes, T extends undefined ? {} : T> &
				Record<string, any>,
		): void => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgentError',
				action,
				attributes: {
					...attributes,
					...(error && {
						error: {
							message: error.message,
						},
					}),
				},
			});
		},
		[fireAnalyticsEvent],
	);

	return {
		trackAgentDebug,
		trackAgentDebugError,
	};
};
