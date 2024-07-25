/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Generates Typescript types for analytics events from analytics.spec.yaml
 *
 * @codegen <<SignedSource::3fdfbbdbdb062babb9a2ab4e53454d79>>
 * @codegenCommand yarn workspace @atlassian/analytics-tooling run analytics:codegen smart-card
 */
import { useCallback } from 'react';

import { useAnalyticsEvents as useAnalyticsNextEvents } from '@atlaskit/analytics-next';

import { EVENT_CHANNEL } from '../constants';

import { type EventKey } from './analytics.types';
import createEventPayload from './create-event-payload';

export const useAnalyticsEvents = () => {
	const { createAnalyticsEvent } = useAnalyticsNextEvents();
	const fireEvent = useCallback(
		<K extends EventKey>(...params: Parameters<typeof createEventPayload<K>>) => {
			const event = createAnalyticsEvent(createEventPayload<K>(...params));
			event.fire(EVENT_CHANNEL);
		},
		[createAnalyticsEvent],
	);
	return {
		fireEvent,
	};
};
