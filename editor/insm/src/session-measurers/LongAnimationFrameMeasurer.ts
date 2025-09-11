import type { INSMSession } from '../insm-session';

type LongAnimationFrameMeasurerOptions = {
	initial: boolean;
	limit: number;
	insmSession: INSMSession;
	reportingThreshold: number;
};

export class LongAnimationFrameMeasurer {
	private observer?: PerformanceObserver;
	private longestAnimationFrames: (PerformanceLongAnimationFrameTiming & {
		runningFeatures: string[];
	})[] = [];
	private options: LongAnimationFrameMeasurerOptions;

	private paused: boolean;
	private minimumIndex = -1;
	private minimumDuration = Infinity;

	constructor(options: LongAnimationFrameMeasurerOptions) {
		this.options = options;
		this.paused = options.insmSession.insm.runningHeavyTasks.size !== 0;

		if (PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')) {
			this.observer = new PerformanceObserver((list) => {
				if (!this.paused) {
					// only handle batches when tracking is not paused
					this.handleBatch(list.getEntries() as PerformanceLongAnimationFrameTiming[]);
				}
			});

			this.observer.observe({ type: 'long-animation-frame', buffered: options.initial });
		}
	}

	private handleBatch(batch: PerformanceLongAnimationFrameTiming[]): void {
		let len = this.longestAnimationFrames.length;

		for (let batchIndex = 0; batchIndex < batch.length; batchIndex++) {
			if (batch[batchIndex].duration < this.options.reportingThreshold) {
				// If the long frame entry had a duration less than the reporting
				// threshold it's not eligible for tracking
				continue;
			}

			const longAnimationFrameEntry = Object.assign(batch[batchIndex], {
				runningFeatures: Array.from(this.options.insmSession.runningFeatures),
			});

			// Not yet at capacity: append and update min tracking incrementally
			if (len < this.options.limit) {
				this.longestAnimationFrames[len] = longAnimationFrameEntry;
				if (len === 0 || longAnimationFrameEntry.duration < this.minimumDuration) {
					this.minimumDuration = longAnimationFrameEntry.duration;
					this.minimumIndex = len;
				}
				len++;
				continue;
			}

			// At capacity: only do work if we beat the current min
			if (longAnimationFrameEntry.duration <= this.minimumDuration) {
				continue;
			}

			// Replace the current min
			this.longestAnimationFrames[this.minimumIndex] = longAnimationFrameEntry;

			let _possiblyNewMinimumIndex = 0;
			let _possibleNewMinimumDuration = this.longestAnimationFrames[0].duration;

			for (let i = 1; i < this.options.limit; i++) {
				if (this.longestAnimationFrames[i].duration < _possibleNewMinimumDuration) {
					_possiblyNewMinimumIndex = i;
					_possibleNewMinimumDuration = this.longestAnimationFrames[i].duration;
				}
			}

			// Update the min tracking
			this.minimumIndex = _possiblyNewMinimumIndex;
			this.minimumDuration = _possibleNewMinimumDuration;
		}
	}

	/**
	 * Pauses tracking
	 */
	pause() {
		this.paused = true;
	}

	/**
	 * Resumes tracking
	 */
	resume() {
		this.paused = false;
	}

	/**
	 * Returns the current tracked longest animation frames sorted by duration
	 */
	get current(): PerformanceLongAnimationFrameTiming[] {
		const copy = this.longestAnimationFrames.slice();
		copy.sort((a, b) => b.duration - a.duration);
		return copy;
	}

	/**
	 * Cleans up the performance tracking (tracking cannot be resumed following this).
	 */
	cleanup() {
		this.observer?.disconnect();
	}
}

// Based on https://github.com/GoogleChrome/web-vitals/blob/1b872cf5f2159e8ace0e98d55d8eb54fb09adfbe/src/types.ts#L129
interface PerformanceScriptTiming extends PerformanceEntry {
	/* Overloading PerformanceEntry */
	readonly startTime: DOMHighResTimeStamp;
	readonly duration: DOMHighResTimeStamp;
	readonly name: string;
	readonly entryType: string;

	readonly invokerType:
		| 'classic-script'
		| 'module-script'
		| 'event-listener'
		| 'user-callback'
		| 'resolve-promise'
		| 'reject-promise';
	readonly invoker: string;
	readonly executionStart: DOMHighResTimeStamp;
	readonly sourceURL: string;
	readonly sourceFunctionName: string;
	readonly sourceCharPosition: number;
	readonly pauseDuration: DOMHighResTimeStamp;
	readonly forcedStyleAndLayoutDuration: DOMHighResTimeStamp;
	readonly window?: Window;
	readonly windowAttribution: 'self' | 'descendant' | 'ancestor' | 'same-page' | 'other';
}

// Based on https://github.com/GoogleChrome/web-vitals/blob/1b872cf5f2159e8ace0e98d55d8eb54fb09adfbe/src/types.ts#L129
interface PerformanceLongAnimationFrameTiming extends PerformanceEntry {
	readonly startTime: DOMHighResTimeStamp;
	readonly duration: DOMHighResTimeStamp;
	readonly name: string;
	readonly entryType: string;
	readonly renderStart: DOMHighResTimeStamp;
	readonly styleAndLayoutStart: DOMHighResTimeStamp;
	readonly blockingDuration: DOMHighResTimeStamp;
	readonly firstUIEventTimestamp: DOMHighResTimeStamp;
	readonly scripts: PerformanceScriptTiming[];
}
