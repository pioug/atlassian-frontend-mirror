// abstract-base-vc-calculator.test.ts
import { fg } from '@atlaskit/platform-feature-flags';

import { VCObserverEntry } from '../types';

import AbstractVCCalculatorBase from './abstract-base-vc-calculator';
import * as percentileCalc from './percentile-calc';
import * as getViewportHeight from './utils/get-viewport-height';
import * as getViewportWidth from './utils/get-viewport-width';

jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

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

describe('AbstractVCCalculatorBase V1', () => {
	let calculator: TestVCCalculator;

	beforeEach(() => {
		calculator = new TestVCCalculator('test-revision');
		jest.spyOn(getViewportWidth, 'default').mockReturnValue(1024);
		jest.spyOn(getViewportHeight, 'default').mockReturnValue(768);
		mockFg.mockImplementation((key) => {
			if (key === 'platform_ufo_ttvc_v3_devtool') {
				return false;
			}
			return false;
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should return unclean result when isVCClean returns false', async () => {
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
				};
			}
		})('test-revision');

		const result = await mockCalculator.calculate({
			orderedEntries: [],
			startTime: 0,
			stopTime: 1000,
			interactionId: 'test-interaction-id',
			isPostInteraction: false,
		});

		expect(result).toEqual({
			revision: 'test-revision',
			'metric:vc90': null,
			clean: false,
		});
	});

	it('should calculate metrics when entries are valid', async () => {
		const mockCalcResult = {
			'25': { t: 100, e: ['div1', 'div2'] },
			'50': { t: 100, e: ['div1', 'div2'] },
			'75': { t: 100, e: ['div1', 'div2'] },
			'80': { t: 100, e: ['div1', 'div2'] },
			'85': { t: 100, e: ['div1', 'div2'] },
			'90': { t: 100, e: ['div1', 'div2'] },
			'95': { t: 200, e: ['div3'] },
			'98': { t: 200, e: ['div3'] },
			'99': { t: 200, e: ['div3'] },
		};

		jest.spyOn(percentileCalc, 'calculateTTVCPercentiles').mockResolvedValue(mockCalcResult);

		const mockEntry: VCObserverEntry = {
			time: 0,
			data: {
				type: 'mutation:element',
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
		});

		expect(result).toEqual({
			revision: 'test-revision',
			clean: true,
			'metric:vc90': 100,
			vcDetails: mockCalcResult,
		});
	});

	it('should filter entries using isEntryIncluded', async () => {
		const mockCalculator = new (class extends AbstractVCCalculatorBase {
			protected isEntryIncluded(entry: VCObserverEntry) {
				return 'type' in entry.data && entry.data.type === 'mutation:element';
			}
			protected isVCClean() {
				return true;
			}
			protected getVCCleanStatus() {
				return {
					isVCClean: true,
				};
			}
		})('test-revision');

		const entries: VCObserverEntry[] = [
			{
				time: 0,
				data: {
					type: 'mutation:element',
					elementName: 'div',
					rect: new DOMRect(),
					visible: true,
				},
			},
			{
				time: 1,
				data: {
					type: 'window:event',
					eventType: 'scroll',
				},
			},
		];

		await mockCalculator.calculate({
			orderedEntries: entries,
			startTime: 0,
			stopTime: 1000,
			interactionId: 'test-interaction-id',
			isPostInteraction: false,
		});

		expect(percentileCalc.calculateTTVCPercentiles).toHaveBeenCalledWith(
			expect.objectContaining({
				orderedEntries: [entries[0]],
			}),
		);
	});
});
