import { fg } from '@atlaskit/platform-feature-flags';

import { setUFOConfig } from '../../config';
import { DefaultInteractionID } from '../../interaction-id-context';
import { interactions } from '../common/constants';
import {
	abort,
	abortAll,
	abortByNewInteraction,
	addHold,
	addHoldByID,
	addNewInteraction,
	interactionExtraMetrics,
	removeHoldByID,
	tryComplete,
} from '../index';

jest.mock('@atlaskit/platform-feature-flags');
const mockFg = fg as jest.Mock;

// Mock performance.now() for consistent testing
const mockPerformanceNow = jest.fn(() => 1000);
Object.defineProperty(global.performance, 'now', {
	writable: true,
	value: mockPerformanceNow,
});

// Mock setTimeout/clearTimeout for testing timeouts
const mockSetTimeout = jest.fn();
const mockClearTimeout = jest.fn();
global.setTimeout = mockSetTimeout as any;
global.clearTimeout = mockClearTimeout as any;

describe('Raw Data Third Party Behavior', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		interactions.clear();
		DefaultInteractionID.current = null;
		mockPerformanceNow.mockReturnValue(1000);
		mockSetTimeout.mockImplementation((fn, delay) => {
			return { id: 'mock-timer', fn, delay };
		});
		mockClearTimeout.mockImplementation(() => {});

		// Set default config
		setUFOConfig({
			enabled: true,
			product: 'test-product',
			region: 'test-region',
			enableVCRawDataRates: {
				enabled: true,
				rates: { 'test-ufo-name': 0.5 },
			},
		});

		// Mock feature flags
		mockFg.mockImplementation(() => false);
	});

	afterEach(() => {
		interactions.clear();
		DefaultInteractionID.current = null;
		interactionExtraMetrics.reset();
	});

	it('should move non-3P holds that start after standard TTAI to extended hold info', () => {
		const interactionId = 'metric-variants-interaction';
		const startTime = 1000;
		mockPerformanceNow.mockReturnValue(startTime);

		addNewInteraction(interactionId, 'test-ufo-name', 'page_load', startTime, 1, null, null, null);

		const interaction = interactions.get(interactionId);
		expect(interaction).toBeDefined();

		const remove3pHold = addHold(
			interactionId,
			[{ name: 'segment1', type: 'third-party' as const }],
			'3p-hold',
			false,
		);
		const removeStandardHold = addHold(
			interactionId,
			[{ name: 'segment1' }],
			'standard-hold',
			false,
		);

		mockPerformanceNow.mockReturnValue(2000);
		removeStandardHold();
		tryComplete(interactionId, 2000);

		expect(interaction!.end).toBe(2000);
		expect(interaction!.holdInfo.map((hold) => hold.name)).toEqual(['standard-hold']);

		mockPerformanceNow.mockReturnValue(2500);
		const removeLateHold = addHold(interactionId, [{ name: 'segment1' }], 'late-hold', false);
		expect(interaction!.holdActive.size).toBe(0);
		expect([...(interaction!.hold3pActive?.values() ?? [])].map((hold) => hold.name)).toEqual([
			'3p-hold',
			'late-hold',
		]);

		mockPerformanceNow.mockReturnValue(2600);
		removeLateHold();

		expect(interaction!.holdInfo.map((hold) => hold.name)).toEqual(['standard-hold']);
		expect(interaction!.hold3pInfo?.map((hold) => hold.name)).toContain('late-hold');

		remove3pHold();
	});

	it('should move non-3P addHoldByID holds that start after standard TTAI to extended hold info', () => {
		const interactionId = 'metric-variants-by-id-interaction';
		const startTime = 1000;
		mockPerformanceNow.mockReturnValue(startTime);

		addNewInteraction(interactionId, 'test-ufo-name', 'page_load', startTime, 1, null, null, null);

		const interaction = interactions.get(interactionId);
		expect(interaction).toBeDefined();

		const remove3pHold = addHold(
			interactionId,
			[{ name: 'segment1', type: 'third-party' as const }],
			'3p-hold',
			false,
		);
		const removeStandardHold = addHold(
			interactionId,
			[{ name: 'segment1' }],
			'standard-hold',
			false,
		);

		mockPerformanceNow.mockReturnValue(2000);
		removeStandardHold();
		tryComplete(interactionId, 2000);

		mockPerformanceNow.mockReturnValue(2500);
		addHoldByID(interactionId, [{ name: 'segment1' }], 'late-by-id-hold', 'late-by-id-hold-id');

		expect(interaction!.holdActive.size).toBe(0);
		expect([...(interaction!.hold3pActive?.values() ?? [])].map((hold) => hold.name)).toEqual([
			'3p-hold',
			'late-by-id-hold',
		]);

		mockPerformanceNow.mockReturnValue(2600);
		removeHoldByID(interactionId, 'late-by-id-hold-id');

		expect(interaction!.holdInfo.map((hold) => hold.name)).toEqual(['standard-hold']);
		expect(interaction!.hold3pInfo?.map((hold) => hold.name)).toContain('late-by-id-hold');

		remove3pHold();
	});

	it('should populate metric windows and lifecycle observations when new interaction happens after standard TTAI', () => {
		const interactionId = 'metric-variant-interaction';
		const startTime = 1000;
		mockPerformanceNow.mockReturnValue(startTime);

		addNewInteraction(interactionId, 'test-ufo-name', 'page_load', startTime, 1, null, null, null);

		const interaction = interactions.get(interactionId);
		expect(interaction).toBeDefined();

		const remove3pHold = addHold(
			interactionId,
			[{ name: 'segment1', type: 'third-party' as const }],
			'3p-hold',
			false,
		);
		const removeHold = addHold(interactionId, [{ name: 'segment1' }], 'regular-hold', false);

		mockPerformanceNow.mockReturnValue(2000);
		removeHold();
		tryComplete(interactionId, 2000);

		expect(interaction!.end).toBe(2000);
		expect(interaction!.metricWindows?.standard).toEqual({
			start: 1000,
			end: 2000,
			includeCategories: [],
			excludeCategories: ['third-party', 'gen-ai'],
		});
		expect(interaction!.metricWindows?.['include-third-party']).toBeUndefined();

		mockPerformanceNow.mockReturnValue(2500);
		abortByNewInteraction(interactionId, 'next-interaction');

		expect(interaction!.abortReason).toBeUndefined();
		expect(interaction!.lifecycleObservations).toEqual([
			{
				type: 'new_interaction_started',
				timestamp: 2500,
				triggerName: 'next-interaction',
			},
		]);
		expect(interaction!.metricWindows?.standard).toEqual({
			start: 1000,
			end: 2000,
			includeCategories: [],
			excludeCategories: ['third-party', 'gen-ai'],
		});
		expect(interaction!.metricWindows?.['include-third-party']).toEqual({
			start: 1000,
			end: 2500,
			includeCategories: ['third-party'],
			excludeCategories: [],
		});

		remove3pHold();
	});

	describe('GenAI metric variant behavior', () => {
		it('waits for GenAI holds and emits an include-gen-ai metric window', () => {
			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
			});

			const interactionId = 'gen-ai-metric-variant-interaction';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);
			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			const removeGenAIHold = addHold(
				interactionId,
				[{ name: 'segment1', type: 'gen-ai' as const }],
				'gen-ai-hold',
				false,
			);
			const removeStandardHold = addHold(
				interactionId,
				[{ name: 'segment1' }],
				'standard-hold',
				false,
			);

			mockPerformanceNow.mockReturnValue(2000);
			removeStandardHold();
			tryComplete(interactionId, 2000);

			expect(interaction!.end).toBe(2000);
			expect(interactions.has(interactionId)).toBe(true);
			expect(interaction!.metricWindows?.standard).toEqual({
				start: 1000,
				end: 2000,
				includeCategories: [],
				excludeCategories: ['third-party', 'gen-ai'],
			});
			expect(interaction!.metricWindows?.['include-gen-ai']).toBeUndefined();

			mockPerformanceNow.mockReturnValue(2500);
			removeGenAIHold();
			tryComplete(interactionId);

			expect(interaction!.metricWindows?.['include-gen-ai']).toEqual({
				start: 1000,
				end: 2500,
				includeCategories: ['gen-ai'],
				excludeCategories: [],
			});
			expect(interaction!.metricWindows?.['include-third-party']).toBeUndefined();
		});

		it('uses the core end time when GenAI holds finish before core holds', () => {
			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
			});

			const interactionId = 'gen-ai-finishes-before-core-interaction';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);
			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			const removeGenAIHold = addHold(
				interactionId,
				[{ name: 'segment1', type: 'gen-ai' as const }],
				'gen-ai-hold',
				false,
			);
			const removeStandardHold = addHold(
				interactionId,
				[{ name: 'segment1' }],
				'standard-hold',
				false,
			);

			mockPerformanceNow.mockReturnValue(1500);
			removeGenAIHold();

			mockPerformanceNow.mockReturnValue(2000);
			removeStandardHold();
			tryComplete(interactionId, 2000);

			expect(interaction!.end).toBe(2000);
			expect(interaction!.metricWindows?.['include-gen-ai']).toEqual({
				start: 1000,
				end: 2000,
				includeCategories: ['gen-ai'],
				excludeCategories: [],
			});
			expect(interaction!.metricWindows?.['include-third-party']).toBeUndefined();
		});
	});

	describe('GenAI metric variant abort behavior', () => {
		it('finishes as successful and emits include-gen-ai when abort is called with only a GenAI hold active', () => {
			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
			});

			const interactionId = 'gen-ai-abort-interaction';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);
			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			const removeGenAIHold = addHold(
				interactionId,
				[{ name: 'segment1', type: 'gen-ai' as const }],
				'gen-ai-hold',
				false,
			);
			const removeStandardHold = addHold(
				interactionId,
				[{ name: 'segment1' }],
				'standard-hold',
				false,
			);

			mockPerformanceNow.mockReturnValue(2000);
			removeStandardHold();
			tryComplete(interactionId, 2000);

			expect(interaction!.end).toBe(2000);
			expect(interactions.has(interactionId)).toBe(true);

			mockPerformanceNow.mockReturnValue(2500);
			abort(interactionId, 'timeout');

			expect(interaction!.abortReason).toBeUndefined();
			expect(interaction!.end).toBe(2000);
			expect(interaction!.lifecycleObservations).toEqual([
				{
					type: 'timeout_expired',
					timestamp: 2500,
					activeHoldCount: 1,
				},
			]);
			expect(interaction!.metricWindows?.standard).toEqual({
				start: 1000,
				end: 2000,
				includeCategories: [],
				excludeCategories: ['third-party', 'gen-ai'],
			});
			expect(interaction!.metricWindows?.['include-gen-ai']).toEqual({
				start: 1000,
				end: 2500,
				includeCategories: ['gen-ai'],
				excludeCategories: [],
			});
			expect(interaction!.metricWindows?.['include-third-party']).toBeUndefined();

			removeGenAIHold();
		});
	});

	describe('tryComplete with third-party holds', () => {
		it('should set endTime but not finish when only 3p holds are active', () => {
			const interactionId = 'test-interaction-1';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Add a third-party hold
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);

			// Add a regular hold and then remove it
			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			removeHold();

			// At this point, only 3p holds are active
			expect(interaction!.holdActive.size).toBe(0);
			expect(interaction!.hold3pActive?.size).toBe(1);

			// Try to complete - should set endTime but not finish
			const endTime = 2000;
			mockPerformanceNow.mockReturnValue(endTime);
			tryComplete(interactionId, endTime);

			// EndTime should be set
			expect(interaction!.end).toBe(endTime);
			// Interaction should not be finished (still in interactions map)
			expect(interactions.has(interactionId)).toBe(true);

			// Clean up
			remove3pHold();
		});

		it('should finish interaction when all holds including 3p are cleared', () => {
			const interactionId = 'test-interaction-2';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Add a third-party hold
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);

			// Remove regular holds first
			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			removeHold();

			// Set endTime when regular holds are cleared
			const endTime = 2000;
			mockPerformanceNow.mockReturnValue(endTime);
			tryComplete(interactionId, endTime);
			expect(interaction!.end).toBe(endTime);

			// Now remove 3p hold - should finish
			remove3pHold();
			tryComplete(interactionId);

			// Interaction should be finished
			expect(interaction!.end).toBe(endTime);
		});
	});

	describe('abort functions with third-party holds', () => {
		it('should finish as successful when only 3p holds are active in abort()', () => {
			const interactionId = 'test-interaction-4';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Add a third-party hold
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);

			// Remove regular holds and set endTime
			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			removeHold();

			const endTime = 2000;
			mockPerformanceNow.mockReturnValue(endTime);
			tryComplete(interactionId, endTime);
			expect(interaction!.end).toBe(endTime);

			// Now abort - should finish as successful
			abort(interactionId, 'timeout');

			// Should not have abortReason
			expect(interaction!.abortReason).toBeUndefined();
			// Should use the saved endTime
			expect(interaction!.end).toBe(endTime);

			// Clean up
			remove3pHold();
		});

		it('should finish as successful when only 3p holds are active in abortByNewInteraction()', () => {
			const interactionId = 'test-interaction-5';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Add a third-party hold
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);

			// Remove regular holds and set endTime
			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			removeHold();

			const endTime = 2000;
			mockPerformanceNow.mockReturnValue(endTime);
			tryComplete(interactionId, endTime);
			expect(interaction!.end).toBe(endTime);

			// Now abort by new interaction - should finish as successful
			abortByNewInteraction(interactionId, 'new-interaction');

			// Should not have abortReason
			expect(interaction!.abortReason).toBeUndefined();
			// Should use the saved endTime
			expect(interaction!.end).toBe(endTime);

			// Clean up
			remove3pHold();
		});

		it('should finish as successful when only 3p holds are active in abortAll()', () => {
			const interactionId = 'test-interaction-6';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Add a third-party hold
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);

			// Remove regular holds and set endTime
			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			removeHold();

			const endTime = 2000;
			mockPerformanceNow.mockReturnValue(endTime);
			tryComplete(interactionId, endTime);
			expect(interaction!.end).toBe(endTime);

			// Now abort all - should finish as successful
			abortAll('transition');

			// Should not have abortReason
			expect(interaction!.abortReason).toBeUndefined();
			// Should use the saved endTime
			expect(interaction!.end).toBe(endTime);

			// Clean up
			remove3pHold();
		});

		it('should abort normally when non-3p holds are active', () => {
			const interactionId = 'test-interaction-7';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Add both regular and 3p holds
			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);

			// Abort - should abort normally since regular holds are active
			abort(interactionId, 'timeout');

			// Should have abortReason
			expect(interaction!.abortReason).toBe('timeout');

			// Clean up
			removeHold();
			remove3pHold();
		});
	});

	describe('addNewInteraction with third-party behavior', () => {
		it('should not start interactionExtraMetrics when disable extra metrics gate is enabled', () => {
			const interactionId = 'test-interaction-disable-extra-start';
			const startTime = 1000;

			mockFg.mockImplementation(
				(flag: string) => flag === 'platform_ufo_disable_interaction_extra_metrics',
			);
			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
				extraInteractionMetrics: {
					enabled: true,
				},
			});

			const resetSpy = jest.spyOn(interactionExtraMetrics, 'reset');
			const startVCObserverSpy = jest.spyOn(interactionExtraMetrics, 'startVCObserver');

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			expect(resetSpy).not.toHaveBeenCalled();
			expect(startVCObserverSpy).not.toHaveBeenCalled();

			resetSpy.mockRestore();
			startVCObserverSpy.mockRestore();
		});

		it('should start interactionExtraMetrics even when feature flag is active', () => {
			const interactionId = 'test-interaction-8';
			const startTime = 1000;

			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
				enableVCRawDataRates: {
					enabled: true,
					rates: { 'test-ufo-name': 0.5 },
				},
				extraInteractionMetrics: {
					enabled: true,
				},
			});

			const startVCObserverSpy = jest.spyOn(interactionExtraMetrics, 'startVCObserver');

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			// Should start interactionExtraMetrics even when feature flag is active
			expect(startVCObserverSpy).toHaveBeenCalledWith({ startTime }, interactionId);

			startVCObserverSpy.mockRestore();
		});

		it('should start interactionExtraMetrics when raw data 3P behavior is enabled by rate config', () => {
			const interactionId = 'test-interaction-9';
			const startTime = 1000;

			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
				enableVCRawDataRates: {
					enabled: true,
					rates: { 'test-ufo-name': 0.5 },
				},
				extraInteractionMetrics: {
					enabled: true,
				},
			});

			const startVCObserverSpy = jest.spyOn(interactionExtraMetrics, 'startVCObserver');

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			// Should start interactionExtraMetrics when raw data 3P behavior is enabled by rate config
			expect(startVCObserverSpy).toHaveBeenCalledWith({ startTime }, interactionId);

			startVCObserverSpy.mockRestore();
		});
	});

	describe('tryComplete sends separated third-party event', () => {
		it('should not send separated third-party event when disable extra metrics gate is enabled', () => {
			const interactionId = 'test-interaction-disable-extra-complete';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			mockFg.mockImplementation(
				(flag: string) => flag === 'platform_ufo_disable_interaction_extra_metrics',
			);
			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
				enableVCRawDataRates: {
					enabled: true,
					rates: { 'test-ufo-name': 0.5 },
				},
				extraInteractionMetrics: {
					enabled: true,
				},
			});

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);
			remove3pHold();

			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			removeHold();

			const onInteractionCompleteSpy = jest.spyOn(interactionExtraMetrics, 'onInteractionComplete');
			const updateFinishedInteractionSpy = jest.spyOn(
				interactionExtraMetrics,
				'updateFinishedInteraction',
			);

			const endTime = 2000;
			mockPerformanceNow.mockReturnValue(endTime);
			tryComplete(interactionId, endTime);

			expect(updateFinishedInteractionSpy).not.toHaveBeenCalled();
			expect(onInteractionCompleteSpy).not.toHaveBeenCalled();

			onInteractionCompleteSpy.mockRestore();
			updateFinishedInteractionSpy.mockRestore();
		});

		it('should send separated third-party event even when feature flag is active', () => {
			const interactionId = 'test-interaction-10';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
				enableVCRawDataRates: {
					enabled: true,
					rates: { 'test-ufo-name': 0.5 },
				},
				extraInteractionMetrics: {
					enabled: true,
				},
			});

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Add and remove a third-party hold
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);
			remove3pHold();

			// Remove regular holds
			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			removeHold();

			const onInteractionCompleteSpy = jest.spyOn(interactionExtraMetrics, 'onInteractionComplete');
			const updateFinishedInteractionSpy = jest.spyOn(
				interactionExtraMetrics,
				'updateFinishedInteraction',
			);

			const endTime = 2000;
			mockPerformanceNow.mockReturnValue(endTime);
			tryComplete(interactionId, endTime);

			// Should update finished interaction when feature flag is active
			expect(updateFinishedInteractionSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					ufoName: 'test-ufo-name',
				}),
			);

			// Should send separated third-party event even when feature flag is active
			expect(onInteractionCompleteSpy).toHaveBeenCalledWith(
				interactionId,
				expect.objectContaining({
					ufoName: 'test-ufo-name',
					end: endTime,
				}),
			);

			onInteractionCompleteSpy.mockRestore();
			updateFinishedInteractionSpy.mockRestore();
		});
	});

	describe('interaction data includes third-party holds', () => {
		it('should have hold3pActive and hold3pInfo when third-party holds are added', () => {
			const interactionId = 'test-interaction-11';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Add a third-party hold
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);

			// Verify hold3pActive is set
			expect(interaction!.hold3pActive).toBeDefined();
			expect(interaction!.hold3pActive!.size).toBe(1);

			// Remove the hold
			remove3pHold();

			// Verify hold3pInfo is populated
			expect(interaction!.hold3pInfo).toBeDefined();
			expect(interaction!.hold3pInfo!.length).toBe(1);
			expect(interaction!.hold3pInfo![0].name).toBe('3p-hold');
		});

		it('should have hold3pActive and hold3pInfo when feature flag is active', () => {
			const interactionId = 'test-interaction-12';
			const startTime = 1000;
			mockPerformanceNow.mockReturnValue(startTime);

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();

			// Verify initial state
			expect(interaction!.hold3pActive).toBeDefined();
			expect(interaction!.hold3pInfo).toBeDefined();

			// Add and remove a third-party hold
			const labelStack3p = [{ name: 'segment1', type: 'third-party' as const }];
			const remove3pHold = addHold(interactionId, labelStack3p, '3p-hold', false);
			expect(interaction!.hold3pActive!.size).toBe(1);

			remove3pHold();
			expect(interaction!.hold3pInfo!.length).toBe(1);
		});
	});
});
