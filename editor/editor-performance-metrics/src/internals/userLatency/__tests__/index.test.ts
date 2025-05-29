// user-latency.test.ts
import { TimelineController } from '../../timeline';
import { onUserLatency } from '../index';
import { UserLatencyObservers } from '../UserLatencyOberservers';

// Mock the TimelineController class
jest.mock('../../timeline', () => ({
	TimelineController: jest.fn().mockImplementation(() => ({
		onIdleBufferFlush: jest.fn((callback) => callback({})),
		getEvents: jest.fn().mockReturnValue([]),
	})),
}));

// Mock the UserLatencyObservers class
jest.mock('../UserLatencyOberservers');

describe('User Latency Module', () => {
	let mockCallback: jest.Mock;

	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks();
		// Reset the global timeline
		delete (global as any).__editor_performance_user_latency_timeline;

		mockCallback = jest.fn();
	});

	describe('onUserLatency', () => {
		it('should create a new TimelineController if one does not exist', () => {
			onUserLatency(mockCallback);
			expect(TimelineController).toHaveBeenCalledWith({
				shouldIdleOnPageVisibilityChange: true,
			});
		});

		it('should reuse existing TimelineController if one exists', () => {
			// First call creates the timeline
			onUserLatency(mockCallback);

			// Second call should reuse the existing timeline
			onUserLatency(mockCallback);
			const secondCallCount = (TimelineController as jest.Mock).mock.calls.length;

			// call count should be 1 because the existing timeline is reused
			expect(secondCallCount).toBe(1);
		});

		it('should create and initialize UserLatencyObservers', () => {
			onUserLatency(mockCallback);

			expect(UserLatencyObservers).toHaveBeenCalled();
			expect(
				(UserLatencyObservers as unknown as jest.Mock).mock.instances[0].observe,
			).toHaveBeenCalled();
		});

		it('should set up onIdleBufferFlush callback', () => {
			onUserLatency(mockCallback);

			const timelineInstance = (global as any).__editor_performance_user_latency_timeline;

			expect(timelineInstance.onIdleBufferFlush).toHaveBeenCalled();
		});

		it('should store timeline in global object', () => {
			onUserLatency(mockCallback);

			expect((global as any).__editor_performance_user_latency_timeline).toBeDefined();
		});
	});
});
