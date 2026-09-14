import type * as SleepDetectorModule from '../sleep-detector';

const TICK_INTERVAL = 1000;
const GAP_HISTORY_SIZE = 20;
const OUT_OF_SYNC_PERIOD = 3000;

const suspendFor = (duration: number): void => {
	jest.setSystemTime(Date.now() + duration);
	jest.advanceTimersByTime(TICK_INTERVAL);
};

const tickTimes = (count: number): void => {
	jest.advanceTimersByTime(TICK_INTERVAL * count);
};

describe('sleep detector', () => {
	let sleepDetector: typeof SleepDetectorModule;
	let release: () => void;
	let start: number;

	beforeEach(async () => {
		jest.useFakeTimers();
		jest.resetModules();
		sleepDetector = await import('../sleep-detector');
		start = Date.now();
		release = sleepDetector.acquireSleepDetector();
	});

	afterEach(() => {
		release();
		jest.useRealTimers();
	});

	it('stays below the out of sync period while ticking normally', () => {
		tickTimes(30);

		expect(sleepDetector.getMaxGapSince(start)).toBeLessThan(OUT_OF_SYNC_PERIOD);
	});

	it('reports zero before the first tick', () => {
		expect(sleepDetector.getMaxGapSince(start)).toBe(0);
	});

	it('reports the suspension duration when the process is frozen', () => {
		tickTimes(3);
		suspendFor(10 * 60 * 1000);

		expect(sleepDetector.getMaxGapSince(start)).toBeGreaterThanOrEqual(10 * 60 * 1000);
	});

	it('retains the suspension while a reconnect is still in flight', () => {
		suspendFor(10 * 60 * 1000);
		tickTimes(GAP_HISTORY_SIZE - 1);

		expect(sleepDetector.getMaxGapSince(start)).toBeGreaterThanOrEqual(10 * 60 * 1000);
	});

	it('discards a suspension once the history window has refilled', () => {
		suspendFor(10 * 60 * 1000);
		tickTimes(GAP_HISTORY_SIZE);

		expect(sleepDetector.getMaxGapSince(start)).toBeLessThan(OUT_OF_SYNC_PERIOD);
	});

	it('discards a throttled background gap once the tab ticks normally again', () => {
		suspendFor(60 * 1000);
		tickTimes(GAP_HISTORY_SIZE);

		expect(sleepDetector.getMaxGapSince(start)).toBeLessThan(OUT_OF_SYNC_PERIOD);
	});

	it('excludes suspensions observed before the caller’s watermark', () => {
		suspendFor(10 * 60 * 1000);
		const watermark = Date.now();

		expect(sleepDetector.getMaxGapSince(watermark)).toBe(0);
	});

	it('keeps a suspension visible to a consumer whose watermark predates it', () => {
		const watermark = Date.now();
		tickTimes(1);
		suspendFor(10 * 60 * 1000);

		expect(sleepDetector.getMaxGapSince(watermark)).toBeGreaterThanOrEqual(10 * 60 * 1000);
	});

	it('stops recording gaps once every consumer has released', () => {
		release();
		suspendFor(10 * 60 * 1000);

		expect(sleepDetector.getMaxGapSince(start)).toBe(0);
	});

	it('keeps ticking while another consumer still holds it', () => {
		const secondRelease = sleepDetector.acquireSleepDetector();
		release();
		suspendFor(10 * 60 * 1000);

		expect(sleepDetector.getMaxGapSince(start)).toBeGreaterThanOrEqual(10 * 60 * 1000);

		secondRelease();
	});

	it('ignores a repeated release from the same consumer', () => {
		const secondRelease = sleepDetector.acquireSleepDetector();
		release();
		release();
		suspendFor(10 * 60 * 1000);

		expect(sleepDetector.getMaxGapSince(start)).toBeGreaterThanOrEqual(10 * 60 * 1000);

		secondRelease();
	});

	it('notifies listeners when a suspension is observed', () => {
		const listener = jest.fn();
		const unsubscribe = sleepDetector.onSuspension(listener);

		suspendFor(10 * 60 * 1000);

		expect(listener).toHaveBeenCalledWith(expect.any(Number));
		expect(listener.mock.calls[0][0]).toBeGreaterThanOrEqual(10 * 60 * 1000);

		unsubscribe();
	});

	it('does not notify listeners while ticking normally', () => {
		const listener = jest.fn();
		const unsubscribe = sleepDetector.onSuspension(listener);

		tickTimes(30);

		expect(listener).not.toHaveBeenCalled();

		unsubscribe();
	});

	it('stops notifying a listener once it unsubscribes', () => {
		const listener = jest.fn();
		sleepDetector.onSuspension(listener)();

		suspendFor(10 * 60 * 1000);

		expect(listener).not.toHaveBeenCalled();
	});
});
