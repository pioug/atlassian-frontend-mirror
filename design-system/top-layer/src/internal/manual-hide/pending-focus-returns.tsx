/**
 * The focus returns that `manual` popovers queued as they hid, one per popover, until they run.
 */
const waiting = new Map<HTMLElement, () => void>();

function run({ element }: { element: HTMLElement }): void {
	const returnFocus = waiting.get(element);
	waiting.delete(element);
	returnFocus?.();
}

export const pendingFocusReturns: {
	schedule: (args: { element: HTMLElement; returnFocus: () => void }) => void;
	cancel: (args: { element: HTMLElement }) => void;
	runAll: () => void;
} = {
	/**
	 * Queues `returnFocus` to run in a microtask, or earlier from `runAll`.
	 */
	schedule({ element, returnFocus }) {
		waiting.set(element, returnFocus);
		queueMicrotask(() => run({ element }));
	},
	cancel({ element }) {
		waiting.delete(element);
	},
	/**
	 * Runs every waiting return now (for example before another layer shows, so it records the
	 * element that the returns move focus to as its opener).
	 */
	runAll() {
		Array.from(waiting.keys()).forEach((element) => run({ element }));
	},
};
