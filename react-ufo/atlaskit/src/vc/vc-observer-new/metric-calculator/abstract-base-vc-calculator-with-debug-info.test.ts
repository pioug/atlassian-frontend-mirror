import { fg } from '@atlaskit/platform-feature-flags';

import { VCAbortReason } from '../../../common/vc/types';
import { VCObserverEntry, VCObserverEntryType } from '../types';

import AbstractVCCalculatorBase from './abstract-base-vc-calculator';
import * as calculateTTVCPercentiles from './percentile-calc';
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

describe('AbstractVCCalculatorBase WithDebugInfo', () => {
	let calculator: TestVCCalculator;

	beforeEach(() => {
		calculator = new TestVCCalculator('test-revision');
		jest.spyOn(getViewportWidth, 'default').mockReturnValue(1024);
		jest.spyOn(getViewportHeight, 'default').mockReturnValue(768);
		mockFg.mockImplementation((key) => {
			if (key === 'platform_ufo_ttvc_v3_devtool') {
				return true;
			}
			return false;
		});
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
		});

		expect(result).toEqual({
			revision: 'test-revision',
			clean: true,
			'metric:vc90': 100,
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
			},
		});
	});

	it('should handle unclean status with abort reason', async () => {
		mockFg.mockImplementation((key) => {
			if (key === 'platform_ufo_add_vc_abort_reason_by_revisions') {
				return true;
			}
			if (key === 'platform_ufo_ttvc_v3_devtool') {
				return true;
			}
			return false;
		});

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
		});

		expect(result).toEqual({
			revision: 'test-revision',
			'metric:vc90': null,
			clean: false,
			abortReason: 'scroll',
		});
	});
});
