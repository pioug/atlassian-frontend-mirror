import type { InteractionMetrics } from '../../common';

import getPageVisibilityUpToTTAI from './get-page-visibility-up-to-ttai';
import { getVisibilityStateFromPerformance } from './get-visibility-state-from-performance';

export function getMoreAccuratePageVisibilityUpToTTAI(interaction: InteractionMetrics) {
	const old = getPageVisibilityUpToTTAI(interaction);
	const buffered = getVisibilityStateFromPerformance(interaction.end);
	if (!buffered) {
		return old;
	}
	if (buffered !== old) {
		return 'mixed';
	}
	return old;
}
