import type { UIEvent } from 'react';

import mapToInteractionType from './internal/map-to-interaction-type';
import internal_traceUFOInteraction from './internal/trace-ufo-interaction';

export { default as UNSAFE__DO_NOT_USE_traceUFOInteraction } from './internal/trace-ufo-interaction';
/**
 * *Warning* Currently this only supports the events with the following types
 * ```ts
 * 'click' | 'dblclick' | 'mousedown' | 'mouseenter' | 'mouseover'
 * ```
 */
function traceUFOInteraction(name: string, event: Event | UIEvent): void {
	if (!event || !event.isTrusted) {
		return;
	}
	const interactionType = mapToInteractionType(event.type);

	if (!interactionType) {
		// when interactionType is falsy we do not yet support this type of event. should we blow up with throwing error instead?
		return;
	}

	return internal_traceUFOInteraction(name, interactionType, event.timeStamp);
}

export default traceUFOInteraction;
