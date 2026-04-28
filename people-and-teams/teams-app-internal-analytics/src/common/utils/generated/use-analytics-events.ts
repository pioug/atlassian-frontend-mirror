/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::d01fef63886f2825ffbc3a0ec1ca7534>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen teams-app-internal-analytics
 */
import { useCallback } from 'react';

import { useAnalyticsEvents as useAnalyticsNextEvents } from '@atlaskit/analytics-next';

import { EVENT_CHANNEL } from '../constants';

import type { EventKey } from './analytics.types';
import createEventPayload, { type EventPayloadAttributes } from './create-event-payload';

type FireEventFn = <K extends EventKey>(
	eventKey: K,
	...params: EventPayloadAttributes<K>
) => void;

export const useAnalyticsEvents = (): { fireEvent: FireEventFn } => {
	const { createAnalyticsEvent } = useAnalyticsNextEvents();
	const fireEvent = useCallback(
		<K extends EventKey>(...params: Parameters<typeof createEventPayload<K>>): void => {
			const event = createAnalyticsEvent(createEventPayload<K>(...params));
			event.fire(EVENT_CHANNEL);
		},
		[createAnalyticsEvent],
	) as FireEventFn;
	return {
		fireEvent,
	};
};
