import type { TimelineHoldable } from './timelineInterfaces';
import { wrapperTimers } from './wrapperTimers';

describe('wrapperTimers', () => {
	let mockGlobalContext: { setTimeout: typeof setTimeout; clearTimeout: typeof clearTimeout };
	let mockTimelineHoldable: TimelineHoldable;
	let originalSetTimeout: typeof setTimeout;
	let originalClearTimeout: typeof clearTimeout;

	beforeEach(() => {
		jest.useFakeTimers();
		originalSetTimeout = global.setTimeout;
		originalClearTimeout = global.clearTimeout;

		mockGlobalContext = {
			setTimeout: originalSetTimeout,
			clearTimeout: originalClearTimeout,
		};

		const unhold = jest.fn();
		mockTimelineHoldable = {
			hold: jest.fn().mockReturnValue(unhold),
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
});
