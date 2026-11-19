/**
 * Runs `callback` once after the next frame renders (`requestAnimationFrame`, then `setTimeout`).
 * Deferring position reads gives the browser an opportunity to update layout first; other work
 * can still invalidate layout before the callback. Calls made while a run is scheduled are ignored.
 */
export const createAfterRenderScheduler = (
	win: Window,
	callback: () => void,
): { cancel: () => void; schedule: () => void } => {
	let frame: number | undefined;
	let timeout: number | undefined;
	return {
		schedule: () => {
			if (frame !== undefined || timeout !== undefined) {
				return;
			}
			frame = win.requestAnimationFrame(() => {
				frame = undefined;
				timeout = win.setTimeout(() => {
					timeout = undefined;
					callback();
				}, 0);
			});
		},
		cancel: () => {
			if (frame !== undefined) {
				win.cancelAnimationFrame(frame);
				frame = undefined;
			}
			if (timeout !== undefined) {
				win.clearTimeout(timeout);
				timeout = undefined;
			}
		},
	};
};
