import { type RefObject, useCallback, useLayoutEffect, useState } from 'react';

import { bind, bindAll } from 'bind-event-listener';

import { readViewport } from './read-viewport';

type TUseReferenceVisibilityArgs = {
	anchor: HTMLElement | null;
	popoverRef: RefObject<HTMLElement | null>;
};

type TVisibility = {
	isReferenceHidden: boolean;
	hasPopperEscaped: boolean;
};

const INITIAL: TVisibility = { isReferenceHidden: false, hasPopperEscaped: false };

function isFullyOutsideViewport(
	rect: DOMRect,
	viewport: { width: number; height: number },
): boolean {
	if (rect.width === 0 && rect.height === 0) {
		return true;
	}
	if (rect.bottom <= 0) {
		return true;
	}
	if (rect.right <= 0) {
		return true;
	}
	if (rect.top >= viewport.height) {
		return true;
	}
	if (rect.left >= viewport.width) {
		return true;
	}
	return false;
}

function isClippingOverflow(value: string): boolean {
	return value === 'auto' || value === 'scroll' || value === 'hidden' || value === 'clip';
}

function isClippedByAncestors(element: HTMLElement): boolean {
	const rect = element.getBoundingClientRect();
	let parent = element.parentElement;
	while (parent) {
		// Read the longhand axis properties directly. The `overflow` shorthand
		// is only populated when both axes share the same value, so reading it
		// alone misses ancestors that set only `overflow-x` or `overflow-y`.
		const style = window.getComputedStyle(parent);
		const clipsHorizontally = isClippingOverflow(style.overflowX);
		const clipsVertically = isClippingOverflow(style.overflowY);
		if (clipsHorizontally || clipsVertically) {
			const parentRect = parent.getBoundingClientRect();
			const horizontallyOutside = rect.right <= parentRect.left || rect.left >= parentRect.right;
			const verticallyOutside = rect.bottom <= parentRect.top || rect.top >= parentRect.bottom;
			if (clipsHorizontally && horizontallyOutside) {
				return true;
			}
			if (clipsVertically && verticallyOutside) {
				return true;
			}
		}
		parent = parent.parentElement;
	}
	return false;
}

/**
 * Exists **only** to preserve API parity with the legacy popper.js
 * implementation. The top-layer popper does not natively expose
 * popper.js's `isReferenceHidden` / `hasPopperEscaped` render-prop
 * modifiers, but existing consumers still branch on those values, so
 * this hook reconstructs them from live DOM measurement.
 *
 * Do not reach for this hook in new code. If you find yourself wanting
 * these signals for a new feature, prefer a first-class top-layer or
 * anchor-positioning primitive instead.
 *
 * - `isReferenceHidden`: the anchor's bounding rect is fully outside the
 *   visual viewport OR is clipped to zero area by any scrollable
 *   ancestor.
 * - `hasPopperEscaped`: the popover surface's rect is fully outside the
 *   visual viewport.
 *
 * Measurement runs in a `useLayoutEffect` so the first paint already
 * reflects the correct values, preventing consumers from animating
 * from `opacity: 1` to `opacity: 0` on mount.
 */
export function useReferenceVisibility({
	anchor,
	popoverRef,
}: TUseReferenceVisibilityArgs): TVisibility {
	const [visibility, setVisibility] = useState<TVisibility>(INITIAL);

	const measure = useCallback(() => {
		if (!anchor) {
			setVisibility((previous) =>
				previous.isReferenceHidden === false && previous.hasPopperEscaped === false
					? previous
					: INITIAL,
			);
			return;
		}
		const viewport = readViewport();
		const anchorRect = anchor.getBoundingClientRect();
		const isReferenceHidden =
			isFullyOutsideViewport(anchorRect, viewport) || isClippedByAncestors(anchor);

		const popoverElement = popoverRef.current;
		const hasPopperEscaped = popoverElement
			? isFullyOutsideViewport(popoverElement.getBoundingClientRect(), viewport)
			: false;

		setVisibility((previous) => {
			if (
				previous.isReferenceHidden === isReferenceHidden &&
				previous.hasPopperEscaped === hasPopperEscaped
			) {
				return previous;
			}
			return { isReferenceHidden, hasPopperEscaped };
		});
	}, [anchor, popoverRef]);

	useLayoutEffect(() => {
		measure();

		if (typeof window === 'undefined') {
			return undefined;
		}

		const cleanups: Array<() => void> = [];

		// Resize observer on the anchor so layout changes update visibility.
		if (anchor && typeof ResizeObserver !== 'undefined') {
			const observer = new ResizeObserver(() => measure());
			observer.observe(anchor);
			cleanups.push(() => observer.disconnect());
		}

		// Scroll + resize: any scroll event in the document can move the
		// anchor in/out of any scrollable ancestor's viewport.
		cleanups.push(
			bindAll(window, [
				{ type: 'scroll', listener: measure, options: { capture: true, passive: true } },
				{ type: 'resize', listener: measure, options: { passive: true } },
			]),
		);

		const visual = window.visualViewport;
		if (visual) {
			cleanups.push(
				bind(visual, { type: 'resize', listener: measure, options: { passive: true } }),
			);
		}

		return () => {
			cleanups.forEach((cleanup) => cleanup());
		};
	}, [anchor, measure]);

	return visibility;
}
