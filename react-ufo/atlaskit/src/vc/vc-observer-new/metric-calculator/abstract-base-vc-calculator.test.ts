// abstract-base-vc-calculator.test.ts
import { fg } from '@atlaskit/platform-feature-flags';

import type { VCObserverEntry } from '../types';

import AbstractVCCalculatorBase from './abstract-base-vc-calculator';
import * as percentileCalc from './percentile-calc';
import * as getViewportHeight from './utils/get-viewport-height';
import * as getViewportWidth from './utils/get-viewport-width';

jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

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

describe('AbstractVCCalculatorBase V1', () => {
	let calculator: TestVCCalculator;

	beforeEach(() => {
		calculator = new TestVCCalculator('test-revision');
		jest.spyOn(getViewportWidth, 'default').mockReturnValue(1024);
		jest.spyOn(getViewportHeight, 'default').mockReturnValue(768);

		// Clear window callbacks
		delete (window as any).__ufo_devtool_onVCRevisionReady__;
		delete (window as any).__on_ufo_vc_debug_data_ready;
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
		const mockCalcResult = [
			{
				time: 100,
				viewportPercentage: 90,
				entries: [
					{
						type: 'mutation:element' as const,
						elementName: 'div1',
						rect: new DOMRect(),
						visible: true,
					},
					{
						type: 'mutation:element' as const,
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
						type: 'mutation:element' as const,
						elementName: 'div3',
						rect: new DOMRect(),
						visible: true,
					},
				],
			},
		];

		jest
			.spyOn(percentileCalc, 'calculateTTVCPercentilesWithDebugInfo')
			.mockResolvedValue(mockCalcResult);

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

		// Mock the function to return empty result for testing filtering
		jest.spyOn(percentileCalc, 'calculateTTVCPercentilesWithDebugInfo').mockResolvedValue([]);

		await mockCalculator.calculate({
			orderedEntries: entries,
			startTime: 0,
			stopTime: 1000,
			interactionId: 'test-interaction-id',
			isPostInteraction: false,
		});

		// Verify that calculateTTVCPercentilesWithDebugInfo was called with only the filtered entries
		expect(percentileCalc.calculateTTVCPercentilesWithDebugInfo).toHaveBeenCalledWith(
			expect.objectContaining({
				orderedEntries: [entries[0]], // Only the first entry should be included
			}),
		);
	});

	it('should include ratios when feature flag is enabled', async () => {
		// Enable the ratios feature flag
		mockFg.mockImplementation((key) => {
			if (key === 'platform_ufo_rev_ratios') {
				return true;
			}
			if (key === 'platform_ufo_ttvc_v3_devtool') {
				return false;
			}
			return false;
		});

		// Mock successful VC calculation
		jest.spyOn(percentileCalc, 'calculateTTVCPercentiles').mockResolvedValue({
			'90': { t: 1000, e: ['element1'] },
		});

		const mockEntries: VCObserverEntry[] = [
			{
				time: 100,
				data: {
					type: 'mutation:element',
					elementName: 'element1',
					rect: { width: 100, height: 50, x: 0, y: 0 } as DOMRect,
					visible: true,
				},
			},
			{
				time: 200,
				data: {
					type: 'mutation:element',
					elementName: 'element2',
					rect: { width: 200, height: 100, x: 0, y: 0 } as DOMRect,
					visible: true,
				},
			},
		];

		const result = await calculator.calculate({
			startTime: 0,
			stopTime: 1000,
			orderedEntries: mockEntries,
			isPostInteraction: false,
		});

		expect(result).toBeDefined();
		expect(result?.ratios).toBeDefined();

		// Verify ratios are calculated correctly
		// Total viewport area = 1024 * 768 = 786432
		// element1 area = 100 * 50 = 5000, ratio = 5000/786432 ≈ 0.00636
		// element2 area = 200 * 100 = 20000, ratio = 20000/786432 ≈ 0.02544
		expect(result?.ratios?.element1).toBeCloseTo(5000 / (1024 * 768), 5);
		expect(result?.ratios?.element2).toBeCloseTo(20000 / (1024 * 768), 5);
	});

	it('should not include ratios when feature flag is disabled', async () => {
		// Disable the ratios feature flag
		mockFg.mockImplementation((key) => {
			if (key === 'platform_ufo_rev_ratios') {
				return false;
			}
			if (key === 'platform_ufo_ttvc_v3_devtool') {
				return false;
			}
			return false;
		});

		// Mock successful VC calculation
		jest.spyOn(percentileCalc, 'calculateTTVCPercentiles').mockResolvedValue({
			'90': { t: 1000, e: ['element1'] },
		});

		const mockEntries: VCObserverEntry[] = [
			{
				time: 100,
				data: {
					type: 'mutation:element',
					elementName: 'element1',
					rect: { width: 100, height: 50, x: 0, y: 0 } as DOMRect,
					visible: true,
				},
			},
		];

		const result = await calculator.calculate({
			startTime: 0,
			stopTime: 1000,
			orderedEntries: mockEntries,
			isPostInteraction: false,
		});

		expect(result).toBeDefined();
		expect(result?.ratios).toBeUndefined();
	});

	describe('Debug info calculation optimization', () => {
		let mockDevToolCallback: jest.Mock;
		let mockDebugDataCallback: jest.Mock;
		let mockCalculator: TestVCCalculator;

		beforeEach(() => {
			mockDevToolCallback = jest.fn();
			mockDebugDataCallback = jest.fn();
			mockCalculator = new TestVCCalculator('test-revision');

			// Mock percentile calculation
			jest.spyOn(percentileCalc, 'calculateTTVCPercentilesWithDebugInfo').mockResolvedValue([
				{
					time: 100,
					viewportPercentage: 90,
					entries: [
						{
							type: 'mutation:element' as const,
							elementName: 'div1',
							rect: new DOMRect(),
							visible: true,
						},
					],
				},
			]);
		});

		it('should not calculate debug details when no devtool callbacks exist', async () => {
			// No devtool callbacks set
			const allEntries: VCObserverEntry[] = [
				{
					time: 100,
					data: {
						type: 'mutation:element',
						elementName: 'included-div',
						rect: new DOMRect(),
						visible: true,
					},
				},
				{
					time: 200,
					data: {
						type: 'mutation:element',
						elementName: 'ignored-div',
						rect: new DOMRect(),
						visible: false,
					},
				},
			];

			// Create calculator that excludes the second entry
			const testCalculator = new (class extends AbstractVCCalculatorBase {
				protected isEntryIncluded(entry: VCObserverEntry) {
					return (
						entry.data.type === 'mutation:element' &&
						'visible' in entry.data &&
						entry.data.visible === true
					);
				}
				protected getVCCleanStatus() {
					return { isVCClean: true };
				}
			})('test-revision');

			await testCalculator.calculate({
				orderedEntries: allEntries,
				startTime: 0,
				stopTime: 1000,
				interactionId: 'test-interaction-id',
				isPostInteraction: false,
			});

			// Verify that devtools callbacks were not called (since they don't exist)
			expect(mockDevToolCallback).not.toHaveBeenCalled();
			expect(mockDebugDataCallback).not.toHaveBeenCalled();
		});

		it('should calculate debug details when __ufo_devtool_onVCRevisionReady__ exists', async () => {
			// Set up devtool callback
			(window as any).__ufo_devtool_onVCRevisionReady__ = mockDevToolCallback;

			const allEntries: VCObserverEntry[] = [
				{
					time: 100,
					data: {
						type: 'mutation:element',
						elementName: 'included-div',
						rect: new DOMRect(),
						visible: true,
					},
				},
				{
					time: 200,
					data: {
						type: 'mutation:element',
						elementName: 'ignored-div',
						rect: new DOMRect(),
						visible: false,
					},
				},
			];

			// Create calculator that excludes the second entry
			const testCalculator = new (class extends AbstractVCCalculatorBase {
				protected isEntryIncluded(entry: VCObserverEntry) {
					return (
						entry.data.type === 'mutation:element' &&
						'visible' in entry.data &&
						entry.data.visible === true
					);
				}
				protected getVCCleanStatus() {
					return { isVCClean: true };
				}
			})('test-revision');

			await testCalculator.calculate({
				orderedEntries: allEntries,
				startTime: 0,
				stopTime: 1000,
				interactionId: 'test-interaction-id',
				isPostInteraction: false,
			});

			// Verify that devtools callback was called with debug details
			expect(mockDevToolCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					revision: 'test-revision',
					isClean: true,
					vcLogs: expect.arrayContaining([
						expect.objectContaining({
							time: 100,
							viewportPercentage: 90,
						}),
						expect.objectContaining({
							time: 200,
							viewportPercentage: 90, // Ignored entry should get the biggest previous viewport percentage
						}),
					]),
					interactionId: 'test-interaction-id',
				}),
			);
		});

		it('should calculate debug details when __on_ufo_vc_debug_data_ready exists with feature flag', async () => {
			// Set up debug data callback and enable feature flag
			(window as any).__on_ufo_vc_debug_data_ready = mockDebugDataCallback;
			mockFg.mockImplementation((key) => {
				if (key === 'platform_ufo_emit_vc_debug_data') {
					return true;
				}
				return false;
			});

			const allEntries: VCObserverEntry[] = [
				{
					time: 100,
					data: {
						type: 'mutation:element',
						elementName: 'included-div',
						rect: new DOMRect(),
						visible: true,
					},
				},
			];

			await mockCalculator.calculate({
				orderedEntries: allEntries,
				startTime: 0,
				stopTime: 1000,
				interactionId: 'test-interaction-id',
				isPostInteraction: false,
			});

			// Verify that debug data callback was called
			expect(mockDebugDataCallback).toHaveBeenCalledWith(
				expect.objectContaining({
					revision: 'test-revision',
					isClean: true,
					vcLogs: expect.any(Array),
					interactionId: 'test-interaction-id',
				}),
			);
		});

		it('should not calculate debug details when __on_ufo_vc_debug_data_ready exists but feature flag is disabled', async () => {
			// Set up debug data callback but disable feature flag
			(window as any).__on_ufo_vc_debug_data_ready = mockDebugDataCallback;
			mockFg.mockImplementation((key) => {
				if (key === 'platform_ufo_emit_vc_debug_data') {
					return false;
				}
				return false;
			});

			const allEntries: VCObserverEntry[] = [
				{
					time: 100,
					data: {
						type: 'mutation:element',
						elementName: 'included-div',
						rect: new DOMRect(),
						visible: true,
					},
				},
			];

			await mockCalculator.calculate({
				orderedEntries: allEntries,
				startTime: 0,
				stopTime: 1000,
				interactionId: 'test-interaction-id',
				isPostInteraction: false,
			});

			// Verify that debug data callback was not called
			expect(mockDebugDataCallback).not.toHaveBeenCalled();
		});

		it('should not calculate debug details for post-interaction scenarios', async () => {
			// Set up devtool callback
			(window as any).__ufo_devtool_onVCRevisionReady__ = mockDevToolCallback;

			const allEntries: VCObserverEntry[] = [
				{
					time: 100,
					data: {
						type: 'mutation:element',
						elementName: 'included-div',
						rect: new DOMRect(),
						visible: true,
					},
				},
			];

			await mockCalculator.calculate({
				orderedEntries: allEntries,
				startTime: 0,
				stopTime: 1000,
				interactionId: 'test-interaction-id',
				isPostInteraction: true, // Post-interaction should skip debug details
			});

			// Verify that devtools callback was not called for post-interaction
			expect(mockDevToolCallback).not.toHaveBeenCalled();
		});
	});
});
