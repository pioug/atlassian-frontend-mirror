import { useCallback, useContext, useRef } from 'react';

import { type AnalyticsEventPayload, AnalyticsReactContext, useAnalyticsEvents } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import { useRovoAgentCSID } from '../common/csid';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

type CommonAnalyticsAttributes = {
	touchPoint?: string;
} & Record<string, any>;

export enum AgentCreateActions {
	/* Start create flow when user clicks on "Create agent" button - https://data-portal.internal.atlassian.com/analytics/registry/97089 */
	START = 'createFlowStart',
	/* Skip natural language - https://data-portal.internal.atlassian.com/analytics/registry/97127 */
	SKIP_NL = 'createFlowSkipNL',
	/* Review natural language - https://data-portal.internal.atlassian.com/analytics/registry/97124 */
	REVIEW_NL = 'createFlowReviewNL',
	/* Activate agent - https://data-portal.internal.atlassian.com/analytics/registry/97123 */
	ACTIVATE = 'createFlowActivate',
	/* Restart create flow - https://data-portal.internal.atlassian.com/analytics/registry/97131 */
	RESTART = 'createFlowRestart',
	/* Error occurred - https://data-portal.internal.atlassian.com/analytics/registry/97132 */
	ERROR = 'createFlowError',
	/* Land in studio - https://data-portal.internal.atlassian.com/analytics/registry/97136 */
	LAND = 'createLandInStudio',
	/* Discard agent - https://data-portal.internal.atlassian.com/analytics/registry/97137 */
	DISCARD = 'createDiscard',
	/* Show no skills modal - https://data-portal.internal.atlassian.com/analytics/registry/97435 */
	SHOW_NO_SKILLS_MODAL = 'showNoSkillsModal',
	/* Browse click no skills modal - https://data-portal.internal.atlassian.com/analytics/registry/97436 */
	BROWSE_CLICK_NO_SKILLS_MODAL = 'browseClickNoSkillsModal',
	/* Discard no skills modal - https://data-portal.internal.atlassian.com/analytics/registry/97437 */
	DISCARD_NO_SKILLS_MODAL = 'discardNoSkillsModal',
}

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
		(action: Omit<AgentCreateActions, AgentCreateActions.START>, attributes?: CommonAnalyticsAttributes) => {
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
				action: AgentCreateActions.START,
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
				action: AgentCreateActions.ERROR,
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
