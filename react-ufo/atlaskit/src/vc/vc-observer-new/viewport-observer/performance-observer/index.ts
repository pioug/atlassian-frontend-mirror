import { withProfiling } from '../../../../self-measurements';

// The LayoutShiftAttribution API is returning the numbers on physical dimension
export const convertPhysicalToLogicalResolution = withProfiling(
	function convertPhysicalToLogicalResolution(rect: DOMRect) {
		if (typeof window.devicePixelRatio !== 'number') {
			return rect;
		}

		if (window.devicePixelRatio === 1) {
			return rect;
		}

		// eslint-disable-next-line compat/compat
		return new DOMRect(
			rect.x / window.devicePixelRatio,
			rect.y / window.devicePixelRatio,
			rect.width / window.devicePixelRatio,
			rect.height / window.devicePixelRatio,
		);
	},
	['vc'],
);

type LayoutShiftAttribution = {
	currentRect: DOMRectReadOnly;
	node: HTMLElement;
	previousRect: DOMRectReadOnly;
};
type ChangedRect = Array<{
	node: HTMLElement;
	rect: DOMRectReadOnly;
	previousRect: DOMRectReadOnly;
}>;
export type CreatePerformanceObserverArgs = {
	onLayoutShift: (args: { time: DOMHighResTimeStamp; changedRects: ChangedRect }) => void;
};

const createPerformanceObserver = withProfiling(
	function createPerformanceObserver(args: CreatePerformanceObserverArgs) {
		if (!window || typeof window.PerformanceObserver !== 'function') {
			return null;
		}

		const onLayoutShift = withProfiling(args.onLayoutShift, ['vc']);

		const performanceObserverCallback: PerformanceObserverCallback = withProfiling(
			function performanceObserverCallback(entries) {
				for (const entry of entries.getEntries()) {
					if (entry.entryType === 'layout-shift') {
						// Ignored via go/ees005
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const changedRects = ((entry as any).sources as LayoutShiftAttribution[]).reduceRight(
							(acc, attr) => {
								acc.push({
									rect: convertPhysicalToLogicalResolution(attr.currentRect),
									previousRect: convertPhysicalToLogicalResolution(attr.previousRect),
									node: attr.node,
								});

								return acc;
							},
							[] as ChangedRect,
						);

						onLayoutShift({
							time: entry.startTime,
							changedRects,
						});
					}
				}
			},
			['vc'],
		);

		const observer = new PerformanceObserver(performanceObserverCallback);

		return observer;
	},
	['vc'],
);

export default createPerformanceObserver;
