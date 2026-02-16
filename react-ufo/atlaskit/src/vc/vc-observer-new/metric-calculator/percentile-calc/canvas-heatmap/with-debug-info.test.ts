import type { ViewportEntryData } from '../../../types';

import { calculatePercentilesWithDebugInfo } from './index';

// Test utilities
const createMockRect = (x = 0, y = 0, width = 100, height = 100) =>
	new MockDOMRect(x, y, width, height);

const createViewportEntry = (
	elementName: string,
	rect = createMockRect(),
	visible = true,
	type: ViewportEntryData['type'] = 'mutation:element',
): ViewportEntryData => ({
	elementName,
	rect,
	visible,
	type,
});

const createTimePixelCounts = (counts: [number, number][]) => new Map(counts);

const createElementMap = (entries: [number, ViewportEntryData[]][]) => new Map(entries);

const createExpectedResult = (
	time: number,
	viewportPercentage: number,
	entries: ViewportEntryData[],
) => ({
	time,
	viewportPercentage,
	entries,
});

class MockDOMRect {
	constructor(
		public x: number,
		public y: number,
		public width: number,
		public height: number,
	) {}
	get bottom() {
		return this.y + this.height;
	}
	get left() {
		return this.x;
	}
	get right() {
		return this.x + this.width;
	}
	get top() {
		return this.y;
	}
	toJSON() {
		return { x: this.x, y: this.y, width: this.width, height: this.height };
	}
}

describe('calculatePercentilesWithDebugInfo', () => {
	it('should correctly calculate percentiles with accumulated elements from timestamps', () => {
		const timePixelCounts = createTimePixelCounts([
			[100, 10],
			[200, 20],
			[300, 10],
			[400, 10],
		]);

		const elementMap = createElementMap([
			[100, [createViewportEntry('div'), createViewportEntry('span')]],
			[200, [createViewportEntry('img')]],
			[300, [createViewportEntry('p'), createViewportEntry('a')]],
			[400, [createViewportEntry('img')]],
		]);

		const expectedEntries = [
			createExpectedResult(100, 20, [createViewportEntry('div'), createViewportEntry('span')]),
			createExpectedResult(200, 60, [createViewportEntry('img')]),
			createExpectedResult(300, 80, [createViewportEntry('p'), createViewportEntry('a')]),
			createExpectedResult(400, 100, [createViewportEntry('img')]),
		];

		const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 50, 0);
		expect(result.entries).toEqual(expectedEntries);
		// Speed index = 100*0.2 + 200*0.4 + 300*0.2 + 400*0.2 = 20 + 80 + 60 + 80 = 240
		expect(result.speedIndex).toEqual(240);
	});

	it('should handle empty entries gracefully', () => {
		const timePixelCounts = new Map();
		const elementMap = new Map<number, ViewportEntryData[]>();

		const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 100, 0);
		expect(result.entries).toEqual([]);
		expect(result.speedIndex).toEqual(0);
	});

	it('should handle non-sequential timestamps', () => {
		const timePixelCounts = createTimePixelCounts([
			[300, 70],
			[100, 30],
		]);

		const elementMap = createElementMap([
			[300, [createViewportEntry('p'), createViewportEntry('a')]],
			[100, [createViewportEntry('div')]],
		]);

		const expectedEntries = [
			createExpectedResult(100, 30, [createViewportEntry('div')]),
			createExpectedResult(300, 100, [createViewportEntry('p'), createViewportEntry('a')]),
		];

		const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 100, 0);
		expect(result.entries).toEqual(expectedEntries);
		// Speed index = 100*0.3 + 300*0.7 = 30 + 210 = 240
		expect(result.speedIndex).toEqual(240);
	});

	it('should correctly calculate percentiles with startTime offset', () => {
		const timePixelCounts = createTimePixelCounts([
			[100, 10],
			[200, 20],
			[300, 10],
			[400, 10],
		]);

		const elementMap = createElementMap([
			[100, [createViewportEntry('div'), createViewportEntry('span')]],
			[200, [createViewportEntry('img')]],
			[300, [createViewportEntry('p'), createViewportEntry('a')]],
			[400, [createViewportEntry('img')]],
		]);

		const expectedEntries = [
			createExpectedResult(50, 20, [createViewportEntry('div'), createViewportEntry('span')]),
			createExpectedResult(150, 60, [createViewportEntry('img')]),
			createExpectedResult(250, 80, [createViewportEntry('p'), createViewportEntry('a')]),
			createExpectedResult(350, 100, [createViewportEntry('img')]),
		];

		const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 50, 50);
		expect(result.entries).toEqual(expectedEntries);
		// Speed index = 50*0.2 + 150*0.4 + 250*0.2 + 350*0.2 = 10 + 60 + 50 + 70 = 190
		expect(result.speedIndex).toEqual(190);
	});

	describe('speed index calculation', () => {
		it('should calculate speed index correctly for evenly distributed paints', () => {
			// 4 elements, each covering 25% of viewport at times 5, 10, 15, 20
			const timePixelCounts = createTimePixelCounts([
				[5, 25],
				[10, 25],
				[15, 25],
				[20, 25],
			]);

			const elementMap = createElementMap([
				[5, [createViewportEntry('a')]],
				[10, [createViewportEntry('b')]],
				[15, [createViewportEntry('c')]],
				[20, [createViewportEntry('d')]],
			]);

			const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 100, 0);
			// Speed index = 5*0.25 + 10*0.25 + 15*0.25 + 20*0.25 = 1.25 + 2.5 + 3.75 + 5 = 12.5 → 13 (rounded)
			expect(result.speedIndex).toEqual(13);
		});

		it('should calculate speed index with startTime offset', () => {
			const timePixelCounts = createTimePixelCounts([
				[100, 10],
				[200, 20],
				[300, 10],
				[400, 10],
			]);

			const elementMap = createElementMap([
				[100, [createViewportEntry('div'), createViewportEntry('span')]],
				[200, [createViewportEntry('img')]],
				[300, [createViewportEntry('p'), createViewportEntry('a')]],
				[400, [createViewportEntry('img')]],
			]);

			const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 50, 50);
			// Speed index = 50*0.2 + 150*0.4 + 250*0.2 + 350*0.2 = 10 + 60 + 50 + 70 = 190
			expect(result.speedIndex).toEqual(190);
		});

		it('should calculate speed index for non-sequential timestamps', () => {
			const timePixelCounts = createTimePixelCounts([
				[300, 70],
				[100, 30],
			]);

			const elementMap = createElementMap([
				[300, [createViewportEntry('p'), createViewportEntry('a')]],
				[100, [createViewportEntry('div')]],
			]);

			const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 100, 0);
			// Speed index = 100*0.3 + 300*0.7 = 30 + 210 = 240
			expect(result.speedIndex).toEqual(240);
		});

		it('should return 0 for empty entries', () => {
			const timePixelCounts = new Map();
			const elementMap = new Map<number, ViewportEntryData[]>();

			const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 100, 0);
			expect(result.speedIndex).toEqual(0);
		});
	});
});
