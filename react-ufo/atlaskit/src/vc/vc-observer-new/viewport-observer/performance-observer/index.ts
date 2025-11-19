// The LayoutShiftAttribution API is returning the numbers on physical dimension
export function convertPhysicalToLogicalResolution(rect: DOMRect): DOMRect {
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
}

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

function createPerformanceObserver({
	onLayoutShift,
}: CreatePerformanceObserverArgs): PerformanceObserver | null {
	if (!window || typeof window.PerformanceObserver !== 'function') {
		return null;
	}

	const performanceObserverCallback: PerformanceObserverCallback = (entries) => {
		for (const entry of entries.getEntries()) {
			if (entry.entryType === 'layout-shift' && 'sources' in entry) {
				// see https://developer.mozilla.org/en-US/docs/Web/API/LayoutShiftAttribution for more info
				const changedRects = (entry.sources as LayoutShiftAttribution[]).reduceRight(
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
	};

	const observer = new PerformanceObserver(performanceObserverCallback);

	return observer;
}

export default createPerformanceObserver;
