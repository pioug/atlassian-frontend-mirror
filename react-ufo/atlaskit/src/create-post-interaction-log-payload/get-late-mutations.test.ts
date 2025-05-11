import { LastInteractionFinishInfo } from '../common';
import { RevisionPayloadVCDetails } from '../common/vc/types';

import getLateMutations from './get-late-mutations';

describe('getLateMutations', () => {
	const mockLastInteractionFinish: LastInteractionFinishInfo = {
		start: 0,
		end: 100,
		ufoName: 'test',
	} as LastInteractionFinishInfo;

	const mockVCRatios: Record<string, number> = {
		'div[testid=main]': 1,
		'div[testid=section1]': 0.5,
		'div[testid=section2]': 0.25,
	};

	it('should return empty array when no vcDetails parts have time after interaction end', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'25': {
				e: ['div[testid=main]'],
				t: 50,
			},
			'50': {
				e: ['div[testid=section1]'],
				t: 75,
			},
		};

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual([]);
	});

	it('should return mutations for vcDetails parts with time after interaction end', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'25': {
				e: ['div[testid=main]'],
				t: 50,
			},
			'50': {
				e: ['div[testid=section1]'],
				t: 150,
			},
			'75': {
				e: ['div[testid=section2]'],
				t: 200,
			},
		};

		const expected = [
			{
				time: 150,
				element: 'div[testid=section1]',
				viewportHeatmapPercentage: 0.5,
			},
			{
				time: 200,
				element: 'div[testid=section2]',
				viewportHeatmapPercentage: 0.25,
			},
		];

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual(expected);
	});

	it('should handle elements without viewport ratios by defaulting to 0', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'50': {
				e: ['div[testid=unknown]'],
				t: 150,
			},
		};

		const expected = [
			{
				time: 150,
				element: 'div[testid=unknown]',
				viewportHeatmapPercentage: 0,
			},
		];

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual(expected);
	});

	it('should handle multiple elements in a single vcDetails part', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'50': {
				e: ['div[testid=section1]', 'div[testid=section2]'],
				t: 150,
			},
		};

		const expected = [
			{
				time: 150,
				element: 'div[testid=section1]',
				viewportHeatmapPercentage: 0.5,
			},
			{
				time: 150,
				element: 'div[testid=section2]',
				viewportHeatmapPercentage: 0.25,
			},
		];

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual(expected);
	});

	it('should handle empty elements array in vcDetails part', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'50': {
				e: [],
				t: 150,
			},
		};

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual([]);
	});

	it('should handle undefined vcDetails parts gracefully', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'50': undefined as any,
			'75': {
				e: ['div[testid=section1]'],
				t: 150,
			},
		};

		const expected = [
			{
				time: 150,
				element: 'div[testid=section1]',
				viewportHeatmapPercentage: 0.5,
			},
		];

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual(expected);
	});

	it('should handle undefined elements array gracefully', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'50': {
				e: undefined as any,
				t: 150,
			},
		};

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual([]);
	});

	it('should handle undefined time value gracefully', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'50': {
				e: ['div[testid=section1]'],
				t: undefined as any,
			},
		};

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual([]);
	});

	it('should deduplicate elements in vcDetails part', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'50': {
				e: ['div[testid=section1]', 'div[testid=section2]', 'div[testid=section1]'],
				t: 150,
			},
		};

		const expected = [
			{
				time: 150,
				element: 'div[testid=section1]',
				viewportHeatmapPercentage: 0.5,
			},
			{
				time: 150,
				element: 'div[testid=section2]',
				viewportHeatmapPercentage: 0.25,
			},
		];

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual(expected);
	});

	it('should deduplicate elements across multiple parts with same timestamp', () => {
		const vcDetails: RevisionPayloadVCDetails = {
			'25': {
				e: ['div[testid=section1]'],
				t: 150,
			},
			'50': {
				e: ['div[testid=section1]', 'div[testid=section2]'],
				t: 150,
			},
			'75': {
				e: ['div[testid=section2]'],
				t: 150,
			},
		};

		const expected = [
			{
				time: 150,
				element: 'div[testid=section1]',
				viewportHeatmapPercentage: 0.5,
			},
			{
				time: 150,
				element: 'div[testid=section2]',
				viewportHeatmapPercentage: 0.25,
			},
		];

		const result = getLateMutations(vcDetails, mockLastInteractionFinish, mockVCRatios);
		expect(result).toEqual(expected);
	});
});
