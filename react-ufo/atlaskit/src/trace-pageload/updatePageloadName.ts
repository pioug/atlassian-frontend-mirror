import coinflip from '../coinflip';
import { getInteractionRate, isUFOEnabled } from '../config';
import {
	abort,
	getActiveInteraction,
	removeHoldByID,
	updatePageLoadInteractionName,
} from '../interaction-metrics';
import UFORouteName from '../route-name-context';

import { AWAITING_PAGELOAD_NAME } from './index';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function updatePageloadName(
	ufoName: string,
	routeName: string | null | undefined = ufoName,
): void {
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
