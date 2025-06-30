import type { BM3Event, InteractionMetrics } from '../../common';

/**
 * Find matching legacy metric by experience name and type
 */
export function findMatchingLegacyMetric(
	interaction: InteractionMetrics,
	experienceName: string,
): BM3Event | undefined {
	return interaction.legacyMetrics?.find(
		(metric) =>
			(metric.key === experienceName || metric.config.reactUFOName === experienceName) &&
			metric.type === 'PAGE_LOAD',
	);
}
