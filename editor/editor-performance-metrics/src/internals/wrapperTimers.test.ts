import type { TimelineHoldable } from './timelineInterfaces';
import { wrapperTimers } from './wrapperTimers';

describe('wrapperTimers', () => {
	let mockGlobalContext: { setTimeout: typeof setTimeout; clearTimeout: typeof clearTimeout };
	let mockTimelineHoldable: TimelineHoldable;
	let originalSetTimeout: typeof setTimeout;
	let originalClearTimeout: typeof clearTimeout;
	let unholdMock: jest.Mock;

	beforeEach(() => {
		jest.useFakeTimers();
		originalSetTimeout = global.setTimeout;
		originalClearTimeout = global.clearTimeout;

		mockGlobalContext = {
			setTimeout: originalSetTimeout,
			clearTimeout: originalClearTimeout,
		};

		unholdMock = jest.fn();
		mockTimelineHoldable = {
			hold: jest.fn().mockReturnValue(unholdMock),
		};
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('should wrap setTimeout and clearTimeout', () => {
		wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		expect(mockGlobalContext.setTimeout).not.toBe(originalSetTimeout);
		expect(mockGlobalContext.clearTimeout).not.toBe(originalClearTimeout);
	});

	it('should properly restore the original setTimeout and clearTimeout implementation', () => {
		const cleanup = wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		expect(mockGlobalContext.setTimeout).not.toBe(originalSetTimeout);
		expect(mockGlobalContext.clearTimeout).not.toBe(originalClearTimeout);

		cleanup();

		expect(mockGlobalContext.setTimeout).toBe(originalSetTimeout);
		expect(mockGlobalContext.clearTimeout).toBe(originalClearTimeout);
	});

	it('should call hold for timeouts between 0 and 2000ms', () => {
		wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		mockGlobalContext.setTimeout(() => {}, 1000);
		expect(mockTimelineHoldable.hold).toHaveBeenCalled();
	});

	it('should not call hold for timeouts over 2000ms', () => {
		wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		mockGlobalContext.setTimeout(() => {}, 3000);
		expect(mockTimelineHoldable.hold).not.toHaveBeenCalled();
	});

	it('should call the original setTimeout for timeouts over 2000ms', () => {
		const originalSetTimeoutSpy = jest.spyOn(mockGlobalContext, 'setTimeout');
		wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		const callback = jest.fn();
		mockGlobalContext.setTimeout(callback, 3000);

		expect(originalSetTimeoutSpy).toHaveBeenCalledWith(callback, 3000);
	});

	describe('when changing the maxTimeoutAllowed', () => {
		it('should call the original setTimeout for timeouts over the maxTimeoutAllowed value', () => {
			const originalSetTimeoutSpy = jest.spyOn(mockGlobalContext, 'setTimeout');
			wrapperTimers({
				globalContext: mockGlobalContext,
				timelineHoldable: mockTimelineHoldable,
				maxTimeoutAllowed: 1000,
			});

			const callback = jest.fn();
			mockGlobalContext.setTimeout(callback, 1500);

			expect(originalSetTimeoutSpy).toHaveBeenCalledWith(callback, 1500);
		});
	});

	it('should call unhold when clearTimeout is called', () => {
		wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		const timeoutId = mockGlobalContext.setTimeout(() => {}, 1000);
		const unhold = mockTimelineHoldable.hold({ source: 'setTimeout' });

		mockGlobalContext.clearTimeout(timeoutId);

		expect(unhold).toHaveBeenCalled();
	});

	it('should call the original clearTimeout', () => {
		const originalClearTimeoutSpy = jest.spyOn(mockGlobalContext, 'clearTimeout');
		wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		const timeoutId = 123;
		mockGlobalContext.clearTimeout(timeoutId);

		expect(originalClearTimeoutSpy).toHaveBeenCalledWith(timeoutId);
	});

	it('should not call unhold twice when clearTimeout is called after timer execution', () => {
		const cleanup = wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		const callback = jest.fn();
		const timeoutId = mockGlobalContext.setTimeout(callback, 1000);

		// Fast-forward time to execute the callback
		jest.advanceTimersByTime(1000);
		expect(callback).toHaveBeenCalled();
		expect(unholdMock).toHaveBeenCalledTimes(1);

		// Now call clearTimeout after the callback has been executed
		mockGlobalContext.clearTimeout(timeoutId);

		// Check that unhold wasn't called again
		expect(unholdMock).toHaveBeenCalledTimes(1);

		cleanup();
	});

	it('should not wrap nested setTimeouts', (done) => {
		const cleanup = wrapperTimers({
			globalContext: mockGlobalContext,
			timelineHoldable: mockTimelineHoldable,
		});

		let outerTimeoutExecuted = false;
		let innerTimeoutExecuted = false;

		mockGlobalContext.setTimeout(() => {
			outerTimeoutExecuted = true;
			mockGlobalContext.setTimeout(() => {
				innerTimeoutExecuted = true;
			}, 100);
		}, 100);

		setTimeout(() => {
			expect(outerTimeoutExecuted).toBe(true);
			expect(innerTimeoutExecuted).toBe(true);
			expect(mockTimelineHoldable.hold).toHaveBeenCalledTimes(1); // Only called for outer setTimeout
			cleanup();
			done();
		}, 300);

		jest.advanceTimersByTime(300);
	});

	describe('when an expection is throwed inside the setTimeout callback', () => {
		it('should call unhold', async () => {
			wrapperTimers({
				globalContext: mockGlobalContext,
				timelineHoldable: mockTimelineHoldable,
			});

			expect(() => {
				mockGlobalContext.setTimeout(() => {
					throw Error('random error');
				}, 10);

				jest.runAllTimers();
			}).toThrow();

			expect(unholdMock).toHaveBeenCalledTimes(1);
		});
	});
});
