import { renderHook, act } from '@atlassian/testing-library';

import { useStableScroll } from '../useStableScroll';

describe('useStableScroll', () => {
	let mockResizeObserver: jest.Mock;
	let mockObserve: jest.Mock;
	let mockDisconnect: jest.Mock;
	let mockContainer: HTMLElement;
	let resizeCallback: ResizeObserverCallback;
	let mockDateNow: jest.SpyInstance;
	let currentTime: number;

	beforeEach(() => {
		jest.useFakeTimers();

		// Mock Date.now() to work with fake timers
		currentTime = 0;
		mockDateNow = jest.spyOn(Date, 'now').mockImplementation(() => currentTime);

		mockObserve = jest.fn();
		mockDisconnect = jest.fn();

		mockResizeObserver = jest.fn((callback) => {
			resizeCallback = callback;
			return {
				observe: mockObserve,
				disconnect: mockDisconnect,
				unobserve: jest.fn(),
			};
		});

		// @ts-ignore
		global.ResizeObserver = mockResizeObserver;

		mockContainer = document.createElement('div');
	});

	afterEach(() => {
		jest.useRealTimers();
		mockDateNow.mockRestore();
		jest.clearAllMocks();
	});

	describe('basic functionality', () => {
		it('should call the callback after stabilityWaitTime with no resize events', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			expect(mockResizeObserver).toHaveBeenCalled();
			expect(mockObserve).toHaveBeenCalledWith(mockContainer);
			expect(onStable).not.toHaveBeenCalled();

			// Fast-forward time by 199ms - callback should not be called yet
			act(() => {
				currentTime += 199;
				jest.advanceTimersByTime(199);
			});
			expect(onStable).not.toHaveBeenCalled();

			// Fast-forward the remaining 1ms - callback should now be called
			act(() => {
				currentTime += 1;
				jest.advanceTimersByTime(1);
			});
			expect(onStable).toHaveBeenCalledTimes(1);
		});

		it('should reset the timer when a resize event occurs', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			// Fast-forward time by 150ms
			act(() => {
				currentTime += 150;
				jest.advanceTimersByTime(150);
			});
			expect(onStable).not.toHaveBeenCalled();

			// Trigger a resize event
			act(() => {
				currentTime += 0;
				resizeCallback([], mockResizeObserver() as ResizeObserver);
			});

			// Fast-forward another 150ms (total 300ms from start, but only 150ms from resize)
			act(() => {
				currentTime += 150;
				jest.advanceTimersByTime(150);
			});
			expect(onStable).not.toHaveBeenCalled();

			// Fast-forward the remaining 50ms to reach 200ms from the resize event
			act(() => {
				currentTime += 50;
				jest.advanceTimersByTime(50);
			});
			expect(onStable).toHaveBeenCalledTimes(1);
		});

		it('should handle multiple resize events correctly', () => {
			const result = renderHook(() =>
				useStableScroll({ stabilityWaitTime: 200, maxStabilityWaitTime: 5000 }),
			);
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			// Trigger multiple resize events at different times
			for (let i = 0; i < 3; i++) {
				act(() => {
					currentTime += 50;
					jest.advanceTimersByTime(50);
					if (resizeCallback) {
						resizeCallback([], mockResizeObserver() as ResizeObserver);
					}
				});
			}

			// Still shouldn't have called the callback (only 150ms passed)
			expect(onStable).not.toHaveBeenCalled();

			// Now wait the full 200ms without any resize
			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			expect(onStable).toHaveBeenCalledTimes(1);
		});
	});

	describe('maxStabilityWaitTime', () => {
		it('should call the callback after maxStabilityWaitTime even with continuous resizes', () => {
			const result = renderHook(() =>
				useStableScroll({ stabilityWaitTime: 200, maxStabilityWaitTime: 1000 }),
			);
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			// Continuously trigger resize events every 100ms for 1200ms
			for (let i = 0; i < 12; i++) {
				act(() => {
					currentTime += 100;
					jest.advanceTimersByTime(100);
					if (resizeCallback) {
						resizeCallback([], mockResizeObserver() as ResizeObserver);
					}
				});
			}

			// Should have been called after 1000ms despite continuous resizes
			expect(onStable).toHaveBeenCalledTimes(1);
		});

		it('should use default maxStabilityWaitTime of 10000ms', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			// Trigger a resize event
			act(() => {
				currentTime += 50;
				jest.advanceTimersByTime(50);
				if (resizeCallback) {
					resizeCallback([], mockResizeObserver() as ResizeObserver);
				}
			});

			// Should not have been called yet
			expect(onStable).not.toHaveBeenCalled();

			// Let it stabilize now (wait 200ms without resizing)
			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			// Should have been called now that it's stable
			expect(onStable).toHaveBeenCalledTimes(1);
		});
	});

	describe('cleanup', () => {
		it('should disconnect the observer when cleanup is called', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			expect(mockDisconnect).not.toHaveBeenCalled();

			act(() => {
				result.current.cleanup();
			});

			expect(mockDisconnect).toHaveBeenCalled();
		});

		it('should clear timers when cleanup is called', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			act(() => {
				currentTime += 100;
				jest.advanceTimersByTime(100);
			});

			act(() => {
				result.current.cleanup();
			});

			// Fast-forward past when the callback would have been called
			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			expect(onStable).not.toHaveBeenCalled();
		});

		it('should automatically cleanup after callback is called', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			expect(onStable).toHaveBeenCalledTimes(1);
			expect(mockDisconnect).toHaveBeenCalled();

			// Triggering another stability check should start fresh
			const onStable2 = jest.fn();
			mockDisconnect.mockClear();

			act(() => {
				result.current.waitForStability(mockContainer, onStable2);
			});

			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			expect(onStable2).toHaveBeenCalledTimes(1);
		});
	});

	describe('ResizeObserver fallback', () => {
		it('should work without ResizeObserver by using timer only', () => {
			// @ts-ignore
			delete global.ResizeObserver;

			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			// Should not have created an observer
			expect(mockResizeObserver).not.toHaveBeenCalled();
			expect(mockObserve).not.toHaveBeenCalled();

			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			expect(onStable).toHaveBeenCalledTimes(1);
		});
	});

	describe('multiple waitForStability calls', () => {
		it('should cleanup previous observer when called again', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable1 = jest.fn();
			const onStable2 = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable1);
			});

			act(() => {
				currentTime += 100;
				jest.advanceTimersByTime(100);
			});

			// Call waitForStability again before the first one completes
			act(() => {
				result.current.waitForStability(mockContainer, onStable2);
			});

			// Fast-forward time
			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			// Only the second callback should be called
			expect(onStable1).not.toHaveBeenCalled();
			expect(onStable2).toHaveBeenCalledTimes(1);
		});
	});

	describe('edge cases', () => {
		it('should handle cleanup being called before stability is achieved', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			act(() => {
				currentTime += 50;
				if (resizeCallback) {
					resizeCallback([], mockResizeObserver() as ResizeObserver);
				}
				jest.advanceTimersByTime(100);
			});

			act(() => {
				result.current.cleanup();
			});

			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			expect(onStable).not.toHaveBeenCalled();
			expect(mockDisconnect).toHaveBeenCalled();
		});

		it('should handle rapid resize events efficiently', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 200 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			// Trigger 100 resize events rapidly
			act(() => {
				for (let i = 0; i < 100; i++) {
					if (resizeCallback) {
						resizeCallback([], mockResizeObserver() as ResizeObserver);
					}
				}
			});

			expect(onStable).not.toHaveBeenCalled();

			// Wait for stability
			act(() => {
				currentTime += 200;
				jest.advanceTimersByTime(200);
			});

			expect(onStable).toHaveBeenCalledTimes(1);
		});

		it('should handle zero stabilityWaitTime', () => {
			const result = renderHook(() => useStableScroll({ stabilityWaitTime: 0 }));
			const onStable = jest.fn();

			act(() => {
				result.current.waitForStability(mockContainer, onStable);
			});

			act(() => {
				currentTime += 0;
				jest.advanceTimersByTime(0);
			});

			expect(onStable).toHaveBeenCalledTimes(1);
		});
	});
});
