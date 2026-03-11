import { useCallback, useContext, useRef } from 'react';

import {
	type AnalyticsEventPayload,
	AnalyticsReactContext,
	useAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../common/constants';
import { LIBRARY_ATTRIBUTE, type EventPayload } from '../common/types';
import { getAttributesFromContexts, getDefaultTrackEventConfig } from '../common/utils';

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
				library: LIBRARY_ATTRIBUTE,
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

	/**
	 * Fully-typed event tracking using discriminated union payload types.
	 * The payload type enforces correct action, actionSubject, and attributes.
	 */
	const trackAgentEvent = useCallback(
		(payload: EventPayload): void => {
			const { action, actionSubject, attributes, ...eventProps } = payload;

			fireAnalyticsEvent({
				actionSubject,
				action,
				...eventProps,
				attributes,
			});
		},
		[fireAnalyticsEvent],
	);

	return {
		trackAgentEvent,
	};
};
