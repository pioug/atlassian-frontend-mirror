/* eslint-disable compat/compat */
import { backgroundTask, isTaskAborted } from './backgroundTasks';

describe('backgroundTasks', () => {
	let originalScheduler: any;
	let originalRequestIdleCallback: any;
	let originalRequestAnimationFrame: any;
	let originalCancelIdleCallback: any;
	let originalCancelAnimationFrame: any;

	beforeEach(() => {
		jest.useFakeTimers();
		originalScheduler = (window as any).scheduler;
		originalRequestIdleCallback = window.requestIdleCallback;
		originalRequestAnimationFrame = window.requestAnimationFrame;
		originalCancelIdleCallback = window.cancelIdleCallback;
		originalCancelAnimationFrame = window.cancelAnimationFrame;
	});

	afterEach(() => {
		jest.clearAllMocks();

		(window as any).scheduler = originalScheduler;
		window.requestIdleCallback = originalRequestIdleCallback;
		window.requestAnimationFrame = originalRequestAnimationFrame;
		window.cancelIdleCallback = originalCancelIdleCallback;
		window.cancelAnimationFrame = originalCancelAnimationFrame;
	});

	it('should use scheduler if available', () => {
		const postTaskMock = jest.fn(async () => {
			return Promise.resolve();
		});
		(window as any).scheduler = { postTask: postTaskMock };

		const task = jest.fn(async () => 232);
		backgroundTask(task);

		expect(postTaskMock).toHaveBeenCalled();
		// @ts-expect-error
		const callback = postTaskMock.mock.calls[0][0];
		// @ts-expect-error
		callback();

		jest.runAllTimers();
		expect(task).toHaveBeenCalled();
	});

	it('should use requestIdleCallback if scheduler is not available', () => {
		delete (window as any).scheduler;
		const requestIdleCallbackMock = jest.fn((callback) => 1);
		const cancelIdleCallbackMock = jest.fn();
		window.requestIdleCallback = requestIdleCallbackMock;
		window.cancelIdleCallback = cancelIdleCallbackMock;

		const task = jest.fn();
		const abortable = backgroundTask(task);

		expect(requestIdleCallbackMock).toHaveBeenCalled();
		const callback = requestIdleCallbackMock.mock.calls[0][0];
		callback();

		expect(task).toHaveBeenCalled();

		abortable.abort();
		expect(cancelIdleCallbackMock).toHaveBeenCalledWith(1);
	});

	it('should use requestAnimationFrame if scheduler and requestIdleCallback are not available', () => {
		delete (window as any).scheduler;
		// Simulating a browser without requestIdleCallback
		// @ts-expect-error
		window.requestIdleCallback = undefined;
		const requestAnimationFrameMock = jest.fn((callback) => 1);
		const cancelAnimationFrameMock = jest.fn();
		window.requestAnimationFrame = requestAnimationFrameMock;
		window.cancelAnimationFrame = cancelAnimationFrameMock;

		const task = jest.fn();
		const abortable = backgroundTask(task);

		expect(requestAnimationFrameMock).toHaveBeenCalled();
		const callback = requestAnimationFrameMock.mock.calls[0][0];
		callback();

		expect(task).toHaveBeenCalled();

		abortable.abort();
		expect(cancelAnimationFrameMock).toHaveBeenCalledWith(1);
	});

	it('should abort scheduler task if abort is called', async () => {
		const postTaskMock = jest.fn(() => Promise.resolve());
		const abortControllerMock = { abort: jest.fn() };
		jest.spyOn(global as any, 'AbortController').mockImplementation(() => abortControllerMock);

		(window as any).scheduler = { postTask: postTaskMock };

		const task = jest.fn();
		const abortable = backgroundTask(task);

		abortable.abort();
		expect(abortControllerMock.abort).toHaveBeenCalledWith('stop-requested');
	});

	it('should allow task to yield control and resume', async () => {
		delete (window as any).scheduler;
		const requestAnimationFrameMock = jest.fn((callback) => callback());
		window.requestAnimationFrame = requestAnimationFrameMock;

		let yielded = false;
		const task = jest.fn(async (maybeYield) => {
			await maybeYield();
			yielded = true;
			return 42;
		});

		const abortable = backgroundTask(task);
		await abortable.result;

		expect(yielded).toBe(true);
		expect(task).toHaveBeenCalled();
	});

	it('should resolve result promise with task result', async () => {
		const postTaskMock = jest.fn(async (cb) => cb());
		(window as any).scheduler = { postTask: postTaskMock };

		const task = jest.fn(async () => 100);
		const abortable = backgroundTask(task);

		const result = await abortable.result;
		expect(result).toBe(100);
	});

	it('should resolve result promise with TaskAborted if aborted', async () => {
		const postTaskMock = jest.fn(async () => Promise.resolve());
		const abortControllerMock = { abort: jest.fn() };
		jest.spyOn(global as any, 'AbortController').mockImplementation(() => abortControllerMock);

		(window as any).scheduler = { postTask: postTaskMock };

		const task = jest.fn();
		const abortable = backgroundTask(task);

		abortable.abort();
		const result = await abortable.result;
		expect(isTaskAborted(result)).toBe(true);
	});
});
