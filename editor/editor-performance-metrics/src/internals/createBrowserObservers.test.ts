/* eslint-disable compat/compat */
import {
	convertPhysicalToLogicalResolution,
	createIntersectionObserver,
	createMutationObserver,
	createPerformanceObserver,
} from './createBrowserObservers';

describe('DOM Observers Utility Functions', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('createMutationObserver', () => {
		let mockObserver: MutationObserver;
		let onAttributeMutation: jest.Mock;
		let onChildListMutation: jest.Mock;
		let onMutationFinished: jest.Mock;

		beforeEach(() => {
			onAttributeMutation = jest.fn();
			onChildListMutation = jest.fn();
			onMutationFinished = jest.fn();

			mockObserver = {
				observe: jest.fn(),
				disconnect: jest.fn(),
			} as unknown as MutationObserver;

			jest.spyOn(window, 'MutationObserver').mockImplementation((callback) => {
				return mockObserver;
			});
		});

		it('should return a MutationObserver when supported', () => {
			const observer = createMutationObserver({
				onAttributeMutation,
				onChildListMutation,
				onMutationFinished,
			});

			expect(observer).toBeTruthy();
			expect(observer).toBe(mockObserver);
		});

		it('should call callbacks for added and removed nodes', () => {
			createMutationObserver({
				onAttributeMutation,
				onChildListMutation,
				onMutationFinished,
			});

			const addedNodes = [document.createElement('div'), document.createElement('div')];
			const removedNodes = [document.createElement('span'), document.createElement('span')];
			const targetNodes = [document.createElement('div'), document.createElement('div')];

			const callback = (window.MutationObserver as jest.Mock).mock.calls[0][0];
			callback([
				{
					addedNodes: [addedNodes[0]],
					removedNodes: [removedNodes[0]],
					target: targetNodes[0],
					type: 'childList',
				},

				{
					addedNodes: [addedNodes[1]],
					removedNodes: [removedNodes[1]],
					target: targetNodes[1],
					type: 'childList',
				},
			]);

			expect(onChildListMutation).toHaveBeenCalledWith(
				expect.objectContaining({
					addedNodes: addedNodes,
					removedNodes: removedNodes,
				}),
			);

			expect(onMutationFinished).toHaveBeenCalledWith(
				expect.objectContaining({
					targets: targetNodes,
				}),
			);
		});
	});

	describe('createIntersectionObserver', () => {
		let mockObserver: IntersectionObserver;
		let onEntry: jest.Mock;
		let onObserved: jest.Mock;

		beforeEach(() => {
			onEntry = jest.fn();
			onObserved = jest.fn();

			mockObserver = {
				observe: jest.fn(),
				unobserve: jest.fn(),
				disconnect: jest.fn(),
			} as unknown as IntersectionObserver;

			jest.spyOn(window, 'IntersectionObserver').mockImplementation((callback) => {
				return mockObserver;
			});
		});

		it('should return an TaintedIntersectionObserver when supported', () => {
			const observer = createIntersectionObserver({
				onEntry,
				onObserved,
			});

			expect(observer).toBeTruthy();
			expect(observer).toEqual({
				disconnect: expect.any(Function),
				unobserve: expect.any(Function),
				watchAndTag: expect.any(Function),
			});
		});

		it('should call onEntry and onObserved for valid entries', () => {
			createIntersectionObserver({
				onEntry,
				onObserved,
			});

			const targetElement = document.createElement('div');
			const rect = new DOMRect(0, 0, 100, 100);
			const startTime = performance.now();

			const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];
			callback([
				{
					target: targetElement,
					isIntersecting: true,
					intersectionRect: rect,
					time: startTime,
				},
			]);

			expect(onEntry).toHaveBeenCalledWith({
				target: targetElement,
				rect,
				startTime,
				taintedTag: 'mutation',
			});

			expect(onObserved).toHaveBeenCalledWith({
				startTime: expect.any(Number),
				elements: [expect.any(WeakRef)],
			});
		});

		it('should call onEntry in the reverse entries order', () => {
			createIntersectionObserver({
				onEntry,
				onObserved,
			});

			const targetElement1 = document.createElement('div');
			const rect1 = new DOMRect(0, 0, 100, 100);

			const targetElement2 = document.createElement('div');
			const rect2 = new DOMRect(0, 0, 150, 150);

			const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];
			callback([
				{
					target: targetElement1,
					isIntersecting: true,
					intersectionRect: rect1,
					time: 3,
				},
				{
					target: targetElement2,
					isIntersecting: true,
					intersectionRect: rect2,
					time: 9,
				},
			]);

			expect(onEntry).toHaveNthReturnedWith(2);
			expect(onEntry).toHaveBeenNthCalledWith(1, {
				target: targetElement2,
				rect: rect2,
				startTime: 9,
				taintedTag: 'mutation',
			});
			expect(onEntry).toHaveBeenNthCalledWith(2, {
				target: targetElement1,
				rect: rect1,
				startTime: 3,
				taintedTag: 'mutation',
			});
		});

		it('should call onEntry with the tag defined to an element reference', () => {
			const observer = createIntersectionObserver({
				onEntry,
				onObserved,
			});

			const targetElement1 = document.createElement('div');
			const rect1 = new DOMRect(0, 0, 100, 100);

			observer?.watchAndTag(
				targetElement1,
				// @ts-ignore
				'my-tag',
			);
			const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];
			callback([
				{
					target: targetElement1,
					isIntersecting: true,
					intersectionRect: rect1,
					time: 3,
				},
			]);

			expect(onEntry).toHaveBeenCalledWith({
				target: targetElement1,
				rect: rect1,
				startTime: 3,
				taintedTag: 'my-tag',
			});
		});

		it('should call onEntry with the tag defined with a callback', () => {
			const observer = createIntersectionObserver({
				onEntry,
				onObserved,
			});

			const targetElement1 = document.createElement('div');
			const rect1 = new DOMRect(0, 0, 100, 100);

			observer?.watchAndTag(
				targetElement1,
				// @ts-ignore
				() => {
					return 'my-cb-tag';
				},
			);
			const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];
			callback([
				{
					target: targetElement1,
					isIntersecting: true,
					intersectionRect: rect1,
					time: 3,
				},
			]);

			expect(onEntry).toHaveBeenCalledWith({
				target: targetElement1,
				rect: rect1,
				startTime: 3,
				taintedTag: 'my-cb-tag',
			});
		});

		it('should unobserve the element right after the first intersection', () => {
			createIntersectionObserver({
				onEntry,
				onObserved,
			});

			const targetElement = document.createElement('div');
			const rect = new DOMRect(0, 0, 100, 100);
			const startTime = performance.now();

			const callback = (window.IntersectionObserver as jest.Mock).mock.calls[0][0];
			callback([
				{
					target: targetElement,
					isIntersecting: true,
					intersectionRect: rect,
					time: startTime,
				},
			]);

			expect(mockObserver.unobserve).toHaveBeenCalledWith(targetElement);
		});

		it('should disconnect the observer', () => {
			const observer = createIntersectionObserver({
				onEntry,
				onObserved,
			});

			observer?.disconnect();

			expect(mockObserver.disconnect).toHaveBeenCalled();
		});
	});

	describe('createPerformanceObserver', () => {
		let mockObserver: PerformanceObserver;
		let onFirstPaint: jest.Mock;
		let onFirstContentfulPaint: jest.Mock;
		let onLongTask: jest.Mock;
		let onLayoutShift: jest.Mock;

		beforeEach(() => {
			onFirstPaint = jest.fn();
			onFirstContentfulPaint = jest.fn();
			onLongTask = jest.fn();
			onLayoutShift = jest.fn();

			mockObserver = {
				observe: jest.fn(),
				disconnect: jest.fn(),
			} as unknown as PerformanceObserver;

			jest.spyOn(window, 'PerformanceObserver').mockImplementation((callback) => {
				return mockObserver;
			});
		});

		it('should return a PerformanceObserver when supported', () => {
			const observer = createPerformanceObserver({
				onFirstPaint,
				onFirstContentfulPaint,
				onLongTask,
				onLayoutShift,
			});

			expect(observer).toBeTruthy();
			expect(observer).toBe(mockObserver);
		});

		it('should handle performance entries', () => {
			createPerformanceObserver({
				onFirstPaint,
				onFirstContentfulPaint,
				onLongTask,
				onLayoutShift,
			});

			const startTime = performance.now();
			const duration = 50;
			const changedRects = [
				{ node: document.createElement('div'), rect: new DOMRect(0, 0, 100, 100) },
			];

			// @ts-expect-error
			const callback = (window.PerformanceObserver as jest.Mock).mock.calls[0][0];
			callback({
				getEntries: jest.fn().mockReturnValue([
					{ name: 'first-paint', startTime },
					{ name: 'first-contentful-paint', startTime: startTime + 10 },
					{ entryType: 'longtask', startTime: startTime + 20, duration },
					{ entryType: 'layout-shift', startTime: startTime + 30, sources: changedRects },
				]),
			});

			expect(onFirstPaint).toHaveBeenCalledWith(startTime);
			expect(onFirstContentfulPaint).toHaveBeenCalledWith(startTime + 10);
			expect(onLongTask).toHaveBeenCalledWith({ startTime: startTime + 20, duration });
			expect(onLayoutShift).toHaveBeenCalledWith({
				startTime: startTime + 30,
				changedRects: expect.any(Array),
			});
		});
	});

	describe('convertPhysicalToLogicalResolution', () => {
		it('should return the same rect if devicePixelRatio is not a number', () => {
			const rect = new DOMRect(0, 0, 100, 100);
			const originalDevicePixelRatio = window.devicePixelRatio;

			// @ts-expect-error
			delete window.devicePixelRatio;

			const result = convertPhysicalToLogicalResolution(rect);

			expect(result).toBe(rect);

			window.devicePixelRatio = originalDevicePixelRatio; // Restore
		});

		it('should return the same rect if devicePixelRatio is 1', () => {
			const rect = new DOMRect(0, 0, 100, 100);
			const originalDevicePixelRatio = window.devicePixelRatio;
			window.devicePixelRatio = 1;

			const result = convertPhysicalToLogicalResolution(rect);

			expect(result).toBe(rect);

			window.devicePixelRatio = originalDevicePixelRatio; // Restore
		});

		it('should convert rect dimensions if devicePixelRatio is greater than 1', () => {
			const rect = new DOMRect(0, 0, 200, 200);
			const originalDevicePixelRatio = window.devicePixelRatio;
			window.devicePixelRatio = 2;

			const result = convertPhysicalToLogicalResolution(rect);

			expect(result).toEqual(new DOMRect(0, 0, 100, 100));

			window.devicePixelRatio = originalDevicePixelRatio; // Restore
		});
	});
});
