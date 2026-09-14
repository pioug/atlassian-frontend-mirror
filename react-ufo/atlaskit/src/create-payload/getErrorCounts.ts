import type { InteractionMetrics } from '../common';
import { getGlobalErrorCount } from '../global-error-handler/get-global-error-count';

export function getErrorCounts(interaction: InteractionMetrics): any {
	return {
		'ufo:errors:globalCount': getGlobalErrorCount(),
		'ufo:errors:count': interaction.errors.length,
	};
}
