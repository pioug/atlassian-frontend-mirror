import type { InteractionMetrics } from '../../common';

import { findMatchingLegacyMetric } from './find-matching-legacy-metric';

/**
 * Calculate TTI (Time to Interactive) based on server-side logic
 * TTI is the time from interaction start to the end of the first matching legacy metric,
 * or falls back to apdex/UFO end time if no legacy metrics exist
 */
export function getTTI(
	interaction: InteractionMetrics,
	experienceName: string,
): number | undefined {
	const { start, end, apdex } = interaction;

	// Find matching legacy metric
	const matchingLegacyMetric = findMatchingLegacyMetric(interaction, experienceName);

	// Get end times in priority order (following server-side logic)
	const apdexEndTime = apdex?.[0]?.stopTime;
	const legacyMetricsEndTime = matchingLegacyMetric?.stop;
	const ufoEndTime = end;

	let ttiEndTime: number | undefined;

	if (matchingLegacyMetric && legacyMetricsEndTime) {
		// Use legacy metrics end time if we have a matching legacy metric
		ttiEndTime = legacyMetricsEndTime;
	} else if (apdexEndTime) {
		// Fall back to apdex end time if no matching legacy metrics
		ttiEndTime = apdexEndTime;
	} else {
		// Final fallback to UFO end time
		ttiEndTime = ufoEndTime;
	}

	return ttiEndTime ? Math.round(ttiEndTime - start) : undefined;
}
