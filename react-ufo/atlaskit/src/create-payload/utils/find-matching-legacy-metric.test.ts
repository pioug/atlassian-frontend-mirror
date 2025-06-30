import type { InteractionMetrics } from '../../common';

import { findMatchingLegacyMetric } from './find-matching-legacy-metric';

describe('findMatchingLegacyMetric', () => {
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

	describe('matching by key', () => {
		it('should find metric when key matches exactly', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
					{
						key: 'other-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2000,
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeDefined();
			expect(result?.key).toBe('test-experience');
			expect(result?.type).toBe('PAGE_LOAD');
		});

		it('should not find metric when key does not match', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'different-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});
	});

	describe('matching by reactUFOName', () => {
		it('should find metric when reactUFOName matches', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'different-key',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: {
							type: 'PAGE_LOAD',
							reactUFOName: 'test-experience',
						},
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeDefined();
			expect(result?.key).toBe('different-key');
			expect(result?.config.reactUFOName).toBe('test-experience');
		});

		it('should not find metric when reactUFOName does not match', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'different-key',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: {
							type: 'PAGE_LOAD',
							reactUFOName: 'different-experience',
						},
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});
	});

	describe('type filtering', () => {
		it('should only find PAGE_LOAD type metrics', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'CUSTOM',
						start: 1000,
						stop: 2200,
						config: { type: 'CUSTOM' },
						custom: {},
					},
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeDefined();
			expect(result?.type).toBe('PAGE_LOAD');
		});

		it('should not find metrics with non-PAGE_LOAD types', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'CUSTOM',
						start: 1000,
						stop: 2200,
						config: { type: 'CUSTOM' },
						custom: {},
					},
					{
						key: 'test-experience',
						type: 'TRANSITION',
						start: 1000,
						stop: 2200,
						config: { type: 'TRANSITION' },
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});
	});

	describe('edge cases', () => {
		it('should return undefined when legacyMetrics is undefined', () => {
			const interaction = createMockInteraction({
				legacyMetrics: undefined,
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});

		it('should return undefined when legacyMetrics is empty', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});

		it('should return undefined when no metrics match both key/reactUFOName and type', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'different-experience',
						type: 'CUSTOM',
						start: 1000,
						stop: 2200,
						config: { type: 'CUSTOM' },
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeUndefined();
		});

		it('should return first matching metric when multiple metrics match', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2500,
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeDefined();
			expect(result?.stop).toBe(2200); // Should return the first match
		});
	});

	describe('priority matching', () => {
		it('should prioritize key match over reactUFOName match', () => {
			const interaction = createMockInteraction({
				legacyMetrics: [
					{
						key: 'test-experience',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2200,
						config: { type: 'PAGE_LOAD' },
						custom: {},
					},
					{
						key: 'different-key',
						type: 'PAGE_LOAD',
						start: 1000,
						stop: 2500,
						config: {
							type: 'PAGE_LOAD',
							reactUFOName: 'test-experience',
						},
						custom: {},
					},
				],
			});

			const result = findMatchingLegacyMetric(interaction, 'test-experience');

			expect(result).toBeDefined();
			expect(result?.key).toBe('test-experience'); // Should match by key first
			expect(result?.stop).toBe(2200);
		});
	});
});
