import { v4 as createUUID } from 'uuid';

import coinflip from '../coinflip';
import { getDoNotAbortActivePressInteraction, getInteractionRate } from '../config';
import { getActiveTrace, setInteractionActiveTrace } from '../experience-trace-id-context';
import { DefaultInteractionID } from '../interaction-id-context';
import { abortAll, addNewInteraction, getActiveInteraction } from '../interaction-metrics';
import UFORouteName from '../route-name-context';
import { withProfiling } from '../self-measurements';

const traceUFOPress = withProfiling(function traceUFOPress(name: string, timestamp?: number): void {
	const rate = getInteractionRate(name, 'press');
	const pressInteractionsList = getDoNotAbortActivePressInteraction();
	if (pressInteractionsList?.includes(name)) {
		const interaction = getActiveInteraction();
		if (interaction?.ufoName !== 'unknown' && interaction?.type === 'press') {
			return;
		}
	}
	if (coinflip(rate)) {
		abortAll('new_interaction', name);
		const startTimestamp = timestamp ?? performance.now();
		const newId = createUUID();
		// covered experiences with tracing instrumentation:
		// inline-result.inline-card-create-submit
		setInteractionActiveTrace(newId, 'press');
		DefaultInteractionID.current = newId;
		addNewInteraction(
			newId,
			name,
			'press',
			startTimestamp,
			rate,
			[],
			UFORouteName.current,
			getActiveTrace(),
		);
	}
});

export default traceUFOPress;
