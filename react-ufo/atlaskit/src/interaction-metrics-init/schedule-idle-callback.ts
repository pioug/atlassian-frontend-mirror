import {
	unstable_IdlePriority as idlePriority,
	unstable_scheduleCallback as scheduleCallback,
} from 'scheduler';

import { fg } from '@atlaskit/platform-feature-flags/fg';

type NativeScheduler = {
	postTask: (callback: () => void, options?: { priority?: 'background' }) => Promise<unknown>;
};

const getNativeScheduler = (): NativeScheduler | undefined => {
	const nativeScheduler = (globalThis as { scheduler?: Partial<NativeScheduler> }).scheduler;
	return typeof nativeScheduler?.postTask === 'function'
		? (nativeScheduler as NativeScheduler)
		: undefined;
};

/**
 * Schedules `work` at idle priority using native browser APIs, in order of preference:
 * `requestIdleCallback`, then `scheduler.postTask` with `background` priority, then
 * `setTimeout(work, 0)` (e.g. Safari or SSR, where neither API is available).
 */
function scheduleNativeIdleTask(work: () => void): void {
	if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
		window.requestIdleCallback(work);
		return;
	}

	const nativeScheduler = getNativeScheduler();
	if (nativeScheduler) {
		nativeScheduler.postTask(work, { priority: 'background' });
		return;
	}

	setTimeout(work, 0);
}

/**
 * Schedules `work` to run at idle priority.
 *
 * When `platform_ufo_native_task_scheduling` is enabled, uses native browser scheduling instead of
 * the `scheduler` npm package, which is being removed for React 19 compatibility.
 */
function scheduleIdleCallback(work: () => void): void {
	if (fg('platform_ufo_native_task_scheduling')) {
		scheduleNativeIdleTask(work);
		return;
	}

	scheduleCallback(idlePriority, work);
}

export default scheduleIdleCallback;
