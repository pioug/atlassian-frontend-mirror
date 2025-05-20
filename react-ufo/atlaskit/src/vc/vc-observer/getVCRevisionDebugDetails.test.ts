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
	};

	const mockVCEntries = [
		{
			time: 100,
			vc: 50,
			elements: ['test-element'],
		},
	];

	it('should return correct revision debug details', () => {
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
			vcLogs: [
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
						},
					],
				},
			],
		});
	});

	it('should handle missing log entries', () => {
		const result = getVCRevisionDebugDetails({
			revision: 'fy25.01',
			isClean: true,
			abortReason: null,
			VCEntries: [
				{
					time: 200,
					vc: 50,
					elements: ['non-existent-element'],
				},
			],
			componentsLog: mockComponentsLog,
		});

		expect(result.vcLogs[0].entries[0]).toEqual({
			elementName: 'non-existent-element',
			type: undefined,
			rect: undefined,
			visible: true,
			attributeName: undefined,
			oldValue: undefined,
			newValue: undefined,
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
});
