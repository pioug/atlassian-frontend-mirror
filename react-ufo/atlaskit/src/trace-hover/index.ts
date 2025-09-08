import { default as internal_traceUFOInteraction } from '../trace-interaction/internal/trace-ufo-interaction';

function traceUFOHover(name: string, timestamp?: number): void {
	return internal_traceUFOInteraction(name, 'hover', timestamp);
}

export default traceUFOHover;
