import { useCallback, useContext, useRef } from 'react';

import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import type { AddToolsPromptEventPayload } from '../actions/groups/add-tools-prompt';
import type { CreateFlowEventPayload } from '../actions/groups/create-flow';
import { ANALYTICS_CHANNEL } from '../common/constants';
import { useRovoAgentCSID } from '../common/csid';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

const DefaultActionSubject = 'rovoAgent';

/**
 * Union of all valid actions for the create agent analytics hook.
 * Derived from the event payload types in the action group files.
 * To add a new action, update the payload type in the relevant group file.
 */
type AgentCreateAction = CreateFlowEventPayload['action'] | AddToolsPromptEventPayload['action'];

type CommonAnalyticsAttributes = {
	touchPoint?: string;
} & Record<string, any>;

const globalEventConfig = getDefaultTrackEventConfig();

export const useRovoAgentCreateAnalytics = (
	commonAttributes: CommonAnalyticsAttributes,
): readonly [
	string | null,
	{
		readonly trackCreateSession: (
			action: AgentCreateAction,
			attributes?: CommonAnalyticsAttributes,
		) => void;
		readonly trackCreateSessionStart: (attributes?: CommonAnalyticsAttributes) => void;
		readonly trackCreateSessionError: (
			error: Error,
			attributes?: CommonAnalyticsAttributes,
		) => void;
		readonly refreshCSID: () => string;
	},
] => {
	const [{ csid, globalCSID }, { refresh: refreshCSID }] = useRovoAgentCSID();
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
				referrer,
			};

			createAnalyticsEvent({
				...globalEventConfig,
				...event,
				attributes,
			}).fire(ANALYTICS_CHANNEL);
		},
		[createAnalyticsEvent, analyticsContext], // keep number of dependencies minimal to prevent re-rendering
	);

	/**
	 * Fires an analytics event for a step in the create agent flow funnel.
	 * Uses the CSID from the URL query parameter.
	 */
	const trackCreateSession = useCallback(
		(action: AgentCreateAction, attributes?: CommonAnalyticsAttributes) => {
			fireAnalyticsEvent({
				actionSubject: DefaultActionSubject,
				action,
				attributes: { csid: globalCSID, ...attributes },
			});
		},
		[fireAnalyticsEvent, globalCSID],
	);

	/**
	 * Fires `createFlowStart` with the current CSID (matching the href),
	 * then refreshes the CSID for the next session.
	 * The component re-renders with the new CSID, updating any href attributes.
	 */
	const trackCreateSessionStart = useCallback(
		(attributes?: CommonAnalyticsAttributes): void => {
			fireAnalyticsEvent({
				actionSubject: DefaultActionSubject,
				action: 'createFlowStart',
				attributes: { csid, ...attributes },
			});
			refreshCSID();
		},
		[fireAnalyticsEvent, refreshCSID, csid],
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
					csid: globalCSID,
					...attributes,
				},
			});
		},
		[fireAnalyticsEvent, globalCSID],
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
