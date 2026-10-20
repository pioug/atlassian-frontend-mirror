import scheduleNormalPriorityTask from './schedule-normal-priority-task';

describe('scheduleNormalPriorityTask', () => {
	let originalScheduler: unknown;

	beforeEach(() => {
		originalScheduler = (globalThis as any).scheduler;
		jest.useFakeTimers();
	});

	afterEach(() => {
		(globalThis as any).scheduler = originalScheduler;
		jest.useRealTimers();
		jest.clearAllMocks();
	});

	it('uses scheduler.postTask with user-visible priority when available', () => {
		const postTask = jest.fn(() => Promise.resolve());
		(globalThis as any).scheduler = { postTask };
		const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout');
		const callback = jest.fn();

		scheduleNormalPriorityTask(callback);

		expect(postTask).toHaveBeenCalledTimes(1);
		expect(postTask).toHaveBeenCalledWith(callback, { priority: 'user-visible' });
		expect(setTimeoutSpy).not.toHaveBeenCalled();
	});

	it('falls back to setTimeout when scheduler is not available', () => {
		(globalThis as any).scheduler = undefined;
		const callback = jest.fn();

		scheduleNormalPriorityTask(callback);

		expect(callback).not.toHaveBeenCalled();
		jest.runAllTimers();
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('falls back to setTimeout when scheduler.postTask is not a function', () => {
		(globalThis as any).scheduler = { postTask: 'not-a-function' };
		const callback = jest.fn();

		scheduleNormalPriorityTask(callback);

		expect(callback).not.toHaveBeenCalled();
		jest.runAllTimers();
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('runs the callback asynchronously, never synchronously', () => {
		(globalThis as any).scheduler = undefined;
		const callback = jest.fn();

		scheduleNormalPriorityTask(callback);

		expect(callback).not.toHaveBeenCalled();
	});
});
