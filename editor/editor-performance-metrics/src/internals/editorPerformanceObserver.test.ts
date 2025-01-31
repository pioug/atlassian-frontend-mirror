import { EditorPerformanceObserver } from './editorPerformanceObserver';
import type { TimelineClock, TimelineHoldable } from './timelineInterfaces';
import { wrapperFetch } from './wrapperFetch';
import { wrapperTimers } from './wrapperTimers';

jest.mock('./wrapperTimers');
jest.mock('./wrapperFetch');

describe('EditorPerformanceObserver', () => {
	let mockTimeline: TimelineClock & TimelineHoldable;
	let observer: EditorPerformanceObserver;
	let mockCleanupCallback: () => void;

	beforeEach(() => {
		mockCleanupCallback = jest.fn();
		mockTimeline = {
			markEvent: jest.fn(),
			getEvents: jest.fn(),
			getEventsPerType: jest.fn(),
			onIdleBufferFlush: jest.fn().mockReturnValue(jest.fn()),
			onNextIdle: jest.fn().mockReturnValue(jest.fn()),
			hold: jest.fn(),
			onceAllSubscribersCleaned: jest.fn().mockImplementation((cb) => {
				mockCleanupCallback = cb;
			}),
		};

		observer = new EditorPerformanceObserver(mockTimeline);

		// Reset mock calls
		(wrapperTimers as jest.Mock).mockClear();
		(wrapperFetch as jest.Mock).mockClear();
	});

	describe('wrapper application', () => {
		it('should apply wrappers only once for multiple onIdleBuffer calls', () => {
			observer.onIdleBuffer(() => {});
			observer.onIdleBuffer(() => {});
			observer.onIdleBuffer(() => {});

			expect(wrapperTimers).toHaveBeenCalledTimes(1);
			expect(wrapperFetch).toHaveBeenCalledTimes(1);
		});

		it('should apply wrappers only once for multiple onceNextIdle calls', () => {
			observer.onceNextIdle(() => {});
			observer.onceNextIdle(() => {});
			observer.onceNextIdle(() => {});

			expect(wrapperTimers).toHaveBeenCalledTimes(1);
			expect(wrapperFetch).toHaveBeenCalledTimes(1);
		});

		it('should apply wrappers only once for mixed onIdleBuffer and onceNextIdle calls', () => {
			observer.onIdleBuffer(() => {});
			observer.onceNextIdle(() => {});
			observer.onIdleBuffer(() => {});
			observer.onceNextIdle(() => {});

			expect(wrapperTimers).toHaveBeenCalledTimes(1);
			expect(wrapperFetch).toHaveBeenCalledTimes(1);
		});

		it('should pass the correct arguments to wrapperTimers and wrapperFetch', () => {
			observer.onIdleBuffer(() => {});

			expect(wrapperTimers).toHaveBeenCalledWith({
				globalContext: expect.any(Object),
				timelineHoldable: mockTimeline,
			});

			expect(wrapperFetch).toHaveBeenCalledWith({
				globalContext: expect.any(Object),
				timelineHoldable: mockTimeline,
			});
		});
	});

	describe('timeline integration', () => {
		it('should call timeline.onIdleBufferFlush when onIdleBuffer is called', () => {
			const callback = jest.fn();
			observer.onIdleBuffer(callback);

			expect(mockTimeline.onIdleBufferFlush).toHaveBeenCalledWith(callback);
		});

		it('should call timeline.onNextIdle when onceNextIdle is called', () => {
			const callback = jest.fn();
			observer.onceNextIdle(callback);

			expect(mockTimeline.onNextIdle).toHaveBeenCalledWith(callback);
		});
	});

	describe('wrapper cleanup', () => {
		let mockTimersCleanup: jest.Mock;
		let mockFetchCleanup: jest.Mock;

		beforeEach(() => {
			mockTimersCleanup = jest.fn();
			mockFetchCleanup = jest.fn();
			(wrapperTimers as jest.Mock).mockReturnValue(mockTimersCleanup);
			(wrapperFetch as jest.Mock).mockReturnValue(mockFetchCleanup);
		});

		it('should set up onceAllSubscribersCleaned callback', () => {
			expect(mockTimeline.onceAllSubscribersCleaned).toHaveBeenCalledTimes(1);
		});

		it('should clean up wrappers when all subscribers are unsubscribed', () => {
			observer.onIdleBuffer(() => {});
			observer.onceNextIdle(() => {});

			mockCleanupCallback();

			expect(mockTimersCleanup).toHaveBeenCalled();
			expect(mockFetchCleanup).toHaveBeenCalled();
			expect((observer as any).wrapperApplied).toBe(false);
		});

		it('should reapply wrappers after cleanup if new subscribers are added', () => {
			observer.onIdleBuffer(() => {});
			mockCleanupCallback();

			observer.onceNextIdle(() => {});

			expect(wrapperTimers).toHaveBeenCalledTimes(2);
			expect(wrapperFetch).toHaveBeenCalledTimes(2);
			expect((observer as any).wrapperApplied).toBe(true);
		});
	});

	describe('start and stop', () => {
		it('should set startTime and observe target on start', () => {
			const startTime = 1000;
			observer.start({ startTime });

			expect(observer.startTime).toBe(startTime);
			// Add more specific assertions based on what start() does
		});

		it('should disconnect observers on stop', () => {
			const mockDisconnect = jest.fn();
			(observer as any).domObservers = { disconnect: mockDisconnect };
			(observer as any).firstInteraction = { disconnect: mockDisconnect };
			(observer as any).userEventsObserver = { disconnect: mockDisconnect };

			observer.stop();

			expect(mockDisconnect).toHaveBeenCalledTimes(3);
		});
	});
});
