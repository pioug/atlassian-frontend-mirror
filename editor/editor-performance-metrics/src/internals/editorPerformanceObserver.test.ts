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
			cleanupSubscribers: jest.fn(),
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
				maxTimeoutAllowed: 2000,
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
			observer.start({ startTime: 1000 }); // make sure the observer is running

			const mockDisconnect = jest.fn();
			(observer as any).domObservers = { disconnect: mockDisconnect };
			(observer as any).firstInteraction = { disconnect: mockDisconnect };
			(observer as any).userEventsObserver = { disconnect: mockDisconnect };

			observer.stop();

			expect(mockDisconnect).toHaveBeenCalledTimes(3);
		});
	});

	describe('when the firstInteraction happens', () => {
		it('make sure we are stopping all observers after the fisr user interaction', () => {
			observer.start({ startTime: 1000 }); // make sure the observer is running

			const mockDisconnect = jest.fn();
			(observer as any).domObservers = { disconnect: mockDisconnect };

			expect(mockDisconnect).toHaveBeenCalledTimes(0);

			observer.onFirstInteraction({
				event: 'stop-me',
				time: performance.now(),
			});

			expect(mockDisconnect).toHaveBeenCalledTimes(1);
		});
	});

	describe('EditorPerformanceObserver start/stop functionality', () => {
		let observer: EditorPerformanceObserver;
		let mockDomObservers: { disconnect: jest.Mock; observe: jest.Mock };
		let mockFirstInteraction: { disconnect: jest.Mock };
		let mockUserEventsObserver: { disconnect: jest.Mock };

		beforeEach(() => {
			mockDomObservers = {
				observe: jest.fn(),
				disconnect: jest.fn(),
			};
			mockFirstInteraction = {
				disconnect: jest.fn(),
			};
			mockUserEventsObserver = {
				disconnect: jest.fn(),
			};

			observer = new EditorPerformanceObserver(mockTimeline);
			(observer as any).domObservers = mockDomObservers;
			(observer as any).firstInteraction = mockFirstInteraction;
			(observer as any).userEventsObserver = mockUserEventsObserver;
		});

		describe('start', () => {
			it('should initialize observer with correct start time', () => {
				const startTime = 1000;
				observer.start({ startTime });

				expect(observer.startTime).toBe(startTime);
				expect(mockDomObservers.observe).toHaveBeenCalledWith(document.body);
			});

			it('should silently return when starting an already started observer', () => {
				observer.start({ startTime: 1000 });
				mockDomObservers.observe.mockClear();

				observer.start({ startTime: 2000 });

				expect(observer.startTime).toBe(1000); // Should keep original start time
				expect(mockDomObservers.observe).not.toHaveBeenCalled();
			});

			it('should create WeakRef to target element only on first start', () => {
				observer.start({ startTime: 1000 });
				const firstRef = (observer as any).observedTargetRef;

				observer.start({ startTime: 2000 });
				const secondRef = (observer as any).observedTargetRef;

				expect(firstRef).toBe(secondRef);
				expect(firstRef.deref()).toBe(document.body);
			});
		});

		describe('stop', () => {
			beforeEach(() => {
				observer.start({ startTime: 1000 });
			});

			it('should properly cleanup all observers', () => {
				observer.stop();

				expect(mockDomObservers.disconnect).toHaveBeenCalled();
				expect(mockFirstInteraction.disconnect).toHaveBeenCalled();
				expect(mockUserEventsObserver.disconnect).toHaveBeenCalled();
			});

			it('should silently return when stopping a non-started observer', () => {
				observer.stop(); // First stop

				// Clear mocks to verify second stop doesn't trigger anything
				mockDomObservers.disconnect.mockClear();
				mockFirstInteraction.disconnect.mockClear();
				mockUserEventsObserver.disconnect.mockClear();

				observer.stop(); // Second stop

				expect(mockDomObservers.disconnect).not.toHaveBeenCalled();
				expect(mockFirstInteraction.disconnect).not.toHaveBeenCalled();
				expect(mockUserEventsObserver.disconnect).not.toHaveBeenCalled();
			});

			it('should allow starting again after stop', () => {
				observer.stop();

				observer.start({ startTime: 2000 });

				expect(observer.startTime).toBe(2000);
				expect(mockDomObservers.observe).toHaveBeenCalledWith(document.body);
			});

			it('should cleanup wrappers when stopping', () => {
				const mockTimersCleanup = jest.fn();
				const mockFetchCleanup = jest.fn();

				(wrapperTimers as jest.Mock).mockReturnValue(mockTimersCleanup);
				(wrapperFetch as jest.Mock).mockReturnValue(mockFetchCleanup);

				// Apply wrappers by subscribing
				observer.onIdleBuffer(() => {});

				observer.stop();

				expect(mockTimersCleanup).toHaveBeenCalled();
				expect(mockFetchCleanup).toHaveBeenCalled();
			});

			it('should cleanup timeline subscribers when stopping', () => {
				const mockCleanupSubscribers = jest.fn();
				mockTimeline.cleanupSubscribers = mockCleanupSubscribers;

				observer.stop();

				expect(mockCleanupSubscribers).toHaveBeenCalled();
			});

			it('should reset isStarted flag when stopping', () => {
				observer.stop();

				expect((observer as any).isStarted).toBe(false);
			});

			it('should allow restarting after stop', () => {
				observer.stop();
				observer.start({ startTime: 2000 });

				expect((observer as any).isStarted).toBe(true);
				expect(observer.startTime).toBe(2000);
			});

			it('should not perform cleanup operations if already stopped', () => {
				const mockCleanupSubscribers = jest.fn();
				mockTimeline.cleanupSubscribers = mockCleanupSubscribers;

				observer.stop(); // First stop
				mockCleanupSubscribers.mockClear();

				observer.stop(); // Second stop

				expect(mockCleanupSubscribers).not.toHaveBeenCalled();
			});
		});
	});
});
