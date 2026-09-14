import type { InteractionMetrics, Segment3pData, Segment3pTimingEntry } from '../../common';

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function buildSegment3pData(
	segment3pTimings: InteractionMetrics['segment3pTimings'],
	segmentExtraData: InteractionMetrics['segmentExtraData'],
): Segment3pData | undefined {
	if (!segment3pTimings || !segmentExtraData) {
		return undefined;
	}
	const seen = new Set<string>();
	const result: Segment3pData = {};

	for (const [segmentId, entries] of Object.entries(segment3pTimings)) {
		const meta = segmentExtraData[segmentId];
		if (!meta) {
			// Skip segments with no extra data — they shouldn't be in the payload.
			continue;
		}
		const timings: Segment3pTimingEntry[] = [];
		for (const entry of entries) {
			if (entry.label === 'segment-timing-abort') {
				// Abort markers are always emitted separately.
				continue;
			}
			const key = `${segmentId}:${entry.label}:${JSON.stringify(entry.data)}`;
			if (seen.has(key)) {
				continue;
			}
			seen.add(key);
			timings.push({ label: entry.label, data: entry.data });
		}
		if (timings.length > 0) {
			result[segmentId] = { meta, timings };
		}
	}

	return Object.keys(result).length > 0 ? result : undefined;
}
