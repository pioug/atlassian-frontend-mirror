import type { InteractionMetrics } from '../common';

import { getEarliestLegacyStopTime } from './getEarliestLegacyStopTime';
import { getPageVisibilityUpToTTI } from './getPageVisibilityUpToTTI';
import { getVisibilityStateFromPerformance } from './utils/get-visibility-state-from-performance';

export function getMoreAccuratePageVisibilityUpToTTI(interaction: InteractionMetrics): any {
	const old = getPageVisibilityUpToTTI(interaction);
	const tti = getEarliestLegacyStopTime(interaction, []);
	if (!tti) {
		return old;
	}
	const buffered = getVisibilityStateFromPerformance(tti);
	if (!buffered) {
		return old;
	}
	if (buffered !== old) {
		return 'mixed';
	}
	return old;
}
