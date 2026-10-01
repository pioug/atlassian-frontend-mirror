/**
 * Flushes a `Popover` exit in jsdom so that `onExitFinish` has fired and the
 * host element has unmounted before the caller asserts.
 *
 * Requires React 18.3 or newer (`act` is imported from `react`).
 *
 * Hiding is two steps: the testing polyfill fires the closed `toggle` as a task,
 * then top-layer settles the exit in a native promise microtask. Jest fake
 * timers drain the task but not that microtask, so a synchronous
 * `act(() => jest.runOnlyPendingTimers())` returns too early. Real browsers are
 * unaffected. See `notes/architecture/animations.md` ("settles in a microtask").
 *
 * Flush any delay before `hidePopover()` first (for example the `delay` prop on
 * `@atlaskit/tooltip`). Only `Popover` is covered - `Dialog` chains a second
 * timer for its `close` event, which this helper does not wait for.
 *
 * @example
 * rerender(<Popover isOpen={false} shouldAnimate onExitFinish={onExitFinish} />);
 * await flushPopoverExit();
 * expect(onExitFinish).toHaveBeenCalledTimes(1);
 */

// `react` is a peer dependency, so this entrypoint adds no testing-library dependency.
import { act } from 'react';

// Mirrors `jestFakeTimersAreEnabled` in `@testing-library/dom`.
function areJestFakeTimersEnabled(): boolean {
	if (typeof jest === 'undefined') {
		return false;
	}
	const timer = setTimeout as unknown as { _isMockFunction?: boolean };
	// Legacy fake timers mark the function. Modern (sinon) fake timers attach a `clock`.
	return (
		timer._isMockFunction === true || Object.prototype.hasOwnProperty.call(setTimeout, 'clock')
	);
}

function waitForOneRealTask(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(resolve, 0);
	});
}

export async function flushPopoverExit(): Promise<void> {
	// The peer range allows React 18.2, which does not export `act`. A plain throw rather than
	// `tiny-invariant`, which is only a devDependency here.
	if (typeof act !== 'function') {
		throw new Error(
			'flushPopoverExit() requires React 18.3 or newer: `act` is not exported by this version of `react`',
		);
	}
	await act(async () => {
		if (areJestFakeTimersEnabled()) {
			jest.runOnlyPendingTimers();
			// Yield once so the settlement job runs before `act` commits.
			await Promise.resolve();
			return;
		}
		// The polyfill's `toggle` task was queued first, so it and its settlement microtask both
		// run before this timer resolves.
		await waitForOneRealTask();
	});
}
