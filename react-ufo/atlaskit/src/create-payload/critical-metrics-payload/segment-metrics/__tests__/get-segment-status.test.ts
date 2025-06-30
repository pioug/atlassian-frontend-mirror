import type { InteractionMetrics, LabelStack } from '../../../../common';
import getSegmentStatus from '../get-segment-status';

// Mock the dependencies
jest.mock('../../../utils/get-interaction-status', () =>
	jest.fn(() => ({ originalInteractionStatus: 'SUCCEEDED' })),
);

const mockGetInteractionStatus = require('../../../utils/get-interaction-status');

describe('getSegmentStatus', () => {
	const createBaseInteraction = (
		overrides: Partial<InteractionMetrics> = {},
	): InteractionMetrics => ({
		id: 'test-id',
		start: 1000,
		end: 2000,
		ufoName: 'test-ufo',
		previousInteractionName: undefined,
		isPreviousInteractionAborted: false,
		type: 'page_load',
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
		measureStart: 0,
		rate: 1,
		cancelCallbacks: [],
		cleanupCallbacks: [],
		metaData: {},
		errors: [],
		apdex: [],
		labelStack: null,
		routeName: null,
		knownSegments: [],
		awaitReactProfilerCount: 0,
		redirects: [],
		timerID: undefined,
		changeTimeout: () => {},
		trace: null,
		abortReason: undefined,
		...overrides,
	});

	const createSegment = (labelStack: LabelStack) => ({ labelStack });

	beforeEach(() => {
		jest.clearAllMocks();
		mockGetInteractionStatus.mockReturnValue({ originalInteractionStatus: 'SUCCEEDED' });
	});

	describe('when segment has failed', () => {
		it('should return FAILED status when segment has errors', () => {
			const interaction = createBaseInteraction({
				errors: [
					{
						name: 'TestError',
						errorType: 'runtime',
						errorMessage: 'Error message',
						labelStack: [{ name: 'segment', segmentId: 'target-segment' }],
					},
				],
			});

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'FAILED', abortReason: undefined });
		});
	});

	describe('when interaction is aborted by new interaction', () => {
		it('should return ABORTED status with new_interaction reason', () => {
			mockGetInteractionStatus.mockReturnValue({ originalInteractionStatus: 'ABORTED' });
			const interaction = createBaseInteraction({
				abortReason: 'new_interaction',
			});

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'ABORTED', abortReason: 'new_interaction' });
		});
	});

	describe('when interaction is aborted by transition', () => {
		it('should return ABORTED status with transition reason', () => {
			mockGetInteractionStatus.mockReturnValue({ originalInteractionStatus: 'ABORTED' });
			const interaction = createBaseInteraction({
				abortReason: 'transition',
			});

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'ABORTED', abortReason: 'transition' });
		});
	});

	describe('when segment has active holds', () => {
		it('should return ABORTED status with timeout reason when active holds are under segment', () => {
			const interaction = createBaseInteraction({
				holdActive: new Map([
					[
						'hold1',
						{
							name: 'hold1',
							start: 1100,
							labelStack: [{ name: 'segment', segmentId: 'target-segment' }, { name: 'child' }],
						},
					],
				]),
			});

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'ABORTED', abortReason: 'timeout' });
		});

		it('should return SUCCEEDED when active holds are not under segment', () => {
			const interaction = createBaseInteraction({
				holdActive: new Map([
					[
						'hold1',
						{
							name: 'hold1',
							start: 1100,
							labelStack: [{ name: 'other', segmentId: 'other-segment' }, { name: 'child' }],
						},
					],
				]),
			});

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'SUCCEEDED', abortReason: undefined });
		});
	});

	describe('when segment has no segmentId', () => {
		it('should return SUCCEEDED status', () => {
			const interaction = createBaseInteraction();

			const segment = createSegment([{ name: 'label' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'SUCCEEDED', abortReason: undefined });
		});

		it('should not check for active holds when no segmentId', () => {
			const interaction = createBaseInteraction({
				holdActive: new Map([
					[
						'hold1',
						{
							name: 'hold1',
							start: 1100,
							labelStack: [{ name: 'segment', segmentId: 'any-segment' }],
						},
					],
				]),
			});

			const segment = createSegment([{ name: 'label' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'SUCCEEDED', abortReason: undefined });
		});
	});

	describe('precedence of status checks', () => {
		it('should prioritize segment failure over interaction abort', () => {
			mockGetInteractionStatus.mockReturnValue({ originalInteractionStatus: 'ABORTED' });
			const interaction = createBaseInteraction({
				abortReason: 'new_interaction',
				errors: [
					{
						name: 'TestError',
						errorType: 'runtime',
						errorMessage: 'Error message',
						labelStack: [{ name: 'segment', segmentId: 'target-segment' }],
					},
				],
			});

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'FAILED', abortReason: undefined });
		});

		it('should prioritize interaction abort over active holds', () => {
			mockGetInteractionStatus.mockReturnValue({ originalInteractionStatus: 'ABORTED' });
			const interaction = createBaseInteraction({
				abortReason: 'transition',
				holdActive: new Map([
					[
						'hold1',
						{
							name: 'hold1',
							start: 1100,
							labelStack: [{ name: 'segment', segmentId: 'target-segment' }],
						},
					],
				]),
			});

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'ABORTED', abortReason: 'transition' });
		});
	});

	describe('default success case', () => {
		it('should return SUCCEEDED status when no failure conditions are met', () => {
			const interaction = createBaseInteraction();

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'SUCCEEDED', abortReason: undefined });
		});
	});

	describe('multiple active holds', () => {
		it('should abort on first matching hold under segment', () => {
			const interaction = createBaseInteraction({
				holdActive: new Map([
					[
						'hold1',
						{
							name: 'hold1',
							start: 1100,
							labelStack: [{ name: 'other', segmentId: 'other-segment' }],
						},
					],
					[
						'hold2',
						{
							name: 'hold2',
							start: 1200,
							labelStack: [{ name: 'segment', segmentId: 'target-segment' }],
						},
					],
					[
						'hold3',
						{
							name: 'hold3',
							start: 1300,
							labelStack: [{ name: 'segment', segmentId: 'target-segment' }],
						},
					],
				]),
			});

			const segment = createSegment([{ name: 'segment', segmentId: 'target-segment' }]);

			const result = getSegmentStatus(interaction, segment);

			expect(result).toEqual({ status: 'ABORTED', abortReason: 'timeout' });
		});
	});
});
