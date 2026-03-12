// scheduleOnPaint.test.ts
import { fg } from '@atlaskit/platform-feature-flags';

import scheduleOnPaint from './schedule-on-paint';

jest.mock('@atlaskit/platform-feature-flags', () => ({
	fg: jest.fn(() => true), // Default to feature gate enabled
}));

describe('scheduleOnPaint', () => {
	let originalScheduler: any;
	let originalRaf: any;
	let originalSetTimeout: any;

	beforeEach(() => {
		// Save original implementations
		originalScheduler = (window as any).scheduler;
		originalRaf = window.requestAnimationFrame;
		originalSetTimeout = window.setTimeout;

		// Mock implementations
		(window as any).scheduler = { postTask: jest.fn() };
		(window as any).requestAnimationFrame = jest.fn().mockImplementation((cb) => cb());
		(window as any).setTimeout = jest.fn().mockImplementation((cb, _) => cb());

		// Reset feature gate mock
		(fg as jest.Mock).mockReturnValue(true);
	});

	afterEach(() => {
		// Restore original implementations
		(window as any).scheduler = originalScheduler;
		(window as any).requestAnimationFrame = originalRaf;
		(window as any).setTimeout = originalSetTimeout;

		jest.clearAllMocks();
	});

	it('should use scheduler.postTask if available', () => {
		const callback = jest.fn();

		scheduleOnPaint(callback);

		expect((window as any).scheduler.postTask).toHaveBeenCalledWith(callback, {
			priority: 'user-visible',
		});
		expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
		expect(window.setTimeout).not.toHaveBeenCalled();
	});

	it('should use requestAnimationFrame if tab is active and scheduler is not available', () => {
		(window as any).scheduler = undefined; // No scheduler
		// Mock document.visibilityState to return 'visible'
		jest.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');

		const callback = jest.fn();

		scheduleOnPaint(callback);

		expect(window.requestAnimationFrame).toHaveBeenCalledTimes(2);
		expect(callback).toHaveBeenCalled();
		expect(window.setTimeout).not.toHaveBeenCalled();
	});

	it('should use setTimeout as a last resort if tab is not active', () => {
		(window as any).scheduler = undefined; // No scheduler
		// Mock document.visibilityState to return 'hidden'
		jest.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');

		const callback = jest.fn();

		scheduleOnPaint(callback);

		expect(window.setTimeout).toHaveBeenCalledWith(callback, 100);
		expect(callback).toHaveBeenCalled();
		expect(window.requestAnimationFrame).not.toHaveBeenCalled();
	});

	describe('SSR Environment Detection', () => {
		let originalWindow: any;
		let originalGlobalThis: any;
		let originalProcess: any;

		beforeEach(() => {
			originalWindow = (global as any).window;
			originalGlobalThis = globalThis;
			originalProcess = process;
		});

		afterEach(() => {
			(global as any).window = originalWindow;
			(global as any).globalThis = originalGlobalThis;
			(global as any).process = originalProcess;
		});

		it('should execute callback immediately in SSR (window undefined)', () => {
			// Save spies before deleting window
			const rafSpy = jest.spyOn(window, 'requestAnimationFrame');
			const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

			// Simulate SSR environment by removing window
			delete (global as any).window;

			const callback = jest.fn();

			scheduleOnPaint(callback);

			// Callback should be executed immediately in SSR
			expect(callback).toHaveBeenCalled();
			expect(rafSpy).not.toHaveBeenCalled();
			expect(setTimeoutSpy).not.toHaveBeenCalled();

			// Restore window before assertions
			(global as any).window = originalWindow;

			rafSpy.mockRestore();
			setTimeoutSpy.mockRestore();
		});

		it('should execute callback immediately when __SERVER__ is set', () => {
			(globalThis as any).__SERVER__ = true;

			const callback = jest.fn();
			const rafSpy = jest.spyOn(window, 'requestAnimationFrame');
			const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

			scheduleOnPaint(callback);

			// Callback should be executed immediately in SSR
			expect(callback).toHaveBeenCalled();
			expect(rafSpy).not.toHaveBeenCalled();
			expect(setTimeoutSpy).not.toHaveBeenCalled();

			rafSpy.mockRestore();
			setTimeoutSpy.mockRestore();
			delete (globalThis as any).__SERVER__;
		});

		it('should execute callback immediately when REACT_SSR env var is set', () => {
			(global as any).process = {
				env: {
					REACT_SSR: true,
				},
			};

			const callback = jest.fn();
			const rafSpy = jest.spyOn(window, 'requestAnimationFrame');
			const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

			scheduleOnPaint(callback);

			// Callback should be executed immediately in SSR
			expect(callback).toHaveBeenCalled();
			expect(rafSpy).not.toHaveBeenCalled();
			expect(setTimeoutSpy).not.toHaveBeenCalled();

			rafSpy.mockRestore();
			setTimeoutSpy.mockRestore();
		});

		it('should not use async scheduling in SSR environment', () => {
			(globalThis as any).__SERVER__ = true;

			const callback = jest.fn();
			const rafSpy = jest.spyOn(window, 'requestAnimationFrame');
			const setTimeoutSpy = jest.spyOn(window, 'setTimeout');

			scheduleOnPaint(callback);

			expect(callback).toHaveBeenCalledTimes(1);
			expect(rafSpy).not.toHaveBeenCalled();
			expect(setTimeoutSpy).not.toHaveBeenCalled();

			rafSpy.mockRestore();
			setTimeoutSpy.mockRestore();
			delete (globalThis as any).__SERVER__;
		});

		it('should NOT use SSR detection when feature gate is disabled', () => {
			// Disable the feature gate
			(fg as jest.Mock).mockReturnValue(false);
			(globalThis as any).__SERVER__ = true;

			// Mock document.visibilityState to return 'hidden' to trigger setTimeout
			jest.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');

			const callback = jest.fn();

			scheduleOnPaint(callback);

			// With feature gate disabled, SSR detection should be skipped
			// Should fall through to normal browser logic (setTimeout in this case)
			expect(window.setTimeout).toHaveBeenCalledWith(callback, 100);
			expect(callback).toHaveBeenCalled(); // setTimeout mock executes immediately in test

			delete (globalThis as any).__SERVER__;
		});
	});
});
