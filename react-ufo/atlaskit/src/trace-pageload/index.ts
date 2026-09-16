/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
// eslint-disable-next-line @atlaskit/platform/prefer-crypto-random-uuid -- Preserves the existing UUID implementation.
import { v4 as createUUID } from 'uuid';

import coinflip from '../coinflip';
import { getInteractionRate, isUFOEnabled } from '../config';
import { getActiveTrace } from '../experience-trace-id-context/get-active-trace';
import DefaultInteractionID from '../interaction-id-context/defaultInteractionId';
import {
	abort,
	addHoldByID,
	addNewInteraction,
	getActiveInteraction,
	removeHoldByID,
	updatePageLoadInteractionName,
} from '../interaction-metrics';
import UFORouteName from '../route-name-context';

export const AWAITING_PAGELOAD_NAME: any = 'awaiting_pageload_name';

function traceUFOPageLoad(
	ufoName?: string | null | undefined,
	routeName: string | null | undefined = ufoName,
): void {
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

/**
 * @deprecated Use `import { updatePageloadName } from '@atlaskit/react-ufo/update-pageload-name'` instead.
 */
export { updatePageloadName } from './updatePageloadName';
