/* eslint-disable compat/compat */
import * as observerCreators from './createBrowserObservers';
import { DOMObservers } from './DOMObservers';
import { TimelineController } from './timeline';

jest.mock('./createBrowserObservers', () => {
	const originalModule = jest.requireActual('./createBrowserObservers');
	return {
		...originalModule,
		createMutationObserver: jest.fn(),
		createIntersectionObserver: jest.fn(),
		createPerformanceObserver: jest.fn(),
	};
});

describe('DOMObservers', () => {
	let timeline: TimelineController;
	let onChange: jest.Mock;
	let onDOMContentChange: jest.Mock;
	let domObservers: DOMObservers;
	let mockMutationObserver: MutationObserver;
	let mockIntersectionObserver: observerCreators.TaintedIntersectionObserver;
	let mockPerformanceObserver: PerformanceObserver;

	beforeEach(() => {
		timeline = new TimelineController();
		onChange = jest.fn();
		onDOMContentChange = jest.fn();

		mockMutationObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		} as unknown as MutationObserver;

		mockIntersectionObserver = {
			watchAndTag: jest.fn(),
			unobserve: jest.fn(),
			disconnect: jest.fn(),
		} as unknown as observerCreators.TaintedIntersectionObserver;

		mockPerformanceObserver = {
			observe: jest.fn(),
			disconnect: jest.fn(),
		} as unknown as PerformanceObserver;

		(observerCreators.createMutationObserver as jest.Mock).mockReturnValue(mockMutationObserver);
		(observerCreators.createIntersectionObserver as jest.Mock).mockReturnValue(
			mockIntersectionObserver,
		);
		(observerCreators.createPerformanceObserver as jest.Mock).mockReturnValue(
			mockPerformanceObserver,
		);

		domObservers = new DOMObservers({
			timeline,
			onChange,
			onDOMContentChange,
		});
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should observe mutations on target element', () => {
		const targetElement = document.createElement('div');

		expect(observerCreators.createMutationObserver).toHaveBeenCalledTimes(1);

		domObservers.observe(targetElement);

		expect(mockMutationObserver.observe).toHaveBeenCalledWith(targetElement, {
			attributeOldValue: true,
			attributes: true,
			childList: true,
			subtree: true,
		});
	});

	it('should handle intersection observer entries', () => {
		const targetElement = document.createElement('div');
		const rect = new DOMRect(0, 0, 100, 100);
		const startTime = performance.now();

		const intersectionCallback = (observerCreators.createIntersectionObserver as jest.Mock).mock
			.calls[0][0].onEntry;

		intersectionCallback({
			target: targetElement,
			rect,
			startTime,
		});

		expect(onChange).toHaveBeenCalledWith({
			startTime,
			elementRef: expect.any(WeakRef),
			visible: true,
			rect,
			previousRect: undefined,
		});
	});

	it('should mark the performance entries in the timeline', () => {
		const startTime = performance.now();
		const duration = 50;
		const changedRects = [
			{ node: document.createElement('div'), rect: new DOMRect(0, 0, 100, 100) },
		];

		const performanceCallback = (observerCreators.createPerformanceObserver as jest.Mock).mock
			.calls[0][0];

		expect(timeline.unorderedEvents).toHaveLength(0);

		performanceCallback.onFirstPaint(startTime);
		performanceCallback.onFirstContentfulPaint(startTime + 10);
		performanceCallback.onLongTask({ startTime: startTime + 20, duration });
		performanceCallback.onLayoutShift({ startTime: startTime + 30, changedRects });

		expect(timeline.unorderedEvents).toHaveLength(4);
	});

	it('should watch and tag elements that had its layout shifted', () => {
		const startTime = performance.now();
		const changedRects = [
			{ node: document.createElement('div'), rect: new DOMRect(0, 0, 100, 100) },
		];

		const performanceCallback = (observerCreators.createPerformanceObserver as jest.Mock).mock
			.calls[0][0];

		performanceCallback.onLayoutShift({ startTime: startTime + 30, changedRects });

		expect(mockIntersectionObserver.watchAndTag).toHaveBeenCalledWith(
			changedRects[0].node,
			expect.any(Function),
		);
	});

	it('should disconnect all observers', () => {
		domObservers.disconnect();

		expect(mockMutationObserver.disconnect).toHaveBeenCalled();
		expect(mockIntersectionObserver.disconnect).toHaveBeenCalled();
		expect(mockPerformanceObserver.disconnect).toHaveBeenCalled();
	});
});
