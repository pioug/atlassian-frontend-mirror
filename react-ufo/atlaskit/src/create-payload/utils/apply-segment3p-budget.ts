import type { FlatSegment3pTimingEntry } from '../../common';

import { SEGMENT_3P_SOFT_BUDGET_KB } from './flatten-segment-3p-timings';

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
