import { v4 as createUUID } from 'uuid';

// Mock all dependencies
jest.mock('uuid');
jest.mock('../../coinflip');
jest.mock('../../config');
jest.mock('../../interaction-id-context');
jest.mock('../../interaction-metrics');
jest.mock('../../route-name-context');
jest.mock('../../experience-trace-id-context');

import coinflip from '../../coinflip';
import { getDoNotAbortActivePressInteraction, getInteractionRate } from '../../config';
import { getActiveTrace, setInteractionActiveTrace } from '../../experience-trace-id-context';
import { DefaultInteractionID } from '../../interaction-id-context';
import { abortAll, addNewInteraction, getActiveInteraction } from '../../interaction-metrics';
import UFORouteName from '../../route-name-context';

import traceUFOInteraction from './trace-ufo-interaction';

const mockCoinflip = coinflip as jest.MockedFunction<typeof coinflip>;
const mockGetInteractionRate = getInteractionRate as jest.MockedFunction<typeof getInteractionRate>;
const mockGetDoNotAbortActivePressInteraction =
	getDoNotAbortActivePressInteraction as jest.MockedFunction<
		typeof getDoNotAbortActivePressInteraction
	>;
const mockGetActiveInteraction = getActiveInteraction as jest.MockedFunction<
	typeof getActiveInteraction
>;
const mockAbortAll = abortAll as jest.MockedFunction<typeof abortAll>;
const mockAddNewInteraction = addNewInteraction as jest.MockedFunction<typeof addNewInteraction>;
const mockGetActiveTrace = getActiveTrace as jest.MockedFunction<typeof getActiveTrace>;
const mockSetInteractionActiveTrace = setInteractionActiveTrace as jest.MockedFunction<
	typeof setInteractionActiveTrace
>;
const mockCreateUUID = createUUID as jest.MockedFunction<typeof createUUID>;

describe('internal traceUFOInteraction', () => {
	const mockTraceContext = {
		traceId: 'test-trace-id',
		spanId: 'test-span-id',
		type: 'test-type',
	};

	beforeEach(() => {
		jest.clearAllMocks();

		// Set up default mock implementations
		mockGetInteractionRate.mockReturnValue(1);
		mockGetDoNotAbortActivePressInteraction.mockReturnValue(undefined);
		mockGetActiveInteraction.mockReturnValue(undefined);
		mockGetActiveTrace.mockReturnValue(mockTraceContext);
		mockCreateUUID.mockReturnValue('test-uuid-123');

		// Mock performance.now
		jest.spyOn(performance, 'now').mockReturnValue(1000);

		// Set up context defaults
		DefaultInteractionID.current = null;
		UFORouteName.current = 'test-route';
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('basic functionality', () => {
		it('should call getInteractionRate with correct parameters', () => {
			mockCoinflip.mockReturnValue(false);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockGetInteractionRate).toHaveBeenCalledWith('test-interaction', 'press');
		});

		it('should call coinflip with the interaction rate', () => {
			mockGetInteractionRate.mockReturnValue(5);
			mockCoinflip.mockReturnValue(false);

			traceUFOInteraction('test-interaction', 'hover');

			expect(mockCoinflip).toHaveBeenCalledWith(5);
		});

		it('should handle different interaction types', () => {
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'typing');

			expect(mockGetInteractionRate).toHaveBeenCalledWith('test-interaction', 'typing');
			expect(mockSetInteractionActiveTrace).toHaveBeenCalledWith('test-uuid-123', 'typing');
		});
	});

	describe('doNotAbortActivePressInteraction logic', () => {
		it('should return early when interaction is in doNotAbortActivePressInteraction list and active interaction is a press type with non-unknown name', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['test-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'test-interaction',
				type: 'press',
			} as any);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockCoinflip).not.toHaveBeenCalled();
			expect(mockAbortAll).not.toHaveBeenCalled();
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
		});

		it('should not return early when interaction is in doNotAbortActivePressInteraction list but active interaction ufoName is unknown', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['test-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'unknown',
				type: 'press',
			} as any);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockCoinflip).toHaveBeenCalled();
		});

		it('should not return early when interaction is in doNotAbortActivePressInteraction list but active interaction is not press type', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['test-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'test-interaction',
				type: 'hover',
			} as any);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockCoinflip).toHaveBeenCalled();
		});

		it('should continue when interaction is NOT in doNotAbortActivePressInteraction list', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['other-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'some-interaction',
				type: 'press',
			} as any);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockCoinflip).toHaveBeenCalled();
		});

		it('should handle null active interaction gracefully', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['test-interaction']);
			mockGetActiveInteraction.mockReturnValue(undefined);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockCoinflip).toHaveBeenCalled();
		});
	});

	describe('abort logic', () => {
		it('should abort all interactions BEFORE coinflip when not in doNotAbortActivePressInteraction list and coinflip fails', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(undefined);
			mockCoinflip.mockReturnValue(false);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockAbortAll).toHaveBeenCalledWith('new_interaction', 'test-interaction');
			expect(mockAbortAll).toHaveBeenCalledTimes(1);
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
		});

		it('should abort all interactions BEFORE coinflip and add new interaction when coinflip passes', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(undefined);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockAbortAll).toHaveBeenCalledWith('new_interaction', 'test-interaction');
			expect(mockAbortAll).toHaveBeenCalledTimes(1);
			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000,
				1,
				[],
				'test-route',
				mockTraceContext,
			);
		});

		it('should not call abortAll when interaction is in doNotAbortActivePressInteraction list and active interaction matches', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['test-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'test-interaction',
				type: 'press',
			} as any);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockAbortAll).not.toHaveBeenCalled();
			expect(mockCoinflip).not.toHaveBeenCalled();
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
		});

		it('should proceed with coinflip when interaction is in doNotAbortActivePressInteraction list but active interaction does not match', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['test-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'some-interaction',
				type: 'hover',
			} as any);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockAbortAll).not.toHaveBeenCalled();
			expect(mockCoinflip).toHaveBeenCalled();
			expect(mockAddNewInteraction).toHaveBeenCalled();
		});

		it('should abort interactions when interaction is NOT in doNotAbortActivePressInteraction list and coinflip fails', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['other-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'some-active-interaction',
				type: 'press',
			} as any);
			mockCoinflip.mockReturnValue(false);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockAbortAll).toHaveBeenCalledWith('new_interaction', 'test-interaction');
			expect(mockAbortAll).toHaveBeenCalledTimes(1);
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
		});
	});

	describe('interaction creation when coinflip passes', () => {
		beforeEach(() => {
			mockCoinflip.mockReturnValue(true);
		});

		it('should create new interaction with correct parameters using performance.now() when no startTime provided', () => {
			mockGetInteractionRate.mockReturnValue(2);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000, // performance.now()
				2, // rate
				[],
				'test-route',
				mockTraceContext,
			);
			expect(DefaultInteractionID.current).toBe('test-uuid-123');
		});

		it('should create new interaction with provided startTime when startTime is given', () => {
			mockGetInteractionRate.mockReturnValue(3);

			traceUFOInteraction('test-interaction', 'hover', 500);

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				500, // provided startTime
				3, // rate
				[],
				'test-route',
				mockTraceContext,
			);
		});

		it('should set interaction active trace with generated UUID and interaction type', () => {
			traceUFOInteraction('test-interaction', 'typing');

			expect(mockSetInteractionActiveTrace).toHaveBeenCalledWith('test-uuid-123', 'typing');
		});

		it('should set DefaultInteractionID to generated UUID', () => {
			traceUFOInteraction('test-interaction', 'press');

			expect(DefaultInteractionID.current).toBe('test-uuid-123');
		});

		it('should handle different interaction types correctly', () => {
			traceUFOInteraction('test-interaction', 'hover');

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000,
				1,
				[],
				'test-route',
				mockTraceContext,
			);
			expect(mockSetInteractionActiveTrace).toHaveBeenCalledWith('test-uuid-123', 'hover');
		});
	});

	describe('timestamp handling', () => {
		beforeEach(() => {
			mockCoinflip.mockReturnValue(true);
		});

		it('should use performance.now() when startTime is not provided', () => {
			traceUFOInteraction('test-interaction', 'press');

			expect(performance.now).toHaveBeenCalled();
			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000, // performance.now()
				1,
				[],
				'test-route',
				mockTraceContext,
			);
		});

		it('should use provided startTime when startTime is provided', () => {
			const customStartTime = 2500;

			traceUFOInteraction('test-interaction', 'press', customStartTime);

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				customStartTime,
				1,
				[],
				'test-route',
				mockTraceContext,
			);
		});

		it('should handle startTime value of 0', () => {
			traceUFOInteraction('test-interaction', 'press', 0);

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				0, // startTime 0 should be used, not performance.now()
				1,
				[],
				'test-route',
				mockTraceContext,
			);
		});
	});

	describe('trace context integration', () => {
		beforeEach(() => {
			mockCoinflip.mockReturnValue(true);
		});

		it('should call setInteractionActiveTrace with correct parameters for press interaction', () => {
			traceUFOInteraction('test-interaction', 'press');

			expect(mockSetInteractionActiveTrace).toHaveBeenCalledWith('test-uuid-123', 'press');
		});

		it('should call setInteractionActiveTrace with correct parameters for hover interaction', () => {
			traceUFOInteraction('test-interaction', 'hover');

			expect(mockSetInteractionActiveTrace).toHaveBeenCalledWith('test-uuid-123', 'hover');
		});

		it('should call setInteractionActiveTrace with correct parameters for typing interaction', () => {
			traceUFOInteraction('test-interaction', 'typing');

			expect(mockSetInteractionActiveTrace).toHaveBeenCalledWith('test-uuid-123', 'typing');
		});
	});

	describe('edge cases and error handling', () => {
		it('should handle empty interaction name', () => {
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('', 'press');

			expect(mockGetInteractionRate).toHaveBeenCalledWith('', 'press');
			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'', // empty name should be passed through
				'press',
				1000,
				1,
				[],
				'test-route',
				mockTraceContext,
			);
		});

		it('should handle zero interaction rate', () => {
			mockGetInteractionRate.mockReturnValue(0);
			mockCoinflip.mockReturnValue(false); // coinflip(0) should return false

			traceUFOInteraction('test-interaction', 'press');

			expect(mockCoinflip).toHaveBeenCalledWith(0);
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
		});

		it('should handle high interaction rate', () => {
			mockGetInteractionRate.mockReturnValue(100);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockCoinflip).toHaveBeenCalledWith(100);
			expect(mockAddNewInteraction).toHaveBeenCalled();
		});

		it('should handle undefined doNotAbortActivePressInteraction list', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(undefined);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockAbortAll).toHaveBeenCalledWith('new_interaction', 'test-interaction');
		});

		it('should handle empty doNotAbortActivePressInteraction list', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue([]);
			mockCoinflip.mockReturnValue(true);

			traceUFOInteraction('test-interaction', 'press');

			expect(mockAbortAll).toHaveBeenCalledWith('new_interaction', 'test-interaction');
		});
	});

	describe('execution order', () => {
		beforeEach(() => {
			mockCoinflip.mockReturnValue(true);
		});

		it('should execute operations in correct order when coinflip passes', () => {
			const callOrder: string[] = [];

			mockAbortAll.mockImplementation(() => callOrder.push('abortAll'));
			mockSetInteractionActiveTrace.mockImplementation(() =>
				callOrder.push('setInteractionActiveTrace'),
			);
			mockAddNewInteraction.mockImplementation(() => callOrder.push('addNewInteraction'));

			traceUFOInteraction('test-interaction', 'press');

			expect(callOrder).toEqual(['abortAll', 'setInteractionActiveTrace', 'addNewInteraction']);
		});
	});
});
