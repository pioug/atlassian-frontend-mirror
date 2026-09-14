import { fg } from '@atlaskit/platform-feature-flags/fg';

import { setUFOConfig } from '../../config';
import { DefaultInteractionID } from '../../interaction-id-context';
import { interactions } from '../common/constants';
import {
	abort,
	abortAll,
	abortByNewInteraction,
	addCompletedHold,
	addExcluded3pSegment,
	addHold,
	addHoldByID,
	addNewInteraction,
	removeHoldByID,
	tryComplete,
} from '../index';

jest.mock('@atlaskit/platform-feature-flags/fg');
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

	describe('excludeFromMetrics third-party holds (background scripts)', () => {
		// GATING NOTE: the master switch for this whole flow, `platform_forge_ufo_exclude_bg_scripts_from_3p`,
		// lives UPSTREAM in Forge and is never referenced in this repo. Forge decides whether to stamp
		// `excludeFromMetrics: true` on a background module's hold; react-ufo reacts purely to that
		// annotation via `isExcludedThirdPartyHold` (no react-ufo feature flag). So "upstream gate on"
		// is simulated here by injecting the annotated labelStack, and "upstream gate off" by a plain
		// `type: 'third-party'` hold (see `real3pLabelStack`), with the default `fg -> false`.
		//
		// A label carrying both `type: 'third-party'` and `excludeFromMetrics: true` marks a subtree
		// (e.g. a Forge background script). CONTRACT (AFO-5545): the hold is NOT dropped at creation.
		// It lives in `hold3pActive` exactly like an ordinary third-party hold, so it still gates
		// completion / defers `finishInteraction`, which keeps the standard bucket identical to when
		// the hold is not excluded. It is excluded ONLY from third-party accounting: it never stamps
		// `metricCategoryEnds['third-party']` and never drags `end3p` (and therefore
		// `metricWindows['include-third-party'].end`) past the real interaction end. The standard
		// window is always invariant to it.
		const excludedLabelStack = [
			{ name: 'segment1', type: 'third-party' as const, excludeFromMetrics: true },
		];

		const setup = (interactionId: string) => {
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
			return interaction!;
		};

		it('addHold keeps the excluded hold in hold3pActive (gates completion) but not holdActive', () => {
			const interactionId = 'excluded-addhold';
			const interaction = setup(interactionId);

			const removeExcluded = addHold(interactionId, excludedLabelStack, 'bg-hold', false);

			// The bg hold is a third-party hold: it sits in the extended bucket, never the standard one.
			expect(interaction.holdActive.size).toBe(0);
			expect(interaction.hold3pActive?.size ?? 0).toBe(1);

			// On release it lands in hold3pInfo like any 3p hold, but records NO third-party category end.
			mockPerformanceNow.mockReturnValue(1800);
			removeExcluded();
			expect(interaction.holdInfo.map((hold) => hold.name)).not.toContain('bg-hold');
			expect(interaction.hold3pInfo?.map((hold) => hold.name) ?? []).toContain('bg-hold');
			expect(interaction.metricCategoryEnds?.['third-party']).toBeUndefined();
		});

		it('addHoldByID keeps the excluded hold in hold3pActive and removeHoldByID clears it without a category end', () => {
			const interactionId = 'excluded-addholdbyid';
			const interaction = setup(interactionId);

			addHoldByID(interactionId, excludedLabelStack, 'bg-hold', 'bg-hold-id');

			expect(interaction.holdActive.size).toBe(0);
			expect(interaction.hold3pActive?.size ?? 0).toBe(1);

			mockPerformanceNow.mockReturnValue(1800);
			expect(() => removeHoldByID(interactionId, 'bg-hold-id')).not.toThrow();
			expect(interaction.hold3pActive?.size ?? 0).toBe(0);
			expect(interaction.hold3pInfo?.map((hold) => hold.name) ?? []).toContain('bg-hold');
			// Excluded from accounting even on the removeHoldByID path.
			expect(interaction.metricCategoryEnds?.['third-party']).toBeUndefined();
		});

		it('addCompletedHold records the excluded hold in hold3pInfo but no metric-variant category end', () => {
			const interactionId = 'excluded-completedhold';
			const interaction = setup(interactionId);

			addCompletedHold(interactionId, excludedLabelStack, 'bg-hold', 1200, 1800);

			// The completed hold is tracked (for observability) ...
			expect(interaction.hold3pInfo?.map((hold) => hold.name) ?? []).toContain('bg-hold');
			// ... but does not contribute a third-party category end.
			expect(interaction.metricCategoryEnds?.['third-party']).toBeUndefined();
		});

		it('an excluded 3p hold DEFERS completion until it clears (preserves the subsidy), and does not inflate the include-third-party window (success path)', () => {
			const interactionId = 'excluded-completion';
			const interaction = setup(interactionId);

			// An excluded bg hold plus a normal standard hold that we release.
			const removeBgHold = addHold(interactionId, excludedLabelStack, 'bg-hold', false);
			const removeStandardHold = addHold(
				interactionId,
				[{ name: 'segment1' }],
				'regular-hold',
				false,
			);

			// Standard hold clears at 2000: the standard window closes, but the interaction must NOT
			// finish yet because the excluded bg hold is still active in hold3pActive.
			mockPerformanceNow.mockReturnValue(2000);
			removeStandardHold();
			tryComplete(interactionId, 2000);

			expect(interaction.end).toBe(2000);
			// Standard window is invariant to the bg hold (the whole point of the fix).
			expect(interaction.metricWindows?.standard).toEqual({
				start: 1000,
				end: 2000,
				includeCategories: [],
				excludeCategories: ['third-party', 'gen-ai'],
			});
			// Still deferred: interaction is present, subsidy preserved.
			expect(interactions.has(interactionId)).toBe(true);
			expect(interaction.hold3pActive?.size ?? 0).toBe(1);

			// The bg hold releases NORMALLY at a much later time (e.g. just before timeout), and the
			// interaction finishes via the success branch of tryComplete.
			mockPerformanceNow.mockReturnValue(60000);
			removeBgHold();
			tryComplete(interactionId, 2000);

			// Finished now.
			expect(interactions.has(interactionId)).toBe(false);
			// The excluded hold recorded no third-party category end ...
			expect(interaction.metricCategoryEnds?.['third-party']).toBeUndefined();
			// ... and end3p / the include-third-party window are NOT dragged to 60000; they collapse to
			// the real interaction end. This is the success-path leak guard.
			expect(interaction.end3p).toBe(2000);
			expect(interaction.metricWindows?.['include-third-party']?.end).toBe(2000);
		});

		it('an excluded 3p hold still active at timeout does not inflate end3p or the include-third-party window (abort path)', () => {
			const interactionId = 'excluded-timeout';
			const interaction = setup(interactionId);

			addHold(interactionId, excludedLabelStack, 'bg-hold', false);
			const removeStandardHold = addHold(
				interactionId,
				[{ name: 'segment1' }],
				'regular-hold',
				false,
			);

			mockPerformanceNow.mockReturnValue(2000);
			removeStandardHold();
			tryComplete(interactionId, 2000);
			// Deferred by the still-active bg hold.
			expect(interactions.has(interactionId)).toBe(true);

			// Timeout fires at 63000 with the bg hold still active. The interaction finishes as
			// successful (only extended holds remain), and the bg hold must NOT drag end3p to 63000.
			mockPerformanceNow.mockReturnValue(63000);
			abortByNewInteraction(interactionId, 'next-interaction');

			expect(interaction.end).toBe(2000);
			expect(interaction.end3p).toBe(2000);
			expect(interaction.metricCategoryEnds?.['third-party']).toBeUndefined();
			expect(interaction.metricWindows?.['include-third-party']?.end).toBe(2000);
			expect(interaction.metricWindows?.standard?.end).toBe(2000);
		});

		it('a late excluded 3p hold IS routed into the extended bucket (like any third-party hold)', () => {
			const interactionId = 'excluded-late';
			const interaction = setup(interactionId);

			// Keep the interaction open with a still-active standard hold, and set interaction.end via a
			// separate released hold so the "late" (start > end) branch is exercised.
			const keepOpen = addHold(interactionId, [{ name: 'segment0' }], 'keep-open-hold', false);
			const removeStandardHold = addHold(
				interactionId,
				[{ name: 'segment1' }],
				'regular-hold',
				false,
			);
			mockPerformanceNow.mockReturnValue(2000);
			removeStandardHold();
			// interaction.end is set once holdActive drains; here another hold is still active, so drive
			// end via moveLateActiveHoldsToExtendedBucket path by completing after we mark the late hold.

			// A hold that starts AFTER the standard end goes to the extended bucket. An excluded one is
			// no longer special-cased at registration: it also goes to hold3pActive (it just will not be
			// counted in third-party accounting when it ends).
			mockPerformanceNow.mockReturnValue(2500);
			addHold(interactionId, excludedLabelStack, 'late-bg-hold', false);
			// Both the excluded late hold and (if any) genuine holds live in the extended/standard maps;
			// the excluded one is in hold3pActive, never dropped.
			expect(interaction.hold3pActive?.size ?? 0).toBe(1);

			keepOpen();
		});

		it('an excluded3pSegment breadcrumb is retained without creating a hold or inflating any window', () => {
			// This mirrors what the Forge renderer does for excluded background modules: it drops the
			// module's metric-affecting holds AND records a small, static breadcrumb into the dedicated
			// `excluded3pSegmentData` field (NOT customData). The breadcrumb must be a pure
			// side-channel: it creates no hold and moves no window.
			const interactionId = 'excluded-with-breadcrumb';
			const interaction = setup(interactionId);

			const segmentId = 'seg-1';
			// The excluded background hold IS created and lives in hold3pActive (new contract). It is
			// excluded only from third-party accounting, not from existence.
			const removeBgHold = addHold(interactionId, excludedLabelStack, 'bg-hold', false);
			// The non-metric breadcrumb goes to its dedicated field, not the product customData API.
			// The entry is a flat object; the engine stamps `segmentId` into it.
			addExcluded3pSegment(interactionId, segmentId, {
				name: 'forge-ui-app-content-root',
				moduleType: 'jira:issueViewBackgroundScript',
				excludedFromMetrics: true,
				reason: 'background-script',
			});
			// A repeat write for the SAME segmentId (e.g. a re-render) upserts, it must not duplicate.
			addExcluded3pSegment(interactionId, segmentId, {
				name: 'forge-ui-app-content-root',
				moduleType: 'jira:issueViewBackgroundScript',
				excludedFromMetrics: true,
				reason: 'background-script',
			});

			// The breadcrumb itself created no hold: the only hold3pActive entry is the bg hold above.
			expect(interaction.hold3pActive?.size ?? 0).toBe(1);

			const removeStandardHold = addHold(
				interactionId,
				[{ name: 'segment1' }],
				'regular-hold',
				false,
			);
			mockPerformanceNow.mockReturnValue(2000);
			removeStandardHold();
			// Release the bg hold late so the interaction can finish via the success branch.
			mockPerformanceNow.mockReturnValue(2000);
			removeBgHold();
			tryComplete(interactionId, 2000);

			// The bg hold (and breadcrumb) did not extend any window: excluded from third-party accounting.
			expect(interaction.metricCategoryEnds?.['third-party']).toBeUndefined();
			expect(interaction.metricWindows?.['include-third-party']?.end).toBe(2000);
			// The product-facing customData is untouched by the breadcrumb.
			expect(interaction.customData).toEqual([]);
			// The breadcrumb is retained for observability in its dedicated field, keyed by segmentId,
			// and the repeat write upserted (no duplicate).
			expect(interaction.excluded3pSegmentData).toEqual({
				[segmentId]: {
					segmentId,
					name: 'forge-ui-app-content-root',
					moduleType: 'jira:issueViewBackgroundScript',
					excludedFromMetrics: true,
					reason: 'background-script',
				},
			});
		});

		it('a normal third-party hold alongside an excluded one still produces the 3p window', () => {
			const interactionId = 'excluded-plus-normal-3p';
			const interaction = setup(interactionId);

			addHold(interactionId, excludedLabelStack, 'bg-hold', false);
			const removeNormal3p = addHold(
				interactionId,
				[{ name: 'segment2', type: 'third-party' as const }],
				'normal-3p-hold',
				false,
			);
			const removeStandardHold = addHold(
				interactionId,
				[{ name: 'segment1' }],
				'regular-hold',
				false,
			);

			// Both third-party holds now live in the extended bucket (bg is no longer dropped at
			// registration); the difference is purely in accounting when they end.
			expect(interaction.hold3pActive?.size).toBe(2);

			mockPerformanceNow.mockReturnValue(2000);
			removeStandardHold();
			tryComplete(interactionId, 2000);

			// Complete the real 3p hold after standard end so include-third-party extends to its end.
			mockPerformanceNow.mockReturnValue(2500);
			removeNormal3p();
			// The bg hold is still active and is closed by the abort; it must NOT drag the window past
			// the real 3p hold's end of 2500.
			mockPerformanceNow.mockReturnValue(3000);
			abortByNewInteraction(interactionId, 'next-interaction');

			// The window end is driven by the real 3p hold (2500), NOT by the still-active excluded bg
			// hold that was closed at 3000.
			expect(interaction.metricWindows?.['include-third-party']).toEqual({
				start: 1000,
				end: 2500,
				includeCategories: ['third-party'],
				excludeCategories: [],
			});
			expect(interaction.metricCategoryEnds?.['third-party']).toBe(2500);
			// The released real 3p hold is recorded in hold3pInfo and drove the end. The bg hold was
			// still active when the abort finished the interaction (active extended holds are not
			// flushed into hold3pInfo on the success-abort path), so it does not appear there, and it
			// never contributed a category end regardless.
			expect(interaction.hold3pInfo?.map((hold) => hold.name)).toContain('normal-3p-hold');
			expect(interaction.hold3pInfo?.map((hold) => hold.name)).not.toContain('bg-hold');
		});

		describe('mixed real + excluded 3p holds (getNonExcludedThirdPartyEnd)', () => {
			// These lock the crux of the fix: when a REAL third-party hold and an excluded background
			// hold coexist, `end3p` must follow the real 3p work, never the bg hold, and never the
			// finish-time clock. The real-work end is read from the released entry in `hold3pInfo` via
			// the `Math.max(interactionEnd, ...non-excluded released ends)` fallback in
			// `getNonExcludedThirdPartyEnd`. `real3pLabelStack` carries `type:'third-party'` WITHOUT
			// `excludeFromMetrics`, so it is genuine 3p work.
			const real3pLabelStack = [{ name: 'segment2', type: 'third-party' as const }];

			it('Case 1: bg hold OUTLIVES the real 3p hold (success path) -> end3p follows the real hold, not the bg hold or the clock', () => {
				const interactionId = 'mixed-bg-outlives-real-success';
				const interaction = setup(interactionId);

				// t=1000: a standard hold + real 3p hold + excluded bg hold all active.
				const removeStandardHold = addHold(
					interactionId,
					[{ name: 'segment1' }],
					'regular-hold',
					false,
				);
				const removeReal3p = addHold(interactionId, real3pLabelStack, 'real-3p-hold', false);
				const removeBgHold = addHold(interactionId, excludedLabelStack, 'bg-hold', false);

				expect(interaction.holdActive.size).toBe(1);
				expect(interaction.hold3pActive?.size).toBe(2);

				// t=1500: standard hold clears -> standard window settles at 1500, but 3p holds keep the
				// interaction open.
				mockPerformanceNow.mockReturnValue(1500);
				removeStandardHold();
				tryComplete(interactionId, 1500);
				expect(interaction.end).toBe(1500);
				expect(interactions.has(interactionId)).toBe(true);

				// t=3000: the REAL 3p work ends and is recorded in hold3pInfo.
				mockPerformanceNow.mockReturnValue(3000);
				removeReal3p();
				tryComplete(interactionId, 1500);
				// Still deferred by the bg hold (subsidy preserved).
				expect(interactions.has(interactionId)).toBe(true);
				expect(interaction.hold3pActive?.size).toBe(1);

				// t=9000: the bg hold releases LAST and fires the final tryComplete -> finishInteraction.
				// The finish-time clock is 9000; if the fix leaked, end3p would be 9000.
				mockPerformanceNow.mockReturnValue(9000);
				removeBgHold();
				tryComplete(interactionId, 1500);

				expect(interactions.has(interactionId)).toBe(false);
				expect(interaction.end).toBe(1500);
				// THE CRUX: end3p is the real hold's end (3000), not the bg end (9000), not the clock.
				expect(interaction.end3p).toBe(3000);
				expect(interaction.metricWindows?.['include-third-party']?.end).toBe(3000);
				// The real hold stamped the third-party category end; the bg hold never did.
				expect(interaction.metricCategoryEnds?.['third-party']).toBe(3000);
				// Standard window is untouched by either 3p hold.
				expect(interaction.metricWindows?.standard?.end).toBe(1500);
				// Both released holds are retained in hold3pInfo for observability.
				expect(interaction.hold3pInfo?.map((hold) => hold.name)).toEqual(
					expect.arrayContaining(['real-3p-hold', 'bg-hold']),
				);
			});

			it('Case 2: real 3p hold is still active when the interaction finishes -> end3p is the finish-time clock (genuine 3p not truncated)', () => {
				const interactionId = 'mixed-bg-releases-first-success';
				const interaction = setup(interactionId);

				const removeStandardHold = addHold(
					interactionId,
					[{ name: 'segment1' }],
					'regular-hold',
					false,
				);
				const removeReal3p = addHold(interactionId, real3pLabelStack, 'real-3p-hold', false);
				const removeBgHold = addHold(interactionId, excludedLabelStack, 'bg-hold', false);

				// Standard window settles at 1500.
				mockPerformanceNow.mockReturnValue(1500);
				removeStandardHold();
				tryComplete(interactionId, 1500);
				expect(interactions.has(interactionId)).toBe(true);

				// bg releases FIRST at 3000; the real 3p hold is still active, so we are NOT finished.
				mockPerformanceNow.mockReturnValue(3000);
				removeBgHold();
				tryComplete(interactionId, 1500);
				expect(interactions.has(interactionId)).toBe(true);
				expect(interaction.hold3pActive?.size).toBe(1);

				// real 3p hold releases last at 6000 and finishes the interaction. Because a non-excluded
				// 3p hold was active right up to finish, end3p is the finish-time clock (6000). We pin the
				// clock so this asserts the intended value rather than an incidental one.
				mockPerformanceNow.mockReturnValue(6000);
				removeReal3p();
				tryComplete(interactionId, 1500);

				expect(interactions.has(interactionId)).toBe(false);
				expect(interaction.end).toBe(1500);
				expect(interaction.end3p).toBe(6000);
				expect(interaction.metricWindows?.['include-third-party']?.end).toBe(6000);
			});

			it.each([
				['abort (timeout)', (id: string) => abort(id, 'timeout')],
				['abortAll', () => abortAll('timeout')],
			])(
				'Case 4: bg outlives real, interaction ends via %s with the bg hold still active -> end3p still follows the real hold, not the clock',
				(_label, triggerAbort) => {
					const interactionId = 'mixed-bg-outlives-real-abort';
					const interaction = setup(interactionId);

					const removeStandardHold = addHold(
						interactionId,
						[{ name: 'segment1' }],
						'regular-hold',
						false,
					);
					const removeReal3p = addHold(interactionId, real3pLabelStack, 'real-3p-hold', false);
					addHold(interactionId, excludedLabelStack, 'bg-hold', false);

					// Standard window settles at 1500.
					mockPerformanceNow.mockReturnValue(1500);
					removeStandardHold();
					tryComplete(interactionId, 1500);
					expect(interactions.has(interactionId)).toBe(true);

					// Real 3p work ends at 3000 (recorded in hold3pInfo); bg hold stays active.
					mockPerformanceNow.mockReturnValue(3000);
					removeReal3p();
					tryComplete(interactionId, 1500);
					expect(interactions.has(interactionId)).toBe(true);
					expect(interaction.hold3pActive?.size).toBe(1);

					// Timeout/abort fires at 63000 with the bg hold still active. end3p must NOT be dragged
					// to the clock (63000); it stays at the real hold's end (3000).
					mockPerformanceNow.mockReturnValue(63000);
					triggerAbort(interactionId);

					expect(interactions.has(interactionId)).toBe(false);
					expect(interaction.end).toBe(1500);
					expect(interaction.end3p).toBe(3000);
					expect(interaction.metricWindows?.['include-third-party']?.end).toBe(3000);
					expect(interaction.metricCategoryEnds?.['third-party']).toBe(3000);
					expect(interaction.metricWindows?.standard?.end).toBe(1500);
				},
			);

			it.each([
				['abort (timeout)', (id: string) => abort(id, 'timeout')],
				['abortAll', () => abortAll('timeout')],
			])(
				'Edge: bg-only tail (no real 3p) ending via %s clamps end3p to interaction.end, not the timeout clock',
				(_label, triggerAbort) => {
					const interactionId = 'bg-only-abort';
					const interaction = setup(interactionId);

					const removeStandardHold = addHold(
						interactionId,
						[{ name: 'segment1' }],
						'regular-hold',
						false,
					);
					addHold(interactionId, excludedLabelStack, 'bg-hold', false);

					// Standard window settles at 1500; only the bg hold remains, deferring completion.
					mockPerformanceNow.mockReturnValue(1500);
					removeStandardHold();
					tryComplete(interactionId, 1500);
					expect(interactions.has(interactionId)).toBe(true);
					expect(interaction.hold3pActive?.size).toBe(1);

					// Timeout/abort fires at 63000 with only the bg hold active. There is no real 3p work,
					// so end3p must clamp to interaction.end (1500), never the timeout clock.
					mockPerformanceNow.mockReturnValue(63000);
					triggerAbort(interactionId);

					expect(interactions.has(interactionId)).toBe(false);
					expect(interaction.end).toBe(1500);
					expect(interaction.end3p).toBe(1500);
					expect(interaction.metricWindows?.['include-third-party']?.end).toBe(1500);
					expect(interaction.metricCategoryEnds?.['third-party']).toBeUndefined();
					expect(interaction.metricWindows?.standard?.end).toBe(1500);
				},
			);

			it('Edge: two real 3p holds plus a bg hold -> end3p follows the LATEST real hold, ignoring the bg hold', () => {
				const interactionId = 'mixed-two-real-plus-bg';
				const interaction = setup(interactionId);

				const removeStandardHold = addHold(
					interactionId,
					[{ name: 'segment1' }],
					'regular-hold',
					false,
				);
				const removeReal3pA = addHold(
					interactionId,
					[{ name: 'segment2', type: 'third-party' as const }],
					'real-3p-a',
					false,
				);
				const removeReal3pB = addHold(
					interactionId,
					[{ name: 'segment3', type: 'third-party' as const }],
					'real-3p-b',
					false,
				);
				const removeBgHold = addHold(interactionId, excludedLabelStack, 'bg-hold', false);

				mockPerformanceNow.mockReturnValue(1500);
				removeStandardHold();
				tryComplete(interactionId, 1500);

				// Two real 3p holds end at 2500 and 4000; the LATER one (4000) must drive end3p.
				mockPerformanceNow.mockReturnValue(2500);
				removeReal3pA();
				tryComplete(interactionId, 1500);
				mockPerformanceNow.mockReturnValue(4000);
				removeReal3pB();
				tryComplete(interactionId, 1500);
				expect(interactions.has(interactionId)).toBe(true);

				// bg releases last at 10000 and finishes; end3p is the max real end (4000), not 10000.
				mockPerformanceNow.mockReturnValue(10000);
				removeBgHold();
				tryComplete(interactionId, 1500);

				expect(interaction.end3p).toBe(4000);
				expect(interaction.metricWindows?.['include-third-party']?.end).toBe(4000);
				expect(interaction.metricCategoryEnds?.['third-party']).toBe(4000);
			});

			it('Edge: a real 3p hold that ends BEFORE the standard end does not pull end3p below interaction.end', () => {
				const interactionId = 'mixed-real-ends-before-standard';
				const interaction = setup(interactionId);

				const removeStandardHold = addHold(
					interactionId,
					[{ name: 'segment1' }],
					'regular-hold',
					false,
				);
				const removeReal3p = addHold(interactionId, real3pLabelStack, 'real-3p-hold', false);
				const removeBgHold = addHold(interactionId, excludedLabelStack, 'bg-hold', false);

				// Real 3p hold ends early at 1200 (before the standard end).
				mockPerformanceNow.mockReturnValue(1200);
				removeReal3p();

				// Standard hold clears later at 2000 -> interaction.end = 2000.
				mockPerformanceNow.mockReturnValue(2000);
				removeStandardHold();
				tryComplete(interactionId, 2000);
				expect(interactions.has(interactionId)).toBe(true);

				// bg releases last; end3p is clamped to interaction.end (2000), not the early real end (1200).
				mockPerformanceNow.mockReturnValue(5000);
				removeBgHold();
				tryComplete(interactionId, 2000);

				expect(interaction.end).toBe(2000);
				expect(interaction.end3p).toBe(2000);
				expect(interaction.metricWindows?.['include-third-party']?.end).toBe(2000);
			});

			it('Zero-drift (no excluded hold): end3p follows the finish clock past interaction.end', () => {
				const interactionId = 'zero-drift-no-excluded';
				const interaction = setup(interactionId);

				const removeStandardHold = addHold(
					interactionId,
					[{ name: 'segment1' }],
					'regular-hold',
					false,
				);
				const removeReal3p = addHold(interactionId, real3pLabelStack, 'real-3p-hold', false);

				// Standard window settles at 1500.
				mockPerformanceNow.mockReturnValue(1500);
				removeStandardHold();
				tryComplete(interactionId, 1500);
				expect(interactions.has(interactionId)).toBe(true);

				// The real 3p hold releases at 3000 and fires the finishing tryComplete with NO endTime,
				// so currentTime = performance.now() = 3000 (> interaction.end = 1500). With no excluded
				// hold present, the guard returns currentTime verbatim: end3p = 3000, not floored to 1500.
				mockPerformanceNow.mockReturnValue(3000);
				removeReal3p();
				tryComplete(interactionId);

				expect(interactions.has(interactionId)).toBe(false);
				expect(interaction.end).toBe(1500);
				expect(interaction.end3p).toBe(3000);
				expect(interaction.metricWindows?.['include-third-party']?.end).toBe(3000);
				expect(interaction.metricWindows?.standard?.end).toBe(1500);
			});
		});
	});
});
