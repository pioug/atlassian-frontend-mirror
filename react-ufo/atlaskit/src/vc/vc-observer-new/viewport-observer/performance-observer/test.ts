import createPerformanceObserver from './index';

describe('createPerformanceObserver', () => {
	let mockObserver: PerformanceObserver;
	let onLayoutShift: jest.Mock;
	let callback: PerformanceObserverCallback | null = null;

	beforeEach(() => {
		onLayoutShift = jest.fn();

		mockObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		} as unknown as PerformanceObserver;

		jest.spyOn(window, 'PerformanceObserver').mockImplementation((_callback) => {
			callback = _callback;
			return mockObserver;
		});
	});

	it('should return a PerformanceObserver when supported', () => {
		const observer = createPerformanceObserver({
			onLayoutShift,
		});

		expect(observer).toBeTruthy();
		expect(observer).toBe(mockObserver);
	});

	it('should handle performance entries', () => {
		createPerformanceObserver({
			onLayoutShift,
		});

		const time = performance.now();

		const node = document.createElement('div');
		const currentRect = new DOMRect(10, 10, 100, 100);
		const previousRect = new DOMRect(0, 0, 100, 100);
		const changedRects = [
			{
				node,
				currentRect,
				previousRect,
			},
		];

		// @ts-expect-error
		callback({
			getEntries: jest
				.fn()
				.mockReturnValue([{ entryType: 'layout-shift', startTime: time, sources: changedRects }]),
		});

		expect(onLayoutShift).toHaveBeenCalled();
		expect(onLayoutShift).toHaveBeenCalledWith({
			time: time,
			changedRects: [
				{
					rect: currentRect,
					previousRect,
					node,
				},
			],
		});
	});
});
