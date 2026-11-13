import { REPORTING_THRESHOLD_MS } from './bucket-boundaries';
import type { InteractionEntry } from './interaction-tracker';

/** `performance.interactionCount` is Chromium-only and absent from the DOM typings. */
const interactionCount = (): number | undefined =>
	(performance as Performance & { interactionCount?: number }).interactionCount;

/** `durationThreshold` is absent from the DOM typings for `PerformanceObserverInit`. */
type EventTimingObserverInit = PerformanceObserverInit & { durationThreshold: number };

/**
 * Reports the interactions the browser observes to `onEntries`.
 *
 * `drain` and `stop` are safe to call before `start` and after each other, so a session
 * that never started collecting needs no special handling.
 */
export class InteractionObserver {
	/**
	 * Whether the browser reports both things a session needs: `interactionId`, which groups
	 * entries into interactions, and `performance.interactionCount`, which counts the ones
	 * below the reporting threshold. Both are Chromium-only, and without the count
	 * `totalCount` would be indistinguishable from `observedCount`.
	 */
	static isSupported(): boolean {
		if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
			return false;
		}

		if (
			!('PerformanceEventTiming' in window) ||
			!('interactionId' in PerformanceEventTiming.prototype)
		) {
			return false;
		}

		if (!PerformanceObserver.supportedEntryTypes.includes('event')) {
			return false;
		}

		return typeof interactionCount() === 'number';
	}

	/**
	 * Total interactions on the page since page load, including those below the reporting
	 * threshold that no observer ever sees. A property of the page, not of an observer.
	 */
	static readPageInteractionCount(): number {
		return interactionCount() ?? 0;
	}

	private readonly onEntries: (entries: InteractionEntry[]) => void;
	private observer: PerformanceObserver | undefined;

	constructor(onEntries: (entries: InteractionEntry[]) => void) {
		this.onEntries = onEntries;
	}

	/**
	 * Starts reporting interactions from this point on. Does nothing when already started, so
	 * a second call cannot leave an observer running with nobody to disconnect it.
	 *
	 * `buffered` is `false`: the entries the browser collected earlier are interactions with
	 * the page while the editor was still loading, and they belong to no session of ours.
	 */
	start(): void {
		if (this.observer) {
			return;
		}

		this.observer = new PerformanceObserver((list) => {
			// Delay by a microtask to work around a Safari bug where the callback is
			// invoked synchronously rather than in a separate task.
			// See: https://github.com/GoogleChrome/web-vitals/issues/277
			Promise.resolve().then(() => {
				this.onEntries(list.getEntries());
			});
		});

		const init: EventTimingObserverInit = {
			type: 'event',
			buffered: false,
			// 16 ms is also the smallest value the spec honours; lower values are clamped.
			durationThreshold: REPORTING_THRESHOLD_MS,
		};
		this.observer.observe(init);
	}

	/**
	 * Synchronously reports the entries the browser has produced but not yet dispatched to
	 * the callback. A snapshot taken because the page is going away has to include them,
	 * because there is no later chance to.
	 */
	drain(): void {
		const entries = this.observer?.takeRecords();
		if (entries) {
			this.onEntries(entries);
		}
	}

	stop(): void {
		this.observer?.disconnect();
		this.observer = undefined;
	}
}
