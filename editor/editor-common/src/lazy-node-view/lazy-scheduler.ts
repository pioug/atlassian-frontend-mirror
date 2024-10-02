const hasIdleCallback = 'requestIdleCallback' in window;

export const scheduleCallback = (cb: () => unknown, options?: IdleRequestOptions) => {
	return hasIdleCallback
		? requestIdleCallback(cb, { timeout: 5000, ...options })
		: requestAnimationFrame(cb);
};

export const cancelCallback = (id: number) => {
	return hasIdleCallback ? cancelIdleCallback(id) : cancelAnimationFrame(id);
};
