import type { RevisionPayloadVCDetails } from '../../types';

import { calculatePercentiles } from './index';

describe('calculatePercentiles', () => {
	it('should correctly calculate percentiles with accumulated elements from timestamps', () => {
		const timePixelCounts = new Map([
			[100, 10],
			[200, 20],
			[300, 10],
			[400, 10],
		]);

		const elementMap = new Map([
			[100, new Set(['div', 'span'])],
			[200, new Set(['img'])],
			[300, new Set(['p', 'a'])],
			[400, new Set(['img'])],
		]);

		const percentiles = [10, 50, 100];

		const expected: RevisionPayloadVCDetails = {
			'10': { t: 100, e: ['div', 'span'] },
			'50': { t: 200, e: ['img'] },
			'100': { t: 400, e: ['p', 'a', 'img'] },
		};

		const result = calculatePercentiles(timePixelCounts, elementMap, percentiles, 50);
		expect(result).toEqual(expected);
	});

	it('should handle empty entries gracefully', () => {
		const timePixelCounts = new Map();
		const elementMap = new Map();
		const percentiles = [10, 50, 90];

		const expected: RevisionPayloadVCDetails = {
			'10': { t: 0, e: [] },
			'50': { t: 0, e: [] },
			'90': { t: 0, e: [] },
		};

		const result = calculatePercentiles(timePixelCounts, elementMap, percentiles, 100);
		expect(result).toEqual(expected);
	});

	it('should handle non-sequential timestamps', () => {
		const timePixelCounts = new Map([
			[300, 70],
			[100, 30],
		]);

		const elementMap = new Map([
			[300, new Set(['p', 'a'])],
			[100, new Set(['div'])],
		]);

		const percentiles = [10, 50, 90];

		const expected: RevisionPayloadVCDetails = {
			'10': { t: 100, e: ['div'] },
			'50': { t: 300, e: ['p', 'a'] },
			'90': { t: 300, e: ['p', 'a'] },
		};

		const result = calculatePercentiles(timePixelCounts, elementMap, percentiles, 100);
		expect(result).toEqual(expected);
	});
});
