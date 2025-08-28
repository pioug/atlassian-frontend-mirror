import type { Measure, PeriodMeasurer } from '../types';

interface PerformanceEventTiming extends PerformanceEntry {
	interactionId?: number;
}

type Interaction = 'pointerdown' | 'pointerup' | 'click' | 'keydown' | 'keyup';

type INPTrackerOptions = {
	/**
	 * The interactions that should be included in the INP calculation.
	 * If none provided then 'pointerdown', 'pointerup', 'click', 'keydown', and 'keyup' are used.
	 */
	includedInteractions?: Interaction[];
};

export class INPTracker implements PeriodMeasurer {
	/**
	 * INP stands for Interaction to Next Paint
	 */
	name = 'inp';

	monitor: InteractionTracker;

	includedInteractions: Interaction[];

	constructor(options?: INPTrackerOptions) {
		this.includedInteractions = options?.includedInteractions || [
			'pointerdown',
			'pointerup',
			'click',
			'keydown',
			'keyup',
		];
		this.monitor = new InteractionTracker(this.includedInteractions);
	}

	start(paused: boolean) {
		const result = this.monitor.start(paused);
		return result;
	}

	end() {
		const result = this.monitor.end();
		return result;
	}

	pause(): void {
		this.monitor.pause();
	}

	resume(): void {
		this.monitor.resume();
	}
}

class InteractionResult {
	private min: number;
	private max: number;
	private average: number;
	private numerator: number;
	private count: number;

	constructor() {
		this.min = Infinity;
		this.max = 0;
		this.average = 0;
		this.numerator = 0;
		this.count = 0;
	}

	update(duration: number) {
		if (duration > this.max) {
			this.max = duration;
		}
		if (duration < this.min) {
			this.min = duration;
		}
		this.numerator += this.average * (this.count - 1) + duration;
		this.count += 1;
		this.average = this.numerator / this.count;
	}

	toMeasure(): Measure {
		return {
			min: this.count === 0 ? 0 : this.min,
			max: this.max,
			average: this.average,
			numerator: this.numerator,
			denominator: this.count,
		};
	}
}

class InteractionTracker {
	paused: boolean = false;

	private performanceObserver: PerformanceObserver | null;
	private interactionResult: InteractionResult;
	private includedInteractions: Interaction[];

	constructor(includedInteractions: Interaction[]) {
		this.performanceObserver = null;
		this.interactionResult = new InteractionResult();
		this.includedInteractions = includedInteractions;
	}

	private stopTracking() {
		this.performanceObserver?.disconnect();
		this.performanceObserver = null;
	}

	private startTracking() {
		this.performanceObserver = new PerformanceObserver((list) => {
			// Note: find link to actual safari issue .. good to get rid of this if Safari has fixed this
			// Delay by a microtask to workaround a bug in Safari where the
			// callback is invoked immediately, rather than in a separate task.
			// See: https://github.com/GoogleChrome/web-vitals/issues/277
			Promise.resolve().then(() => {
				const entries = list.getEntries() as PerformanceEventTiming[];
				entries.forEach((entry) => {
					// Skip further processing for entries that cannot be INP candidates.
					//
					// When a user interacts with a web page, a user interaction (for example a click) usually triggers a sequence of events.
					// To measure the latency of this series of events, the events share the same interactionId.
					// An interactionId is only computed for the following event types belonging to a user interaction. It is 0 otherwise.
					// * click / tap / drag events: 'pointerdown', 'pointerup', 'click'
					// * keypress events: 'keydown', 'keyup'
					//
					if (!entry.interactionId) {
						return;
					}
					if (this.includedInteractions.includes(entry.name as Interaction)) {
						this.interactionResult.update(entry.duration);
					}
				});
			});
		});

		// Event Timing entries have their durations rounded to the nearest 8ms,
		// so a duration of 40ms would be any event that spans 2.5 or more frames
		// at 60Hz. This threshold is chosen to strike a balance between usefulness
		// and performance. Running this callback for any interaction that spans
		// just one or two frames is likely not worth the insight that could be
		// gained.
		if (PerformanceObserver.supportedEntryTypes.includes('event')) {
			this.performanceObserver.observe({
				type: 'event',
				buffered: true,
				durationThreshold: 40,
			} as PerformanceObserverInit);
		}
	}

	private reset() {
		this.stopTracking();
		this.interactionResult = new InteractionResult();
	}

	start(paused: boolean) {
		const lastResult = this.interactionResult.toMeasure();
		this.reset();
		this.paused = paused;
		if (!paused) {
			this.startTracking();
		}
		return lastResult;
	}

	end() {
		try {
			return this.interactionResult.toMeasure();
		} finally {
			this.reset();
		}
	}

	pause() {
		if (this.paused) {
			return;
		}
		this.paused = true;
		this.stopTracking();
	}

	resume() {
		if (!this.paused) {
			return;
		}
		this.paused = false;
		this.startTracking();
	}
}
