/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Preserves the existing UUID implementation.
import { v4 as createUUID } from 'uuid';

import coinflip from '../coinflip';
import {
	getDoNotAbortActivePressInteractionOnTransition,
	getInteractionRate,
	isUFOEnabled,
} from '../config';
import { getActiveTrace } from '../experience-trace-id-context/get-active-trace';
import { DefaultInteractionID } from '../interaction-id-context';
import { abortAll, addNewInteraction, getActiveInteraction } from '../interaction-metrics';
import UFORouteName from '../route-name-context';

import { setInteractionActiveTrace } from './utils/set-interaction-active-trace';

function traceUFOTransition(
	ufoName: string | null | undefined,
	routeName: string | null | undefined = ufoName,
	preloadKey?: string,
): void {
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
				preloadKey,
			);
		}
	}
}

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export default traceUFOTransition;

/**
 * @deprecated Use `import { useUFOTransitionCompleter } from '@atlaskit/react-ufo/use-ufo-transition-completer'` instead.
 */
export { useUFOTransitionCompleter } from './useUFOTransitionCompleter';
