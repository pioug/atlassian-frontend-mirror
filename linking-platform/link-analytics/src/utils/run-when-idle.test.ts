import { runWhenIdle } from './run-when-idle';

describe('runWhenIdle', () => {
	it('calls `window.requestIdleCallback` with the callback function and set 5s timeout', () => {
		global.requestIdleCallback = jest.fn();
		const cb = jest.fn();

		runWhenIdle(cb);

		expect(global.requestIdleCallback).toBeCalledWith(cb, { timeout: 5000 });
	});

	it('falls back to `window.requestAnimationFrame` with the callback function if `window.requestIdleCallback` is not implemented', () => {
		global.requestIdleCallback = undefined as any;
		global.requestAnimationFrame = jest.fn();
		const cb = jest.fn();

		runWhenIdle(cb);

		expect(global.requestAnimationFrame).toBeCalledWith(cb);
	});
});
