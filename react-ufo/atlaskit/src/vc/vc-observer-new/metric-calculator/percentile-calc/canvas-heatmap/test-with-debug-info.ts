import { ViewportEntryData } from '../../../types';

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

		const expected = [
			createExpectedResult(100, 20, [createViewportEntry('div'), createViewportEntry('span')]),
			createExpectedResult(200, 60, [createViewportEntry('img')]),
			createExpectedResult(300, 80, [createViewportEntry('p'), createViewportEntry('a')]),
			createExpectedResult(400, 100, [createViewportEntry('img')]),
		];

		const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 50, 0);
		expect(result).toEqual(expected);
	});

	it('should handle empty entries gracefully', () => {
		const timePixelCounts = new Map();
		const elementMap = new Map<number, ViewportEntryData[]>();
		const expected: any[] = [];

		const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 100, 0);
		expect(result).toEqual(expected);
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

		const expected = [
			createExpectedResult(100, 30, [createViewportEntry('div')]),
			createExpectedResult(300, 100, [createViewportEntry('p'), createViewportEntry('a')]),
		];

		const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 100, 0);
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
			[100, [createViewportEntry('div'), createViewportEntry('span')]],
			[200, [createViewportEntry('img')]],
			[300, [createViewportEntry('p'), createViewportEntry('a')]],
			[400, [createViewportEntry('img')]],
		]);

		const expected = [
			createExpectedResult(50, 20, [createViewportEntry('div'), createViewportEntry('span')]),
			createExpectedResult(150, 60, [createViewportEntry('img')]),
			createExpectedResult(250, 80, [createViewportEntry('p'), createViewportEntry('a')]),
			createExpectedResult(350, 100, [createViewportEntry('img')]),
		];

		const result = calculatePercentilesWithDebugInfo(timePixelCounts, elementMap, 50, 50);
		expect(result).toEqual(expected);
	});
});
