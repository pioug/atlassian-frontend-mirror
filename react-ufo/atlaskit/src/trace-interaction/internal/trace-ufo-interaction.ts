import { v4 as createUUID } from 'uuid';

import coinflip from '../../coinflip';
import {
	getDoNotAbortActivePressInteraction,
	getInteractionRate,
	getMinorInteractions,
} from '../../config';
import { getActiveTrace, setInteractionActiveTrace } from '../../experience-trace-id-context';
import { DefaultInteractionID } from '../../interaction-id-context';
import { abortAll, addNewInteraction, getActiveInteraction } from '../../interaction-metrics';
import UFORouteName from '../../route-name-context';

type InteractionType = 'press' | 'typing' | 'hover';

function traceUFOInteraction(
	name: string,
	interactionType: InteractionType,
	startTime?: DOMHighResTimeStamp,
): void {
	const rate = getInteractionRate(name, interactionType);
	const pressInteractionsList = getDoNotAbortActivePressInteraction();

	const minorInteractions = (pressInteractionsList ?? []).concat(getMinorInteractions() ?? []);
	if (minorInteractions.includes(name)) {
		const activeInteraction = getActiveInteraction();
		activeInteraction?.minorInteractions?.push({
			name,
			startTime: startTime ?? performance.now(),
		});
		return;
	} else {
		abortAll('new_interaction', name);
	}

	if (coinflip(rate)) {
		const startTimestamp = startTime ?? performance.now();
		const newId = createUUID();
		DefaultInteractionID.current = newId;

		// covered experiences with tracing instrumentation:
		// inline-result.inline-card-create-submit
		setInteractionActiveTrace(newId, interactionType);

		addNewInteraction(
			newId,
			name,
			interactionType === 'hover' ? 'press' : interactionType, // TODO add dedicated type for hover, might change backend though
			startTimestamp,
			rate,
			[],
			UFORouteName.current,
			getActiveTrace(),
		);
	}
}

export default traceUFOInteraction;
