import { fg } from '@atlaskit/platform-feature-flags';

import { setUFOConfig, shouldUseRawDataThirdPartyBehavior } from '../../config';
import { DefaultInteractionID } from '../../interaction-id-context';
import { interactions } from '../common/constants';
import {
	abort,
	abortAll,
	abortByNewInteraction,
	addHold,
	addNewInteraction,
	interactionExtraMetrics,
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
		mockFg.mockImplementation((flag: string) => {
			if (flag === 'platform_ufo_raw_data_thirdparty') {
				return true;
			}
			if (flag === 'platform_ufo_enable_ttai_with_3p') {
				return true;
			}
			return false;
		});
	});

	afterEach(() => {
		interactions.clear();
		DefaultInteractionID.current = null;
		interactionExtraMetrics.reset();
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

		it('should not wait for 3p holds when feature flag is disabled', () => {
			mockFg.mockImplementation((flag: string) => {
				if (flag === 'platform_ufo_raw_data_thirdparty') {
					return false;
				}
				return flag === 'platform_ufo_enable_ttai_with_3p';
			});

			const interactionId = 'test-interaction-3';
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

			// Remove regular holds
			const labelStack = [{ name: 'segment1' }];
			const removeHold = addHold(interactionId, labelStack, 'regular-hold', false);
			removeHold();

			// Should not wait for 3p holds when feature flag is disabled
			expect(shouldUseRawDataThirdPartyBehavior('test-ufo-name', 'page_load')).toBe(false);

			// Clean up
			remove3pHold();
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

		it('should start interactionExtraMetrics when feature flag is disabled', () => {
			mockFg.mockImplementation((flag: string) => {
				if (flag === 'platform_ufo_raw_data_thirdparty') {
					return false;
				}
				return flag === 'platform_ufo_enable_ttai_with_3p';
			});

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

			// Should start interactionExtraMetrics when feature flag is disabled
			expect(startVCObserverSpy).toHaveBeenCalledWith({ startTime }, interactionId);

			startVCObserverSpy.mockRestore();
		});
	});

	describe('tryComplete sends separated third-party event', () => {
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

			const onInteractionCompleteSpy = jest.spyOn(
				interactionExtraMetrics,
				'onInteractionComplete',
			);
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

