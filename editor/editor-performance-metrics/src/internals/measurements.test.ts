import type { Heatmap, HeatmapEntry } from './heatmap';
import {
	calculatePercentile,
	getLatencyPercentiles,
	getVCPercentFromHeatmap,
	getVCPercentileTargets,
} from './measurements';
import type { UserEvent } from './timelineTypes';

const createEntry = (entry: Partial<Partial<HeatmapEntry['head']>>): HeatmapEntry['head'] => {
	return {
		time: entry?.time ?? 0,
		elementName: entry?.elementName || 'div',
		wrapperSectionName: null,
		rect: entry?.rect || null,
		source: entry?.source || null,
		ratio: entry?.ratio || null,
	};
};

const entry = (time: DOMHighResTimeStamp): HeatmapEntry => {
	return {
		head: createEntry({
			time,
		}),
		previousEntries: [],
	};
};
describe('measurements: getVCPercentileTargets', () => {
	const testCases: Array<{
		timestampPercent: Record<string, number>;
		expectedVCTarget: Record<string, number | undefined>;
	}> = [
		{
			timestampPercent: {
				'32': 313,
				'36': 913,
				'37': 1516,
				'38': 1517,
				'53': 2521,
				'67': 2720,
				'81': 2919,
				'95': 3120,
				'100': 10793314,
			},
			expectedVCTarget: {
				'25': 313,
				'50': 2521,
				'75': 2919,
				'80': 2919,
				'85': 3120,
				'90': 3120,
				'95': 3120,
				'98': 10793314,
				'99': 10793314,
			},
		},
		{
			timestampPercent: {
				'34': 161,
				'37': 759,
				'39': 1357,
				'55': 2176,
				'71': 2571,
				'96': 3177,
				'100': 4183,
			},
			expectedVCTarget: {
				'25': 161,
				'50': 2176,
				'75': 3177,
				'80': 3177,
				'85': 3177,
				'90': 3177,
				'95': 3177,
				'98': 4183,
				'99': 4183,
			},
		},
		{
			timestampPercent: {},
			expectedVCTarget: {
				'25': undefined,
				'50': undefined,
				'75': undefined,
				'80': undefined,
				'85': undefined,
				'90': undefined,
				'95': undefined,
				'98': undefined,
				'99': undefined,
			},
		},
		{
			timestampPercent: {
				'101': 99,
			},
			expectedVCTarget: {
				'25': 99,
				'50': 99,
				'75': 99,
				'80': 99,
				'85': 99,
				'90': 99,
				'95': 99,
				'98': 99,
				'99': 99,
			},
		},
		{
			timestampPercent: {
				'95': 95,
				'99': 99,
				'101': 101,
			},
			expectedVCTarget: {
				'25': 95,
				'50': 95,
				'75': 95,
				'80': 95,
				'85': 95,
				'90': 95,
				'95': 95,
				'98': 99,
				'99': 99,
			},
		},
	];

	describe.each(testCases)(
		'Test case: %# - validate timestamp percent',
		({ timestampPercent, expectedVCTarget }) => {
			it('should properly convert the accumulative timestamp percent to the VCTargets', () => {
				const result = getVCPercentileTargets(timestampPercent);
				expect(result).toEqual(expectedVCTarget);
			});
		},
	);
});

describe('getVCPercentFromHeatmap', () => {
	const defaultOptions = {
		ignoreNodeReplacements: false,
		ignoreLayoutShifts: false,
	};
	test('should return an empty object for an empty heatmap', () => {
		const heatmap: Heatmap = {
			map: [[]],
			height: 0,
			width: 0,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, defaultOptions);
		expect(result).toEqual({ '100': 0 });
	});

	test('should handle a heatmap with all zeros', () => {
		const heatmap: Heatmap = {
			map: [[0, 0].map(entry), [0, 0].map(entry)],
			height: 2,
			width: 2,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, defaultOptions);
		expect(result).toEqual({
			'100': 0,
		});
	});

	test('should calculate percentiles correctly for a uniform heatmap', () => {
		const heatmap: Heatmap = {
			map: [[1, 1].map(entry), [1, 1].map(entry)],
			height: 2,
			width: 2,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, defaultOptions);
		expect(result).toEqual({ '100': 1 });
	});

	test('should calculate percentiles correctly for a varied heatmap', () => {
		const heatmap: Heatmap = {
			map: [[1, 2].map(entry), [3, 4].map(entry)],
			height: 2,
			width: 2,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, defaultOptions);
		expect(result).toEqual({ '25': 1, '50': 2, '75': 3, '100': 4 });
	});

	test('should handle a non-square heatmap', () => {
		const heatmap: Heatmap = {
			map: [[1, 2, 3].map(entry), [4, 5, 6].map(entry)],
			height: 2,
			width: 3,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, defaultOptions);
		expect(result).toEqual({ '16': 1, '33': 2, '50': 3, '66': 4, '83': 5, '100': 6 });
	});

	test('should round timestamps correctly', () => {
		const heatmap: Heatmap = {
			map: [[1.5, 2.5].map(entry), [3.5, 4.5].map(entry)],
			height: 2,
			width: 2,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, defaultOptions);
		expect(result).toEqual({
			'100': 5,
			'25': 2,
			'50': 3,
			'75': 4,
		});
	});

	test('should handle heatmap with mixed values', () => {
		const heatmap: Heatmap = {
			map: [[0, 1, 0].map(entry), [2, 3, 1].map(entry), [0, 4, 5].map(entry)],
			height: 3,
			width: 3,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, defaultOptions);
		expect(result).toEqual({
			'33': 0,
			'55': 1,
			'66': 2,
			'77': 3,
			'88': 4,
			'100': 5,
		});
	});
});

const entryWithPrevious = (
	entry: Partial<HeatmapEntry['head']>,
	...previousEntries: Array<Partial<HeatmapEntry['head']>>
): HeatmapEntry => {
	return {
		head: {
			time: entry?.time ?? 0,
			elementName: entry?.elementName || 'div',
			wrapperSectionName: null,
			rect: entry?.rect || null,
			source: entry?.source || 'mutation',
			ratio: null,
		},
		previousEntries: previousEntries.reverse().map((prev) => ({
			time: prev?.time ?? 0,
			elementName: prev?.elementName || 'div',
			wrapperSectionName: null,
			rect: prev?.rect || null,
			source: prev?.source || 'mutation',
			ratio: null,
		})),
	};
};

describe('getVCPercentFromHeatmap with ignoreNodeReplacements true', () => {
	const options = {
		ignoreNodeReplacements: true,
	};
	const basicRect = { left: 0, top: 0, right: 100, bottom: 100 };

	test('should use previous entry time if the source is replacement', () => {
		const row0col0Entry = entryWithPrevious(
			{ time: 5, rect: basicRect, source: 'mutation:node-replacement' },
			{ time: 3, rect: basicRect },
		);
		const row1col0Entry = entryWithPrevious(
			{ time: 10, rect: basicRect, source: 'mutation:node-replacement' },
			{ time: 8, rect: basicRect },
		);
		const heatmap: Heatmap = {
			map: [[row0col0Entry], [row1col0Entry]],
			height: 2,
			width: 1,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, options);
		expect(result).toEqual({
			'50': 3,
			'100': 8,
		});
	});
});

describe('getVCPercentFromHeatmap with ignoreLayoutShifts true', () => {
	const options = {
		ignoreLayoutShifts: true,
	};

	test('should use previous entry time if the source is layout shift', () => {
		const row0col0Entry = entryWithPrevious({ time: 5, source: 'layout-shift' }, { time: 3 });
		const row1col0Entry = entryWithPrevious({ time: 10, source: 'layout-shift' }, { time: 8 });
		const heatmap: Heatmap = {
			map: [[row0col0Entry], [row1col0Entry]],
			height: 2,
			width: 1,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, options);
		expect(result).toEqual({
			'50': 3,
			'100': 8,
		});
	});

	test('should not use previous entry time if source is not layout-shift', () => {
		const row0col0Entry = entryWithPrevious({ time: 5, source: 'mutation' }, { time: 3 });
		const row1col0Entry = entryWithPrevious({ time: 10, source: 'mutation' }, { time: 8 });
		const heatmap: Heatmap = {
			map: [[row0col0Entry], [row1col0Entry]],
			height: 2,
			width: 1,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, options);
		expect(result).toEqual({
			'50': 5,
			'100': 10,
		});
	});

	test('should handle a mix of layout shift and non-layout shift entries', () => {
		const row0col0Entry = entryWithPrevious({ time: 5, source: 'layout-shift' }, { time: 3 });
		const row0col1Entry = entryWithPrevious({ time: 15, source: 'mutation' }, { time: 12 });
		const heatmap: Heatmap = {
			map: [[row0col0Entry, row0col1Entry]],
			height: 1,
			width: 2,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, options);
		expect(result).toEqual({
			'50': 3,
			'100': 15,
		});
	});

	test('should handle entries with no previous entries', () => {
		const row0col0Entry = entryWithPrevious({ time: 5, source: 'layout-shift' });
		const row1col0Entry = entryWithPrevious({ time: 10, source: 'layout-shift' });
		const heatmap: Heatmap = {
			map: [[row0col0Entry], [row1col0Entry]],
			height: 2,
			width: 1,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, options);
		expect(result).toEqual({
			'100': 0,
		});
	});
});

describe('getVCPercentFromHeatmap with both ignoreNodeReplacements and ignoreLayoutShifts true', () => {
	const options = {
		ignoreNodeReplacements: true,
		ignoreLayoutShifts: true,
	};
	const basicRect = { left: 0, top: 0, right: 100, bottom: 100 };

	test('should search for the last valid entry', () => {
		const row0col0Entry = entryWithPrevious(
			{ time: 20, source: 'layout-shift' },
			{ time: 10, rect: basicRect, source: 'mutation:node-replacement' },
			{ time: 5, rect: basicRect, elementName: 'lol' },
		);
		const row1col0Entry = entryWithPrevious(
			{ time: 30, source: 'layout-shift' },
			{ time: 15, rect: basicRect, source: 'mutation:node-replacement' },
			{ time: 5, rect: basicRect, elementName: 'lol' },
		);
		const heatmap: Heatmap = {
			map: [[row0col0Entry], [row1col0Entry]],
			height: 2,
			width: 1,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, options);
		expect(result).toEqual({
			'100': 5,
		});
	});

	test('should search for the last valid entry when a node replacement when first', () => {
		const row0col0Entry = entryWithPrevious(
			{ time: 20, rect: basicRect, source: 'mutation:node-replacement' },
			{ time: 10, source: 'layout-shift' },
			{ time: 7, rect: basicRect, source: 'mutation:node-replacement' },
			{ time: 5, rect: basicRect, elementName: 'lol' },
		);
		const row1col0Entry = entryWithPrevious(
			{ time: 30, rect: basicRect, source: 'mutation:node-replacement' },
			{ time: 15, source: 'layout-shift' },
			{ time: 7, rect: basicRect, source: 'mutation:node-replacement' },
			{ time: 5, rect: basicRect, elementName: 'lol' },
		);
		const heatmap: Heatmap = {
			map: [[row0col0Entry], [row1col0Entry]],
			height: 2,
			width: 1,
			scaleX: 1,
			scaleY: 1,
		};
		const result = getVCPercentFromHeatmap(heatmap, options);
		expect(result).toEqual({
			'100': 5,
		});
	});
});

describe('measurements: getLatencyPercentiles', () => {
	it('should calculate percentiles for all events and categories', () => {
		const events: UserEvent[] = [
			{
				type: 'user-event:mouse-action',
				startTime: 0,
				data: { category: 'mouse-action', eventName: 'click', duration: 1800, elementName: '' },
			},
			{
				type: 'user-event:mouse-movement',
				startTime: 0,
				data: { category: 'mouse-movement', eventName: 'move', duration: 1500, elementName: '' },
			},
			{
				type: 'user-event:keyboard',
				startTime: 0,
				data: { category: 'keyboard', eventName: 'input', duration: 328, elementName: '' },
			},
			{
				type: 'user-event:keyboard',
				startTime: 0,
				data: { category: 'keyboard', eventName: 'input', duration: 982, elementName: '' },
			},
			{
				type: 'user-event:form',
				startTime: 0,
				data: { category: 'form', eventName: 'submit', duration: 100, elementName: '' },
			},
		];

		const result = getLatencyPercentiles(events);

		expect(result).toEqual({
			p50: 982,
			p85: 1620,
			p90: 1680,
			p95: 1740,
			p99: 1788,
		});
	});

	it('should handle empty array of events', () => {
		const result = getLatencyPercentiles([]);
		expect(result).toBeNull();
	});
});

describe('calculatePercentile', () => {
	it('should return the single element for a single-element array', () => {
		expect(calculatePercentile([42], 50)).toBe(42);
		expect(calculatePercentile([42], 85)).toBe(42);
	});

	it('should return the correct percentiles for an array with two elements', () => {
		expect(calculatePercentile([10, 20], 50)).toBe(15);
		expect(calculatePercentile([10, 20], 0)).toBe(10);
		expect(calculatePercentile([10, 20], 100)).toBe(20);
	});

	it('should handle arrays with duplicate values correctly', () => {
		expect(calculatePercentile([1, 1, 1, 1], 50)).toBe(1);
		expect(calculatePercentile([5, 5, 5, 5, 5], 90)).toBe(5);
	});

	it('should calculate percentiles correctly for a sorted array', () => {
		const arr = [1, 2, 3, 4, 5].sort((a, b) => a - b);
		expect(calculatePercentile(arr, 50)).toBe(3);
		expect(calculatePercentile(arr, 20)).toBe(1.8);
		expect(calculatePercentile(arr, 80)).toBe(4.2);
		expect(calculatePercentile(arr, 100)).toBe(5);
		expect(calculatePercentile(arr, 0)).toBe(1);
	});

	it('should calculate percentiles correctly for an unsorted array', () => {
		const arr = [5, 1, 3, 4, 2].sort((a, b) => a - b);

		expect(calculatePercentile(arr, 50)).toBe(3);
		expect(calculatePercentile(arr, 20)).toBe(1.8);
		expect(calculatePercentile(arr, 80)).toBe(4.2);
	});

	it('should return exact percentiles when they fall on an index', () => {
		const arr = [10, 20, 30, 40, 50];
		expect(calculatePercentile(arr, 25)).toBe(20);
		expect(calculatePercentile(arr, 75)).toBe(40);
	});

	it('should handle extreme percentiles', () => {
		const arr = [7, 3, 4, 8, 5, 2, 9, 1, 6].sort((a, b) => a - b);
		expect(calculatePercentile(arr, 0)).toBe(1);
		expect(calculatePercentile(arr, 100)).toBe(9);
	});
});
