import type { InteractionMetrics } from '../../common';
import * as getPageVisibilityUpToTTAI from '../utils/get-page-visibility-up-to-ttai';

import getTTAI from './get-ttai';

// Mock the utility function
jest.mock('../utils/get-page-visibility-up-to-ttai');
const mockGetPageVisibilityUpToTTAI = getPageVisibilityUpToTTAI.default as jest.MockedFunction<
	typeof getPageVisibilityUpToTTAI.default
>;

describe('getTTAI', () => {
	const createMockInteraction = (
		overrides: Partial<InteractionMetrics> = {},
	): InteractionMetrics => ({
		id: 'test-id',
		start: 1000,
		end: 2000,
		ufoName: 'test-interaction',
		type: 'page_load',
		marks: [],
		customData: [],
		cohortingCustomData: new Map(),
		customTimings: [],
		spans: [],
		requestInfo: [],
		reactProfilerTimings: [],
		holdInfo: [],
		holdExpInfo: [],
		holdActive: new Map(),
		holdExpActive: new Map(),
		measureStart: 1000,
		rate: 1,
		cancelCallbacks: [],
		metaData: {},
		errors: [],
		apdex: [],
		labelStack: null,
		routeName: 'test-route',
		knownSegments: [],
		cleanupCallbacks: [],
		awaitReactProfilerCount: 0,
		redirects: [],
		timerID: undefined,
		changeTimeout: jest.fn(),
		trace: null,
		previousInteractionName: undefined,
		isPreviousInteractionAborted: false,
		abortReason: undefined,
		...overrides,
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return TTAI when interaction is not aborted and page is visible', () => {
		const interaction = createMockInteraction({
			start: 1000,
			end: 2500,
			abortReason: undefined,
		});

		mockGetPageVisibilityUpToTTAI.mockReturnValue('visible');

		const result = getTTAI(interaction);

		expect(result).toBe(1500); // Math.round(2500 - 1000)
		expect(mockGetPageVisibilityUpToTTAI).toHaveBeenCalledWith(interaction);
	});

	it('should return undefined when interaction is aborted', () => {
		const interaction = createMockInteraction({
			start: 1000,
			end: 2500,
			abortReason: 'timeout',
		});

		mockGetPageVisibilityUpToTTAI.mockReturnValue('visible');

		const result = getTTAI(interaction);

		expect(result).toBeUndefined();
	});

	it('should return undefined when page is not visible', () => {
		const interaction = createMockInteraction({
			start: 1000,
			end: 2500,
			abortReason: undefined,
		});

		mockGetPageVisibilityUpToTTAI.mockReturnValue('hidden');

		const result = getTTAI(interaction);

		expect(result).toBeUndefined();
	});

	it('should return undefined when page visibility is mixed', () => {
		const interaction = createMockInteraction({
			start: 1000,
			end: 2500,
			abortReason: undefined,
		});

		mockGetPageVisibilityUpToTTAI.mockReturnValue('mixed');

		const result = getTTAI(interaction);

		expect(result).toBeUndefined();
	});

	it('should handle edge case where start and end are the same', () => {
		const interaction = createMockInteraction({
			start: 1000,
			end: 1000,
			abortReason: undefined,
		});

		mockGetPageVisibilityUpToTTAI.mockReturnValue('visible');

		const result = getTTAI(interaction);

		expect(result).toBe(0);
	});

	it('should round the result to nearest integer', () => {
		const interaction = createMockInteraction({
			start: 1000.7,
			end: 2500.3,
			abortReason: undefined,
		});

		mockGetPageVisibilityUpToTTAI.mockReturnValue('visible');

		const result = getTTAI(interaction);

		expect(result).toBe(1500); // Math.round(2500.3 - 1000.7) = Math.round(1499.6) = 1500
	});

	it('should handle different abort reasons', () => {
		const abortReasons = ['timeout', 'new_interaction', 'transition'] as const;

		abortReasons.forEach((abortReason) => {
			const interaction = createMockInteraction({
				start: 1000,
				end: 2500,
				abortReason,
			});

			mockGetPageVisibilityUpToTTAI.mockReturnValue('visible');

			const result = getTTAI(interaction);

			expect(result).toBeUndefined();
		});
	});
});
