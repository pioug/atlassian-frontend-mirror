import type { UIEvent } from 'react';

import { v4 as createUUID } from 'uuid';

import coinflip from '../coinflip';
import { getDoNotAbortActivePressInteraction, getInteractionRate } from '../config';
import { DefaultInteractionID } from '../interaction-id-context';
import { abortAll, addNewInteraction, getActiveInteraction } from '../interaction-metrics';
import UFORouteName from '../route-name-context';
import { withProfiling } from '../self-measurements';

const mapToInteractionType = withProfiling(function mapToInteractionType(eventType: string) {
	if (eventType === 'click' || eventType === 'dblclick' || eventType === 'mousedown') {
		return 'press';
	}
	if (eventType === 'mouseenter' || eventType === 'mouseover') {
		return 'hover';
	}
	return undefined;
});

const traceUFOInteraction = withProfiling(function traceUFOInteraction(
	name: string,
	event: UIEvent,
): void {
	if (!event || !event.isTrusted) {
		return;
	}
	const interactionType = mapToInteractionType(event.type);

	if (!interactionType) {
		// when interactionType is falsy we do not yet support this type of event. should we blow up with throwing error instead?
		return;
	}

	const rate = getInteractionRate(name, interactionType);
	const pressInteractionsList = getDoNotAbortActivePressInteraction();
	if (pressInteractionsList?.includes(name)) {
		const interaction = getActiveInteraction();
		if (interaction?.ufoName !== 'unknown' && interaction?.type === 'press') {
			return;
		}
	}
	if (coinflip(rate)) {
		abortAll('new_interaction', name);
		const startTimestamp = event.timeStamp ?? performance.now();
		const newId = createUUID();
		DefaultInteractionID.current = newId;
		addNewInteraction(newId, name, 'press', startTimestamp, rate, [], UFORouteName.current);
	}
});

export default traceUFOInteraction;
