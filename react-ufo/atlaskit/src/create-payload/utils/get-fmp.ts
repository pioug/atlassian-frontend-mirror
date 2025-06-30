import type { InteractionMetrics } from '../../common';
import { getConfig } from '../../config';

import { findMatchingLegacyMetric } from './find-matching-legacy-metric';

/**
 * Calculate FMP (First Meaningful Paint) based on interaction type and configuration
 * FMP is calculated based on legacy metrics or marks depending on interaction type and configuration
 */
export function getFMP(
	interaction: InteractionMetrics,
	experienceName: string,
): number | undefined {
	const { start, type, marks } = interaction;

	const config = getConfig();
	const ssrDoneTime = config?.ssr?.getSSRDoneTime?.();
	const isBM3ConfigSSRDoneAsFmp = interaction.metaData.__legacy__bm3ConfigSSRDoneAsFmp;
	const isUFOConfigSSRDoneAsFmp =
		interaction.metaData.__legacy__bm3ConfigSSRDoneAsFmp || !!config?.ssr?.getSSRDoneTime;

	// Find matching legacy metric
	const matchingLegacyMetric = findMatchingLegacyMetric(interaction, experienceName);

	let fmp: number | undefined;

	if (type === 'page_load' || type === 'transition') {
		if (interaction.legacyMetrics && matchingLegacyMetric) {
			// Check if legacy metric has FMP
			const legacyFmp = (matchingLegacyMetric as any).fmp; // BM3Event doesn't have fmp in types, but it might exist
			if (legacyFmp) {
				fmp = Math.round(legacyFmp - start);
			}
			// If no FMP in legacy metric, return undefined (don't calculate fallback)
		}
	}

	if (type === 'page_load' && fmp === undefined) {
		if (isBM3ConfigSSRDoneAsFmp || isUFOConfigSSRDoneAsFmp) {
			const foundMark = marks?.find((mark) => mark.name === 'fmp')?.time;
			if (foundMark) {
				fmp = Math.round(foundMark - start);
			} else if (ssrDoneTime) {
				fmp = Math.round(ssrDoneTime - start);
			}
			// If no FMP mark and no SSR done time, fmp remains undefined
		}
		// If not using SSR config, fmp remains undefined for page_load without legacy metrics
	}

	return fmp;
}
