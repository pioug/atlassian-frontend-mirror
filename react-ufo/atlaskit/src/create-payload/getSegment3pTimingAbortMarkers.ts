import type { InteractionMetrics } from '../common';

export function getSegment3pTimingAbortMarkers(
	segment3pTimings: InteractionMetrics['segment3pTimings'],
): {
	segment3pTimingAborts?: Array<{ segmentId: string; data: Record<string, unknown> }>;
} {
	if (!segment3pTimings) {
		return {};
	}
	const aborts: Array<{ segmentId: string; data: Record<string, unknown> }> = [];
	for (const [segmentId, entries] of Object.entries(segment3pTimings)) {
		for (const entry of entries) {
			if (entry.label === 'segment-timing-abort') {
				aborts.push({ segmentId, data: entry.data });
			}
		}
	}
	return aborts.length > 0 ? { segment3pTimingAborts: aborts } : {};
}
