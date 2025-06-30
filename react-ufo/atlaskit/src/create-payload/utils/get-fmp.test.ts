import type { InteractionMetrics } from '../../common';

import { getFMP } from './get-fmp';

// Mock the config module
jest.mock('../../config');

describe('getFMP', () => {
	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();
		// Default mock - no SSR done time
		const { getConfig } = require('../../config');
		getConfig.mockReturnValue({
			ssr: {
				getSSRDoneTime: undefined,
			},
		});
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

	describe('FMP calculation', () => {
		it('should calculate FMP from legacy metrics when available for PAGE_LOAD', () => {
			const interaction = createMockInteraction({
				type: 'page_load',
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
						fmp: 1800, // FMP should be 1800 - 1000 = 800ms
					} as any,
				],
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBe(800);
		});

		it('should calculate FMP from legacy metrics when available for TRANSITION', () => {
			const interaction = createMockInteraction({
				type: 'transition',
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
						fmp: 1700, // FMP should be 1700 - 1000 = 700ms
					} as any,
				],
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBe(700);
		});

		it('should not calculate FMP for TRANSITION without legacy metrics', () => {
			const interaction = createMockInteraction({
				type: 'transition',
				legacyMetrics: [],
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});

		it('should return undefined for PAGE_LOAD without legacy metrics when not using SSR config', () => {
			const interaction = createMockInteraction({
				type: 'page_load',
				start: 1000,
				end: 2500,
				legacyMetrics: [],
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});

		it('should calculate FMP from FMP mark when BM3 config is enabled', () => {
			const interaction = createMockInteraction({
				type: 'page_load',
				start: 1000,
				end: 2500,
				legacyMetrics: [],
				marks: [{ name: 'fmp', time: 1600, type: 'custom', labelStack: null }],
				metaData: { __legacy__bm3ConfigSSRDoneAsFmp: true },
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBe(600); // 1600 - 1000
		});

		it('should calculate FMP from FMP mark when UFO config is enabled', () => {
			// Mock the config to have UFO SSR done time
			const { getConfig } = require('../../config');
			getConfig.mockReturnValue({
				ssr: {
					getSSRDoneTime: () => undefined,
				},
			});

			const interaction = createMockInteraction({
				type: 'page_load',
				start: 1000,
				end: 2500,
				legacyMetrics: [],
				marks: [{ name: 'fmp', time: 1750, type: 'custom', labelStack: null }],
				metaData: { __legacy__bm3ConfigSSRDoneAsFmp: false },
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBe(750); // 1750 - 1000
		});

		it('should calculate FMP from SSR done time when no FMP mark and SSR config enabled', () => {
			// Mock the config to have SSR done time
			const { getConfig } = require('../../config');
			getConfig.mockReturnValue({
				ssr: {
					getSSRDoneTime: () => 1300,
				},
			});

			const interaction = createMockInteraction({
				type: 'page_load',
				start: 1000,
				end: 2500,
				legacyMetrics: [],
				marks: [{ name: 'other-mark', time: 1400, type: 'custom', labelStack: null }],
				metaData: { __legacy__bm3ConfigSSRDoneAsFmp: true },
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBe(300); // 1300 - 1000
		});

		it('should return undefined when no FMP mark and no SSR done time', () => {
			const interaction = createMockInteraction({
				type: 'page_load',
				start: 1000,
				end: 2500,
				legacyMetrics: [],
				marks: [{ name: 'other-mark', time: 1400, type: 'custom', labelStack: null }],
				metaData: { __legacy__bm3ConfigSSRDoneAsFmp: true },
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});

		it('should not calculate FMP for non-PAGE_LOAD/TRANSITION types', () => {
			const interaction = createMockInteraction({
				type: 'press',
				legacyMetrics: [],
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});

		it('should return undefined FMP when legacy metric has no FMP for PAGE_LOAD/TRANSITION', () => {
			const interaction = createMockInteraction({
				type: 'page_load',
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
						// No fmp property
					},
				],
			});

			const result = getFMP(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});
	});
});
