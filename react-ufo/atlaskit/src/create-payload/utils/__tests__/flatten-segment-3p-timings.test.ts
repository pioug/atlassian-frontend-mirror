import type { FlatSegment3pTimingEntry } from '../../../common';
import {
	SEGMENT_3P_SOFT_BUDGET_KB,
	applySegment3pBudget,
} from '../flatten-segment-3p-timings';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a FlatSegment3pTimingEntry with the given label and an arbitrary data payload. */
function makeEntry(
	label: string,
	data: Record<string, unknown> = {},
	segmentId = 'seg-1',
): FlatSegment3pTimingEntry {
	return { segmentId, label, data };
}

/**
 * Builds a flat array that is guaranteed to be slightly over `targetKb` in serialised size,
 * by repeating a resource-timing entry padded with a growing `pad` string.
 */
function buildBigArray(
	label: string,
	targetKb: number,
	durationMs = 100,
): FlatSegment3pTimingEntry[] {
	const entries: FlatSegment3pTimingEntry[] = [];
	let size = 0;
	let i = 0;
	while (size < targetKb * 1024) {
		const entry = makeEntry(label, { duration: durationMs, pad: 'x'.repeat(200), index: i });
		entries.push(entry);
		size = JSON.stringify(entries).length;
		i++;
	}
	return entries;
}

// ---------------------------------------------------------------------------
// applySegment3pBudget — under budget
// ---------------------------------------------------------------------------

describe('applySegment3pBudget — under soft budget', () => {
	it('returns the array unchanged when it is within the soft budget', () => {
		const flat = [
			makeEntry('navigation-timing', { fetchStart: 0 }),
			makeEntry('paint-timing', { startTime: 200 }),
		];
		const { result, wasTrimmed } = applySegment3pBudget(flat);
		expect(wasTrimmed).toBe(false);
		expect(result).toBe(flat); // same reference
	});
});

// ---------------------------------------------------------------------------
// applySegment3pBudget — soft budget exceeded, trimming works
// ---------------------------------------------------------------------------

describe('applySegment3pBudget — soft budget exceeded', () => {
	it('drops dom-mutations first to get under budget', () => {
		// Build a large dom-mutations chunk that pushes us over the soft budget
		const bigDomMutations = buildBigArray('dom-mutations', SEGMENT_3P_SOFT_BUDGET_KB + 5, 100);
		const navEntry = makeEntry('navigation-timing', { fetchStart: 0 });
		const flat = [...bigDomMutations, navEntry];

		const { result, wasTrimmed } = applySegment3pBudget(flat);

		expect(wasTrimmed).toBe(true);
		expect(result.some((e) => e.label === 'dom-mutations')).toBe(false);
		expect(result.some((e) => e.label === 'navigation-timing')).toBe(true);
	});

	it('drops frame-mark / frame-measure before resource-timing', () => {
		// Build enough frame-mark entries to push over soft budget
		const bigMarks = buildBigArray('frame-mark', SEGMENT_3P_SOFT_BUDGET_KB + 5, 100);
		const resourceEntry = makeEntry('resource-timing', { duration: 50 });
		const flat = [...bigMarks, resourceEntry];

		const { result, wasTrimmed } = applySegment3pBudget(flat);

		expect(wasTrimmed).toBe(true);
		expect(result.some((e) => e.label === 'frame-mark')).toBe(false);
		expect(result.some((e) => e.label === 'resource-timing')).toBe(true);
	});

	it('trims sub-median resource-timing entries by duration before dropping all', () => {
		// Mix of short (1 ms) and long (1000 ms) resource entries, enough to exceed soft budget
		const shortEntries = buildBigArray('resource-timing', SEGMENT_3P_SOFT_BUDGET_KB / 2 + 5, 1);
		const longEntries = buildBigArray('resource-timing', SEGMENT_3P_SOFT_BUDGET_KB / 2 + 5, 1000);
		const flat = [...shortEntries, ...longEntries];

		const { result, wasTrimmed } = applySegment3pBudget(flat);
		expect(wasTrimmed).toBe(true);

		const resourceEntries = result.filter((e) => e.label === 'resource-timing');
		resourceEntries.forEach((e) => {
			expect(e.data.duration).toBeGreaterThanOrEqual(1000);
		});
	});

	it('never drops navigation-timing or layout-shift entries', () => {
		// Construct a payload over soft budget entirely from droppable + protected entries
		const bigDomMutations = buildBigArray('dom-mutations', SEGMENT_3P_SOFT_BUDGET_KB + 5);
		const navEntry = makeEntry('navigation-timing', { fetchStart: 0 });
		const layoutShiftEntry = makeEntry('layout-shift', { value: 0.05, cumulativeScore: 0.05 });
		const flat = [...bigDomMutations, navEntry, layoutShiftEntry];

		const { result } = applySegment3pBudget(flat);

		expect(result.some((e) => e.label === 'navigation-timing')).toBe(true);
		expect(result.some((e) => e.label === 'layout-shift')).toBe(true);
	});
});

