import {
	isDomMutationsFinalBatch,
	shapeDomMutationsData,
	shapeFrameMarkData,
	shapeFrameMeasureData,
	shapeLayoutShiftData,
	shapePaintTimingData,
} from '../shape-iframe-dom-events';

// Helper: wrap payload in the standard iframe event envelope (type stripped, rest kept).
const wrap = (payload: Record<string, unknown>) => ({
	name: 'ufo-forge-some-event',
	elapsed: 42,
	payload,
});

describe('shapePaintTimingData', () => {
	it('returns name and startTime from payload', () => {
		const result = shapePaintTimingData(
			wrap({ name: 'first-contentful-paint', startTime: 120, duration: 0, entryType: 'paint' }),
		);
		expect(result).toEqual({ name: 'first-contentful-paint', startTime: 120 });
	});

	it('drops elapsed, entryType, duration from the output', () => {
		const result = shapePaintTimingData(
			wrap({ name: 'first-paint', startTime: 50, duration: 0, entryType: 'paint' }),
		);
		expect(result).not.toHaveProperty('elapsed');
		expect(result).not.toHaveProperty('entryType');
		expect(result).not.toHaveProperty('duration');
	});

	it('falls back to empty string when payload.name is missing', () => {
		const result = shapePaintTimingData(wrap({ startTime: 50 }));
		expect(result.name).toBe('');
	});

	it('falls back to 0 when payload.startTime is missing', () => {
		const result = shapePaintTimingData(wrap({ name: 'first-paint' }));
		expect(result.startTime).toBe(0);
	});

	it('rounds startTime to nearest integer', () => {
		const result = shapePaintTimingData(wrap({ name: 'first-paint', startTime: 120.7 }));
		expect(result.startTime).toBe(121);
	});

	it('returns empty fallbacks when payload is absent', () => {
		const result = shapePaintTimingData({ name: 'ufo-forge-paint-timing', elapsed: 10 });
		expect(result).toEqual({ name: '', startTime: 0 });
	});
});

describe('shapeFrameMarkData', () => {
	it('returns entryName and startTime from payload', () => {
		const result = shapeFrameMarkData(wrap({ entryName: 'my-mark', startTime: 200 }));
		expect(result).toEqual({ entryName: 'my-mark', startTime: 200 });
	});

	it('drops detail and elapsed', () => {
		const result = shapeFrameMarkData(
			wrap({ entryName: 'my-mark', startTime: 200, detail: { foo: 'bar' } }),
		);
		expect(result).not.toHaveProperty('detail');
		expect(result).not.toHaveProperty('elapsed');
	});

	it('falls back to empty string / 0 when fields are missing', () => {
		const result = shapeFrameMarkData(wrap({}));
		expect(result).toEqual({ entryName: '', startTime: 0 });
	});
});

describe('shapeFrameMeasureData', () => {
	it('returns entryName, startTime, and duration from payload', () => {
		const result = shapeFrameMeasureData(wrap({ entryName: 'my-measure', startTime: 10, duration: 90 }));
		expect(result).toEqual({ entryName: 'my-measure', startTime: 10, duration: 90 });
	});

	it('drops detail and elapsed', () => {
		const result = shapeFrameMeasureData(
			wrap({ entryName: 'my-measure', startTime: 10, duration: 90, detail: { x: 1 } }),
		);
		expect(result).not.toHaveProperty('detail');
		expect(result).not.toHaveProperty('elapsed');
	});

	it('rounds fractional values', () => {
		const result = shapeFrameMeasureData(wrap({ entryName: 'x', startTime: 1.4, duration: 2.6 }));
		expect(result.startTime).toBe(1);
		expect(result.duration).toBe(3);
	});
});

describe('shapeLayoutShiftData', () => {
	it('keeps value, startTime, cumulativeScore, sessionValue, and mapped sources', () => {
		const result = shapeLayoutShiftData(
			wrap({
				value: 0.05,
				startTime: 300,
				cumulativeScore: 0.1,
				sessionValue: 0.08,
				hadRecentInput: false,
				lastInputTime: 0,
				sources: [{ node: 'div', currentRect: {}, previousRect: {} }],
			}),
		);
		expect(result).toEqual({
			value: 0.05,
			startTime: 300,
			cumulativeScore: 0.1,
			sessionValue: 0.08,
			sources: [{ node: 'div' }],
		});
	});

	it('drops currentRect and previousRect from sources', () => {
		const result = shapeLayoutShiftData(
			wrap({
				value: 0,
				startTime: 0,
				cumulativeScore: 0,
				sessionValue: 0,
				sources: [{ node: 'span', currentRect: { x: 1 }, previousRect: { x: 0 } }],
			}),
		);
		expect((result.sources as Array<Record<string, unknown>>)[0]).not.toHaveProperty('currentRect');
		expect((result.sources as Array<Record<string, unknown>>)[0]).not.toHaveProperty('previousRect');
	});

	it('defaults source node to "unknown" when missing', () => {
		const result = shapeLayoutShiftData(wrap({ value: 0, startTime: 0, cumulativeScore: 0, sessionValue: 0, sources: [{}] }));
		expect((result.sources as Array<Record<string, unknown>>)[0].node).toBe('unknown');
	});

	it('handles missing sources array gracefully', () => {
		const result = shapeLayoutShiftData(wrap({ value: 0.1, startTime: 10, cumulativeScore: 0.1, sessionValue: 0.1 }));
		expect(result.sources).toEqual([]);
	});
});

describe('isDomMutationsFinalBatch', () => {
	it('returns true when payload.isFinalBatch is true', () => {
		expect(isDomMutationsFinalBatch(wrap({ isFinalBatch: true, totalMutations: 5 }))).toBe(true);
	});

	it('returns false when payload.isFinalBatch is false', () => {
		expect(isDomMutationsFinalBatch(wrap({ isFinalBatch: false, totalMutations: 3 }))).toBe(false);
	});

	it('returns false when payload.isFinalBatch is absent', () => {
		expect(isDomMutationsFinalBatch(wrap({ totalMutations: 3 }))).toBe(false);
	});

	it('returns false when payload itself is absent', () => {
		expect(isDomMutationsFinalBatch({ name: 'ufo-forge-dom-mutations', elapsed: 10 })).toBe(false);
	});
});

describe('shapeDomMutationsData', () => {
	it('returns totalMutations, observationDurationMs, and stopReason from payload', () => {
		const result = shapeDomMutationsData(
			wrap({
				totalMutations: 42,
				observationDurationMs: 1500,
				stopReason: 'max-mutations',
				isFinalBatch: true,
				addedNodeDetails: [{ tag: 'div' }],
				removedNodeDetails: [],
			}),
		);
		expect(result).toEqual({
			totalMutations: 42,
			observationDurationMs: 1500,
			stopReason: 'max-mutations',
		});
	});

	it('drops isFinalBatch, addedNodeDetails, removedNodeDetails from output', () => {
		const result = shapeDomMutationsData(
			wrap({ totalMutations: 1, observationDurationMs: 100, stopReason: 'timeout', isFinalBatch: true }),
		);
		expect(result).not.toHaveProperty('isFinalBatch');
		expect(result).not.toHaveProperty('addedNodeDetails');
		expect(result).not.toHaveProperty('removedNodeDetails');
	});

	it('falls back to 0 / null when fields are missing', () => {
		const result = shapeDomMutationsData(wrap({}));
		expect(result).toEqual({ totalMutations: 0, observationDurationMs: 0, stopReason: null });
	});

	it('rounds observationDurationMs', () => {
		const result = shapeDomMutationsData(wrap({ totalMutations: 1, observationDurationMs: 99.6, stopReason: null }));
		expect(result.observationDurationMs).toBe(100);
	});
});
