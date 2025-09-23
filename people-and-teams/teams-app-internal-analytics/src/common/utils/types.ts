import type { EventKey } from './generated/analytics.types';
import type createEventPayload from './generated/create-event-payload';

export type FireEventType = <K extends EventKey>(
	...params: Parameters<typeof createEventPayload<K>>
) => void;
