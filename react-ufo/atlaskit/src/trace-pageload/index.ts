// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
import { v4 as createUUID } from 'uuid';

import coinflip from '../coinflip';
import { getInteractionRate, isUFOEnabled } from '../config';
import { getActiveTrace } from '../experience-trace-id-context';
import { DefaultInteractionID } from '../interaction-id-context';
import {
	abort,
	addHoldByID,
	addNewInteraction,
	getActiveInteraction,
	removeHoldByID,
	updatePageLoadInteractionName,
} from '../interaction-metrics';
import UFORouteName from '../route-name-context';

const AWAITING_PAGELOAD_NAME = 'awaiting_pageload_name';

function traceUFOPageLoad(
	ufoName?: string | null | undefined,
	routeName: string | null | undefined = ufoName,
): void {
	// Skip if UFO is disabled (gated behind platform_ufo_enable_killswitch_config)
	if (!isUFOEnabled()) {
		return;
	}

	const activeInteraction = getActiveInteraction();
	if (activeInteraction && !ufoName) {
		return;
	}
	UFORouteName.current = routeName || null;
	const rate = ufoName ? getInteractionRate(ufoName, 'page_load') : 1;
	const enabledBySamplingRate = coinflip(rate);
	if (enabledBySamplingRate && !activeInteraction) {
		// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Use crypto.randomUUID instead
		const newId: string = createUUID();
		DefaultInteractionID.current = newId;
		addNewInteraction(
			newId,
			ufoName || '',
			'page_load',
			0,
			rate,
			null,
			routeName,
			getActiveTrace(),
		);
		if (!ufoName) {
			// if no name is provided we add a hold to the interaction, it is removed if the name is provided while the interaction is holding
			addHoldByID(newId, [], AWAITING_PAGELOAD_NAME, AWAITING_PAGELOAD_NAME, true);
		}
	} else if (
		!enabledBySamplingRate &&
		activeInteraction &&
		activeInteraction.type === 'page_load'
	) {
		// if there is an active interaction it will be aborted without initialising a new one because the coinflip returned false
		abort(activeInteraction.id, 'excluded_by_sampling');
	} else if (
		ufoName &&
		activeInteraction &&
		!activeInteraction.ufoName &&
		activeInteraction.type === 'page_load'
	) {
		updatePageLoadInteractionName(ufoName, routeName);
		removeHoldByID(activeInteraction.id, AWAITING_PAGELOAD_NAME);
	}
}

export default traceUFOPageLoad;

export function updatePageloadName(
	ufoName: string,
	routeName: string | null | undefined = ufoName,
): void {
	// Skip if UFO is disabled (gated behind platform_ufo_enable_killswitch_config)
	if (!isUFOEnabled()) {
		return;
	}

	const interaction = getActiveInteraction();
	if (!interaction || (interaction.type !== 'page_load' && interaction.type !== 'transition')) {
		return;
	}
	if (ufoName) {
		const rate = getInteractionRate(ufoName, 'page_load');
		updatePageLoadInteractionName(ufoName, routeName);
		if (coinflip(rate)) {
			UFORouteName.current = ufoName;
		} else {
			abort(interaction.id, 'excluded_by_sampling');
		}
	}
	removeHoldByID(interaction.id, AWAITING_PAGELOAD_NAME);
}
