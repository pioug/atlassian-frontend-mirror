import { type EventKey } from '../analytics/generated/analytics.types';
import type createEventPayload from '../analytics/generated/create-event-payload';

export type AnalyticsFireEvent = <K extends EventKey>(
	...params: Parameters<typeof createEventPayload<K>>
) => void;
