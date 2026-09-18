import type { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';

import { insm, init as originalInit } from '../index';
import type { INSMOptions } from '../types';

// --- Mocks ---
let rafCallbacks: { cb: FrameRequestCallback; id: number }[] = [];
let rafId = 1;
let analyticsSpy: jest.Mock = jest.fn();
let visibilityState = 'visible';

function mockRAF() {
	global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
		const id = rafId++;
		rafCallbacks.push({ id, cb });
		return id;
	});
	global.cancelAnimationFrame = jest.fn((cancelId: number) => {
		rafCallbacks = rafCallbacks.filter(({ id }) => id !== cancelId);
	});
}

function runRAF(frames = 1, frameDuration = 16) {
	for (let i = 0; i < frames; i++) {
		jest.advanceTimersByTime(frameDuration);

		const cbs = [...rafCallbacks];
		rafCallbacks = [];
		cbs.forEach(({ cb }) => cb(performance.now()));
	}
}

function mockVisibility() {
	Object.defineProperty(document, 'visibilityState', {
		get: () => visibilityState,
		configurable: true,
	});
}

function setVisibility(state: 'visible' | 'hidden') {
	visibilityState = state;
	window.dispatchEvent(new Event('visibilitychange'));
}

function resetMocks() {
	rafCallbacks = [];
	rafId = 1;
	visibilityState = 'visible';
	MockPerformanceObserver.instance = null;
	if (analyticsSpy) {
		analyticsSpy.mockReset();
	}
}

// Mock PerformanceEventTiming - the DOM lib type does not include `interactionId`
interface PerformanceEventTiming extends PerformanceEntry {
	interactionId?: number;
}

function interactionEntry(
	name: string,
	duration: number,
	interactionId: number,
): PerformanceEventTiming {
	return { name, entryType: 'event', duration, interactionId } as PerformanceEventTiming;
}

/**
 * The INP observer callback defers processing entries by a microtask
 * (a Safari workaround), so entries are only recorded after the microtask queue drains.
 */
const flushEntryProcessing = () => Promise.resolve();

// --- Analytics stub ---
const analyticsClientStub = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	sendOperationalEvent: (payload: any) => analyticsSpy(payload),
} as AnalyticsWebClient;

function init(
	options: INSMOptions,
	{ withoutAnalyticsOverride = false }: { withoutAnalyticsOverride?: boolean } = {},
) {
	originalInit({
		...options,
		getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
	});
	if (!withoutAnalyticsOverride) {
		// @ts-expect-error Private method for testing purposes
		insm.__setAnalyticsWebClient(analyticsClientStub);
	}
}

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

// --- Test suite ---
describe('Entry Point API (index.ts)', () => {
	let originalPerformanceObserver: typeof PerformanceObserver;

	beforeEach(() => {
		jest.useFakeTimers({ doNotFake: ['requestAnimationFrame'] });
		resetMocks();
		mockRAF();
		mockVisibility();
		analyticsSpy = jest.fn();

		// Store original PerformanceObserver
		originalPerformanceObserver = window.PerformanceObserver;

		// Mock PerformanceObserver
		window.PerformanceObserver = MockPerformanceObserver as any;
	});

	afterEach(() => {
		// Restore original PerformanceObserver
		window.PerformanceObserver = originalPerformanceObserver;
	});

	describe('Guard rails', () => {
		test('when used before init, returns undefined', () => {
			expect(insm.start('made-up', { initial: true, contentId: '9001' })).toBeUndefined();
			expect(insm.stopEarly('error-boundary', 'error details')).toBeUndefined();
			expect(insm.session).toBeUndefined();
			expect(insm.startHeavyTask('page-load')).toBeUndefined();
			expect(insm.endHeavyTask('page-load')).toBeUndefined();
		});

		test('safe behavior when analytics client fails to resolve', () => {
			init(
				{
					getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
					experiences: { expA: { enabled: true } },
				},
				{ withoutAnalyticsOverride: true },
			);
			expect(() => insm.start('expA', { initial: true, contentId: '9001' })).not.toThrow();
			expect(() => insm.stopEarly('error-boundary', 'error details')).not.toThrow();
			expect(analyticsSpy).not.toHaveBeenCalled();
		});

		test('experiences not enabled do not create a session', () => {
			init({ getAnalyticsWebClient: Promise.resolve(analyticsClientStub), experiences: {} });
			insm.start('disabledExp', { initial: true, contentId: '9001' });
			expect(insm.session).toBeUndefined();
			expect(analyticsSpy).not.toHaveBeenCalled();
		});
	});

	describe('Lifecycle and transitions', () => {
		test('start creates session', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.start('expA', { initial: true, contentId: '9001' });
			expect(insm.session).toBeTruthy();
		});

		describe('overrideExperienceKey', () => {
			test('if no experience has been started it does nothing', () => {
				init({
					getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
					experiences: { expA: { enabled: true } },
				});
				insm.overrideExperienceKey('expA');
				expect(insm.session).toBeFalsy();
			});

			test('if a non whitelisted experience has been started it starts a new experience', () => {
				init({
					getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
					experiences: { expA: { enabled: true } },
				});
				insm.start('nonWhitelisted', { initial: true, contentId: '9001' });
				insm.overrideExperienceKey('expA');
				expect(insm.session).toBeTruthy();
			});

			test('if a whitelisted experience has been started it updates the existing experience rather than create a new one', () => {
				init({
					getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
					experiences: { expA: { enabled: true }, expB: { enabled: true } },
				});
				insm.start('expA', { initial: true, contentId: '9001' });
				const session = insm.session;
				insm.overrideExperienceKey('expB');
				expect(session).toBe(insm.session);
			});
		});

		test('session end captures measurer details and attributes order', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.start('expA', { initial: true, contentId: '9001' });
			runRAF(60); // Simulate 1s at 60fps
			insm.session?.addProperties({ foo: 1 });
			insm.session?.addProperties({ bar: 2 });
			insm.stopEarly('error-boundary', 'example error');
			const payload = analyticsSpy.mock.calls[0][0];
			expect(payload.attributes).toMatchObject({ foo: 1, bar: 2 });
		});

		test('features scoped to periods', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.start('expA', { initial: true, contentId: '9001' });
			insm.session?.startFeature('f1');
			insm.session?.startFeature('f2');
			insm.session?.endFeature('f1');
			window.dispatchEvent(new Event('click'));
			insm.start('expB', { initial: false, contentId: '9002' });

			const periods = analyticsSpy.mock.calls[0][0].attributes.periods;
			expect(Array.from(periods.inactive.features)).toEqual(['f1', 'f2']);
			expect(Array.from(periods.active.features)).toEqual(['f2']);
		});

		test('secondary start ends previous and replaces session', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true }, expB: { enabled: true } },
			});
			insm.start('expA', { initial: true, contentId: '9001' });
			insm.start('expB', { initial: false, contentId: '9001' });
			expect(analyticsSpy).toHaveBeenCalled();
			expect(insm.session?.details.experienceKey).toBe('expB');
		});

		test('stopEarly emits operational event on subsequent end', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.start('expA', { initial: true, contentId: '9001' });
			insm.stopEarly('error-boundary', 'desc');
			expect(analyticsSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					attributes: expect.objectContaining({
						endDetails: { description: 'desc', reason: 'error-boundary', stoppedBy: 'early-stop' },
					}),
				}),
			);
		});

		test('beforeunload ends running session', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.start('expA', { initial: true, contentId: '9001' });
			window.dispatchEvent(new Event('beforeunload'));
			expect(analyticsSpy).toHaveBeenCalledWith(
				expect.objectContaining({
					attributes: expect.objectContaining({ endDetails: { stoppedBy: 'beforeunload' } }),
				}),
			);
		});
	});

	describe('Heavy tasks', () => {
		test('heavy tasks pause measurement, resume only after all end', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.start('expA', { initial: true, contentId: '9001' });
			insm.startHeavyTask('t1');

			expect(insm.session?.details.paused).toBe(true);
			insm.startHeavyTask('t2');
			insm.endHeavyTask('t1');
			expect(insm.session?.details.paused).toBe(true);
			insm.endHeavyTask('t2');
			expect(insm.session?.details.paused).toBe(false);
		});

		test('paused session has no measurement', async () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.startHeavyTask('t1');
			insm.start('expA', { initial: true, contentId: '9001' });

			// While paused, interactions must not be observed at all
			expect(MockPerformanceObserver.instance).toBeNull();

			// ... so any interaction timing occurring during the heavy task is discarded
			MockPerformanceObserver.simulateEntries([interactionEntry('click', 100, 1)]);
			await flushEntryProcessing();

			insm.stopEarly('test', 'n/a');
			const inp = analyticsSpy.mock.calls[0][0].attributes.periods.inactive.measurements.inp;
			expect(inp).toEqual({ min: 0, max: 0, average: 0, numerator: 0, denominator: 0 });
		});

		test('measurement resumes once all heavy tasks have ended', async () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.startHeavyTask('t1');
			insm.start('expA', { initial: true, contentId: '9001' });

			// Ignored - the session is still paused
			MockPerformanceObserver.simulateEntries([interactionEntry('click', 100, 1)]);
			await flushEntryProcessing();

			insm.endHeavyTask('t1');
			expect(MockPerformanceObserver.instance).not.toBeNull();

			// Measured - the session has resumed
			MockPerformanceObserver.simulateEntries([interactionEntry('click', 200, 2)]);
			await flushEntryProcessing();

			insm.stopEarly('test', 'n/a');
			const inp = analyticsSpy.mock.calls[0][0].attributes.periods.inactive.measurements.inp;
			expect(inp).toEqual({ min: 200, max: 200, average: 200, numerator: 200, denominator: 1 });
		});

		test('starting session while a heavy task is active begins paused', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.startHeavyTask('t1');
			insm.start('expA', { initial: true, contentId: '9001' });
			expect(insm.session?.details.paused).toBe(true);
		});
	});

	describe('Period tracking: inactivity gating', () => {
		describe('active period inactivity monitor', () => {
			test('visibility change to hidden moves to inactive', () => {
				init({
					getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
					experiences: { expA: { enabled: true } },
				});
				insm.start('expA', { initial: true, contentId: '9001' });
				window.dispatchEvent(new Event('mousemove'));
				setVisibility('hidden');
				expect(insm.session?.details.periodState).toBe('inactive');
			});

			test.each([
				['>=3s inactivity and >=3 RAFs -> inactive', { elapsedMs: 3001, rafs: 3 }, 'inactive'],
				['3s inactivity with <3 RAFs -> remains active', { elapsedMs: 3000, rafs: 1 }, 'active'],
				['>=3 RAFs with >3s elapsed -> inactive', { elapsedMs: 3001, rafs: 3 }, 'inactive'],
				['<3s with >=3 RAFs -> remains active', { elapsedMs: 2000, rafs: 3 }, 'active'],
			])('inactivity gating: %s', async (_name, inputs, expected) => {
				init({
					getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
					experiences: { expA: { enabled: true } },
				});
				insm.start('expA', { initial: true, contentId: '9001' });
				window.dispatchEvent(new Event('mousemove'));
				jest.advanceTimersByTime(inputs.elapsedMs);
				runRAF(inputs.rafs);
				expect(insm.session?.details.periodState).toBe(expected);
			});

			test('any user activity resets inactivity countdown', () => {
				init({
					getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
					experiences: { expA: { enabled: true } },
				});
				insm.start('expA', { initial: true, contentId: '9001' });
				window.dispatchEvent(new Event('mousemove'));
				jest.advanceTimersByTime(2999);
				runRAF(2);
				window.dispatchEvent(new Event('mousemove'));
				jest.advanceTimersByTime(2999);
				runRAF(2);
				expect(insm.session?.details.periodState).toBe('active');
			});
		});

		describe('inactive period', () => {
			test('any user interaction moves to active', () => {
				init({
					getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
					experiences: { expA: { enabled: true } },
				});
				insm.start('expA', { initial: true, contentId: '9001' });
				window.dispatchEvent(new Event('click'));
				expect(insm.session?.details.periodState).toBe('active');
			});
		});
	});

	describe('Period aggregation and totals', () => {
		test('multiple active and inactive: periods merged', async () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			insm.start('expA', { initial: true, contentId: '9001' });
			window.dispatchEvent(new Event('click'));
			setVisibility('hidden');
			window.dispatchEvent(new Event('click'));

			insm.stopEarly('test', 'n/a');
			const periods = analyticsSpy.mock.calls[0][0].attributes.periods;
			expect(periods.active.count).toBe(2);
			expect(periods.inactive.count).toBe(2);
		});

		test('no active period and single inactive only', () => {
			init({
				getAnalyticsWebClient: Promise.resolve(analyticsClientStub),
				experiences: { expA: { enabled: true } },
			});
			setVisibility('hidden');
			insm.start('expA', { initial: true, contentId: '9001' });
			insm.stopEarly('test', 'n/a');
			const periods = analyticsSpy.mock.calls[0][0].attributes.periods;
			expect(periods.active.count).toBe(0);
			expect(periods.inactive.count).toBe(1);
		});
	});
});
