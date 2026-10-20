type NativeScheduler = {
	postTask: (callback: () => void, options?: { priority?: 'user-visible' }) => Promise<unknown>;
};

const getNativeScheduler = (): NativeScheduler | undefined => {
	const nativeScheduler = (globalThis as { scheduler?: Partial<NativeScheduler> }).scheduler;
	return typeof nativeScheduler?.postTask === 'function'
		? (nativeScheduler as NativeScheduler)
		: undefined;
};

/**
 * Schedules `callback` as a normal-priority macrotask using native browser APIs.
 *
 * Native replacement for `unstable_scheduleCallback(unstable_NormalPriority, callback)` from the
 * `scheduler` npm package, which is being removed for React 19 compatibility.
 *
 * - Prefers the Prioritized Task Scheduling API (`scheduler.postTask`) with `user-visible`
 *   priority, the native equivalent of React's `NormalPriority`.
 *   https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API
 * - Falls back to `setTimeout(callback, 0)` where `postTask` is unavailable (e.g. Safari, SSR).
 *
 * Note: unlike the `scheduler` package, this does not share React's internal task queue, so the
 * callback is not guaranteed to run after already-queued React work of the same priority.
 */
function scheduleNormalPriorityTask(callback: () => void): void {
	const nativeScheduler = getNativeScheduler();

	if (nativeScheduler) {
		nativeScheduler.postTask(callback, { priority: 'user-visible' });
		return;
	}

	setTimeout(callback, 0);
}

export default scheduleNormalPriorityTask;
