import type { UIEvent } from 'react';

import mapToInteractionType from './internal/map-to-interaction-type';
import internal_traceUFOInteraction from './internal/trace-ufo-interaction';

import traceUFOInteraction from './index';

// Mock the internal functions
jest.mock('./internal/trace-ufo-interaction');
jest.mock('./internal/map-to-interaction-type');

const mockInternalTraceUFOInteraction = internal_traceUFOInteraction as jest.MockedFunction<
	typeof internal_traceUFOInteraction
>;
const mockMapToInteractionType = mapToInteractionType as jest.MockedFunction<
	typeof mapToInteractionType
>;

describe('traceUFOInteraction (wrapper)', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// Set up default mock implementations
		mockMapToInteractionType.mockReturnValue('press');
	});

	// Helper to create mock UI events
	const createMockEvent = (type: string, isTrusted: boolean = true, timeStamp?: number): UIEvent =>
		({
			type,
			isTrusted,
			timeStamp,
			// Add other required UIEvent properties as needed
		}) as UIEvent;

	describe('event validation', () => {
		it('should return early if event is falsy', () => {
			traceUFOInteraction('test-interaction', null as any);

			expect(mockMapToInteractionType).not.toHaveBeenCalled();
			expect(mockInternalTraceUFOInteraction).not.toHaveBeenCalled();
		});

		it('should return early if event is not trusted', () => {
			const event = createMockEvent('click', false);

			traceUFOInteraction('test-interaction', event);

			expect(mockMapToInteractionType).not.toHaveBeenCalled();
			expect(mockInternalTraceUFOInteraction).not.toHaveBeenCalled();
		});
	});

	describe('interaction type mapping', () => {
		it('should call mapToInteractionType with event type', () => {
			const event = createMockEvent('click');

			traceUFOInteraction('test-interaction', event);

			expect(mockMapToInteractionType).toHaveBeenCalledWith('click');
		});

		it('should return early for unsupported event types', () => {
			const event = createMockEvent('keydown');
			mockMapToInteractionType.mockReturnValue(undefined);

			traceUFOInteraction('test-interaction', event);

			expect(mockMapToInteractionType).toHaveBeenCalledWith('keydown');
			expect(mockInternalTraceUFOInteraction).not.toHaveBeenCalled();
		});
	});

	describe('delegation to internal function', () => {
		it('should call internal traceUFOInteraction with correct parameters when event has timeStamp', () => {
			const event = createMockEvent('click', true, 500);
			mockMapToInteractionType.mockReturnValue('press');

			traceUFOInteraction('test-interaction', event);

			expect(mockInternalTraceUFOInteraction).toHaveBeenCalledWith(
				'test-interaction',
				'press',
				500, // event.timeStamp
			);
		});

		it('should call internal traceUFOInteraction with undefined timeStamp when event has no timeStamp', () => {
			const event = createMockEvent('mouseenter', true, undefined);
			mockMapToInteractionType.mockReturnValue('hover');

			traceUFOInteraction('test-interaction', event);

			expect(mockInternalTraceUFOInteraction).toHaveBeenCalledWith(
				'test-interaction',
				'hover',
				undefined,
			);
		});

		it('should pass through different interaction types correctly', () => {
			const event = createMockEvent('dblclick');
			mockMapToInteractionType.mockReturnValue('press');

			traceUFOInteraction('test-interaction', event);

			expect(mockInternalTraceUFOInteraction).toHaveBeenCalledWith(
				'test-interaction',
				'press',
				undefined,
			);
		});

		it('should handle different event types with their respective interaction types', () => {
			// Test hover event
			const hoverEvent = createMockEvent('mouseover');
			mockMapToInteractionType.mockReturnValue('hover');

			traceUFOInteraction('hover-interaction', hoverEvent);

			expect(mockInternalTraceUFOInteraction).toHaveBeenCalledWith(
				'hover-interaction',
				'hover',
				undefined,
			);
		});

		it('should pass empty interaction name through', () => {
			const event = createMockEvent('click');
			mockMapToInteractionType.mockReturnValue('press');

			traceUFOInteraction('', event);

			expect(mockInternalTraceUFOInteraction).toHaveBeenCalledWith('', 'press', undefined);
		});
	});

	describe('edge cases', () => {
		it('should handle event with timeStamp of 0', () => {
			const event = createMockEvent('click', true, 0);
			mockMapToInteractionType.mockReturnValue('press');

			traceUFOInteraction('test-interaction', event);

			expect(mockInternalTraceUFOInteraction).toHaveBeenCalledWith('test-interaction', 'press', 0);
		});

		it('should handle multiple calls correctly', () => {
			const event1 = createMockEvent('click', true, 100);
			const event2 = createMockEvent('mouseenter', true, 200);

			mockMapToInteractionType.mockReturnValueOnce('press');
			mockMapToInteractionType.mockReturnValueOnce('hover');

			traceUFOInteraction('interaction-1', event1);
			traceUFOInteraction('interaction-2', event2);

			expect(mockInternalTraceUFOInteraction).toHaveBeenCalledTimes(2);
			expect(mockInternalTraceUFOInteraction).toHaveBeenNthCalledWith(
				1,
				'interaction-1',
				'press',
				100,
			);
			expect(mockInternalTraceUFOInteraction).toHaveBeenNthCalledWith(
				2,
				'interaction-2',
				'hover',
				200,
			);
		});
	});

	describe('integration with mapToInteractionType', () => {
		it('should respect mapToInteractionType return value', () => {
			const event = createMockEvent('customEvent');

			// Test when mapToInteractionType returns undefined
			mockMapToInteractionType.mockReturnValue(undefined);
			traceUFOInteraction('test-interaction', event);
			expect(mockInternalTraceUFOInteraction).not.toHaveBeenCalled();

			// Test when mapToInteractionType returns a valid type
			mockMapToInteractionType.mockReturnValue('press');
			traceUFOInteraction('test-interaction', event);
			expect(mockInternalTraceUFOInteraction).toHaveBeenCalledWith(
				'test-interaction',
				'press',
				undefined,
			);
		});

		it('should handle all possible interaction types from mapToInteractionType', () => {
			const event = createMockEvent('test');

			// Test press type
			mockMapToInteractionType.mockReturnValue('press');
			traceUFOInteraction('test-interaction', event);
			expect(mockInternalTraceUFOInteraction).toHaveBeenLastCalledWith(
				'test-interaction',
				'press',
				undefined,
			);

			// Test hover type
			mockMapToInteractionType.mockReturnValue('hover');
			traceUFOInteraction('test-interaction', event);
			expect(mockInternalTraceUFOInteraction).toHaveBeenLastCalledWith(
				'test-interaction',
				'hover',
				undefined,
			);
		});
	});
});
