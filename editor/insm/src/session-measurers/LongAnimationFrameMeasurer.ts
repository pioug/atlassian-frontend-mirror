import type { INSMSession } from '../insm-session';

type LongAnimationFrameMeasurerOptions = {
	initial: boolean;
	insmSession: INSMSession;
	limit: number;
	reportingThreshold: number;
};

// Script timing data we want to track
interface TrackedScriptTiming {
	afDuration: number;
	duration: number;
	features: string[];
	forcedStyleAndLayoutDuration: number;
	invoker: string;
	invokerType: string;
	sourceCharPosition: number;
	sourceFunctionName: string;
	sourceURL: string;
}

export class LongAnimationFrameMeasurer {
	private observer?: PerformanceObserver;
	private longestScriptTimings: TrackedScriptTiming[] = [];
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
		for (let batchIndex = 0; batchIndex < batch.length; batchIndex++) {
			const animationFrame = batch[batchIndex];

			// Only process frames that exceed the reporting threshold
			if (animationFrame.duration < this.options.reportingThreshold) {
				continue;
			}

			// Process all scripts in this long animation frame
			if (animationFrame.scripts && animationFrame.scripts.length > 0) {
				for (const script of animationFrame.scripts) {
					this.processScript(script, animationFrame);
				}
			}
		}
	}

	private createScriptTiming(
		script: _PerformanceScriptTiming,
		animationFrame: PerformanceLongAnimationFrameTiming,
	): TrackedScriptTiming {
		return {
			duration: script.duration,
			forcedStyleAndLayoutDuration: script.forcedStyleAndLayoutDuration,
			invoker: script.invoker,
			invokerType: script.invokerType,
			sourceCharPosition: script.sourceCharPosition,
			sourceFunctionName: script.sourceFunctionName,
			sourceURL: script.sourceURL,
			features: Array.from(this.options.insmSession.runningFeatures),
			afDuration: animationFrame.duration,
		};
	}

	private processScript(
		script: _PerformanceScriptTiming,
		animationFrame: PerformanceLongAnimationFrameTiming,
	): void {
		const scriptDuration = script.duration;
		const len = this.longestScriptTimings.length;

		// Not yet at capacity: append and update min tracking incrementally
		if (len < this.options.limit) {
			const scriptTiming = this.createScriptTiming(script, animationFrame);

			this.longestScriptTimings[len] = scriptTiming;

			if (len === 0 || scriptDuration < this.minimumDuration) {
				this.minimumDuration = scriptDuration;
				this.minimumIndex = len;
			}

			return;
		}

		// At capacity: only do work if we beat the current min
		if (scriptDuration <= this.minimumDuration) {
			return;
		}

		const scriptTiming = this.createScriptTiming(script, animationFrame);

		// Replace the current min
		this.longestScriptTimings[this.minimumIndex] = scriptTiming;

		// Find new minimum
		let newMinimumIndex = 0;
		let newMinimumDuration = this.longestScriptTimings[0].duration;

		for (let i = 1; i < this.options.limit; i++) {
			if (this.longestScriptTimings[i].duration < newMinimumDuration) {
				newMinimumIndex = i;
				newMinimumDuration = this.longestScriptTimings[i].duration;
			}
		}

		// Update the min tracking
		this.minimumIndex = newMinimumIndex;
		this.minimumDuration = newMinimumDuration;
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
	 * Returns the current tracked longest script timings sorted by duration
	 */
	get current(): TrackedScriptTiming[] {
		const copy = this.longestScriptTimings.slice();
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
// exported for use in test file
export interface _PerformanceScriptTiming extends PerformanceEntry {
	readonly duration: DOMHighResTimeStamp;
	readonly entryType: string;
	readonly executionStart: DOMHighResTimeStamp;
	readonly forcedStyleAndLayoutDuration: DOMHighResTimeStamp;

	readonly invoker: string;
	readonly invokerType:
		| 'classic-script'
		| 'module-script'
		| 'event-listener'
		| 'user-callback'
		| 'resolve-promise'
		| 'reject-promise';
	readonly name: string;
	readonly pauseDuration: DOMHighResTimeStamp;
	readonly sourceCharPosition: number;
	readonly sourceFunctionName: string;
	readonly sourceURL: string;
	/* Overloading PerformanceEntry */
	readonly startTime: DOMHighResTimeStamp;
	readonly window?: Window;
	readonly windowAttribution: 'self' | 'descendant' | 'ancestor' | 'same-page' | 'other';
}

// Based on https://github.com/GoogleChrome/web-vitals/blob/1b872cf5f2159e8ace0e98d55d8eb54fb09adfbe/src/types.ts#L129
interface PerformanceLongAnimationFrameTiming extends PerformanceEntry {
	readonly blockingDuration: DOMHighResTimeStamp;
	readonly duration: DOMHighResTimeStamp;
	readonly entryType: string;
	readonly firstUIEventTimestamp: DOMHighResTimeStamp;
	readonly name: string;
	readonly renderStart: DOMHighResTimeStamp;
	readonly scripts: _PerformanceScriptTiming[];
	readonly startTime: DOMHighResTimeStamp;
	readonly styleAndLayoutStart: DOMHighResTimeStamp;
}
