import type { BM3Event, InteractionMetrics } from '../common';
import { getBm3Timings } from '../custom-timings/getBm3Timings';

function getBM3SubmetricsTimings(submetrics?: BM3Event[]) {
	if (!submetrics) {
		return null;
	}
	const submetricsTimings: any = submetrics
		.filter((item) => {
			return typeof item.stop === 'number' && !!item.key && typeof item.start === 'number';
		})
		.map((item) => {
			let childSubmetrics;
			const newKey = `include/${item.key}`;
			if (item.submetrics) {
				childSubmetrics = getBM3SubmetricsTimings(item.submetrics);
			}
			return {
				[newKey]: {
					endTime: item.stop! - item.start!,
					startTime: item.start!,
				},
				...(childSubmetrics ? childSubmetrics : {}),
			};
		});

	return submetricsTimings;
}

export function getBm3TrackerTimings(interaction: InteractionMetrics): any {
	const interactionLegacyMetrics = interaction.legacyMetrics;
	if (!interactionLegacyMetrics) {
		return {};
	}
	const legacyMetrics = interactionLegacyMetrics
		.map((item) => {
			return {
				key: item.key,
				startTime: item.start,
				stopTime: item.stop,
				type: item.config?.type,
				reactUFOName: item.config?.reactUFOName,
				fmp: item.marks?.['fmp'] || item.stop,
				source: 'bm3',
				timings: getBm3Timings(item.marks, item.config.timings),
				submetrics: getBM3SubmetricsTimings(item.submetrics),
				pageVisibleState: item.pageVisibleState,
			};
		})
		.filter((item) => !!item.type);
	return { legacyMetrics };
}
