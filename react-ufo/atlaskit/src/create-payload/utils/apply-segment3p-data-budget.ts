import type { FlatSegment3pTimingEntry, Segment3pData, Segment3pDataPayload } from '../../common';

import { applySegment3pBudget } from './apply-segment3p-budget';

/** Applies B1+B2 budget trimming to a `Segment3pData` and returns a `Segment3pDataPayload`. */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function applySegment3pDataBudget(data: Segment3pData): Segment3pDataPayload {
	// Flatten all timings with a temporary segmentId for budget calculation.
	const flat: FlatSegment3pTimingEntry[] = Object.entries(data).flatMap(
		([segmentId, { timings }]) => timings.map((t) => ({ segmentId, label: t.label, data: t.data })),
	);

	const { result, wasTrimmed } = applySegment3pBudget(flat);

	// Fast path: nothing was trimmed, return the original data directly.
	if (!wasTrimmed) {
		return { segments: data };
	}

	// Re-group the trimmed flat array back into Segment3pData.
	const trimmed: Segment3pData = {};
	for (const entry of result) {
		if (!trimmed[entry.segmentId]) {
			trimmed[entry.segmentId] = { meta: data[entry.segmentId].meta, timings: [] };
		}
		trimmed[entry.segmentId].timings.push({ label: entry.label, data: entry.data });
	}

	return { segments: trimmed, trim: true };
}
