import {
	type EventOrTimestamp,
	resolveInteractionTimestamp,
} from '../common/interaction-timestamp';
import { default as internal_traceUFOInteraction } from '../trace-interaction/internal/trace-ufo-interaction';

function traceUFOPress(name: string, eventOrTimestamp?: EventOrTimestamp): void {
	return internal_traceUFOInteraction(name, 'press', resolveInteractionTimestamp(eventOrTimestamp));
}

export default traceUFOPress;
