import type { HeatmapEntrySource } from './types';

const isBrowserSupported =
	typeof window.IntersectionObserver === 'function' &&
	typeof window.MutationObserver === 'function';

function isValidEntry(entry: IntersectionObserverEntry) {
	return (
		entry.isIntersecting && entry.intersectionRect.width > 0 && entry.intersectionRect.height > 0
	);
}

export type CreateMutationObserverProps = {
	onAttributeMutation: (props: { target: HTMLElement }) => void;

	onMutationFinished: (props: { targets: Array<HTMLElement> }) => void;
	onChildListMutation: (props: {
		addedNodes: ReadonlyArray<HTMLElement>;
		removedNodes: ReadonlyArray<HTMLElement>;
	}) => void;
};

export function createMutationObserver({
	onAttributeMutation,
	onChildListMutation,
	onMutationFinished,
}: CreateMutationObserverProps) {
	if (!isBrowserSupported) {
		return null;
	}

	const observer = new MutationObserver((mutations) => {
		const addedNodes: Array<HTMLElement> = [];
		const removedNodes: Array<HTMLElement> = [];
		const targets: Array<HTMLElement> = [];

		for (const mut of mutations) {
			if (!(mut.target instanceof HTMLElement)) {
				continue;
			}
			if (mut.type === 'attributes') {
				onAttributeMutation({
					target: mut.target,
				});
				continue;
			} else if (mut.type === 'childList') {
				(mut.addedNodes || []).forEach((node: Node) => {
					if (node instanceof HTMLElement) {
						addedNodes.push(node);
					}
				});

				(mut.removedNodes || []).forEach((node: Node) => {
					if (node instanceof HTMLElement) {
						removedNodes.push(node);
					}
				});
			}

			targets.push(mut.target);
		}

		onChildListMutation({
			addedNodes,
			removedNodes,
		});

		onMutationFinished({
			targets,
		});
	});

	return observer;
}

type DoTag = (props: {
	target: HTMLElement;
	rect: DOMRectReadOnly;
}) => HeatmapEntrySource | undefined | null;

export interface TaintedIntersectionObserver {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	disconnect(): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	unobserve(target: Element): void;
	watchAndTag: (target: Element, cbOrTag: DoTag | HeatmapEntrySource) => void;
}

export function createIntersectionObserver(props: {
	onEntry: (entry: {
		target: HTMLElement;
		rect: DOMRectReadOnly;
		startTime: DOMHighResTimeStamp;
		taintedTag: HeatmapEntrySource;
	}) => void;
	onObserved: (props: {
		startTime: DOMHighResTimeStamp;
		elements: ReadonlyArray<WeakRef<HTMLElement>>;
	}) => void;
}): TaintedIntersectionObserver | null {
	if (!isBrowserSupported) {
		return null;
	}

	const callbacksPerElement = new WeakMap<Element, DoTag | HeatmapEntrySource>();
	const observer = new IntersectionObserver((entries) => {
		const validEntries: Array<WeakRef<HTMLElement>> = [];
		const startTime = performance.now();
		// Reversing the entries is important because the
		// inner nodes should get be sent first to the observers
		entries.reverse().forEach((entry) => {
			if (!(entry.target instanceof HTMLElement) || !isValidEntry(entry)) {
				return;
			}
			let customTag: HeatmapEntrySource | undefined | null = null;

			const doTag = callbacksPerElement.get(entry.target);
			if (typeof doTag === 'function') {
				customTag = doTag({
					target: entry.target,
					rect: entry.intersectionRect,
				});
			} else if (typeof doTag === 'string') {
				customTag = doTag;
			}

			props.onEntry({
				target: entry.target,
				rect: entry.intersectionRect,
				startTime: entry.time,
				taintedTag: customTag || 'mutation',
			});
			validEntries.push(new WeakRef(entry.target));

			callbacksPerElement.delete(entry.target);
			observer.unobserve(entry.target);
		});

		props.onObserved({
			startTime,
			elements: validEntries,
		});
	});

	return {
		disconnect: () => {
			observer.disconnect();
		},
		unobserve: (target: Element) => {
			observer.unobserve(target);
		},
		watchAndTag: (target: Element, cbOrTag) => {
			callbacksPerElement.set(target, cbOrTag);

			observer.observe(target);
		},
	};
}

// The LayoutShiftAttribution API is returning the numbers on physical dimension
export function convertPhysicalToLogicalResolution(rect: DOMRect) {
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
type CreatePerformanceObserverProps = {
	onFirstPaint: (startTime: DOMHighResTimeStamp) => void;
	onFirstContentfulPaint: (startTime: DOMHighResTimeStamp) => void;
	onLongTask: (props: { startTime: DOMHighResTimeStamp; duration: number }) => void;
	onLayoutShift: (props: { startTime: DOMHighResTimeStamp; changedRects: ChangedRect }) => void;
};
export function createPerformanceObserver(props: CreatePerformanceObserverProps) {
	if (typeof window.PerformanceObserver !== 'function') {
		return null;
	}

	const observer = new PerformanceObserver((entries) => {
		for (const entry of entries.getEntries()) {
			if (entry.name === 'first-paint') {
				props.onFirstPaint(entry.startTime);
			} else if (entry.name === 'first-contentful-paint') {
				props.onFirstContentfulPaint(entry.startTime);
			} else if (entry.entryType === 'longtask') {
				props.onLongTask({ startTime: entry.startTime, duration: entry.duration });
			} else if (entry.entryType === 'layout-shift') {
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

				props.onLayoutShift({
					startTime: entry.startTime,
					changedRects,
				});
			}
		}
	});

	return observer;
}
