import type { FlatSegment3pTimingEntry, InteractionMetrics } from '../../common';

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

/**
 * Hard budget (KB): if entries still exceed this after suffix-level trimming, replace the whole
 * array with a sentinel summary object so the interaction payload never blows the 240 KB limit.
 */
export const SEGMENT_3P_HARD_BUDGET_KB = 120;

/**
 * The sentinel value written into the payload when the hard budget is exceeded.
 * Consumers can detect `truncated: true` to know that the full data was dropped.
 */
export type Segment3pTimingsTruncatedSentinel = {
	truncated: true;
	droppedBy: 'budget';
	originalSizeKb: number;
	perSuffixCounts: Record<string, number>;
};

function sizeKb(entries: FlatSegment3pTimingEntry[]): number {
	return JSON.stringify(entries).length / 1024;
}

function buildPerSuffixCounts(entries: FlatSegment3pTimingEntry[]): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const e of entries) {
		counts[e.label] = (counts[e.label] ?? 0) + 1;
	}
	return counts;
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
 * Applies B1 + B2: soft-budget suffix-level trimming followed by a hard-budget sentinel.
 *
 * - If `sizeKb(flat) <= SEGMENT_3P_SOFT_BUDGET_KB`: returned unchanged.
 * - If soft budget exceeded: drops entries in TRIM_ORDER (resource-timing trimmed by sub-median
 *   duration first, then dropped entirely) until within budget or all droppable labels exhausted.
 * - If still over SEGMENT_3P_HARD_BUDGET_KB: replaces the array with a sentinel summary.
 *
 * navigation-timing and layout-shift are never dropped (most TTAI-relevant signals).
 */
export function applySegment3pBudget(flat: FlatSegment3pTimingEntry[]): {
	result: FlatSegment3pTimingEntry[] | Segment3pTimingsTruncatedSentinel;
	wasTrimmed: boolean;
} {
	const initialSizeKb = sizeKb(flat);
	if (initialSizeKb <= SEGMENT_3P_SOFT_BUDGET_KB) {
		return { result: flat, wasTrimmed: false };
	}

	const originalSizeKb = initialSizeKb;
	const perSuffixCounts = buildPerSuffixCounts(flat);

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

	if (currentSizeKb > SEGMENT_3P_HARD_BUDGET_KB) {
		// Hard budget exceeded even after trimming — replace with a lightweight sentinel
		const sentinel: Segment3pTimingsTruncatedSentinel = {
			truncated: true,
			droppedBy: 'budget',
			originalSizeKb: Math.round(originalSizeKb),
			perSuffixCounts,
		};
		return { result: sentinel, wasTrimmed: true };
	}

	return { result: trimmed, wasTrimmed: trimmed.length < flat.length };
}

/**
 * Flattens `Record<segmentId, entries[]>` into `FlatSegment3pTimingEntry[]` and removes
 * duplicate entries (multiple Forge iframes can report identical perf timeline data).
 */
export function flattenAndDeduplicateSegment3pTimings(
	segment3pTimings: InteractionMetrics['segment3pTimings'],
): FlatSegment3pTimingEntry[] | undefined {
	if (!segment3pTimings) {
		return undefined;
	}
	const seen = new Set<string>();
	const result: FlatSegment3pTimingEntry[] = [];
	for (const [segmentId, entries] of Object.entries(segment3pTimings)) {
		for (const entry of entries) {
			const key = `${segmentId}:${entry.label}:${JSON.stringify(entry.data)}`;
			if (seen.has(key)) {
				continue;
			}
			seen.add(key);
			result.push({ segmentId, label: entry.label, data: entry.data });
		}
	}
	return result;
}

/**
 * Returns serialized sizes (in KB) of perf timings (resource/navigation) and
 * DOM timings (frame-mark, frame-measure, paint-timing, layout-shift, dom-mutations).
 */
export function getSegment3pTimingsSizes(flat: FlatSegment3pTimingEntry[]): {
	segment3pPerfTimingsSizeInKb: number;
	segment3pDomTimingsSizeInKb: number;
} {
	const perfTimings = flat.filter((e) => PERF_TIMING_LABELS.includes(e.label));
	const domTimings = flat.filter((e) => DOM_TIMING_LABELS.includes(e.label));
	return {
		segment3pPerfTimingsSizeInKb: Math.round((JSON.stringify(perfTimings).length / 1024) * 100) / 100,
		segment3pDomTimingsSizeInKb: Math.round((JSON.stringify(domTimings).length / 1024) * 100) / 100,
	};
}
