import { useCallback, useContext, useRef } from 'react';

import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import { useRovoAgentCSID } from '../common/csid';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

const DefaultActionSubject = 'rovoAgent';

/**
 * Union type of all valid create agent flow actions.
 * Includes both CreateFlow and AddToolsPrompt actions.
 *
 * Data portal registry links:
 * - createFlowStart: https://data-portal.internal.atlassian.com/analytics/registry/97089
 * - createFlowSkipNL: https://data-portal.internal.atlassian.com/analytics/registry/97127
 * - createFlowReviewNL: https://data-portal.internal.atlassian.com/analytics/registry/97124
 * - createFlowActivate: https://data-portal.internal.atlassian.com/analytics/registry/97123
 * - createFlowRestart: https://data-portal.internal.atlassian.com/analytics/registry/97131
 * - createFlowError: https://data-portal.internal.atlassian.com/analytics/registry/97132
 * - createLandInStudio: https://data-portal.internal.atlassian.com/analytics/registry/97136
 * - createDiscard: https://data-portal.internal.atlassian.com/analytics/registry/97137
 * - saDraft: https://data-portal.internal.atlassian.com/analytics/registry/97924
 * - addToolsPromptShown: https://data-portal.internal.atlassian.com/analytics/registry/98106
 * - addToolsPromptBrowse: https://data-portal.internal.atlassian.com/analytics/registry/98107
 * - addToolsPromptDismiss: https://data-portal.internal.atlassian.com/analytics/registry/98108
 */
type AgentCreateAction =
	// CreateFlow actions
	| 'createFlowStart'
	| 'createFlowSkipNL'
	| 'createFlowReviewNL'
	| 'createFlowActivate'
	| 'createFlowRestart'
	| 'createFlowError'
	| 'createLandInStudio'
	| 'createDiscard'
	| 'saDraft'
	// AddToolsPrompt actions
	| 'addToolsPromptShown'
	| 'addToolsPromptBrowse'
	| 'addToolsPromptDismiss';

type CommonAnalyticsAttributes = {
	touchPoint?: string;
} & Record<string, any>;

const globalEventConfig = getDefaultTrackEventConfig();

export const useRovoAgentCreateAnalytics = (commonAttributes: CommonAnalyticsAttributes) => {
	const [csid, { refresh: refreshCSID }] = useRovoAgentCSID();

	const analyticsContext = useContext(AnalyticsReactContext);
	const { createAnalyticsEvent } = useAnalyticsEvents();
	const commonAttributesRef = useRef(commonAttributes);

	const fireAnalyticsEvent = useCallback(
		(event: AnalyticsEventPayload) => {
			const referrer = typeof window !== 'undefined' ? window.document.referrer : 'unknown';
			const attributes = {
				...getAttributesFromContexts(analyticsContext.getAtlaskitAnalyticsContext()),
				...commonAttributesRef.current,
				...event.attributes,
				actionGroup: 'createFlow',
				csid,
				referrer,
			};

			createAnalyticsEvent({
				...globalEventConfig,
				...event,
				attributes,
			}).fire(ANALYTICS_CHANNEL);
		},
		[createAnalyticsEvent, csid, analyticsContext], // keep number of dependencies minimal to prevent re-rendering
	);

	/**
	 * This will fire analytics event for intermediate steps in the create agent flow funnel
	 * To start the create agent flow, use trackCreateSessionStart
	 */
	const trackCreateSession = useCallback(
		(action: AgentCreateAction, attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: DefaultActionSubject,
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
				actionSubject: DefaultActionSubject,
				action: 'createFlowStart',
				attributes,
			});
			refreshCSID();
		},
		[fireAnalyticsEvent, refreshCSID],
	);

	const trackCreateSessionError = useCallback(
		(error: Error, attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: DefaultActionSubject,
				action: 'createFlowError',
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
			refreshCSID,
		},
	] as const;
};
