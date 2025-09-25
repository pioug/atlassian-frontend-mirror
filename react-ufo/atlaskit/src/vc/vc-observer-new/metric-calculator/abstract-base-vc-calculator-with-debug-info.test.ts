import type { VCAbortReason } from '../../../common/vc/types';
import type { VCObserverEntry, VCObserverEntryType } from '../types';

import AbstractVCCalculatorBase from './abstract-base-vc-calculator';
import * as calculateTTVCPercentiles from './percentile-calc';
import * as getViewportHeight from './utils/get-viewport-height';
import * as getViewportWidth from './utils/get-viewport-width';

// Mock canvas functionality for tests
jest.mock('./percentile-calc/canvas-heatmap/canvas-pixel', () => ({
	ViewportCanvas: jest.fn().mockImplementation(() => ({
		drawRect: jest.fn(),
		getPixelCounts: jest.fn().mockResolvedValue(new Map()),
		getScaledDimensions: jest.fn().mockReturnValue({ width: 100, height: 100 }),
	})),
}));

// Create a concrete implementation for testing
class TestVCCalculator extends AbstractVCCalculatorBase {
	protected isEntryIncluded(entry: VCObserverEntry): boolean {
		return true; // For testing purposes
	}

	protected isVCClean(filteredEntries: ReadonlyArray<VCObserverEntry>): boolean {
		return true; // For testing purposes
	}

	protected getVCCleanStatus(filteredEntries: ReadonlyArray<VCObserverEntry>) {
		return { isVCClean: true }; // For testing purposes
	}
}

describe('AbstractVCCalculatorBase WithDebugInfo', () => {
	let calculator: TestVCCalculator;

	beforeEach(() => {
		calculator = new TestVCCalculator('test-revision');
		jest.spyOn(getViewportWidth, 'default').mockReturnValue(1024);
		jest.spyOn(getViewportHeight, 'default').mockReturnValue(768);
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should calculate metrics when entries are valid', async () => {
		const mockCalcResult = [
			{
				time: 100,
				viewportPercentage: 90,
				entries: [
					{
						type: 'mutation:element' as VCObserverEntryType,
						elementName: 'div1',
						rect: new DOMRect(),
						visible: true,
					},
					{
						type: 'mutation:element' as VCObserverEntryType,
						elementName: 'div2',
						rect: new DOMRect(),
						visible: true,
					},
				],
			},
			{
				time: 200,
				viewportPercentage: 95,
				entries: [
					{
						type: 'mutation:element' as VCObserverEntryType,
						elementName: 'div3',
						rect: new DOMRect(),
						visible: true,
					},
				],
			},
		];

		jest
			.spyOn(calculateTTVCPercentiles, 'calculateTTVCPercentilesWithDebugInfo')
			.mockResolvedValue(mockCalcResult);

		const mockEntry: VCObserverEntry = {
			time: 0,
			data: {
				type: 'mutation:element' as VCObserverEntryType,
				elementName: 'div',
				rect: new DOMRect(),
				visible: true,
			},
		};

		const result = await calculator.calculate({
			orderedEntries: [mockEntry],
			startTime: 0,
			stopTime: 1000,
			interactionId: 'test-interaction-id',
			isPostInteraction: false,
			interactionType: 'page_load',
			isPageVisible: true,
		});

		expect(result).toEqual({
			revision: 'test-revision',
			clean: true,
			'metric:vc90': 100,
			ratios: {
				div: 0,
			},
			vcDetails: {
				'25': { t: 100, e: ['div1', 'div2'] },
				'50': { t: 100, e: ['div1', 'div2'] },
				'75': { t: 100, e: ['div1', 'div2'] },
				'80': { t: 100, e: ['div1', 'div2'] },
				'85': { t: 100, e: ['div1', 'div2'] },
				'90': { t: 100, e: ['div1', 'div2'] },
				'95': { t: 200, e: ['div3'] },
				'98': { t: 200, e: ['div3'] },
				'99': { t: 200, e: ['div3'] },
				'100': { t: 200, e: ['div3'] },
			},
		});
	});

	it('should handle unclean status with abort reason', async () => {
		const mockCalculator = new (class extends AbstractVCCalculatorBase {
			protected isEntryIncluded() {
				return true;
			}
			protected isVCClean() {
				return false;
			}
			protected getVCCleanStatus() {
				return {
					isVCClean: false,
					dirtyReason: 'scroll' as VCAbortReason,
				};
			}
		})('test-revision');

		const result = await mockCalculator.calculate({
			orderedEntries: [],
			startTime: 0,
			stopTime: 1000,
			interactionId: 'test-interaction-id',
			isPostInteraction: false,
			interactionType: 'page_load',
			isPageVisible: true,
		});

		expect(result).toEqual({
			revision: 'test-revision',
			'metric:vc90': null,
			clean: false,
			abortReason: 'scroll',
		});
	});
});
