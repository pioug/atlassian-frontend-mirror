import type {
	FlatSegment3pTimingEntry,
	InteractionMetrics,
	Segment3pData,
	Segment3pDataPayload,
	Segment3pTimingEntry,
} from '../../common';

const PERF_TIMING_LABELS = ['resource-timing', 'navigation-timing'];
const DOM_TIMING_LABELS = [
	'frame-mark',
	'frame-measure',
	'paint-timing',
	'layout-shift',
	'dom-mutations',
	'react-profiler-timing',
];

/**
 * Drop order when the soft budget is exceeded (B2).
 * Labels earlier in this array are dropped first; labels absent from the list are never dropped.
 * navigation-timing and layout-shift are intentionally omitted — they are the most TTAI-relevant
 * signals and must be preserved even under budget pressure.
 */
const TRIM_ORDER: readonly string[] = [
	'dom-mutations', // verbose detail, least TTAI-relevant
	'frame-mark', // free-form app marks, often large on misbehaving Forge apps
	'frame-measure', // same rationale as frame-mark
	'resource-timing', // sub-median entries trimmed first (handled specially below)
	'paint-timing', // FP / FCP, low cardinality — last resort
	'react-profiler-timing', // internal profiling data, low analytical value when under pressure
];

/**
 * Soft budget (KB): when the flat array exceeds this, begin dropping entries by TRIM_ORDER.
 * Chosen as roughly 3× the P75 of segment3pTimings observed in production (~30 KB).
 */
export const SEGMENT_3P_SOFT_BUDGET_KB = 60;

function sizeKb(entries: FlatSegment3pTimingEntry[]): number {
	return JSON.stringify(entries).length / 1024;
}

/**
 * For `resource-timing` entries: drop those with the shortest duration first (sub-median),
 * since they contribute least to TTAI attribution. Returns the filtered list.
 */
function trimResourceTimingsByDuration(
	entries: FlatSegment3pTimingEntry[],
): FlatSegment3pTimingEntry[] {
	const resourceEntries = entries.filter((e) => e.label === 'resource-timing');
	const otherEntries = entries.filter((e) => e.label !== 'resource-timing');

	if (resourceEntries.length === 0) {
		return entries;
	}

	// Sort by duration ascending so we drop the shortest first
	const durations = resourceEntries
		.map((e) => (typeof e.data.duration === 'number' ? e.data.duration : 0))
		.sort((a, b) => a - b);

	// Pass 1 of 2: drop the shortest (sub-median) entries; caller drops all resource-timing if still over budget.
	const median = durations[Math.floor(durations.length / 2)];
	const kept = resourceEntries.filter(
		(e) => typeof e.data.duration !== 'number' || e.data.duration >= median,
	);

	return [...otherEntries, ...kept];
}

/**
 * Soft-budget trimming: drops entries in TRIM_ORDER until under SEGMENT_3P_SOFT_BUDGET_KB
 * or all droppable labels are exhausted. Always returns a `FlatSegment3pTimingEntry[]`.
 * If still over budget after trimming, the payload-level trimmer drops the whole field.
 * navigation-timing and layout-shift are never dropped (most TTAI-relevant signals).
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function applySegment3pBudget(flat: FlatSegment3pTimingEntry[]): {
	result: FlatSegment3pTimingEntry[];
	wasTrimmed: boolean;
} {
	const initialSizeKb = sizeKb(flat);
	if (initialSizeKb <= SEGMENT_3P_SOFT_BUDGET_KB) {
		return { result: flat, wasTrimmed: false };
	}

	let trimmed = flat;
	let currentSizeKb = initialSizeKb;

	for (const label of TRIM_ORDER) {
		if (currentSizeKb <= SEGMENT_3P_SOFT_BUDGET_KB) {
			break;
		}

		if (label === 'resource-timing') {
			// First pass: trim sub-median resource entries
			const afterSubMedian = trimResourceTimingsByDuration(trimmed);
			if (afterSubMedian !== trimmed) {
				trimmed = afterSubMedian;
				currentSizeKb = sizeKb(trimmed);
			}
			if (currentSizeKb <= SEGMENT_3P_SOFT_BUDGET_KB) {
				break;
			}
			// Second pass: drop all resource-timing entries
			trimmed = trimmed.filter((e) => e.label !== 'resource-timing');
			currentSizeKb = sizeKb(trimmed);
		} else {
			trimmed = trimmed.filter((e) => e.label !== label);
			currentSizeKb = sizeKb(trimmed);
		}
	}

	return { result: trimmed, wasTrimmed: trimmed.length < flat.length };
}
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

/**
 * Returns serialized sizes (in KB) of perf timings and DOM timings within a `Segment3pData`
 * grouped structure. Used when the ecosystem data feature flag is off.
 */
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function getSegment3pDataSizes(data: Segment3pData): {
	segment3pPerfTimingsSizeInKb: number;
	segment3pDomTimingsSizeInKb: number;
	segment3pExtraDataSizeInKb: number;
} {
	const allTimings = Object.values(data).flatMap((s) => s.timings);
	const allMetas = Object.values(data).map((s) => s.meta);
	const perfTimings = allTimings.filter((e) => PERF_TIMING_LABELS.includes(e.label));
	const domTimings = allTimings.filter((e) => DOM_TIMING_LABELS.includes(e.label));
	return {
		segment3pPerfTimingsSizeInKb:
			Math.round((JSON.stringify(perfTimings).length / 1024) * 100) / 100,
		segment3pDomTimingsSizeInKb: Math.round((JSON.stringify(domTimings).length / 1024) * 100) / 100,
		segment3pExtraDataSizeInKb: Math.round((JSON.stringify(allMetas).length / 1024) * 100) / 100,
	};
}

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
