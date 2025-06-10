import type { VCObserverEntryType } from '../vc-observer-new/types';

import { getVCRevisionDebugDetails } from './getVCRevisionDebugDetails';

describe('getVCRevisionDebugDetails', () => {
	const mockComponentsLog = {
		'100': [
			{
				targetName: 'test-element',
				type: 'mutation' as VCObserverEntryType,
				intersectionRect: {
					top: 0,
					left: 0,
					right: 100,
					bottom: 100,
					width: 100,
					height: 100,
					x: 0,
					y: 0,
					toJSON: () => ({}),
				} as DOMRect,
				attributeName: 'class',
				oldValue: 'old-class',
				newValue: 'new-class',
				__debug__element: null,
			},
		],
		'150': [
			{
				targetName: 'ignored-element',
				type: 'mutation' as VCObserverEntryType,
				intersectionRect: {
					top: 0,
					left: 0,
					right: 50,
					bottom: 50,
					width: 50,
					height: 50,
					x: 0,
					y: 0,
					toJSON: () => ({}),
				} as DOMRect,
				ignoreReason: 'image' as const,
				__debug__element: null,
			},
		],
		'250': [
			{
				targetName: 'another-ignored-element',
				type: 'mutation' as VCObserverEntryType,
				intersectionRect: {
					top: 0,
					left: 0,
					right: 75,
					bottom: 75,
					width: 75,
					height: 75,
					x: 0,
					y: 0,
					toJSON: () => ({}),
				} as DOMRect,
				ignoreReason: 'not-visible' as const,
				__debug__element: null,
			},
		],
	};

	const mockVCEntries = [
		{
			time: 100,
			vc: 50,
			elements: ['test-element'],
		},
		{
			time: 200,
			vc: 75,
			elements: ['another-element'],
		},
	];

	it('should return correct revision debug details with regular elements', () => {
		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			VCEntries: mockVCEntries,
			componentsLog: mockComponentsLog,
			interactionId: 'test-interaction',
		});

		expect(result).toEqual({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			interactionId: 'test-interaction',
			vcLogs: expect.arrayContaining([
				{
					time: 100,
					viewportPercentage: 50,
					entries: [
						{
							elementName: 'test-element',
							type: 'mutation',
							rect: {
								top: 0,
								left: 0,
								right: 100,
								bottom: 100,
								width: 100,
								height: 100,
								x: 0,
								y: 0,
								toJSON: expect.any(Function),
							},
							visible: true,
							attributeName: 'class',
							oldValue: 'old-class',
							newValue: 'new-class',
							ignoreReason: undefined,
						},
					],
				},
			]),
		});
	});

	it('should include ignored elements with correct viewport percentage', () => {
		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			VCEntries: mockVCEntries,
			componentsLog: mockComponentsLog,
		});

		// Find ignored element entries
		const ignoredAtTime150 = result.vcLogs.find((log) => log.time === 150);
		const ignoredAtTime250 = result.vcLogs.find((log) => log.time === 250);

		expect(ignoredAtTime150).toEqual({
			time: 150,
			viewportPercentage: 50, // Biggest previous VC at time <= 150 is 50 from time 100
			entries: [
				{
					elementName: 'ignored-element',
					type: 'mutation',
					rect: expect.any(Object),
					visible: false,
					attributeName: undefined,
					oldValue: undefined,
					newValue: undefined,
					ignoreReason: 'image',
				},
			],
		});

		expect(ignoredAtTime250).toEqual({
			time: 250,
			viewportPercentage: 75, // Biggest previous VC at time <= 250 is 75 from time 200
			entries: [
				{
					elementName: 'another-ignored-element',
					type: 'mutation',
					rect: expect.any(Object),
					visible: false,
					attributeName: undefined,
					oldValue: undefined,
					newValue: undefined,
					ignoreReason: 'not-visible',
				},
			],
		});
	});

	it('should sort vcLogs by time', () => {
		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			VCEntries: mockVCEntries,
			componentsLog: mockComponentsLog,
		});

		const times = result.vcLogs.map((log) => log.time);
		const sortedTimes = [...times].sort((a, b) => a - b);
		expect(times).toEqual(sortedTimes);
	});

	it('should handle ignored elements before any VC entries', () => {
		const earlyIgnoredLog = {
			'50': [
				{
					targetName: 'early-ignored',
					type: 'mutation' as VCObserverEntryType,
					intersectionRect: {} as DOMRect,
					ignoreReason: 'ssr-hydration' as const,
					__debug__element: null,
				},
			],
		};

		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			VCEntries: mockVCEntries,
			componentsLog: earlyIgnoredLog,
		});

		const earlyIgnored = result.vcLogs.find((log) => log.time === 50);
		expect(earlyIgnored?.viewportPercentage).toBeNull();
	});

	it('should handle missing log entries', () => {
		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			VCEntries: [
				{
					time: 300,
					vc: 50,
					elements: ['non-existent-element'],
				},
			],
			componentsLog: mockComponentsLog,
		});

		expect(result.vcLogs.find((log) => log.time === 300)?.entries[0]).toEqual({
			elementName: 'non-existent-element',
			type: undefined,
			rect: undefined,
			visible: true,
			attributeName: undefined,
			oldValue: undefined,
			newValue: undefined,
			ignoreReason: undefined,
		});
	});

	it('should handle aborted state', () => {
		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: false,
			abortReason: 'scroll',
			VCEntries: mockVCEntries,
			componentsLog: mockComponentsLog,
		});

		expect(result).toEqual({
			revision: 'fy25.01',
			isClean: false,
			abortReason: 'scroll',
			vcLogs: expect.any(Array),
		});
	});

	it('should handle empty components log', () => {
		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			VCEntries: mockVCEntries,
			componentsLog: {},
		});

		expect(result.vcLogs).toHaveLength(2); // Only VC entries, no ignored elements
		expect(
			result.vcLogs.every((log) => log.entries.length > 0 && log.entries[0].visible === true),
		).toBe(true);
	});

	it('should handle timestamps with mixed ignored and regular elements', () => {
		const mixedLog = {
			'100': [
				{
					targetName: 'regular-element',
					type: 'mutation' as VCObserverEntryType,
					intersectionRect: {} as DOMRect,
					__debug__element: null,
				},
				{
					targetName: 'ignored-element',
					type: 'mutation' as VCObserverEntryType,
					intersectionRect: {} as DOMRect,
					ignoreReason: 'image' as const,
					__debug__element: null,
				},
			],
		};

		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			VCEntries: [{ time: 100, vc: 50, elements: ['regular-element'] }],
			componentsLog: mixedLog,
		});

		expect(result.vcLogs).toHaveLength(2); // One for regular VC entry, one for ignored elements

		const regularEntry = result.vcLogs.find((log) => log.viewportPercentage === 50);
		const ignoredEntry = result.vcLogs.find((log) => log.entries[0]?.ignoreReason === 'image');

		expect(regularEntry?.entries[0].visible).toBe(true);
		expect(ignoredEntry?.entries[0].visible).toBe(false);
	});
});
