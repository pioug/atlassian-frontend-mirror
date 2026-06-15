import { type RefObject, useLayoutEffect, useRef } from 'react';

import { type TPlacementOptions } from './resolve-placement';
import { useAnchorPosition } from './use-anchor-position';

/**
 * A point in viewport coordinates (CSS pixels) at which the synthetic
 * anchor should be placed.
 *
 * Axis-named (`x`/`y`) rather than edge-named (`left`/`top`) so the
 * shape is unambiguous in RTL writing modes - there is no ambiguity
 * about whether a coordinate is logical (`inline-start`/`block-start`)
 * or physical (`left`/`top`). Viewport coordinates are always
 * physical, so we name them with the physical axis labels.
 */
export type TAnchorPoint = {
	x: number;
	y: number;
};

/**
 * Styles the synthetic anchor as an invisible, zero-size point.
 * Dynamic `inset-*` overrides are written by the positioning effect.
 *
 * Uses `Object.assign` rather than Compiled CSS (element is outside the React tree)
 * or the internal `setStyle` helper (we own this element entirely - it is created
 * and removed by this hook - so the snapshot/restore semantics `setStyle`
 * provides for caller-owned elements would be dead work here).
 */
function applyStaticAnchorStyles(element: HTMLElement): void {
	Object.assign(element.style, {
		position: 'fixed',
		// `top`/`left` rather than `inset-block-start`/`inset-inline-start`
		// for consistency with the dynamic positioning effect below, which
		// uses physical properties (see comment there for the rationale).
		top: '0',
		left: '0',
		// Zero size - placement decides which side the popover sits on.
		width: '0',
		height: '0',
		// Prevent the overlay from intercepting pointer events.
		pointerEvents: 'none',
	});
}

// `useAnchorPosition` requires a real DOM element. When the caller only
// has a viewport coordinate (e.g. cursor at hover time), this hook
// manages a hidden `<div>` at that point and delegates the rest.
//
// The `<div>` is appended directly to `document.body` to escape any
// transformed ancestor, which would otherwise break `position: fixed`
// viewport-relative resolution.

/**
 * Positions a popover at a consumer-supplied viewport coordinate using a
 * hidden synthetic anchor.
 *
 * @example
 * ```tsx
 * function PointPositionedPopover({ popoverRef, placement, mousePos }) {
 *   useAnchorPositionAtPoint({
 *     popoverRef,
 *     placement,
 *     isEnabled: Boolean(mousePos),
 *     getPoint: () => {
 *       if (!mousePos) return null;
 *       return { x: mousePos.clientX, y: mousePos.clientY };
 *     },
 *   });
 *   return <Popover ref={popoverRef}>...</Popover>;
 * }
 * ```
 */
export function useAnchorPositionAtPoint({
	popoverRef,
	placement,
	getPoint,
	isEnabled = true,
	isOpen,
}: {
	/**
	 * Element being positioned. Passed to `useAnchorPosition`.
	 */
	popoverRef: RefObject<HTMLElement | null>;
	/**
	 * Where the popover sits relative to the anchor.
	 */
	placement: TPlacementOptions;
	/**
	 * Lazy callback returning the viewport coordinate to anchor at.
	 * Called once per activation (every `isEnabled: false → true`
	 * transition); the result is latched and not re-read.
	 *
	 * Return `null` to signal "no point yet" - the hook stays in a
	 * no-DOM state so another positioning strategy can own the popover.
	 *
	 * Read from a ref, so it does not need to be memoized.
	 */
	getPoint: () => TAnchorPoint | null;
	/**
	 * When `false`, the hook is a no-op: no synthetic anchor is created
	 * and no positioning is applied. Defaults to `true`.
	 */
	isEnabled?: boolean;
	/**
	 * Whether the popover is currently open. Forwarded to the inner
	 * `useAnchorPosition` so it re-runs across host remount cycles.
	 */
	isOpen: boolean;
}): void {
	const syntheticAnchorRef = useRef<HTMLDivElement | null>(null);

	// `getPoint` is kept in a ref so the layout effect can call the
	// latest version without listing it as a dep - that would re-fire
	// on every render and re-latch the point.
	const getPointRef = useRef(getPoint);
	getPointRef.current = getPoint;

	// Lazy element creation: the `<div>` is only created when both
	// `isEnabled` is true AND `getPoint()` returns a non-null point.
	// `useLayoutEffect` ensures the element exists before the inner
	// `useAnchorPosition` (also a layout effect) reads the ref.
	useLayoutEffect(() => {
		if (!isEnabled) {
			return;
		}

		const point = getPointRef.current();
		if (!point) {
			return;
		}

		const anchor = document.createElement('div');
		anchor.setAttribute('aria-hidden', 'true');
		applyStaticAnchorStyles(anchor);
		// `point.x`/`y` are physical viewport coordinates (from
		// `MouseEvent.clientX/Y`), so map directly onto physical
		// `left`/`top`. This is RTL-safe: `position: fixed` + physical
		// insets is direction-independent. Using logical
		// `inset-inline-start` would need `viewportWidth - point.x` in
		// RTL to land at the same physical pixel.
		anchor.style.top = `${point.y}px`;
		anchor.style.left = `${point.x}px`;
		document.body.appendChild(anchor);
		syntheticAnchorRef.current = anchor;

		return function cleanup() {
			anchor.remove();
			syntheticAnchorRef.current = null;
		};
	}, [isEnabled]);

	// Mirror `isEnabled` so both hooks stay in sync - when disabled,
	// neither this hook nor the inner one touches the popover, leaving
	// any other positioning the consumer has set up free to take effect.
	useAnchorPosition({
		anchorRef: syntheticAnchorRef,
		popoverRef,
		placement,
		isEnabled,
		isOpen,
	});
}
