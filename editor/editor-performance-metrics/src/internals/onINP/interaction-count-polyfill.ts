// Adapted from https://github.com/GoogleChrome/web-vitals/blob/main/src/lib/polyfills/interactionCountPolyfill.ts
declare global {
	interface Performance {
		interactionCount: number;
	}
}
interface PerformanceEventTiming extends PerformanceEntry {
	interactionId?: number;
}

export class InteractionCountPolyfill {
	private interactionCountEstimate = 0;
	private minKnownInteractionId = Infinity;
	private maxKnownInteractionId = 0;
	private po: PerformanceObserver | undefined;

	public constructor() {
		if ('interactionCount' in performance || this.po) {
			return;
		}
		if (!PerformanceObserver.supportedEntryTypes.includes('event')) {
			return;
		}

		this.po = new PerformanceObserver((list) => {
			// Delay by a microtask to workaround a bug in Safari where the
			// callback is invoked immediately, rather than in a separate task.
			// See: https://github.com/GoogleChrome/web-vitals/issues/277
			Promise.resolve().then(() => {
				this.updateEstimate(list.getEntries() as PerformanceEventTiming[]);
			});
		});

		this.po.observe({
			type: 'event',
			buffered: true,
			durationThreshold: 0,
		} as PerformanceObserverInit);
	}

	public cleanup(): void {
		this.po?.disconnect();
	}

	private updateEstimate(entries: PerformanceEventTiming[]): void {
		entries.forEach((e) => {
			if (e.interactionId) {
				this.minKnownInteractionId = Math.min(this.minKnownInteractionId, e.interactionId);
				this.maxKnownInteractionId = Math.max(this.maxKnownInteractionId, e.interactionId);

				this.interactionCountEstimate = this.maxKnownInteractionId
					? (this.maxKnownInteractionId - this.minKnownInteractionId) / 7 + 1
					: 0;
			}
		});
	}

	/**
	 * Returns the `interactionCount` value using the native API (if available)
	 * or the polyfill estimate in this module.
	 */
	public getInteractionCount(): number {
		return this.po ? this.interactionCountEstimate : performance.interactionCount || 0;
	}
}
