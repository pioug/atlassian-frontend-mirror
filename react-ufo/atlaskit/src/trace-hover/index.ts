import {
	type EventOrTimestamp,
	resolveInteractionTimestamp,
} from '../common/interaction-timestamp';
import { default as internal_traceUFOInteraction } from '../trace-interaction/internal/trace-ufo-interaction';

function traceUFOHover(name: string, eventOrTimestamp?: EventOrTimestamp): void {
	return internal_traceUFOInteraction(name, 'hover', resolveInteractionTimestamp(eventOrTimestamp));
}

export default traceUFOHover;
