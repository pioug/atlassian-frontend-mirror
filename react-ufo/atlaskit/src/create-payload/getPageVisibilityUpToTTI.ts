import type { InteractionMetrics } from '../common';
import { getPageVisibilityState } from '../hidden-timing';
import type { LabelStack } from '../interaction-context';

import { getEarliestLegacyStopTime } from './getEarliestLegacyStopTime';

function getBm3EndTimeOrFallbackValue(
	interaction: InteractionMetrics,
	labelStack: LabelStack = [],
	fallbackValue = interaction.end,
) {
	if (interaction.type === 'press') {
		return fallbackValue;
	}

	return getEarliestLegacyStopTime(interaction, labelStack) ?? fallbackValue;
}

export function getPageVisibilityUpToTTI(interaction: InteractionMetrics): any {
	const { start } = interaction;
	const bm3EndTimeOrInteractionEndTime = getBm3EndTimeOrFallbackValue(interaction);
	return getPageVisibilityState(start, bm3EndTimeOrInteractionEndTime);
}
