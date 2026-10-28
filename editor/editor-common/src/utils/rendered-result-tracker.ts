import { bind } from 'bind-event-listener';

export type RenderedResultTracker = {
	destroy: () => void;
	observe: (element: HTMLElement | null) => void;
	ready: (resultId: string) => void;
	setResult: (resultId: string) => void;
};

export function createRenderedResultTracker({
	onRendered,
}: {
	onRendered: (resultId: string) => void;
}): RenderedResultTracker {
	let resultId: string | undefined;
	let ready = false;
	let intersects = false;
	let element: HTMLElement | null = null;
	let observer: IntersectionObserver | undefined;
	let unbindVisibility: (() => void) | undefined;
	let destroyed = false;
	const emitted = new Set<string>();

	const updateIntersection = (entries: IntersectionObserverEntry[]) => {
		for (const entry of entries) {
			if (entry.target === element) {
				intersects = entry.isIntersecting && entry.intersectionRatio > 0;
			}
		}
	};

	const emit = () => {
		if (destroyed || !ready || resultId === undefined || emitted.has(resultId)) {
			return;
		}
		updateIntersection(observer?.takeRecords() ?? []);
		if (!intersects || element?.ownerDocument.visibilityState !== 'visible') {
			return;
		}
		emitted.add(resultId);
		onRendered(resultId);
	};

	const disconnect = () => {
		observer?.disconnect();
		observer = undefined;
		unbindVisibility?.();
		unbindVisibility = undefined;
		intersects = false;
	};

	return {
		setResult: (nextResultId) => {
			if (resultId !== nextResultId) {
				resultId = nextResultId;
				ready = false;
			}
		},
		ready: (renderedResultId) => {
			if (resultId === renderedResultId) {
				ready = true;
				emit();
			}
		},
		observe: (nextElement) => {
			if (destroyed || element === nextElement) {
				return;
			}
			disconnect();
			element = nextElement;
			if (element) {
				observer = new IntersectionObserver(
					(entries) => {
						updateIntersection(entries);
						emit();
					},
					{
						// The root property identifies what to observe in the viewport
						// `null` will use the owning document (most likely the browser window)
						root: null,
						// Detect when overlap reaches 0.1% of the element's area
						threshold: [0, 0.001],
					},
				);
				observer.observe(element);
				unbindVisibility = bind(element.ownerDocument, {
					type: 'visibilitychange',
					listener: emit,
				});
			}
		},
		destroy: () => {
			destroyed = true;
			disconnect();
			element = null;
		},
	};
}
