import { InteractivityCollector } from '../../collector/interactivity-collector';
import {
	declareEventTimingSupport,
	deliver,
	dispatchInteraction,
	entry,
	FakePerformanceObserver,
	installFakeObserver,
	observer,
	setPageInteractionCount,
	setVisibility,
} from '../_event-timing';

describe('InteractivityCollector', () => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let emit: jest.Mock<void, [any, any]>;
	let onError: jest.Mock<void, [Error]>;
	let objectId: string | undefined;
	let mode: 'editing' | 'reading' | undefined;
	let collector: ReturnType<typeof create>;
	/** The element of the `main` region. */
	let main: HTMLElement;

	const create = (regions: readonly ('main' | 'side')[]) =>
		new InteractivityCollector({
			regions,
			endReasons: ['navigation', 'modeChange', 'close'],
			sessionKeys: { objectId, mode },
			onError,
			emit,
		});

	const navigate = () =>
		collector.setSessionKeys({ values: { objectId }, endReason: 'navigation' });
	const changeMode = () => collector.setSessionKeys({ values: { mode }, endReason: 'modeChange' });
	const stop = () => collector.stop({ endReason: 'close' });

	const start = (root?: HTMLElement) => {
		collector = create(['main']);
		if (root) {
			collector.region('main').addElement(root);
		}
		return collector.start();
	};

	beforeAll(() => {
		declareEventTimingSupport();
	});

	beforeEach(() => {
		jest.useFakeTimers();
		installFakeObserver();
		setPageInteractionCount(0);
		setVisibility('visible');
		emit = jest.fn();
		onError = jest.fn();
		objectId = 'page-1';
		mode = 'editing';
		main = document.createElement('div');
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('does not collect when the browser cannot report interaction counts', () => {
		setPageInteractionCount(undefined);

		expect(start()).toBe(false);
		expect(FakePerformanceObserver.instances).toHaveLength(0);
	});

	describe('cadence', () => {
		it('snapshots at 10s, 30s and 60s, then every 60s', async () => {
			start();

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);
			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0]).toMatchObject({ seq: 1, reason: 'timer' });

			await deliver([entry(2, 24)]);
			jest.advanceTimersByTime(20_000);
			expect(emit).toHaveBeenCalledTimes(2);

			await deliver([entry(3, 24)]);
			jest.advanceTimersByTime(30_000);
			expect(emit).toHaveBeenCalledTimes(3);

			await deliver([entry(4, 24)]);
			jest.advanceTimersByTime(60_000);
			expect(emit).toHaveBeenCalledTimes(4);
			expect(emit.mock.calls[3][0]).toMatchObject({ seq: 4 });
		});

		it('skips a timer snapshot when no interaction data changed', async () => {
			start();

			jest.advanceTimersByTime(10_000);
			expect(emit).not.toHaveBeenCalled();

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(20_000);
			expect(emit).toHaveBeenCalledTimes(1);

			jest.advanceTimersByTime(120_000);
			expect(emit).toHaveBeenCalledTimes(1);
		});
	});

	describe('lifecycle', () => {
		it('snapshots when the tab becomes hidden', async () => {
			start();
			await deliver([entry(1, 24)]);

			setVisibility('hidden');

			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0]).toMatchObject({ reason: 'hidden', seq: 1 });
		});

		it('includes interactions the browser has already delivered', () => {
			start();
			observer().queue([entry(1, 120)]);

			setVisibility('hidden');

			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0].page).toMatchObject({ observedCount: 1, maxMs: 120 });
		});

		it('keeps entries a suppressed pagehide would otherwise have consumed', async () => {
			start();
			await deliver([entry(1, 24)]);
			setVisibility('hidden');
			expect(emit).toHaveBeenCalledTimes(1);

			// The browser produced these but has not dispatched them, and the pagehide snapshot
			// is the one already reported for this transition.
			observer().queue([entry(2, 120)]);
			window.dispatchEvent(new Event('pagehide'));
			expect(emit).toHaveBeenCalledTimes(1);

			// So they are still there for the next snapshot rather than dropped with it.
			stop();
			expect(emit).toHaveBeenCalledTimes(2);
			expect(emit.mock.calls[1][0].page).toMatchObject({ observedCount: 2, maxMs: 120 });
		});

		it('reports again after the page comes back from the back/forward cache', async () => {
			start();
			await deliver([entry(1, 24)]);
			setVisibility('hidden');
			window.dispatchEvent(new Event('pagehide'));
			expect(emit).toHaveBeenCalledTimes(1);

			window.dispatchEvent(new Event('pageshow'));
			await deliver([entry(2, 120)]);
			window.dispatchEvent(new Event('pagehide'));

			expect(emit).toHaveBeenCalledTimes(2);
			expect(emit.mock.calls[1][0]).toMatchObject({ reason: 'pagehide', seq: 2 });
		});

		it('coalesces hidden and pagehide from one transition into one snapshot', async () => {
			start();
			await deliver([entry(1, 24)]);

			setVisibility('hidden');
			window.dispatchEvent(new Event('pagehide'));

			expect(emit).toHaveBeenCalledTimes(1);
		});

		it('keeps collecting when the tab becomes visible again', async () => {
			start();
			await deliver([entry(1, 24)]);
			setVisibility('hidden');
			setVisibility('visible');

			await deliver([entry(2, 24)]);
			setVisibility('hidden');

			expect(emit).toHaveBeenCalledTimes(2);
			expect(emit.mock.calls[1][0]).toMatchObject({ reason: 'hidden', seq: 2 });
		});

		it('snapshots on stop and stops collecting', async () => {
			start();
			await deliver([entry(1, 24)]);

			stop();

			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0]).toMatchObject({ reason: 'close' });
			expect(observer().disconnected).toBe(true);

			jest.advanceTimersByTime(120_000);
			expect(emit).toHaveBeenCalledTimes(1);
		});

		it('does not repeat an unchanged snapshot on stop', async () => {
			start();
			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);
			expect(emit).toHaveBeenCalledTimes(1);

			stop();

			expect(emit).toHaveBeenCalledTimes(1);
		});

		it('reports active and hidden time separately', async () => {
			start();
			jest.advanceTimersByTime(4_000);
			setVisibility('hidden');
			jest.advanceTimersByTime(6_000);
			setVisibility('visible');

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(20_000);

			expect(emit.mock.calls[0][0]).toMatchObject({ activeMs: 24_000, hiddenMs: 6_000 });
		});
	});

	describe('counts', () => {
		it('counts interactions below the reporting threshold via the page count', async () => {
			setPageInteractionCount(5);
			start();

			await deliver([entry(1, 24)]);
			setPageInteractionCount(9);
			jest.advanceTimersByTime(10_000);

			// Four interactions since mount, one of them slow enough to observe.
			expect(emit.mock.calls[0][0].page).toMatchObject({ totalCount: 4, observedCount: 1 });
		});

		it('reports the schema version and the values of the session keys', async () => {
			start();

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0]).toMatchObject({
				schema: 1,
				sessionKeys: { objectId: 'page-1', mode: 'editing' },
			});
		});

		it('merges entries of one interaction instead of counting them twice', async () => {
			start();

			await deliver([entry(1, 24), entry(1, 120)]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].page).toMatchObject({
				observedCount: 1,
				maxMs: 120,
				sumMs: 120,
				buckets: { '120': 1 },
			});
		});

		it('reports the page percentiles alongside its buckets', async () => {
			start();

			await deliver([entry(1, 24), entry(2, 120), entry(3, 600)]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].page).toMatchObject({
				percentilesMs: { '90': 600, '98': 600 },
			});
		});
	});

	describe('session keys', () => {
		it('reports a key whose value the session never knew as unknown', async () => {
			mode = undefined;
			start();

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].sessionKeys).toEqual({ objectId: 'page-1', mode: undefined });
		});

		it('ends the session once when one change moves several keys', async () => {
			start();
			await deliver([entry(1, 24)]);

			collector.setSessionKeys({
				values: { objectId: 'page-2', mode: 'reading' },
				endReason: 'navigation',
			});
			await deliver([entry(2, 24)]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls.map(([snapshot]) => snapshot.reason)).toEqual(['navigation', 'timer']);
			expect(emit.mock.calls[0][0].sessionKeys).toEqual({ objectId: 'page-1', mode: 'editing' });
			expect(emit.mock.calls[1][0].sessionKeys).toEqual({ objectId: 'page-2', mode: 'reading' });
		});

		it('ends the session with the reason the caller gave', async () => {
			start();
			await deliver([entry(1, 24)]);

			collector.setSessionKeys({ values: { mode: 'reading' }, endReason: 'navigation' });

			expect(emit.mock.calls[0][0]).toMatchObject({ reason: 'navigation' });
		});

		it('reports a key it was not given once', () => {
			start();

			// @ts-expect-error what an untyped owner could pass
			collector.setSessionKeys({ values: { other: 'x' }, endReason: 'navigation' });
			// @ts-expect-error what an untyped owner could pass
			collector.setSessionKeys({ values: { other: undefined }, endReason: 'navigation' });

			expect(onError.mock.calls).toEqual([
				[new Error('Undeclared interactivity session key: other')],
			]);
		});

		it('reports an end reason it did not declare once', () => {
			start();

			// @ts-expect-error what an untyped owner could pass
			collector.setSessionKeys({ values: {}, endReason: 'redirect' });
			// @ts-expect-error what an untyped owner could pass
			collector.setSessionKeys({ values: {}, endReason: 'redirect' });

			expect(onError.mock.calls).toEqual([
				[new Error('Undeclared interactivity end reason: redirect')],
			]);
		});

		it('leaves the session alone for a key it was not given', async () => {
			start();
			await deliver([entry(1, 24)]);

			collector.setSessionKeys({
				// @ts-expect-error what an untyped owner could pass
				values: { other: 'x', constructor: 'x' },
				endReason: 'navigation',
			});
			jest.advanceTimersByTime(10_000);

			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0]).toMatchObject({ reason: 'timer' });
			expect(emit.mock.calls[0][0].sessionKeys).toEqual({ objectId: 'page-1', mode: 'editing' });
		});

		it('ends the session with an end reason it did not declare', async () => {
			start();
			await deliver([entry(1, 24)]);

			// @ts-expect-error what an untyped owner could pass
			collector.setSessionKeys({ values: { objectId: 'page-2' }, endReason: 'redirect' });

			expect(emit.mock.calls[0][0]).toMatchObject({ reason: 'redirect' });
		});
	});

	describe('session mode', () => {
		it('reports the mode the session runs in', async () => {
			mode = 'reading';
			start();

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0]).toMatchObject({ sessionKeys: { mode: 'reading' } });
		});

		it('closes the session for the previous mode and starts a new one', async () => {
			mode = 'editing';
			start();
			await deliver([entry(1, 24)]);

			mode = 'reading';
			changeMode();

			expect(emit).toHaveBeenCalledTimes(1);
			const editing = emit.mock.calls[0][0];
			expect(editing).toMatchObject({
				reason: 'modeChange',
				seq: 1,
				sessionKeys: { mode: 'editing' },
			});

			await deliver([entry(2, 120)]);
			jest.advanceTimersByTime(10_000);

			const reading = emit.mock.calls[1][0];
			expect(reading).toMatchObject({ seq: 1, sessionKeys: { mode: 'reading' }, reason: 'timer' });
			expect(reading.interactivitySessionId).not.toBe(editing.interactivitySessionId);
			// Counts are per session, so the interaction from the editing one is gone.
			expect(reading.page).toMatchObject({ observedCount: 1, maxMs: 120 });
		});

		it('never reports a session that covers two modes', async () => {
			mode = 'editing';
			start();

			await deliver([entry(1, 24)]);
			mode = 'reading';
			changeMode();
			await deliver([entry(2, 120)]);
			mode = 'editing';
			changeMode();

			const modes = emit.mock.calls.map(([snapshot]) => snapshot.sessionKeys.mode);
			expect(modes).toEqual(['editing', 'reading']);
		});

		it('adopts a mode that resolves after the session opened', async () => {
			mode = undefined;
			start();

			mode = 'editing';
			changeMode();

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);

			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0]).toMatchObject({
				reason: 'timer',
				sessionKeys: { mode: 'editing' },
			});
		});
	});

	describe('object id', () => {
		it('closes the session for the previous content and starts a new one', async () => {
			start();
			await deliver([entry(1, 24)]);

			objectId = 'page-2';
			navigate();

			expect(emit).toHaveBeenCalledTimes(1);
			const navigation = emit.mock.calls[0][0];
			expect(navigation).toMatchObject({
				reason: 'navigation',
				seq: 1,
				sessionKeys: { objectId: 'page-1' },
			});

			await deliver([entry(2, 24)]);
			jest.advanceTimersByTime(10_000);

			const next = emit.mock.calls[1][0];
			// The new session carries every key, not only the one that changed.
			expect(next).toMatchObject({
				seq: 1,
				sessionKeys: { objectId: 'page-2', mode: 'editing' },
				reason: 'timer',
			});
			expect(next.interactivitySessionId).not.toBe(navigation.interactivitySessionId);
			// Counts are per session, so the interaction of the previous one is gone.
			expect(next.page).toMatchObject({ observedCount: 1 });
		});

		it('starts the new session even when the previous snapshot needs no repeat', async () => {
			start();
			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);
			const previous = emit.mock.calls[0][0];

			objectId = 'page-2';
			navigate();

			// Nothing changed since the timer snapshot, so there is nothing new to report.
			expect(emit).toHaveBeenCalledTimes(1);

			// Dated inside the new session: an interaction the user started before it opened is
			// the previous session's, whatever its id says.
			await deliver([entry(2, 120, { startTime: 10_000 })]);
			jest.advanceTimersByTime(10_000);

			const next = emit.mock.calls[1][0];
			expect(next).toMatchObject({ seq: 1, sessionKeys: { objectId: 'page-2' } });
			expect(next.interactivitySessionId).not.toBe(previous.interactivitySessionId);
		});

		it('ignores an object id that is momentarily unknown', async () => {
			start();
			await deliver([entry(1, 24)]);
			navigate();

			// An owner can lose a value for a moment on a document that never changed. That is
			// not a navigation.
			objectId = undefined;
			navigate();
			objectId = 'page-1';
			navigate();

			jest.advanceTimersByTime(10_000);

			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0]).toMatchObject({
				reason: 'timer',
				sessionKeys: { objectId: 'page-1' },
				seq: 1,
			});
		});

		it('adopts an object id that resolves after mount without ending the session', async () => {
			objectId = undefined;
			start();

			objectId = 'page-1';
			navigate();

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);

			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0]).toMatchObject({
				reason: 'timer',
				seq: 1,
				sessionKeys: { objectId: 'page-1' },
			});
		});
	});

	describe('start', () => {
		it('does nothing when called again while collecting', async () => {
			expect(start()).toBe(true);
			const [firstObserver] = FakePerformanceObserver.instances;

			expect(collector.start()).toBe(true);

			expect(FakePerformanceObserver.instances).toHaveLength(1);
			expect(firstObserver.disconnected).toBe(false);

			// Still one collector collecting, so one snapshot rather than two.
			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);
			expect(emit).toHaveBeenCalledTimes(1);
		});
	});

	describe('stop', () => {
		it('stops with an end reason it did not declare, and reports it', async () => {
			start();
			await deliver([entry(1, 24)]);

			// @ts-expect-error what an untyped owner could pass
			collector.stop({ endReason: 'redirect' });
			jest.advanceTimersByTime(10_000);

			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0]).toMatchObject({ reason: 'redirect' });
			expect(onError.mock.calls).toEqual([
				[new Error('Undeclared interactivity end reason: redirect')],
			]);
		});

		it('reports an emit that threw, once, and keeps collecting', async () => {
			const failure = new Error('No analytics');
			emit.mockImplementation(() => {
				throw failure;
			});
			start();

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);
			await deliver([entry(2, 32)]);
			jest.advanceTimersByTime(20_000);
			await deliver([entry(3, 40)]);
			expect(() => stop()).not.toThrow();

			expect(emit).toHaveBeenCalledTimes(3);
			expect(onError.mock.calls).toEqual([[failure]]);
		});

		it('reports an end reason it takes interim snapshots with', () => {
			new InteractivityCollector({
				regions: [],
				// @ts-expect-error what an untyped owner could pass
				endReasons: ['unmount', 'timer'],
				sessionKeys: {},
				onError,
				emit,
			});

			expect(onError.mock.calls).toEqual([[new Error('Reserved interactivity end reason: timer')]]);
		});

		it('carries on when reporting throws', async () => {
			onError.mockImplementation(() => {
				throw new Error('No logging');
			});
			emit.mockImplementation(() => {
				throw new Error('No analytics');
			});
			start();
			await deliver([entry(1, 24)]);

			expect(() => jest.advanceTimersByTime(10_000)).not.toThrow();
			// @ts-expect-error what an untyped owner could pass
			expect(() => collector.stop({ endReason: 'redirect' })).not.toThrow();
			expect(onError).toHaveBeenCalledTimes(2);
		});

		it('reports nothing when used as declared', async () => {
			start(main);
			await deliver([entry(1, 24)]);
			objectId = 'page-2';
			navigate();
			mode = 'reading';
			changeMode();
			stop();

			expect(onError).not.toHaveBeenCalled();
		});
	});

	describe('constructor', () => {
		it('touches nothing of the page before it is started', () => {
			const now = jest.spyOn(performance, 'now');
			const visibility = jest.spyOn(document, 'visibilityState', 'get');

			create(['main']);

			expect(now).not.toHaveBeenCalled();
			expect(visibility).not.toHaveBeenCalled();
			expect(FakePerformanceObserver.instances).toHaveLength(0);
		});
	});

	describe('starting again after a stop', () => {
		it('reports a new session', async () => {
			start();
			await deliver([entry(1, 24)]);
			stop();

			expect(collector.start()).toBe(true);
			await deliver([entry(2, 120)]);
			jest.advanceTimersByTime(10_000);

			const [[stopped], [next]] = emit.mock.calls;
			expect(next).toMatchObject({ reason: 'timer', seq: 1 });
			expect(next.interactivitySessionId).not.toBe(stopped.interactivitySessionId);
			expect(next.page).toMatchObject({ observedCount: 1, maxMs: 120 });
		});

		it('does not count an interaction the stopped session reported', async () => {
			start();
			await deliver([entry(7, 24)]);
			stop();

			collector.start();
			// The browser reports the rest of that interaction after the restart.
			await deliver([entry(7, 120)]);
			jest.advanceTimersByTime(10_000);

			expect(emit).toHaveBeenCalledTimes(1);
		});

		it('counts nothing that happened while it was stopped', () => {
			start(main);
			stop();

			dispatchInteraction(main, 'keydown', 100);
			collector.start();
			jest.advanceTimersByTime(10_000);

			expect(emit).not.toHaveBeenCalled();
		});

		it('keeps the elements of its regions', () => {
			start(main);
			stop();

			collector.start();
			dispatchInteraction(main, 'keydown', 100);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].regions.main.typing).toMatchObject({ totalCount: 1 });
		});

		it('starts with the session keys it was given while stopped', async () => {
			start();
			stop();

			objectId = 'page-2';
			navigate();
			collector.start();
			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls.map(([snapshot]) => snapshot.reason)).toEqual(['timer']);
			expect(emit.mock.calls[0][0].sessionKeys).toEqual({ objectId: 'page-2', mode: 'editing' });
		});
	});

	describe('send hints', () => {
		// The page may not be around for long once one of these has happened.
		it.each([
			['hidden', () => setVisibility('hidden')],
			['pagehide', () => window.dispatchEvent(new Event('pagehide'))],
			['close', () => stop()],
		] as const)('asks for a %s snapshot to be sent immediately', async (_, end) => {
			start();
			await deliver([entry(1, 24)]);

			end();

			expect(emit.mock.calls[0][1]).toEqual({ immediate: true });
		});

		it.each([
			['timer', () => jest.advanceTimersByTime(10_000)],
			['a rotation', () => changeMode()],
		] as const)('lets a %s snapshot wait its turn', async (_, take) => {
			start();
			await deliver([entry(1, 24)]);

			mode = 'reading';
			take();

			expect(emit.mock.calls[0][1]).toEqual({ immediate: false });
		});
	});

	describe('regions', () => {
		it('reports every group, including the ones nothing happened in', async () => {
			start(main);

			await deliver([entry(1, 24)]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].regions).toMatchObject({
				main: {
					all: { totalCount: 0, observedCount: 0, buckets: {} },
					typing: { totalCount: 0, observedCount: 0, buckets: {} },
					pointer: { totalCount: 0, observedCount: 0, buckets: {} },
					other: { totalCount: 0, observedCount: 0, buckets: {} },
				},
			});
		});

		it('counts an interaction with a region in page, in all and in the group of its kind', async () => {
			start(main);

			dispatchInteraction(main, 'keydown', 100);
			await deliver([entry(1, 120, { name: 'keydown', startTime: 100 })]);
			jest.advanceTimersByTime(10_000);

			const snapshot = emit.mock.calls[0][0];
			expect(snapshot.page).toMatchObject({ observedCount: 1, maxMs: 120, buckets: { '120': 1 } });
			expect(snapshot.regions.main.all).toMatchObject({
				totalCount: 1,
				observedCount: 1,
				maxMs: 120,
				buckets: { '120': 1 },
			});
			expect(snapshot.regions.main.typing).toMatchObject({
				totalCount: 1,
				observedCount: 1,
				maxMs: 120,
				buckets: { '120': 1 },
			});
			expect(snapshot.regions.main.pointer).toMatchObject({ totalCount: 0, observedCount: 0 });
		});

		it('reports the kinds as one in all', async () => {
			start(main);

			dispatchInteraction(main, 'keydown', 100);
			dispatchInteraction(main, 'pointerdown', 200);
			dispatchInteraction(main, 'pointerup', 250);
			dispatchInteraction(main, 'keydown', 300);
			await deliver([
				entry(1, 24, { name: 'keydown', startTime: 100 }),
				entry(2, 600, { name: 'pointerup', startTime: 250 }),
			]);
			jest.advanceTimersByTime(10_000);

			const snapshot = emit.mock.calls[0][0];
			// The counts are the groups' sums; the percentiles are the union's own.
			expect(snapshot.regions.main.all).toEqual({
				totalCount: 3,
				observedCount: 2,
				sumMs: 624,
				maxMs: 600,
				buckets: { '24': 1, '675': 1 },
				percentilesMs: { '90': 600, '98': 600 },
			});
			expect(snapshot.regions.main.typing).toMatchObject({
				totalCount: 2,
				observedCount: 1,
				maxMs: 24,
			});
			expect(snapshot.regions.main.pointer).toMatchObject({
				totalCount: 1,
				observedCount: 1,
				maxMs: 600,
			});
		});

		it('moves an interaction measured again within all as well', async () => {
			start(main);

			dispatchInteraction(main, 'pointerdown', 100);
			dispatchInteraction(main, 'pointerup', 150);
			dispatchInteraction(main, 'click', 160);
			await deliver([entry(1, 24, { name: 'pointerup', startTime: 150 })]);
			await deliver([entry(1, 120, { name: 'click', startTime: 160 })]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].regions.main.all).toMatchObject({
				totalCount: 1,
				observedCount: 1,
				maxMs: 120,
				buckets: { '120': 1 },
			});
		});

		it('counts an interaction too fast for Event Timing to report', () => {
			start(main);

			dispatchInteraction(main, 'pointerdown', 100);
			dispatchInteraction(main, 'pointerup', 150);
			jest.advanceTimersByTime(10_000);

			// Nothing was observed, but the region saw an interaction, so there is something to
			// report: `totalCount - observedCount` is what those interactions are counted as.
			expect(emit).toHaveBeenCalledTimes(1);
			expect(emit.mock.calls[0][0].regions.main.all).toMatchObject({
				totalCount: 1,
				observedCount: 0,
			});
			expect(emit.mock.calls[0][0].regions.main.pointer).toMatchObject({
				totalCount: 1,
				observedCount: 0,
				buckets: {},
			});
		});

		it('leaves an interaction outside the region to page', async () => {
			start(main);

			dispatchInteraction(document.body, 'keydown', 100);
			await deliver([entry(1, 120, { name: 'keydown', startTime: 100 })]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].page).toMatchObject({ observedCount: 1, maxMs: 120 });
			expect(emit.mock.calls[0][0].regions.main.all).toMatchObject({
				totalCount: 0,
				observedCount: 0,
			});
			expect(emit.mock.calls[0][0].regions.main.typing).toMatchObject({
				totalCount: 0,
				observedCount: 0,
			});
		});

		it('starts attributing interactions when the region is given its element', () => {
			start();

			// The element can arrive a render after the first paint, so this key press is only in
			// `page`, where every interaction on the page is counted anyway.
			dispatchInteraction(main, 'keydown', 100);

			collector.region('main').addElement(main);
			dispatchInteraction(main, 'keydown', 200);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].regions.main.typing).toMatchObject({ totalCount: 1 });
		});

		it('counts the interactions with any element of the region, and none twice', () => {
			const popup = document.createElement('div');
			const nested = main.appendChild(document.createElement('div'));
			start();
			collector.region('main').addElement(main);
			collector.region('main').addElement(popup);
			collector.region('main').addElement(nested);

			dispatchInteraction(popup, 'keydown', 100);
			// Passes through two elements of the region.
			dispatchInteraction(nested, 'keydown', 200);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].regions.main.typing).toMatchObject({ totalCount: 2 });
		});

		it('stops attributing interactions with an element once it is removed', async () => {
			start();
			const remove = collector.region('main').addElement(main);

			remove();
			dispatchInteraction(main, 'keydown', 100);
			await deliver([entry(1, 120, { name: 'keydown', startTime: 100 })]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].page).toMatchObject({ observedCount: 1 });
			expect(emit.mock.calls[0][0].regions.main.typing).toMatchObject({
				totalCount: 0,
				observedCount: 0,
			});
		});

		it('counts per session', () => {
			start(main);
			dispatchInteraction(main, 'keydown', 100);

			objectId = 'page-2';
			navigate();
			expect(emit.mock.calls[0][0].regions.main.typing).toMatchObject({ totalCount: 1 });

			dispatchInteraction(main, 'pointerdown', 200);
			dispatchInteraction(main, 'pointerup', 250);
			jest.advanceTimersByTime(10_000);

			const next = emit.mock.calls[1][0];
			expect(next.regions.main.typing).toMatchObject({ totalCount: 0 });
			expect(next.regions.main.pointer).toMatchObject({ totalCount: 1 });
		});

		it('stops counting once stopped', () => {
			start(main);
			stop();
			emit.mockClear();

			dispatchInteraction(main, 'keydown', 100);
			jest.advanceTimersByTime(120_000);

			expect(emit).not.toHaveBeenCalled();
		});
	});

	describe('several regions', () => {
		let side: HTMLElement;

		const startWithTwoRegions = () => {
			collector = create(['main', 'side']);
			collector.region('main').addElement(main);
			collector.region('side').addElement(side);
			collector.start();
		};

		beforeEach(() => {
			side = document.createElement('div');
		});

		it('reports each region on its own', async () => {
			startWithTwoRegions();

			dispatchInteraction(main, 'keydown', 100);
			dispatchInteraction(side, 'pointerdown', 200);
			dispatchInteraction(side, 'pointerup', 250);
			await deliver([
				entry(1, 120, { name: 'keydown', startTime: 100 }),
				entry(2, 600, { name: 'pointerup', startTime: 250 }),
			]);
			jest.advanceTimersByTime(10_000);

			const { page, regions } = emit.mock.calls[0][0];
			expect(page).toMatchObject({ observedCount: 2 });
			expect(regions.main.all).toMatchObject({ totalCount: 1, observedCount: 1, maxMs: 120 });
			expect(regions.main.pointer).toMatchObject({ totalCount: 0 });
			expect(regions.side.all).toMatchObject({ totalCount: 1, observedCount: 1, maxMs: 600 });
			expect(regions.side.typing).toMatchObject({ totalCount: 0 });
		});

		it('counts an interaction with two regions in each of them and once in page', async () => {
			main.appendChild(side);
			startWithTwoRegions();

			dispatchInteraction(side, 'keydown', 100);
			await deliver([entry(1, 120, { name: 'keydown', startTime: 100 })]);
			jest.advanceTimersByTime(10_000);

			const { page, regions } = emit.mock.calls[0][0];
			expect(page).toMatchObject({ observedCount: 1 });
			expect(regions.main.typing).toMatchObject({ totalCount: 1, observedCount: 1 });
			expect(regions.side.typing).toMatchObject({ totalCount: 1, observedCount: 1 });
		});

		it('counts an interaction with a region it was not created with in `page` only', async () => {
			startWithTwoRegions();
			const other = document.createElement('div');
			// @ts-expect-error what an untyped owner could pass
			collector.region('other').addElement(other);

			dispatchInteraction(other, 'keydown', 100);
			await deliver([entry(1, 120, { name: 'keydown', startTime: 100 })]);
			jest.advanceTimersByTime(10_000);

			const { page, regions } = emit.mock.calls[0][0];
			expect(page).toMatchObject({ observedCount: 1 });
			expect(Object.keys(regions)).toEqual(['main', 'side']);
		});

		it('reports each region it was not created with once', () => {
			startWithTwoRegions();

			// @ts-expect-error what an untyped owner could pass
			collector.region('other');
			// @ts-expect-error what an untyped owner could pass
			collector.region('other');
			// @ts-expect-error what an untyped owner could pass
			collector.region('another');

			expect(onError.mock.calls).toEqual([
				[new Error('Undeclared interactivity region: other')],
				[new Error('Undeclared interactivity region: another')],
			]);
		});

		it('reports no more than 100 of them, however many there are', () => {
			startWithTwoRegions();

			for (let index = 0; index < 101; index++) {
				// @ts-expect-error what an untyped owner could pass
				collector.region(`card-${index}`);
			}

			expect(onError).toHaveBeenCalledTimes(100);
		});

		it('reports a region declared twice once', async () => {
			collector = create(['main', 'main']);
			collector.region('main').addElement(main);
			collector.start();

			dispatchInteraction(main, 'keydown', 100);
			await deliver([entry(1, 120, { name: 'keydown', startTime: 100 })]);
			jest.advanceTimersByTime(10_000);

			const { regions } = emit.mock.calls[0][0];
			expect(Object.keys(regions)).toEqual(['main']);
			expect(regions.main.typing).toMatchObject({ totalCount: 1, observedCount: 1 });
		});

		it('gives out the same region every time', () => {
			startWithTwoRegions();

			expect(collector.region('main')).toBe(collector.region('main'));
		});
	});

	describe('events a script dispatched', () => {
		const untrusted = { trusted: false };

		it('counts no typing interaction', () => {
			start(main);

			dispatchInteraction(main, 'keydown', 100, untrusted);
			jest.advanceTimersByTime(10_000);

			// Nothing counted, so the session has nothing to report.
			expect(emit).not.toHaveBeenCalled();
		});

		it('counts no pointer interaction', () => {
			start(main);

			dispatchInteraction(main, 'pointerdown', 100, untrusted);
			dispatchInteraction(main, 'pointerup', 150, untrusted);
			dispatchInteraction(main, 'click', 160, untrusted);
			jest.advanceTimersByTime(10_000);

			expect(emit).not.toHaveBeenCalled();
		});

		it('leaves an observed typing interaction to page rather than a region', async () => {
			start(main);

			dispatchInteraction(main, 'keydown', 100, untrusted);
			await deliver([entry(1, 120, { name: 'keydown', startTime: 100 })]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].page).toMatchObject({ observedCount: 1, maxMs: 120 });
			expect(emit.mock.calls[0][0].regions.main.typing).toMatchObject({
				totalCount: 0,
				observedCount: 0,
			});
		});

		it('leaves an observed pointer interaction to page rather than a region', async () => {
			start(main);

			dispatchInteraction(main, 'pointerdown', 100, untrusted);
			dispatchInteraction(main, 'pointerup', 150, untrusted);
			await deliver([entry(1, 120, { name: 'pointerup', startTime: 150 })]);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].page).toMatchObject({ observedCount: 1, maxMs: 120 });
			expect(emit.mock.calls[0][0].regions.main.pointer).toMatchObject({
				totalCount: 0,
				observedCount: 0,
			});
		});

		it('still counts the events of the user among them', () => {
			start(main);

			dispatchInteraction(main, 'keydown', 100, untrusted);
			dispatchInteraction(main, 'keydown', 200);
			dispatchInteraction(main, 'pointerdown', 300, untrusted);
			dispatchInteraction(main, 'pointerup', 350, untrusted);
			dispatchInteraction(main, 'pointerdown', 400);
			dispatchInteraction(main, 'pointerup', 450);
			jest.advanceTimersByTime(10_000);

			expect(emit.mock.calls[0][0].regions.main.typing).toMatchObject({ totalCount: 1 });
			expect(emit.mock.calls[0][0].regions.main.pointer).toMatchObject({ totalCount: 1 });
		});
	});

	describe('interactions spanning a session rotation', () => {
		it('does not count an interaction of the previous session again', async () => {
			start();
			// Two entries of one interaction, the second still to come.
			await deliver([entry(7, 24)]);

			objectId = 'page-2';
			navigate();
			expect(emit.mock.calls[0][0].page).toMatchObject({ observedCount: 1 });

			// The browser reports the rest of that interaction after the rotation.
			await deliver([entry(7, 120)]);
			await deliver([entry(14, 24)]);
			jest.advanceTimersByTime(10_000);

			// Only the interaction that started after the rotation is in the new session.
			expect(emit.mock.calls[1][0].page).toMatchObject({
				observedCount: 1,
				maxMs: 24,
				buckets: { '24': 1 },
			});
		});
	});

	describe('interactions that started before the session', () => {
		/**
		 * The click on Edit on the view page, whose handler mounts the editor. Event Timing creates
		 * the entry for it after the paint that presented it, which is after the editor has mounted
		 * and the observer has subscribed, so `buffered: false` does not keep it out.
		 */
		const clickIntoTheEditor = () => entry(1, 700, { name: 'pointerup', startTime: 4_300 });

		/** Mounts the editor five seconds into the page, while that click is being handled. */
		const mountAfterTheClick = () => {
			jest.advanceTimersByTime(5_000);
			start(main);
		};

		it('counts none of them, so a session they are all of has nothing to report', async () => {
			mountAfterTheClick();

			await deliver([clickIntoTheEditor()]);
			jest.advanceTimersByTime(10_000);

			expect(emit).not.toHaveBeenCalled();
		});

		it('counts what the user did once the editor was there', async () => {
			mountAfterTheClick();

			dispatchInteraction(main, 'keydown', 6_000);
			await deliver([clickIntoTheEditor(), entry(2, 400, { name: 'keydown', startTime: 6_000 })]);
			jest.advanceTimersByTime(10_000);

			const snapshot = emit.mock.calls[0][0];
			expect(snapshot.page).toMatchObject({ observedCount: 1, maxMs: 400 });
			expect(snapshot.regions.main.typing).toMatchObject({ observedCount: 1, maxMs: 400 });
		});
	});
});
