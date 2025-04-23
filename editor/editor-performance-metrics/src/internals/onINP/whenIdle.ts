// Adapted from https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/whenIdle.ts
import { onHidden } from './onHidden';

export const whenIdle = (cb: () => void): number => {
	const rIC = window.requestIdleCallback || window.setTimeout;

	let handle = -1;
	cb = runOnce(cb);
	// If the document is hidden, run the callback immediately, otherwise
	// race an idle callback with the next `visibilitychange` event.
	if (document.visibilityState === 'hidden') {
		cb();
	} else {
		const cleanup = onHidden(() => {
			cb();
			cleanup();
		});
		handle = rIC(() => {
			cb();
			cleanup();
		});
	}
	return handle;
};

// Adapted from https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/runOnce.ts
const runOnce = (cb: () => void) => {
	let called = false;
	return () => {
		if (!called) {
			cb();
			called = true;
		}
	};
};
