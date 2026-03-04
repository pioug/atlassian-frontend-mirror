import { useCallback, useContext, useRef } from 'react';

import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { AddToolsPromptActions } from '../actions/groups/add-tools-prompt';
import { CreateFlowActions } from '../actions/groups/create-flow';
import { ACTION_TO_GROUP } from '../actions/registry';
import { ANALYTICS_CHANNEL } from '../common/constants';
import { useRovoAgentCSID } from '../common/csid';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

// Backward-compatible alias
// TODO: migrate consumers to use CreateFlowActions / AddToolsPromptActions directly, then remove
export const AgentCreateActions = {
	...CreateFlowActions,
	...AddToolsPromptActions,
} as const;

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
			const action = event.action as string;
			const attributes = {
				...getAttributesFromContexts(analyticsContext.getAtlaskitAnalyticsContext()),
				...commonAttributesRef.current,
				...event.attributes,
				actionGroup: ACTION_TO_GROUP[action],
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
		(
			action: (typeof AgentCreateActions)[keyof typeof AgentCreateActions],
			attributes?: CommonAnalyticsAttributes,
		) => {
			fireAnalyticsEvent({
				actionSubject: 'rovoAgent',
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
				actionSubject: 'rovoAgent',
				action: CreateFlowActions.START,
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
				action: CreateFlowActions.ERROR,
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
