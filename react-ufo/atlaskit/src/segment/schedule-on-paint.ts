export type OnPaintCallback = () => any;

function scheduleOnPaint(callback: OnPaintCallback) {
	if (globalThis.document?.visibilityState !== 'visible') {
		// last resort fallback
		setTimeout(callback, 100);
		return;
	}

	// Check if the Scheduler API is available
	if (
		typeof (window as any).scheduler !== 'undefined' &&
		typeof (window as any).scheduler.postTask === 'function'
	) {
		// Use scheduler.postTask if available
		// https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API
		// Make sure we are scheduling this task before the browser paint the next frame
		requestAnimationFrame(() => {
			(window as any).scheduler.postTask(callback, { priority: 'user-visible' });
		});
	}
	// if active tab, and can do requestAnimationFrame
	else if (typeof requestAnimationFrame !== 'undefined') {
		// Fallback to using double requestAnimationFrame
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				callback();
			});
		});
	}
}

export default scheduleOnPaint;
