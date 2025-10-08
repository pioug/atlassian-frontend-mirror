import { v4 as createUUID } from 'uuid';

// Mock all dependencies
jest.mock('uuid');
jest.mock('../coinflip');
jest.mock('../config');
jest.mock('../experience-trace-id-context');
jest.mock('../interaction-id-context');
jest.mock('../interaction-metrics');
jest.mock('../route-name-context');

import coinflip from '../coinflip';
import {
	getDoNotAbortActivePressInteraction,
	getInteractionRate,
	getMinorInteractions,
} from '../config';
import { getActiveTrace, setInteractionActiveTrace } from '../experience-trace-id-context';
import { DefaultInteractionID } from '../interaction-id-context';
import { abortAll, addNewInteraction, getActiveInteraction } from '../interaction-metrics';
import UFORouteName from '../route-name-context';

import traceUFOPress from './index';

const mockCoinflip = coinflip as jest.MockedFunction<typeof coinflip>;
const mockGetInteractionRate = getInteractionRate as jest.MockedFunction<typeof getInteractionRate>;
const mockGetDoNotAbortActivePressInteraction =
	getDoNotAbortActivePressInteraction as jest.MockedFunction<
		typeof getDoNotAbortActivePressInteraction
	>;
const mockGetMinorInteractions = getMinorInteractions as jest.MockedFunction<
	typeof getMinorInteractions
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

describe('traceUFOPress', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Set up default mock implementations
		mockGetInteractionRate.mockReturnValue(1);
		mockGetDoNotAbortActivePressInteraction.mockReturnValue(undefined);
		mockGetMinorInteractions.mockReturnValue(undefined);
		mockGetActiveInteraction.mockReturnValue(undefined);
		mockGetActiveTrace.mockReturnValue(undefined);
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

			traceUFOPress('test-interaction');

			expect(mockGetInteractionRate).toHaveBeenCalledWith('test-interaction', 'press');
		});

		it('should call coinflip with the interaction rate', () => {
			mockGetInteractionRate.mockReturnValue(5);
			mockCoinflip.mockReturnValue(false);

			traceUFOPress('test-interaction');

			expect(mockCoinflip).toHaveBeenCalledWith(5);
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

			traceUFOPress('test-interaction');

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
				minorInteractions: [],
			} as any);
			mockCoinflip.mockReturnValue(true);

			traceUFOPress('test-interaction');

			expect(mockCoinflip).not.toHaveBeenCalled();
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
			expect(mockGetActiveInteraction).toHaveBeenCalled();
			const activeInteraction = mockGetActiveInteraction.mock.results[0].value;
			expect(activeInteraction.minorInteractions).toHaveLength(1);
			expect(activeInteraction.minorInteractions[0].name).toBe('test-interaction');
		});

		it('should not return early when interaction is in doNotAbortActivePressInteraction list but active interaction is not press type', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['test-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'some-interaction',
				type: 'hover',
				minorInteractions: [],
			} as any);
			mockCoinflip.mockReturnValue(true);

			traceUFOPress('test-interaction');

			expect(mockCoinflip).not.toHaveBeenCalled();
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
			expect(mockGetActiveInteraction).toHaveBeenCalled();
			const activeInteraction = mockGetActiveInteraction.mock.results[0].value;
			expect(activeInteraction.minorInteractions).toHaveLength(1);
			expect(activeInteraction.minorInteractions[0].name).toBe('test-interaction');
		});

		it('should continue when interaction is NOT in doNotAbortActivePressInteraction list', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['other-interaction']);
			mockGetActiveInteraction.mockReturnValue({
				id: 'active-id',
				ufoName: 'some-interaction',
				type: 'press',
			} as any);
			mockCoinflip.mockReturnValue(true);

			traceUFOPress('test-interaction');

			expect(mockCoinflip).toHaveBeenCalled();
			expect(mockAddNewInteraction).toHaveBeenCalled();
		});

		it('should continue when doNotAbortActivePressInteraction list is undefined', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(undefined);
			mockCoinflip.mockReturnValue(true);

			traceUFOPress('test-interaction');

			expect(mockCoinflip).toHaveBeenCalled();
			expect(mockAddNewInteraction).toHaveBeenCalled();
		});

		it('should handle null active interaction gracefully', () => {
			mockGetDoNotAbortActivePressInteraction.mockReturnValue(['test-interaction']);
			mockGetActiveInteraction.mockReturnValue(undefined);
			mockCoinflip.mockReturnValue(true);

			traceUFOPress('test-interaction');

			expect(mockCoinflip).not.toHaveBeenCalled();
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
			expect(mockGetActiveInteraction).toHaveBeenCalled();
		});
	});

	describe('coinflip behavior', () => {
		it('should not create interaction when coinflip fails', () => {
			mockCoinflip.mockReturnValue(false);

			traceUFOPress('test-interaction');

			expect(mockAddNewInteraction).not.toHaveBeenCalled();
			expect(mockSetInteractionActiveTrace).not.toHaveBeenCalled();
			expect(DefaultInteractionID.current).toBe(null);
		});

		it('should create interaction when coinflip passes', () => {
			mockCoinflip.mockReturnValue(true);

			traceUFOPress('test-interaction');

			expect(mockAbortAll).toHaveBeenCalledWith('new_interaction', 'test-interaction');
			expect(mockAddNewInteraction).toHaveBeenCalled();
			expect(mockSetInteractionActiveTrace).toHaveBeenCalled();
			expect(DefaultInteractionID.current).toBe('test-uuid-123');
		});
	});

	describe('interaction creation when coinflip passes', () => {
		beforeEach(() => {
			mockCoinflip.mockReturnValue(true);
		});

		it('should abort all existing interactions', () => {
			traceUFOPress('test-interaction');

			expect(mockAbortAll).toHaveBeenCalledWith('new_interaction', 'test-interaction');
		});

		it('should set interaction active trace with generated UUID and press type', () => {
			traceUFOPress('test-interaction');

			expect(mockSetInteractionActiveTrace).toHaveBeenCalledWith('test-uuid-123', 'press');
		});

		it('should set DefaultInteractionID to generated UUID', () => {
			traceUFOPress('test-interaction');

			expect(DefaultInteractionID.current).toBe('test-uuid-123');
		});

		it('should create new interaction with correct parameters using performance.now() when no timestamp provided', () => {
			mockGetInteractionRate.mockReturnValue(2);

			traceUFOPress('test-interaction');

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000, // performance.now()
				2, // rate
				[],
				'test-route',
				undefined, // getActiveTrace()
			);
		});

		it('should create new interaction with provided timestamp when timestamp is given', () => {
			mockGetInteractionRate.mockReturnValue(3);

			traceUFOPress('test-interaction', 500);

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				500, // provided timestamp
				3, // rate
				[],
				'test-route',
				undefined, // getActiveTrace()
			);
		});

		it('should pass active trace context to addNewInteraction', () => {
			const mockTrace = { traceId: 'trace-123', spanId: 'span-456', type: 'test' };
			mockGetActiveTrace.mockReturnValue(mockTrace);

			traceUFOPress('test-interaction');

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000,
				1,
				[],
				'test-route',
				mockTrace,
			);
		});
	});

	describe('timestamp handling', () => {
		beforeEach(() => {
			mockCoinflip.mockReturnValue(true);
		});

		it('should use performance.now() when timestamp is not provided', () => {
			traceUFOPress('test-interaction');

			expect(performance.now).toHaveBeenCalled();
			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000, // performance.now()
				1,
				[],
				'test-route',
				undefined,
			);
		});

		it('should use provided timestamp when timestamp is provided', () => {
			const customTimestamp = 2500;

			traceUFOPress('test-interaction', customTimestamp);

			// performance.now should not be called when timestamp is provided
			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				customTimestamp,
				1,
				[],
				'test-route',
				undefined,
			);
		});

		it('should handle timestamp value of 0', () => {
			traceUFOPress('test-interaction', 0);

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				0, // timestamp 0 should be used, not performance.now()
				1,
				[],
				'test-route',
				undefined,
			);
		});
	});

	describe('trace context integration', () => {
		beforeEach(() => {
			mockCoinflip.mockReturnValue(true);
		});

		it('should call setInteractionActiveTrace with correct parameters', () => {
			traceUFOPress('test-interaction');

			expect(mockSetInteractionActiveTrace).toHaveBeenCalledWith('test-uuid-123', 'press');
		});

		it('should call getActiveTrace to get current trace context', () => {
			traceUFOPress('test-interaction');

			expect(mockGetActiveTrace).toHaveBeenCalled();
		});

		it('should handle undefined trace context', () => {
			mockGetActiveTrace.mockReturnValue(undefined);

			traceUFOPress('test-interaction');

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000,
				1,
				[],
				'test-route',
				undefined,
			);
		});

		it('should handle existing trace context', () => {
			const existingTrace = {
				traceId: 'existing-trace',
				spanId: 'existing-span',
				type: 'existing',
			};
			mockGetActiveTrace.mockReturnValue(existingTrace);

			traceUFOPress('test-interaction');

			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'test-interaction',
				'press',
				1000,
				1,
				[],
				'test-route',
				existingTrace,
			);
		});
	});

	describe('edge cases and error handling', () => {
		it('should handle empty interaction name', () => {
			mockCoinflip.mockReturnValue(true);

			traceUFOPress('');

			expect(mockGetInteractionRate).toHaveBeenCalledWith('', 'press');
			expect(mockAddNewInteraction).toHaveBeenCalledWith(
				'test-uuid-123',
				'', // empty name should be passed through
				'press',
				1000,
				1,
				[],
				'test-route',
				undefined,
			);
		});

		it('should handle zero interaction rate', () => {
			mockGetInteractionRate.mockReturnValue(0);
			mockCoinflip.mockReturnValue(false); // coinflip(0) should return false

			traceUFOPress('test-interaction');

			expect(mockCoinflip).toHaveBeenCalledWith(0);
			expect(mockAddNewInteraction).not.toHaveBeenCalled();
		});

		it('should handle high interaction rate', () => {
			mockGetInteractionRate.mockReturnValue(100);
			mockCoinflip.mockReturnValue(true);

			traceUFOPress('test-interaction');

			expect(mockCoinflip).toHaveBeenCalledWith(100);
			expect(mockAddNewInteraction).toHaveBeenCalled();
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

			traceUFOPress('test-interaction');

			expect(callOrder).toEqual(['abortAll', 'setInteractionActiveTrace', 'addNewInteraction']);
		});
	});
});
