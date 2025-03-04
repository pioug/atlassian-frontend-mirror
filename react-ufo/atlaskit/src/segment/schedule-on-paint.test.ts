// scheduleOnPaint.test.ts
import scheduleOnPaint from './schedule-on-paint';

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
		(window as any).setTimeout = jest.fn().mockImplementation((cb, delay) => cb());
	});

	afterEach(() => {
		// Restore original implementations
		(window as any).scheduler = originalScheduler;
		(window as any).requestAnimationFrame = originalRaf;
		(window as any).setTimeout = originalSetTimeout;
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
});
