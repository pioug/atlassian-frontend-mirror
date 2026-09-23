/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::50049b97279bd4c80145082104cdbde5>>
 * @codegenCommand afm workspace @atlassian/analytics-tooling analytics:codegen link-datasource
 */
import { useCallback } from 'react';

import { useAnalyticsEvents as useAnalyticsNextEvents } from '@atlaskit/analytics-next/useAnalyticsEvents';

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
