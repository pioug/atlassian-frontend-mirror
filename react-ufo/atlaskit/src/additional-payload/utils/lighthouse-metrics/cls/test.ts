import { BufferWithMaxLength } from '../utils/buffer';

import type { LayoutShiftAttribution, LayoutShiftPerformanceEntry } from './types';

import { getCLS } from './index';

type LayoutShiftTestEntry = {
	startTime: number;
	duration: number;
	value: number;
	sources?: LayoutShiftAttribution[];
};

const createRect = ({
	x,
	y,
	width,
	height,
}: {
	x: number;
	y: number;
	width: number;
	height: number;
}): DOMRectReadOnly => ({
	x,
	y,
	width,
	height,
	top: y,
	right: x + width,
	bottom: y + height,
	left: x,
	toJSON: () => ({}),
});

const shiftedSource: LayoutShiftAttribution = {
	node: document.createElement('div'),
	previousRect: createRect({ x: 0, y: 0, width: 100, height: 100 }),
	currentRect: createRect({ x: 0, y: 10, width: 100, height: 100 }),
	toJSON: () => ({}),
};

const unchangedSource: LayoutShiftAttribution = {
	node: document.createElement('div'),
	previousRect: createRect({ x: 0, y: 0, width: 100, height: 100 }),
	currentRect: createRect({ x: 0, y: 0, width: 100, height: 100 }),
	toJSON: () => ({}),
};

const makeBuffer = (arr: LayoutShiftTestEntry[]) => {
	const buffer = new BufferWithMaxLength<LayoutShiftPerformanceEntry>();
	arr.forEach((a) => {
		buffer.push({
			...a,
			entryType: 'layout-shift',
			name: '',
			toJSON: () => a,
			sources: a.sources ?? [shiftedSource],
		});
	});
	return buffer;
};
describe('tbt', () => {
	test('should return 0 when tasks before event', () => {
		expect(getCLS(100, 200, makeBuffer([{ startTime: 1, duration: 0, value: 0.7 }]))).toBe(0);
	});

	test('should return 0 when tasks after event', () => {
		expect(getCLS(100, 200, makeBuffer([{ startTime: 201, duration: 0, value: 0.7 }]))).toBe(0);
	});

	test('should return 0 when no tasks', () => {
		expect(getCLS(100, 200, makeBuffer([]))).toBe(0);
	});

	test('should return sum of layout shifts within one 5s session where not more than 1s between shifts', () => {
		expect(
			getCLS(
				0,
				20000,
				makeBuffer([
					{ startTime: 1, duration: 0, value: 0.7 },
					{ startTime: 51, duration: 0, value: 0.7 },
				]),
			),
		).toBe(1.4);
	});

	test('should exclude layout shifts where all sources have unchanged rect positions', () => {
		expect(
			getCLS(
				0,
				20000,
				makeBuffer([
					{ startTime: 1, duration: 0, value: 0.7, sources: [unchangedSource] },
					{ startTime: 51, duration: 0, value: 0.5 },
				]),
			),
		).toBe(0.5);
	});

	test('should group layout shifts into two groups and return max when distance is more than 1s', () => {
		expect(
			getCLS(
				0,
				20000,
				makeBuffer([
					{ startTime: 1, duration: 0, value: 0.7 },
					{ startTime: 1051, duration: 0, value: 0.7 },
				]),
			),
		).toBe(0.7);
	});

	test('should group layout shifts into two groups when they happen over 5s time window', () => {
		expect(
			getCLS(
				0,
				20000,
				makeBuffer([
					{ startTime: 1, duration: 0, value: 0.1 },
					{ startTime: 500, duration: 0, value: 0.1 },
					{ startTime: 1000, duration: 0, value: 0.1 },
					{ startTime: 1500, duration: 0, value: 0.1 },
					{ startTime: 2000, duration: 0, value: 0.1 },
					{ startTime: 2500, duration: 0, value: 0.1 },
					{ startTime: 3000, duration: 0, value: 0.1 },
					{ startTime: 3500, duration: 0, value: 0.1 },
					{ startTime: 4000, duration: 0, value: 0.1 },
					{ startTime: 4500, duration: 0, value: 0.1 },
					{ startTime: 5000, duration: 0, value: 0.1 },
					{ startTime: 5500, duration: 0, value: 0.1 },
					{ startTime: 6000, duration: 0, value: 0.1 },
				]),
			),
		).toBe(1.1);
	});
});
