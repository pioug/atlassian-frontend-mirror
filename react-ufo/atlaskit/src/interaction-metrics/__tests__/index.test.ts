import { fg } from '@atlaskit/platform-feature-flags';

import type { ApdexType, BM3Event } from '../../common';
import { setUFOConfig } from '../../config';
import { DefaultInteractionID } from '../../interaction-id-context';
import { interactions } from '../common/constants';
import {
	abort,
	addApdex,
	addApdexToAll,
	addBrowserMetricEvent,
	addNewInteraction,
	PreviousInteractionLog,
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

// Helper to create a valid BM3Event
const createBM3Event = (): BM3Event => ({
	key: 'test-bm3-key',
	custom: {},
	config: {
		type: 'PAGE_LOAD',
	},
	start: 1000,
	stop: 2000,
	type: 'page_load',
});

describe('interaction-metrics timeout behavior', () => {
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
		});
	});

	afterEach(() => {
		interactions.clear();
		DefaultInteractionID.current = null;
	});

	describe('default timeout behavior (current implementation)', () => {
		beforeEach(() => {
			// Ensure the feature flag is disabled for current behavior tests
			mockFg.mockReturnValue(false);
		});

		it('should create interaction with 60s timeout by default', () => {
			const interactionId = 'test-interaction-1';
			const startTime = 1000;

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

			// Check that setTimeout was called with 60s timeout (60 * 1000 = 60000ms)
			expect(mockSetTimeout).toHaveBeenCalledWith(
				expect.any(Function),
				60000, // CLEANUP_TIMEOUT
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();
			expect(interaction!.ufoName).toBe('test-ufo-name');
			expect(interaction!.type).toBe('page_load');
		});

		it('should NOT reduce timeout for press interactions when BrowserMetricEvent is added', () => {
			const interactionId = 'test-interaction-4';
			const startTime = 1000;

			// Set the current interaction ID so addBrowserMetricEvent can find it
			DefaultInteractionID.current = interactionId;

			addNewInteraction(interactionId, 'test-ufo-name', 'press', startTime, 1, null, null, null);

			// Clear the initial setTimeout call
			mockSetTimeout.mockClear();
			mockClearTimeout.mockClear();

			const bm3Event = createBM3Event();
			addBrowserMetricEvent(bm3Event);

			// Should NOT change timeout for press interactions
			expect(mockClearTimeout).not.toHaveBeenCalled();
			expect(mockSetTimeout).not.toHaveBeenCalled();
		});

		it('should NOT reduce timeout for press interactions when apdex is added', () => {
			const interactionId = 'test-interaction-7';
			const startTime = 1000;

			addNewInteraction(interactionId, 'test-ufo-name', 'press', startTime, 1, null, null, null);

			// Clear the initial setTimeout call
			mockSetTimeout.mockClear();
			mockClearTimeout.mockClear();

			const apdexInfo: ApdexType = {
				key: 'test-apdex',
				stopTime: 8000,
				startTime: 7500,
			};

			addApdex(interactionId, apdexInfo);

			// Should NOT change timeout for press interactions
			expect(mockClearTimeout).not.toHaveBeenCalled();
			expect(mockSetTimeout).not.toHaveBeenCalled();
		});
	});

	describe('config set interaction metrics', () => {
		it('should create interaction with 60s timeout by default when no config is set', () => {
			const interactionId = 'test-interaction-1';
			const startTime = 1000;

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

			// Check that setTimeout was called with 60s timeout (60 * 1000 = 60000ms)
			expect(mockSetTimeout).toHaveBeenCalledWith(
				expect.any(Function),
				60000, // default CLEANUP_TIMEOUT
			);
		});
		it('should create interaction with custom timeout when config is set', () => {
			// Set default config
			setUFOConfig({
				enabled: true,
				product: 'test-product',
				region: 'test-region',
				interactionTimeout: { 'test-ufo-name': 30000 }, // Custom timeout of 30 seconds
			});
			const interactionId = 'test-interaction-1';
			const startTime = 1000;

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

			// Check that setTimeout was called with 60s timeout (60 * 1000 = 60000ms)
			expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 30000);
		});
	});

	describe('simplified timeout behavior', () => {
		it('should create interaction with 60s timeout and keep it', () => {
			const interactionId = 'test-interaction-8';
			const startTime = 1000;

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

			// Check that setTimeout was called with 60s timeout
			expect(mockSetTimeout).toHaveBeenCalledWith(
				expect.any(Function),
				60000, // CLEANUP_TIMEOUT
			);

			const interaction = interactions.get(interactionId);
			expect(interaction).toBeDefined();
		});

		it('should NOT reduce timeout when BrowserMetricEvent is added (page_load)', () => {
			const interactionId = 'test-interaction-9';
			const startTime = 1000;

			// Set the current interaction ID so addBrowserMetricEvent can find it
			DefaultInteractionID.current = interactionId;

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

			// Clear the initial setTimeout call
			mockSetTimeout.mockClear();
			mockClearTimeout.mockClear();

			const bm3Event = createBM3Event();
			addBrowserMetricEvent(bm3Event);

			// Should NOT change timeout when feature flag is enabled
			expect(mockClearTimeout).not.toHaveBeenCalled();
			expect(mockSetTimeout).not.toHaveBeenCalled();
		});

		it('should NOT reduce timeout when BrowserMetricEvent is added (transition)', () => {
			const interactionId = 'test-interaction-10';
			const startTime = 1000;

			// Set the current interaction ID so addBrowserMetricEvent can find it
			DefaultInteractionID.current = interactionId;

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'transition',
				startTime,
				1,
				null,
				null,
				null,
			);

			// Clear the initial setTimeout call
			mockSetTimeout.mockClear();
			mockClearTimeout.mockClear();

			const bm3Event = createBM3Event();
			addBrowserMetricEvent(bm3Event);

			// Should NOT change timeout when feature flag is enabled
			expect(mockClearTimeout).not.toHaveBeenCalled();
			expect(mockSetTimeout).not.toHaveBeenCalled();
		});

		it('should NOT reduce timeout when apdex is added to specific interaction', () => {
			const interactionId = 'test-interaction-11';
			const startTime = 1000;

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

			// Clear the initial setTimeout call
			mockSetTimeout.mockClear();
			mockClearTimeout.mockClear();

			const apdexInfo: ApdexType = {
				key: 'test-apdex',
				stopTime: 12000,
				startTime: 11500,
			};

			addApdex(interactionId, apdexInfo);

			// Should NOT change timeout when feature flag is enabled
			expect(mockClearTimeout).not.toHaveBeenCalled();
			expect(mockSetTimeout).not.toHaveBeenCalled();
		});

		it('should NOT reduce timeout for any interactions when apdex is added to all', () => {
			const interactionId1 = 'test-interaction-12a';
			const interactionId2 = 'test-interaction-12b';
			const startTime = 1000;

			// Create two interactions
			addNewInteraction(
				interactionId1,
				'test-ufo-name-1',
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);
			addNewInteraction(
				interactionId2,
				'test-ufo-name-2',
				'transition',
				startTime,
				1,
				null,
				null,
				null,
			);

			// Clear the initial setTimeout calls
			mockSetTimeout.mockClear();
			mockClearTimeout.mockClear();

			const apdex: ApdexType = {
				key: 'test-apdex-all',
				stopTime: 13000,
				startTime: 12500,
			};

			addApdexToAll(apdex);

			// Should NOT change timeouts when feature flag is enabled
			expect(mockClearTimeout).not.toHaveBeenCalled();
			expect(mockSetTimeout).not.toHaveBeenCalled();
		});

		it('should still remove holds when BrowserMetricEvent is added', () => {
			const interactionId = 'test-interaction-13';
			const startTime = 1000;

			// Set the current interaction ID so addBrowserMetricEvent can find it
			DefaultInteractionID.current = interactionId;

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

			const bm3Event = createBM3Event();
			// Add the event
			addBrowserMetricEvent(bm3Event);

			// Verify the event was added to the interaction
			expect(interaction!.legacyMetrics).toHaveLength(1);
			expect(interaction!.legacyMetrics![0]).toBe(bm3Event);
		});

		it('should still add apdex data when apdex is added', () => {
			const interactionId = 'test-interaction-14';
			const startTime = 1000;

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

			const apdexInfo: ApdexType = {
				key: 'test-apdex',
				stopTime: 15000,
				startTime: 14500,
			};

			addApdex(interactionId, apdexInfo);

			// Verify the apdex was added to the interaction
			expect(interaction!.apdex).toHaveLength(1);
			expect(interaction!.apdex[0]).toEqual(apdexInfo);
		});
	});

	describe('cleanup behavior', () => {
		it('should clear timeout when interaction is aborted', () => {
			const interactionId = 'test-interaction-15';
			const startTime = 1000;

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

			// Clear the initial call
			mockClearTimeout.mockClear();

			abort(interactionId, 'timeout');

			// Should clear the timeout when aborted
			expect(mockClearTimeout).toHaveBeenCalled();
		});
	});

	describe('PreviousInteractionLog', () => {
		beforeEach(() => {
			PreviousInteractionLog.id = undefined;
			PreviousInteractionLog.name = undefined;
			PreviousInteractionLog.type = undefined;
			PreviousInteractionLog.isAborted = undefined;
			PreviousInteractionLog.timestamp = undefined;
		});

		it('should set id, type, and timestamp when feature flag is enabled', () => {
			mockFg.mockImplementation((flag: string) => flag === 'platform_ufo_enable_terminal_errors');
			mockPerformanceNow.mockReturnValue(2000);

			const interactionId = 'test-prev-interaction-1';
			const startTime = 1000;

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

			tryComplete(interactionId, 2000);

			expect(PreviousInteractionLog.id).toBe(interactionId);
			expect(PreviousInteractionLog.name).toBe('test-ufo-name');
			expect(PreviousInteractionLog.type).toBe('page_load');
			expect(PreviousInteractionLog.isAborted).toBe(false);
			expect(PreviousInteractionLog.timestamp).toBe(2000);
		});

		it('should NOT set id, type, and timestamp when feature flag is disabled', () => {
			mockFg.mockReturnValue(false);
			mockPerformanceNow.mockReturnValue(2000);

			const interactionId = 'test-prev-interaction-2';
			const startTime = 1000;

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'transition',
				startTime,
				1,
				null,
				null,
				null,
			);

			tryComplete(interactionId, 2000);

			expect(PreviousInteractionLog.id).toBeUndefined();
			expect(PreviousInteractionLog.type).toBeUndefined();
			expect(PreviousInteractionLog.timestamp).toBeUndefined();
		});

		it('should always set name and isAborted', () => {
			mockPerformanceNow.mockReturnValue(2000);

			const interactionId = 'test-prev-interaction-3';
			const startTime = 1000;

			addNewInteraction(
				interactionId,
				'test-ufo-name',
				'press',
				startTime,
				1,
				null,
				null,
				null,
			);

			tryComplete(interactionId, 2000);

			expect(PreviousInteractionLog.name).toBe('test-ufo-name');
			expect(PreviousInteractionLog.isAborted).toBe(false);
		});

		it('should set name to "unknown" when ufoName is empty', () => {
			mockPerformanceNow.mockReturnValue(2000);

			const interactionId = 'test-prev-interaction-5';
			const startTime = 1000;

			addNewInteraction(
				interactionId,
				'', // empty ufoName
				'page_load',
				startTime,
				1,
				null,
				null,
				null,
			);

			tryComplete(interactionId, 2000);

			expect(PreviousInteractionLog.name).toBe('unknown');
		});

		it('should update PreviousInteractionLog for different interaction types', () => {
			mockFg.mockImplementation((flag: string) => flag === 'platform_ufo_enable_terminal_errors');

			const transitionId = 'test-prev-interaction-6';
			mockPerformanceNow.mockReturnValue(3000);

			addNewInteraction(transitionId, 'transition-interaction', 'transition', 1000, 1, null, null, null);
			tryComplete(transitionId, 3000);

			expect(PreviousInteractionLog.id).toBe(transitionId);
			expect(PreviousInteractionLog.name).toBe('transition-interaction');
			expect(PreviousInteractionLog.type).toBe('transition');
			expect(PreviousInteractionLog.timestamp).toBe(3000);

			// Test press type - should overwrite previous values
			const pressId = 'test-prev-interaction-7';
			mockPerformanceNow.mockReturnValue(4000);

			addNewInteraction(pressId, 'press-interaction', 'press', 2000, 1, null, null, null);
			tryComplete(pressId, 4000);

			expect(PreviousInteractionLog.id).toBe(pressId);
			expect(PreviousInteractionLog.name).toBe('press-interaction');
			expect(PreviousInteractionLog.type).toBe('press');
			expect(PreviousInteractionLog.timestamp).toBe(4000);
		});
	});
});
