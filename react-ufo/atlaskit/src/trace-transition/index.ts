import { useContext, useEffect } from 'react';

// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as createUUID } from 'uuid';

import coinflip from '../coinflip';
import {
	getDoNotAbortActivePressInteractionOnTransition,
	getInteractionRate,
	isUFOEnabled,
} from '../config';
import { getActiveTrace } from '../experience-trace-id-context';
import UFOInteractionIDContext, { DefaultInteractionID } from '../interaction-id-context';
import {
	abortAll,
	addNewInteraction,
	addOnCancelCallback,
	getActiveInteraction,
	tryComplete,
} from '../interaction-metrics';
import UFORouteName from '../route-name-context';

import { setInteractionActiveTrace } from './utils/set-interaction-active-trace';

function traceUFOTransition(
	ufoName: string | null | undefined,
	routeName: string | null | undefined = ufoName,
): void {
	// Skip if UFO is disabled (gated behind platform_ufo_enable_killswitch_config)
	if (!isUFOEnabled()) {
		return;
	}

	const pressInteractionsList = getDoNotAbortActivePressInteractionOnTransition();
	const interaction = getActiveInteraction();
	if (pressInteractionsList && interaction) {
		if (pressInteractionsList.includes(interaction.ufoName)) {
			return;
		}
	}
	abortAll('transition', ufoName ?? undefined);
	if (ufoName) {
		UFORouteName.current = ufoName;
		const rate = getInteractionRate(ufoName, 'transition');
		if (coinflip(rate)) {
			// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
			const newId: string = createUUID();

			setInteractionActiveTrace(newId);

			DefaultInteractionID.current = newId;
			addNewInteraction(
				newId,
				ufoName,
				'transition',
				performance.now(),
				rate,
				null,
				routeName,
				getActiveTrace(),
			);
		}
	}
}

export function useUFOTransitionCompleter(): void {
	const interactionId = useContext(UFOInteractionIDContext);
	const capturedInteractionId = interactionId.current;
	useEffect(() => {
		// If we have a current interaction set...
		if (capturedInteractionId != null) {
			let cancel = requestAnimationFrame(() => {
				cancel = requestAnimationFrame(() => {
					if (capturedInteractionId === interactionId.current) {
						tryComplete(capturedInteractionId);
					}
				});
			});

			addOnCancelCallback(capturedInteractionId, () => {
				cancelAnimationFrame(cancel);
			});
		}
	}, [capturedInteractionId, interactionId]);
}

export default traceUFOTransition;
