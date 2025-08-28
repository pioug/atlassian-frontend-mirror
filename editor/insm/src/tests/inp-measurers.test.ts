import { flushPromises } from '@atlaskit/editor-test-helpers/e2e-helpers';

import { INPTracker } from '../inp-measurers/inp';

// Mock PerformanceObserver
class MockPerformanceObserver {
	public static instance: MockPerformanceObserver | null = null;
	private callback: (list: { getEntries: () => PerformanceEventTiming[] }) => void;
	public static supportedEntryTypes: string[] = ['event'];

	constructor(callback: (list: { getEntries: () => PerformanceEventTiming[] }) => void) {
		this.callback = callback;
		MockPerformanceObserver.instance = this;
	}

	observe(_options: PerformanceObserverInit) {
		// No-op
	}

	disconnect() {
		MockPerformanceObserver.instance = null;
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

describe('INPTracker', () => {
	let originalPerformanceObserver: typeof PerformanceObserver;

	beforeEach(() => {
		// Store original PerformanceObserver
		originalPerformanceObserver = window.PerformanceObserver;

		// Mock PerformanceObserver
		window.PerformanceObserver = MockPerformanceObserver as any;
	});

	afterEach(() => {
		// Restore original PerformanceObserver
		window.PerformanceObserver = originalPerformanceObserver;
	});

	it('should handle no interactions', () => {
		const inpTracker = new INPTracker();
		inpTracker.start(false);
		const result = inpTracker.end();
		expect(result).toEqual({
			min: 0,
			max: 0,
			average: 0,
			numerator: 0,
			denominator: 0,
		});
	});

	it('should handle paused start', async () => {
		const inpTracker = new INPTracker();
		inpTracker.start(true);
		// Simulate performance entries while paused (should be ignored)
		MockPerformanceObserver.simulateEntries([
			{
				name: 'click',
				entryType: 'event',
				duration: 100,
				interactionId: 1,
			} as PerformanceEventTiming,
		]);
		// Wait for the event loop to process the simulated entries
		await flushPromises();
		const result = inpTracker.end();
		expect(result).toEqual({
			min: 0,
			max: 0,
			average: 0,
			numerator: 0,
			denominator: 0,
		});
	});

	it('should handle multiple starts', async () => {
		const inpTracker = new INPTracker();
		inpTracker.start(false);
		// Simulate performance entries
		MockPerformanceObserver.simulateEntries([
			{
				name: 'click',
				entryType: 'event',
				duration: 100,
				interactionId: 1,
			} as PerformanceEventTiming,
		]);
		// Wait for the event loop to process the simulated entries
		await flushPromises();
		const result = inpTracker.start(false);
		expect(result).toEqual({
			min: 100,
			max: 100,
			average: 100,
			numerator: 100,
			denominator: 1,
		});

		// Simulate more performance entries
		MockPerformanceObserver.simulateEntries([
			{
				name: 'click',
				entryType: 'event',
				duration: 200,
				interactionId: 2,
			} as PerformanceEventTiming,
		]);
		// Wait for the event loop to process the simulated entries
		await flushPromises();
		const result2 = inpTracker.end();
		expect(result2).toEqual({
			min: 200,
			max: 200,
			average: 200,
			numerator: 200,
			denominator: 1,
		});
	});

	it('should handle pause', async () => {
		const inpTracker = new INPTracker();
		inpTracker.start(false);
		// Simulate performance entries before pausing
		MockPerformanceObserver.simulateEntries([
			{
				name: 'click',
				entryType: 'event',
				duration: 100,
				interactionId: 1,
			} as PerformanceEventTiming,
		]);
		// Wait for the event loop to process the simulated entries
		await flushPromises();
		inpTracker.pause();
		// Simulate performance entries while paused (should be ignored)
		MockPerformanceObserver.simulateEntries([
			{
				name: 'click',
				entryType: 'event',
				duration: 200,
				interactionId: 2,
			} as PerformanceEventTiming,
		]);

		// Wait for the event loop to process the simulated entries
		await flushPromises();
		const result = inpTracker.end();
		expect(result).toEqual({
			min: 100,
			max: 100,
			average: 100,
			numerator: 100,
			denominator: 1,
		});
	});

	it('should handle resume', async () => {
		const inpTracker = new INPTracker();
		inpTracker.start(false);
		// Simulate performance entries before pausing
		MockPerformanceObserver.simulateEntries([
			{
				name: 'click',
				entryType: 'event',
				duration: 100,
				interactionId: 1,
			} as PerformanceEventTiming,
		]);
		// Wait for the event loop to process the simulated entries
		await flushPromises();
		inpTracker.pause();
		// Simulate performance entries while paused (should be ignored)
		MockPerformanceObserver.simulateEntries([
			{
				name: 'click',
				entryType: 'event',
				duration: 200,
				interactionId: 2,
			} as PerformanceEventTiming,
		]);
		// Wait for the event loop to process the simulated entries
		await flushPromises();
		inpTracker.resume();
		// Simulate performance entries after resuming
		MockPerformanceObserver.simulateEntries([
			{
				name: 'click',
				entryType: 'event',
				duration: 150,
				interactionId: 3,
			} as PerformanceEventTiming,
		]);
		// Wait for the event loop to process the simulated entries
		await flushPromises();
		const result = inpTracker.end();
		expect(result).toEqual({
			min: 100,
			max: 150,
			average: 125,
			numerator: 250,
			denominator: 2,
		});
	});

	describe('interactionType: total (default)', () => {
		it('should handle a single interaction', async () => {
			const inpTracker = new INPTracker();
			inpTracker.start(false);
			// Simulate performance entries
			MockPerformanceObserver.simulateEntries([
				{
					name: 'click',
					entryType: 'event',
					duration: 100,
					interactionId: 1,
				} as PerformanceEventTiming,
			]);
			// Wait for the event loop to process the simulated entries
			await flushPromises();
			const result = inpTracker.end();
			expect(result).toEqual({
				min: 100,
				max: 100,
				average: 100,
				numerator: 100,
				denominator: 1,
			});
		});

		it('should handle multiple interactions', async () => {
			const inpTracker = new INPTracker();
			inpTracker.start(false);
			// Simulate performance entries
			MockPerformanceObserver.simulateEntries([
				{
					name: 'click',
					entryType: 'event',
					duration: 100,
					interactionId: 1,
				} as PerformanceEventTiming,
				{
					name: 'keydown',
					entryType: 'event',
					duration: 200,
					interactionId: 2,
				} as PerformanceEventTiming,
			]);
			// Wait for the event loop to process the simulated entries
			await flushPromises();
			const result = inpTracker.end();
			expect(result).toEqual({
				min: 100,
				max: 200,
				average: 150,
				numerator: 300,
				denominator: 2,
			});
		});
	});

	describe.each(['click', 'keydown', 'keyup', 'pointerdown', 'pointerup'] as const)(
		'interactionType: %s',
		(interactionType) => {
			it(`should handle a single ${interactionType} interaction`, async () => {
				const inpTracker = new INPTracker({ includedInteractions: [interactionType] });
				inpTracker.start(false);
				// Simulate performance entries
				MockPerformanceObserver.simulateEntries([
					{
						name: interactionType,
						entryType: 'event',
						duration: 150,
						interactionId: 1,
					} as PerformanceEventTiming,
				]);
				// Wait for the event loop to process the simulated entries
				await flushPromises();
				const result = inpTracker.end();
				expect(result).toEqual({
					min: 150,
					max: 150,
					average: 150,
					numerator: 150,
					denominator: 1,
				});
			});

			it(`should handle multiple ${interactionType} interactions`, async () => {
				const inpTracker = new INPTracker({ includedInteractions: [interactionType] });
				inpTracker.start(false);
				// Simulate performance entries
				MockPerformanceObserver.simulateEntries([
					{
						name: interactionType,
						entryType: 'event',
						duration: 100,
						interactionId: 1,
					} as PerformanceEventTiming,
					{
						name: interactionType,
						entryType: 'event',
						duration: 300,
						interactionId: 2,
					} as PerformanceEventTiming,
				]);
				// Wait for the event loop to process the simulated entries
				await flushPromises();
				const result = inpTracker.end();
				expect(result).toEqual({
					min: 100,
					max: 300,
					average: 200,
					numerator: 400,
					denominator: 2,
				});
			});

			it(`should ignore non-${interactionType} interactions`, async () => {
				const inpTracker = new INPTracker({ includedInteractions: [interactionType] });
				inpTracker.start(false);
				// Simulate performance entries
				MockPerformanceObserver.simulateEntries([
					{
						name: 'blah',
						entryType: 'event',
						duration: 100,
						interactionId: 1,
					} as PerformanceEventTiming,
				]);
				// Wait for the event loop to process the simulated entries
				await flushPromises();
				const result = inpTracker.end();
				expect(result).toEqual({
					min: 0,
					max: 0,
					average: 0,
					numerator: 0,
					denominator: 0,
				});
			});
		},
	);
});
