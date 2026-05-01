/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::acff924d069eafb053d3209818c6810a>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen link-datasource
 */
import { useCallback } from 'react';

import { useAnalyticsEvents as useAnalyticsNextEvents } from '@atlaskit/analytics-next';

import { EVENT_CHANNEL } from '../constants';

import type { EventKey } from './analytics.types';
import createEventPayload from './create-event-payload';

type UseAnalyticsEventsFireFn = <K extends EventKey>(
	...params: Parameters<typeof createEventPayload<K>>
) => void;

export const useAnalyticsEvents = (): {
	fireEvent: UseAnalyticsEventsFireFn;
} => {
	const { createAnalyticsEvent } = useAnalyticsNextEvents();
	const fireEvent: UseAnalyticsEventsFireFn = useCallback(
		<K extends EventKey>(...params: Parameters<typeof createEventPayload<K>>) => {
			const event = createAnalyticsEvent(createEventPayload<K>(...params));
			event.fire(EVENT_CHANNEL);
		},
		[createAnalyticsEvent],
	);
	return {
		fireEvent: fireEvent,
	};
};
