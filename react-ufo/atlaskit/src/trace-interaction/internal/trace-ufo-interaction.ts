import { v4 as createUUID } from 'uuid';

import { fg } from '@atlaskit/platform-feature-flags';

import coinflip from '../../coinflip';
import { getDoNotAbortActivePressInteraction, getInteractionRate } from '../../config';
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
	if (pressInteractionsList?.includes(name)) {
		const interaction = getActiveInteraction();
		if (interaction?.ufoName !== 'unknown' && interaction?.type === 'press') {
			return;
		}
	} else {
		if (fg('platform_ufo_abort_measurement_fix')) {
			// abort any existing interaction regardless if the next interaction's coinflip returns true or false
			abortAll('new_interaction', name);
		}
	}
	if (coinflip(rate)) {
		if (!fg('platform_ufo_abort_measurement_fix')) {
			abortAll('new_interaction', name);
		}
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
