import {
	type EventOrTimestamp,
	resolveInteractionTimestamp,
} from '../common/interaction-timestamp';
import type { CustomData } from '../interaction-metrics';
import { default as internal_traceUFOInteraction } from '../trace-interaction/internal/trace-ufo-interaction';

function traceUFOPress(
	name: string,
	eventOrTimestamp?: EventOrTimestamp,
	options?: { customData?: CustomData },
): void {
	return internal_traceUFOInteraction(
		name,
		'press',
		resolveInteractionTimestamp(eventOrTimestamp),
		options?.customData,
	);
}

export default traceUFOPress;
