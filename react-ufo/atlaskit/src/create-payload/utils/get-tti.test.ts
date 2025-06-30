import type { InteractionMetrics } from '../../common';

import { getTTI } from './get-tti';

// Mock the config module
jest.mock('../../config');

describe('getTTI', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
	});

	const createMockInteraction = (
		overrides: Partial<InteractionMetrics> = {},
	): InteractionMetrics => ({
		id: 'test-interaction',
		start: 1000,
		end: 3000,
		ufoName: 'test-experience',
		rate: 1,
		type: 'page_load',
		apdex: [],
		legacyMetrics: [],
		errors: [],
		isPreviousInteractionAborted: false,
		marks: [],
		customData: [],
		cohortingCustomData: new Map(),
		customTimings: [],
		spans: [],
		requestInfo: [],
		holdInfo: [],
		holdExpInfo: [],
		holdActive: new Map(),
		holdExpActive: new Map(),
		reactProfilerTimings: [],
		measureStart: 1000,
		cancelCallbacks: [],
		cleanupCallbacks: [],
		metaData: {},
		labelStack: null,
		knownSegments: [],
		awaitReactProfilerCount: 0,
		redirects: [],
		timerID: undefined,
		changeTimeout: jest.fn(),
		trace: null,
		routeName: 'test-route',
		...overrides,
	});

	describe('TTI calculation', () => {
		it('should calculate TTI from legacy metrics when available', () => {
			const interaction = createMockInteraction({
				apdex: [{ key: 'test-apdex', stopTime: 2500, startTime: 1000 }],
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200, // TTI should be 2200 - 1000 = 1200ms
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
				],
			});

			const result = getTTI(interaction, 'test-experience');

			expect(result).toBe(1200);
		});

		it('should calculate TTI from apdex when no matching legacy metrics', () => {
			const interaction = createMockInteraction({
				apdex: [{ key: 'test-apdex', stopTime: 2300, startTime: 1000 }],
				legacyMetrics: [
					{
						key: 'different-experience', // Non-matching key
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
				],
			});

			const result = getTTI(interaction, 'test-experience');

			expect(result).toBe(1300); // 2300 - 1000
		});

		it('should calculate TTI from UFO end time when no legacy metrics or apdex', () => {
			const interaction = createMockInteraction({
				end: 2800,
				apdex: [],
				legacyMetrics: [],
			});

			const result = getTTI(interaction, 'test-experience');

			expect(result).toBe(1800); // 2800 - 1000
		});

		it('should handle legacy metric matching by reactUFOName', () => {
			const interaction = createMockInteraction({
				apdex: [{ key: 'test-apdex', stopTime: 2500, startTime: 1000 }],
				legacyMetrics: [
					{
						key: 'different-key',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2100,
						config: {
							type: 'PAGE_LOAD',
							reactUFOName: 'test-experience', // Matches by reactUFOName
						},
						custom: {},
					},
				],
			});

			const result = getTTI(interaction, 'test-experience');

			expect(result).toBe(1100); // 2100 - 1000
		});

		it('should return undefined TTI when no valid end time is found', () => {
			const interaction = createMockInteraction({
				end: 0, // Invalid end time
				apdex: [],
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: null, // No stop time
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
				],
			});

			const result = getTTI(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});
	});
});
