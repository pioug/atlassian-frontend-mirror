import {
	useCallback,
	useEffect,
	useLayoutEffect as useRealLayoutEffect,
	useRef,
	useState,
} from 'react';

// The ellipsis trigger is a compact IconButton (24px) plus the trailing separator (24px).
const ELLIPSIS_WIDTH_ESTIMATE = 48;

// Measurements need layout timing in the browser, but should be a no-op for SSR.
const useLayoutEffect: typeof useEffect =
	typeof window === 'undefined' ? useEffect : useRealLayoutEffect;

function setsEqual(a: Set<number>, b: Set<number>): boolean {
	if (a.size !== b.size) {
		return false;
	}
	for (const v of a) {
		if (!b.has(v)) {
			return false;
		}
	}
	return true;
}

function getMiddleOutCollapseOrder(itemCount: number): number[] {
	const lastIndex = itemCount - 1;
	const middleIndex = Math.floor((itemCount - 1) / 2);
	const collapseOrder: number[] = [];

	if (middleIndex > 0 && middleIndex < lastIndex) {
		collapseOrder.push(middleIndex);
	}

	for (let distance = 1; distance < itemCount; distance++) {
		const leftIndex = middleIndex - distance;
		const rightIndex = middleIndex + distance;

		if (leftIndex > 0) {
			collapseOrder.push(leftIndex);
		}

		if (rightIndex < lastIndex) {
			collapseOrder.push(rightIndex);
		}
	}

	return collapseOrder;
}

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default function useOverflowCollapse(itemCount: number): {
	collapsedIndices: Set<number>;
	naturalWidthsReady: boolean;
	registerItem: (index: number) => (el: HTMLLIElement | null) => void;
	registerContainer: (el: HTMLElement | null) => void;
} {
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
	const containerRef = useRef<HTMLElement | null>(null);
	const naturalWidths = useRef<number[]>([]);
	const naturalWidthsReady = useRef(false);
	const [naturalWidthsReadyState, setNaturalWidthsReadyState] = useState(false);
	const [collapsedIndices, setCollapsedIndices] = useState<Set<number>>(new Set());

	// Intentionally runs after each render until refs have committed and natural widths are measured.
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useLayoutEffect(() => {
		if (naturalWidthsReady.current) {
			return;
		}
		const widths = itemRefs.current.map((el) => el?.offsetWidth ?? 0);
		if (widths.some((w) => w > 0)) {
			naturalWidths.current = widths;
			naturalWidthsReady.current = true;
			setNaturalWidthsReadyState(true);
		}
	});

	const recalculate = useCallback(() => {
		const container = containerRef.current;
		if (!container || !naturalWidthsReady.current) {
			return;
		}

		const availableWidth = container.offsetWidth;
		const widths = naturalWidths.current;

		if (itemCount <= 2) {
			setCollapsedIndices((prev) => (prev.size === 0 ? prev : new Set()));
			return;
		}

		const totalWidth = widths.reduce((sum, w) => sum + w, 0);
		if (totalWidth <= availableWidth) {
			setCollapsedIndices((prev) => (prev.size === 0 ? prev : new Set()));
			return;
		}

		let usedWidth = totalWidth;
		const newCollapsed = new Set<number>();

		for (const index of getMiddleOutCollapseOrder(itemCount)) {
			if (newCollapsed.size === 0) {
				usedWidth += ELLIPSIS_WIDTH_ESTIMATE;
			}

			newCollapsed.add(index);
			usedWidth -= widths[index] ?? 0;

			if (usedWidth <= availableWidth) {
				break;
			}
		}

		// At the smallest sizes, even first + ellipsis + last may not fit.
		// In that case, also collapse the first item so only ellipsis + last is shown.
		// Note: this branch is only reachable when itemCount > 2 (the early return above
		// handles itemCount <= 2), so collapsing index 0 here always leaves at least one
		// visible item (the last) plus the ellipsis trigger.
		if (usedWidth > availableWidth) {
			newCollapsed.add(0);
		}

		setCollapsedIndices((prev) => (setsEqual(prev, newCollapsed) ? prev : newCollapsed));
	}, [itemCount]);

	const registerItem = useCallback(
		(index: number) => (el: HTMLLIElement | null) => {
			itemRefs.current[index] = el;
		},
		[],
	);

	const observerRef = useRef<ResizeObserver | null>(null);

	const registerContainer = useCallback(
		(el: HTMLElement | null) => {
			// Disconnect any existing observer
			observerRef.current?.disconnect();
			containerRef.current = el;

			if (!el) {
				return;
			}

			if (typeof ResizeObserver === 'undefined') {
				return;
			}

			// Set up ResizeObserver immediately when container mounts
			const observer = new ResizeObserver(() => {
				recalculate();
			});
			observer.observe(el);
			observerRef.current = observer;
		},
		[recalculate],
	);

	useEffect(() => {
		if (naturalWidthsReadyState) {
			recalculate();
		}
	}, [naturalWidthsReadyState, recalculate]);

	// Cleanup observer on unmount
	useEffect(() => {
		return () => {
			observerRef.current?.disconnect();
		};
	}, []);

	useEffect(() => {
		naturalWidthsReady.current = false;
		naturalWidths.current = [];
		setNaturalWidthsReadyState(false);
		setCollapsedIndices(new Set());
	}, [itemCount]);

	return {
		collapsedIndices,
		naturalWidthsReady: naturalWidthsReadyState,
		registerItem,
		registerContainer,
	};
}
