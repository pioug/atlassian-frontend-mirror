import { calculatePercentiles } from './index';

// Test utilities
const createTimePixelCounts = (counts: [number, number][]) => new Map(counts);

const createElementMap = (entries: [number, Set<string>][]) => new Map(entries);

describe('calculatePercentiles', () => {
	it('should correctly calculate percentiles with accumulated elements from timestamps', () => {
		const timePixelCounts = createTimePixelCounts([
			[100, 10],
			[200, 20],
			[300, 10],
			[400, 10],
		]);

		const elementMap = createElementMap([
			[100, new Set(['div', 'span'])],
			[200, new Set(['img'])],
			[300, new Set(['p', 'a'])],
			[400, new Set(['img'])],
		]);

		const expected = {
			'25': { t: 200, e: ['div', 'span', 'img'] },
			'50': { t: 200, e: ['div', 'span', 'img'] },
			'75': { t: 300, e: ['p', 'a'] },
			'90': { t: 400, e: ['img'] },
			'95': { t: 400, e: ['img'] },
			'99': { t: 400, e: ['img'] },
		};

		const result = calculatePercentiles(
			timePixelCounts,
			elementMap,
			[25, 50, 75, 90, 95, 99],
			50,
			0,
		);
		expect(result).toEqual(expected);
	});

	it('should handle empty entries gracefully', () => {
		const timePixelCounts = new Map();
		const elementMap = new Map<number, Set<string>>();
		const expected = {
			'25': { t: 0, e: [] },
			'50': { t: 0, e: [] },
			'75': { t: 0, e: [] },
			'90': { t: 0, e: [] },
			'95': { t: 0, e: [] },
			'99': { t: 0, e: [] },
		};

		const result = calculatePercentiles(
			timePixelCounts,
			elementMap,
			[25, 50, 75, 90, 95, 99],
			100,
			0,
		);
		expect(result).toEqual(expected);
	});

	it('should handle non-sequential timestamps', () => {
		const timePixelCounts = createTimePixelCounts([
			[300, 70],
			[100, 30],
		]);

		const elementMap = createElementMap([
			[300, new Set(['p', 'a'])],
			[100, new Set(['div'])],
		]);

		const expected = {
			'25': { t: 100, e: ['div'] },
			'50': { t: 300, e: ['p', 'a'] },
			'75': { t: 300, e: ['p', 'a'] },
			'90': { t: 300, e: ['p', 'a'] },
			'95': { t: 300, e: ['p', 'a'] },
			'99': { t: 300, e: ['p', 'a'] },
		};

		const result = calculatePercentiles(
			timePixelCounts,
			elementMap,
			[25, 50, 75, 90, 95, 99],
			100,
			0,
		);
		expect(result).toEqual(expected);
	});

	it('should correctly calculate percentiles with startTime offset', () => {
		const timePixelCounts = createTimePixelCounts([
			[100, 10],
			[200, 20],
			[300, 10],
			[400, 10],
		]);

		const elementMap = createElementMap([
			[100, new Set(['div', 'span'])],
			[200, new Set(['img'])],
			[300, new Set(['p', 'a'])],
			[400, new Set(['img'])],
		]);

		const expected = {
			'25': { t: 150, e: ['div', 'span', 'img'] },
			'50': { t: 150, e: ['div', 'span', 'img'] },
			'75': { t: 250, e: ['p', 'a'] },
			'90': { t: 350, e: ['img'] },
			'95': { t: 350, e: ['img'] },
			'99': { t: 350, e: ['img'] },
		};

		const result = calculatePercentiles(
			timePixelCounts,
			elementMap,
			[25, 50, 75, 90, 95, 99],
			50,
			50,
		);
		expect(result).toEqual(expected);
	});
});
