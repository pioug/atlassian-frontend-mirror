import { default as internal_traceUFOInteraction } from '../trace-interaction/internal/trace-ufo-interaction';

function traceUFOPress(name: string, timestamp?: number): void {
	return internal_traceUFOInteraction(name, 'press', timestamp);
}

export default traceUFOPress;
