import { onINP, type Metric } from '../index';

// Mock PerformanceObserver
class MockPerformanceObserver {
	private static instance: MockPerformanceObserver;
	private callback: (list: { getEntries: () => PerformanceEventTiming[] }) => void;
	public static supportedEntryTypes: string[] = ['event', 'first-input'];

	constructor(callback: (list: { getEntries: () => PerformanceEventTiming[] }) => void) {
		this.callback = callback;
		MockPerformanceObserver.instance = this;
	}

	observe(_options: PerformanceObserverInit) {
		// No-op
	}

	disconnect() {
		// No-op
	}

	takeRecords(): PerformanceEventTiming[] {
		return [];
	}

	// Helper method to simulate performance entries
	static simulateEntries(entries: PerformanceEventTiming[]) {
		if (MockPerformanceObserver.instance) {
			MockPerformanceObserver.instance.callback({ getEntries: () => entries });
		}
	}
}

// Mock PerformanceEventTiming
interface PerformanceEventTiming extends PerformanceEntry {
	interactionId?: number;
}

describe('onINP', () => {
	let originalPerformanceObserver: typeof PerformanceObserver;
	let originalRequestIdleCallback: typeof window.requestIdleCallback;
	let originalVisibilityState: string;
	let mockCallback: jest.Mock;
	let cleanup: () => void;

	beforeEach(() => {
		// Store original values
		originalPerformanceObserver = window.PerformanceObserver;
		originalRequestIdleCallback = window.requestIdleCallback;
		originalVisibilityState = document.visibilityState;

		// Mock requestIdleCallback to execute immediately
		window.requestIdleCallback = (cb: IdleRequestCallback) => {
			cb({ timeRemaining: () => 50, didTimeout: false });
			return 0;
		};

		// Set document to visible
		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			configurable: true,
		});

		// @ts-ignore
		window.PerformanceObserver = MockPerformanceObserver;

		mockCallback = jest.fn();
		cleanup = onINP(mockCallback);
	});

	afterEach(() => {
		cleanup?.();
		// @ts-ignore
		window.PerformanceObserver = originalPerformanceObserver;
		window.requestIdleCallback = originalRequestIdleCallback;
		Object.defineProperty(document, 'visibilityState', {
			value: originalVisibilityState,
			configurable: true,
		});
		jest.clearAllMocks();
	});

	describe('bindReporter integration', () => {
		it('should only report when there is a delta change in interaction latency', async () => {
			const mockEntry1: PerformanceEventTiming = {
				entryType: 'event',
				name: 'click',
				startTime: 0,
				duration: 100,
				interactionId: 1,
				toJSON: () => ({}),
			};

			const mockEntry2: PerformanceEventTiming = {
				entryType: 'event',
				name: 'click',
				startTime: 0,
				duration: 100,
				interactionId: 2,
				toJSON: () => ({}),
			};

			const mockEntry3: PerformanceEventTiming = {
				entryType: 'event',
				name: 'click',
				startTime: 0,
				duration: 200,
				interactionId: 3,
				toJSON: () => ({}),
			};

			// First interaction
			MockPerformanceObserver.simulateEntries([mockEntry1]);
			await Promise.resolve();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(mockCallback).toHaveBeenCalledTimes(1);
			expect(mockCallback.mock.calls[0][0].delta).toBe(100);

			// Same latency interaction
			MockPerformanceObserver.simulateEntries([mockEntry2]);
			await Promise.resolve();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(mockCallback).toHaveBeenCalledTimes(1); // No change, no report

			// Higher latency interaction
			MockPerformanceObserver.simulateEntries([mockEntry3]);
			await Promise.resolve();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(mockCallback).toHaveBeenCalledTimes(2);
			expect(mockCallback.mock.calls[1][0].delta).toBe(100);
		});

		it('should not report negative interaction latencies', async () => {
			const mockEntry: PerformanceEventTiming = {
				entryType: 'event',
				name: 'click',
				startTime: 0,
				duration: -1,
				interactionId: 1,
				toJSON: () => ({}),
			};

			MockPerformanceObserver.simulateEntries([mockEntry]);
			await Promise.resolve();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(mockCallback).not.toHaveBeenCalled();
		});
	});

	describe('InteractionManager integration', () => {
		it('should maintain only the longest interactions', async () => {
			// Add 11 interactions with increasing durations
			const mockEntries: PerformanceEventTiming[] = Array.from({ length: 11 }, (_, i) => ({
				entryType: 'event',
				name: 'click',
				startTime: 0,
				duration: (i + 1) * 10,
				interactionId: i + 1,
				toJSON: () => ({}),
			}));

			MockPerformanceObserver.simulateEntries(mockEntries);
			await Promise.resolve();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(mockCallback).toHaveBeenCalled();
			const metric: Metric = mockCallback.mock.calls[0][0];
			expect(metric.value).toBe(110); // 10th longest interaction
		});

		it('should handle first-input entries', async () => {
			const mockEntry: PerformanceEventTiming = {
				entryType: 'first-input',
				name: 'click',
				startTime: 0,
				duration: 100,
				interactionId: 1,
				toJSON: () => ({}),
			};

			MockPerformanceObserver.simulateEntries([mockEntry]);
			await Promise.resolve();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(mockCallback).toHaveBeenCalled();
			const metric: Metric = mockCallback.mock.calls[0][0];
			expect(metric.value).toBe(100);
		});
	});

	describe('onINP integration', () => {
		it('should initialize and cleanup properly', () => {
			expect(typeof cleanup).toBe('function');

			// Cleanup should not throw
			expect(() => cleanup()).not.toThrow();
		});

		it('should handle page visibility changes', async () => {
			const mockEntry: PerformanceEventTiming = {
				entryType: 'event',
				name: 'click',
				startTime: 0,
				duration: 100,
				interactionId: 1,
				toJSON: () => ({}),
			};

			MockPerformanceObserver.simulateEntries([mockEntry]);
			await Promise.resolve();
			await new Promise((resolve) => setTimeout(resolve, 0));

			// Simulate page visibility change
			Object.defineProperty(document, 'visibilityState', {
				value: 'hidden',
				configurable: true,
			});
			document.dispatchEvent(new Event('visibilitychange'));

			await Promise.resolve();
			await new Promise((resolve) => setTimeout(resolve, 0));

			expect(mockCallback).toHaveBeenCalled();
			const metric: Metric = mockCallback.mock.calls[0][0];
			expect(metric.value).toBeGreaterThan(0);
		});
	});
});
