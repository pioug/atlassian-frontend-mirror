import { InteractionObserver } from '../../collector/interaction-observer';
import {
	declareEventTimingSupport,
	entry,
	FakePerformanceObserver,
	flushObserverCallback,
	installFakeObserver,
	observer,
	setPageInteractionCount,
} from '../_event-timing';

describe('InteractionObserver', () => {
	beforeEach(() => {
		declareEventTimingSupport();
		installFakeObserver();
		setPageInteractionCount(0);
	});

	describe('isSupported', () => {
		it('accepts a browser that reports interaction ids and an interaction count', () => {
			expect(InteractionObserver.isSupported()).toBe(true);
		});

		it('rejects a browser without a performance observer', () => {
			Reflect.deleteProperty(window, 'PerformanceObserver');

			expect(InteractionObserver.isSupported()).toBe(false);
		});

		it('rejects a browser without event timing', () => {
			// Firefox reports no `PerformanceEventTiming` at all.
			Reflect.deleteProperty(window, 'PerformanceEventTiming');

			expect(InteractionObserver.isSupported()).toBe(false);
		});

		it('rejects a browser whose event timing has no interaction ids', () => {
			// Safari reports event timings but does not group them into interactions, so their
			// latencies cannot be attributed to anything.
			Object.defineProperty(window, 'PerformanceEventTiming', {
				configurable: true,
				value: class {},
			});

			expect(InteractionObserver.isSupported()).toBe(false);
		});

		it('rejects a browser that cannot observe event timings', () => {
			FakePerformanceObserver.supportedEntryTypes = ['paint'];

			expect(InteractionObserver.isSupported()).toBe(false);
		});

		it('rejects a browser without an interaction count', () => {
			// Without it `totalCount` would only ever be the interactions slow enough to observe,
			// which reads as a page where every interaction was slow.
			setPageInteractionCount(undefined);

			expect(InteractionObserver.isSupported()).toBe(false);
		});
	});

	describe('readPageInteractionCount', () => {
		it('reports what the page counted', () => {
			setPageInteractionCount(7);

			expect(InteractionObserver.readPageInteractionCount()).toBe(7);
		});

		it('reports no interactions when the page does not count them', () => {
			setPageInteractionCount(undefined);

			expect(InteractionObserver.readPageInteractionCount()).toBe(0);
		});
	});

	describe('start', () => {
		it('observes the interactions that are slow enough to report', () => {
			new InteractionObserver(jest.fn()).start();

			expect(observer().observedWith).toEqual({
				type: 'event',
				// The interactions faster than this are counted by the page instead.
				durationThreshold: 16,
				// The entries from before this point are interactions with a page that was still
				// loading the editor, and belong to no session.
				buffered: false,
			});
		});

		it('reports the entries the browser dispatches', async () => {
			const onEntries = jest.fn();
			new InteractionObserver(onEntries).start();

			const entries = [entry(1, 120), entry(2, 24)];
			observer().deliver(entries);

			// The observer callback is delayed by a microtask, which works around Safari
			// invoking it synchronously.
			expect(onEntries).not.toHaveBeenCalled();
			await flushObserverCallback();

			expect(onEntries).toHaveBeenCalledWith(entries);
		});

		it('leaves the observer it already has running', () => {
			const interactions = new InteractionObserver(jest.fn());
			interactions.start();
			interactions.start();

			// A second observer would keep reporting interactions after `stop`.
			expect(FakePerformanceObserver.instances).toHaveLength(1);
		});
	});

	describe('drain', () => {
		it('reports the entries the browser has not dispatched yet', () => {
			const onEntries = jest.fn();
			const interactions = new InteractionObserver(onEntries);
			interactions.start();

			const entries = [entry(1, 120)];
			observer().queue(entries);
			interactions.drain();

			// Synchronously, unlike a dispatched entry: the page it is reported for may be gone
			// before a microtask runs.
			expect(onEntries).toHaveBeenCalledWith(entries);
		});

		it('reports nothing when the browser has nothing pending', () => {
			const onEntries = jest.fn();
			const interactions = new InteractionObserver(onEntries);
			interactions.start();

			interactions.drain();

			expect(onEntries).toHaveBeenCalledWith([]);
		});

		it('reports nothing when it never started', () => {
			const onEntries = jest.fn();

			new InteractionObserver(onEntries).drain();

			expect(onEntries).not.toHaveBeenCalled();
		});
	});

	describe('stop', () => {
		it('disconnects the observer', () => {
			const interactions = new InteractionObserver(jest.fn());
			interactions.start();
			const stopped = observer();

			interactions.stop();

			expect(stopped.disconnected).toBe(true);
		});

		it('reports nothing afterwards', () => {
			const onEntries = jest.fn();
			const interactions = new InteractionObserver(onEntries);
			interactions.start();
			observer().queue([entry(1, 120)]);

			interactions.stop();
			interactions.drain();

			expect(onEntries).not.toHaveBeenCalled();
		});

		it('can be called before starting and more than once', () => {
			const interactions = new InteractionObserver(jest.fn());

			expect(() => {
				interactions.stop();
				interactions.start();
				interactions.stop();
				interactions.stop();
			}).not.toThrow();
		});
	});
});
