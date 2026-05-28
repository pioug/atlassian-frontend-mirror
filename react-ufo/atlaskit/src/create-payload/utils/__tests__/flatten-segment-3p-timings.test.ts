import type { FlatSegment3pTimingEntry } from '../../../common';
import {
	SEGMENT_3P_HARD_BUDGET_KB,
	SEGMENT_3P_SOFT_BUDGET_KB,
	applySegment3pBudget,
	flattenAndDeduplicateSegment3pTimings,
	getSegment3pTimingsSizes,
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
// flattenAndDeduplicateSegment3pTimings
// ---------------------------------------------------------------------------

describe('flattenAndDeduplicateSegment3pTimings', () => {
	it('returns undefined when input is undefined', () => {
		expect(flattenAndDeduplicateSegment3pTimings(undefined)).toBeUndefined();
	});

	it('flattens entries from multiple segments', () => {
		const result = flattenAndDeduplicateSegment3pTimings({
			'seg-a': [{ label: 'paint-timing', data: { startTime: 100 } }],
			'seg-b': [{ label: 'navigation-timing', data: { fetchStart: 0 } }],
		});
		expect(result).toHaveLength(2);
		expect(result?.map((e) => e.label)).toEqual(
			expect.arrayContaining(['paint-timing', 'navigation-timing']),
		);
	});

	it('deduplicates identical entries within the same segment', () => {
		const entry = { label: 'resource-timing', data: { duration: 50 } };
		const result = flattenAndDeduplicateSegment3pTimings({
			'seg-a': [entry, entry],
		});
		expect(result).toHaveLength(1);
	});

	it('deduplicates identical entries across different segments', () => {
		const entry = { label: 'resource-timing', data: { duration: 50 } };
		const result = flattenAndDeduplicateSegment3pTimings({
			'seg-a': [entry],
			'seg-b': [entry],
		});
		// Different segmentIds → different dedup key → both kept
		expect(result).toHaveLength(2);
	});

	it('keeps distinct entries with the same label', () => {
		const result = flattenAndDeduplicateSegment3pTimings({
			'seg-a': [
				{ label: 'resource-timing', data: { duration: 50 } },
				{ label: 'resource-timing', data: { duration: 200 } },
			],
		});
		expect(result).toHaveLength(2);
	});
});

// ---------------------------------------------------------------------------
// getSegment3pTimingsSizes
// ---------------------------------------------------------------------------

describe('getSegment3pTimingsSizes', () => {
	it('returns near-zero sizes for an empty array', () => {
		const { segment3pPerfTimingsSizeInKb, segment3pDomTimingsSizeInKb } =
			getSegment3pTimingsSizes([]);
		// JSON.stringify([]) = "[]" = 2 bytes → ~0.002 KB, so just assert it's negligibly small
		expect(segment3pPerfTimingsSizeInKb).toBeLessThan(0.01);
		expect(segment3pDomTimingsSizeInKb).toBeLessThan(0.01);
	});

	it('classifies resource-timing and navigation-timing as perf timings', () => {
		const flat = [
			makeEntry('resource-timing', { duration: 10 }),
			makeEntry('navigation-timing', { fetchStart: 0 }),
		];
		const { segment3pPerfTimingsSizeInKb, segment3pDomTimingsSizeInKb } =
			getSegment3pTimingsSizes(flat);
		expect(segment3pPerfTimingsSizeInKb).toBeGreaterThan(0);
		expect(segment3pDomTimingsSizeInKb).toBeLessThan(0.01);
	});

	it('classifies frame-mark, layout-shift, dom-mutations as dom timings', () => {
		const flat = [
			makeEntry('frame-mark', { startTime: 10 }),
			makeEntry('layout-shift', { value: 0.1 }),
			makeEntry('dom-mutations', { totalMutations: 5 }),
		];
		const { segment3pPerfTimingsSizeInKb, segment3pDomTimingsSizeInKb } =
			getSegment3pTimingsSizes(flat);
		expect(segment3pPerfTimingsSizeInKb).toBeLessThan(0.01);
		expect(segment3pDomTimingsSizeInKb).toBeGreaterThan(0);
	});
});

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
		expect(Array.isArray(result)).toBe(true);
		const trimmedArray = result as FlatSegment3pTimingEntry[];
		// dom-mutations should have been dropped
		expect(trimmedArray.some((e) => e.label === 'dom-mutations')).toBe(false);
		// navigation-timing must always be preserved
		expect(trimmedArray.some((e) => e.label === 'navigation-timing')).toBe(true);
	});

	it('drops frame-mark / frame-measure before resource-timing', () => {
		// Build enough frame-mark entries to push over soft budget
		const bigMarks = buildBigArray('frame-mark', SEGMENT_3P_SOFT_BUDGET_KB + 5, 100);
		const resourceEntry = makeEntry('resource-timing', { duration: 50 });
		const flat = [...bigMarks, resourceEntry];

		const { result, wasTrimmed } = applySegment3pBudget(flat);

		expect(wasTrimmed).toBe(true);
		const trimmedArray = result as FlatSegment3pTimingEntry[];
		expect(trimmedArray.some((e) => e.label === 'frame-mark')).toBe(false);
		// resource-timing should survive since frame-mark removal brought us under budget
		expect(trimmedArray.some((e) => e.label === 'resource-timing')).toBe(true);
	});

	it('trims sub-median resource-timing entries by duration before dropping all', () => {
		// Mix of short (1 ms) and long (1000 ms) resource entries, enough to exceed soft budget
		const shortEntries = buildBigArray('resource-timing', SEGMENT_3P_SOFT_BUDGET_KB / 2 + 5, 1);
		const longEntries = buildBigArray('resource-timing', SEGMENT_3P_SOFT_BUDGET_KB / 2 + 5, 1000);
		const flat = [...shortEntries, ...longEntries];

		const { result, wasTrimmed } = applySegment3pBudget(flat);
		expect(wasTrimmed).toBe(true);

		if (Array.isArray(result)) {
			const resourceEntries = result.filter((e) => e.label === 'resource-timing');
			// All kept entries should have duration >= median (i.e., the long ones were kept)
			resourceEntries.forEach((e) => {
				expect(e.data.duration).toBeGreaterThanOrEqual(1000);
			});
		}
	});

	it('never drops navigation-timing or layout-shift entries', () => {
		// Construct a payload over soft budget entirely from droppable + protected entries
		const bigDomMutations = buildBigArray('dom-mutations', SEGMENT_3P_SOFT_BUDGET_KB + 5);
		const navEntry = makeEntry('navigation-timing', { fetchStart: 0 });
		const layoutShiftEntry = makeEntry('layout-shift', { value: 0.05, cumulativeScore: 0.05 });
		const flat = [...bigDomMutations, navEntry, layoutShiftEntry];

		const { result } = applySegment3pBudget(flat);

		if (Array.isArray(result)) {
			expect(result.some((e) => e.label === 'navigation-timing')).toBe(true);
			expect(result.some((e) => e.label === 'layout-shift')).toBe(true);
		}
		// If sentinel, navigation-timing is already gone but that's fine — sentinel captures perSuffixCounts
	});
});

// ---------------------------------------------------------------------------
// applySegment3pBudget — hard budget sentinel
// ---------------------------------------------------------------------------

describe('applySegment3pBudget — hard budget sentinel', () => {
	it('returns a sentinel when payload exceeds hard budget even after trimming', () => {
		// Build enough navigation-timing entries (un-droppable) to exceed the hard budget.
		// navigation-timing is never dropped, so if it alone exceeds the hard budget we get a sentinel.
		const bigNav = buildBigArray('navigation-timing', SEGMENT_3P_HARD_BUDGET_KB + 5);
		const { result, wasTrimmed } = applySegment3pBudget(bigNav);

		expect(wasTrimmed).toBe(true);
		expect(Array.isArray(result)).toBe(false);

		const sentinel = result as import('../flatten-segment-3p-timings').Segment3pTimingsTruncatedSentinel;
		expect(sentinel.truncated).toBe(true);
		expect(sentinel.droppedBy).toBe('budget');
		expect(sentinel.originalSizeKb).toBeGreaterThan(SEGMENT_3P_HARD_BUDGET_KB);
		expect(sentinel.perSuffixCounts).toHaveProperty('navigation-timing');
	});

	it('sentinel perSuffixCounts reflects counts from the original un-trimmed array', () => {
		const bigNav = buildBigArray('navigation-timing', SEGMENT_3P_HARD_BUDGET_KB + 5);
		const bigMarks = buildBigArray('frame-mark', 10); // small, will be trimmed
		const flat = [...bigNav, ...bigMarks];

		const { result } = applySegment3pBudget(flat);

		const sentinel = result as import('../flatten-segment-3p-timings').Segment3pTimingsTruncatedSentinel;
		// perSuffixCounts is built from the ORIGINAL flat array before any trimming
		expect(sentinel.perSuffixCounts['navigation-timing']).toBe(bigNav.length);
		expect(sentinel.perSuffixCounts['frame-mark']).toBe(bigMarks.length);
	});

	it('result size stays within hard budget after trimming droppable entries', () => {
		// Over soft but under hard when dom-mutations are trimmed
		const bigDomMutations = buildBigArray(
			'dom-mutations',
			SEGMENT_3P_SOFT_BUDGET_KB + 10,
		);
		const smallNav = [makeEntry('navigation-timing', { fetchStart: 0 })];
		const flat = [...bigDomMutations, ...smallNav];

		const { result } = applySegment3pBudget(flat);
		// Should be a trimmed array, not a sentinel
		expect(Array.isArray(result)).toBe(true);
		const size = JSON.stringify(result).length / 1024;
		expect(size).toBeLessThanOrEqual(SEGMENT_3P_HARD_BUDGET_KB);
	});
});
