export type LongAnimationFrame = PerformanceEntry & {
	scripts?: LongAnimationFrameScript[];
	styleAndLayoutStart?: number;
};

export type LongAnimationFrameScript = {
	duration: number;
	forcedStyleAndLayoutDuration?: number;
	invokerType?: string;
	sourceFunctionName?: string;
	sourceURL?: string;
	startTime: number;
};

/**
 * Reports the frames the browser took longer than 50 ms to render to `onFrames`. They are what says
 * where the time of a slow interaction went — which script ran the longest while the user waited,
 * and how much of the wait was style and layout — which Event Timing cannot answer.
 *
 * What they say about an interaction is `SlowInteractionList`'s to work out; this only observes.
 */
export class LongAnimationFrameObserver {
	static isSupported(): boolean {
		return (
			typeof PerformanceObserver !== 'undefined' &&
			PerformanceObserver.supportedEntryTypes.includes('long-animation-frame')
		);
	}

	private observer: PerformanceObserver | undefined;

	constructor(private readonly onFrames: (frames: LongAnimationFrame[]) => void) {}

	start(): void {
		if (this.observer || !LongAnimationFrameObserver.isSupported()) {
			return;
		}

		this.observer = new PerformanceObserver((list) => {
			this.onFrames(list.getEntries() as LongAnimationFrame[]);
		});

		// Buffered, as `web-vitals` observes them: a frame reported before the editor mounted can
		// still be the one an interaction right after it ran in.
		this.observer.observe({ type: 'long-animation-frame', buffered: true });
	}

	drain(): void {
		const frames = this.observer?.takeRecords();
		if (frames) {
			this.onFrames(frames as LongAnimationFrame[]);
		}
	}

	stop(): void {
		this.observer?.disconnect();
		this.observer = undefined;
	}
}
