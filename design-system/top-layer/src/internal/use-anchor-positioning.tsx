import { type RefObject, useId, useLayoutEffect } from 'react';

import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import once from '@atlaskit/ds-lib/once';

import { type TArrowPreset } from '../arrow/types';
import { type TPlacementOptions } from '../popup/types';

import { computeFallbackPosition } from './anchor-positioning-fallback';
import { combine } from './combine';
import { getPlacement, type TPlacement } from './resolve-placement';
import { setStyle } from './set-style';

export { getPlacement } from './resolve-placement';

/**
 * Resolves placement options to CSS `position-area` syntax.
 *
 * The `align` field represents the *visual* alignment:
 * - `align: 'start'` means "aligned to the trigger's start edge" (left in LTR for block axis)
 * - `align: 'end'` means "aligned to the trigger's end edge"
 * - `align: 'center'` means centered (single-axis position-area)
 *
 * CSS `position-area` uses `span-*` keywords which indicate the *expansion direction*.
 * Visual start-alignment requires `span-{cross-axis}-end` (expand toward end = start-aligned).
 * This function handles the inversion internally.
 *
 * @example
 * placementToPositionArea({ placement: { axis: 'block', edge: 'end', align: 'center' } }) // → 'block-end'
 * placementToPositionArea({ placement: { axis: 'block', edge: 'end', align: 'start' } }) // → 'block-end span-inline-end'
 * placementToPositionArea({ placement: { axis: 'block', edge: 'end', align: 'end' } })   // → 'block-end span-inline-start'
 */
export function placementToPositionArea({ placement }: { placement: TPlacementOptions }): string {
	const { axis, edge, align } = getPlacement({ placement });
	const edgeValue = `${axis}-${edge}`;

	if (align === 'center') {
		return edgeValue;
	}

	// Cross-axis name: block ↔ inline
	const crossAxis = axis === 'block' ? 'inline' : 'block';
	// Invert align → CSS span direction: visual 'start' → span toward 'end'
	const spanDir = align === 'start' ? 'end' : 'start';
	return `${edgeValue} span-${crossAxis}-${spanDir}`;
}

/**
 * Returns `position-try-fallbacks` value based on placement.
 *
 * For centered placements, includes cross-axis aligned position-area
 * values so the browser can shift the popover along the cross-axis
 * when the centered position would overflow the viewport edge.
 *
 * Fallback order for centered placements (e.g. `block-end`):
 * 1. Same edge, start-aligned (shift for near-edge overflow)
 * 2. Same edge, end-aligned (shift for far-edge overflow)
 * 3. Flipped edge, centered
 * 4. Flipped edge, start-aligned
 * 5. Flipped edge, end-aligned
 *
 * For aligned placements (start/end), includes the same-edge centered
 * position as fallbacks so the browser can try centering when the aligned
 * position would overflow, before flipping to the opposite edge.
 */
export function placementToTryFallbacks({ placement }: { placement: TPlacementOptions }): string {
	const { axis, edge, align } = getPlacement({ placement });
	const crossAxis = axis === 'block' ? 'inline' : 'block';
	const flippedEdge = edge === 'start' ? 'end' : 'start';

	if (align !== 'center') {
		const sameEdge = `${axis}-${edge}`;
		const oppositeEdge = `${axis}-${flippedEdge}`;
		const flipKeyword = axis === 'block' ? 'flip-block' : 'flip-inline';
		// Legacy Popper fallbacks for e.g. bottom-start: [bottom, bottom-end, top-start, top, top-end, auto].
		// Include same-edge centered so the browser can try center when start/end would overflow.
		return [
			`${sameEdge} span-${crossAxis}-${align === 'start' ? 'end' : 'start'}`,
			sameEdge,
			`${sameEdge} span-${crossAxis}-${align === 'start' ? 'start' : 'end'}`,
			flipKeyword,
			`${oppositeEdge} span-${crossAxis}-${align === 'start' ? 'end' : 'start'}`,
			oppositeEdge,
			`${oppositeEdge} span-${crossAxis}-${align === 'start' ? 'start' : 'end'}`,
		].join(', ');
	}

	const sameEdge = `${axis}-${edge}`;
	const oppositeEdge = `${axis}-${flippedEdge}`;
	const flipKeyword = axis === 'block' ? 'flip-block' : 'flip-inline';

	return [
		`${sameEdge} span-${crossAxis}-end`,
		`${sameEdge} span-${crossAxis}-start`,
		flipKeyword,
		`${oppositeEdge} span-${crossAxis}-end`,
		`${oppositeEdge} span-${crossAxis}-start`,
	].join(', ');
}

/**
 * Detects whether the browser supports CSS Anchor Positioning.
 * Uses `once()` for lazy evaluation — safe for SSR and avoids hydration mismatches.
 */
const supportsAnchorPositioning = once((): boolean => {
	if (typeof window === 'undefined' || typeof CSS === 'undefined' || typeof CSS.supports !== 'function') {
		return false;
	}
	return CSS.supports('anchor-name', '--a');
});

/**
 * Default gap between the popover and its trigger (in pixels).
 * Maps to `space.100` (8px) in the design token scale.
 */
const DEFAULT_OFFSET = 8;

/**
 * Returns the CSS margin declaration that creates a gap between the
 * popover and its trigger on the side facing the anchor.
 *
 * For example, a `block-end` placement (popover below) gets
 * `margin-block-start: 8px` to push it away from the trigger's bottom edge.
 */
function edgeMargin({ placement, offset }: { placement: TPlacement; offset: number }): {
	property: string;
	value: string;
} {
	const { axis, edge } = placement;
	const value = `${offset}px`;

	if (axis === 'block' && edge === 'end') {
		return { property: 'margin-block-start', value };
	}
	if (axis === 'block' && edge === 'start') {
		return { property: 'margin-block-end', value };
	}
	if (axis === 'inline' && edge === 'end') {
		return { property: 'margin-inline-start', value };
	}
	if (axis === 'inline' && edge === 'start') {
		return { property: 'margin-inline-end', value };
	}
	return { property: 'margin-block-start', value };
}

/**
 * Hook that positions an element relative to an anchor element using
 * CSS Anchor Positioning (with a JS fallback for older browsers).
 *
 * This hook is the positioning primitive — it has no knowledge of popovers,
 * visibility, or animation. Compose it with `Popover` for anchor-positioned
 * top-layer content.
 *
 * When CSS Anchor Positioning is supported, it sets CSS properties
 * (`anchor-name`, `position-anchor`, `position-area`, `position-try-fallbacks`)
 * directly on the elements via `el.style.setProperty()`.
 *
 * When not supported, it falls back to JavaScript-based positioning using
 * `position: fixed` with measured coordinates, re-running on scroll (capture)
 * and resize events.
 */
export function useAnchorPosition({
	anchorRef,
	popoverRef,
	placement,
	offset = DEFAULT_OFFSET,
	forceFallbackPositioning = false,
	arrow,
}: {
	/**
	 * Element to position relative to.
	 */
	anchorRef: RefObject<HTMLElement | null>;
	/**
	 * Element being positioned (typically a popover).
	 */
	popoverRef: RefObject<HTMLElement | null>;
	/**
	 * Where to place the element relative to the anchor.
	 */
	placement: TPlacementOptions;
	/**
	 * Gap between the positioned element and the anchor, in pixels.
	 * Defaults to 8 (`space.100`). Tooltip uses 4.
	 */
	offset?: number;
	/**
	 * Forces the JavaScript positioning fallback even when the browser
	 * supports CSS Anchor Positioning. Useful for testing fallback
	 * behavior in any environment, including production.
	 */
	forceFallbackPositioning?: boolean;
	/**
	 * Arrow preset from `@atlaskit/top-layer/arrow`. When provided, uses
	 * the preset's named `@position-try` rules (which update both
	 * `position-area` and `margin` on flip) and sets `--ds-arrow-size`.
	 *
	 * Pass `null` to disable. Has no effect in the JS fallback path —
	 * arrows are CSS-only.
	 */
	arrow?: TArrowPreset | null;
}): void {
	const id = useId();
	const anchorName = `--anchor-${id.replace(/:/g, '')}`;
	useLayoutEffect(() => {
		const trigger = anchorRef.current;
		const popover = popoverRef.current;

		if (!trigger || !popover) {
			return;
		}

		const resolvedPlacement = getPlacement({ placement });

		const shouldForceFallback = Boolean(forceFallbackPositioning);

		if (supportsAnchorPositioning() && !shouldForceFallback) {
			const gap = edgeMargin({ placement: resolvedPlacement, offset });

			const popoverStyles: Array<{ property: string; value: string }> = [
				{ property: 'position-anchor', value: anchorName },
				{ property: 'position-area', value: placementToPositionArea({ placement: resolvedPlacement }) },
				{
					property: 'position-try-fallbacks',
					value: arrow
						? arrow.getTryFallbacks({ placement: resolvedPlacement })
						: placementToTryFallbacks({ placement: resolvedPlacement }),
				},
				// Reset browser default popover positioning that conflicts
				// with anchor positioning (UA: `inset: 0; margin: auto;`)
				{ property: 'margin', value: '0' },
				{ property: 'inset', value: 'auto' },
				// Gap between the popover and its trigger
				{ property: gap.property, value: gap.value },
			];

			if (arrow) {
				// Set the arrow size variable used by the injected arrow CSS
				// and the @position-try rules for margin values.
				popoverStyles.push({ property: '--ds-arrow-size', value: `${offset}px` });
			}

			const undoPositioning = combine(
				setStyle({ el: trigger, styles: [{ property: 'anchor-name', value: anchorName }] }),
				setStyle({ el: popover, styles: popoverStyles }),
			);

			return undoPositioning;
		}

		// ── JS fallback ──
		// The popover is already in the browser's top layer via popover="auto",
		// so it does not need position:fixed. We only reset the UA defaults
		// (inset: 0; margin: auto) and set top/left based on measurements.
		const cleanupBaseStyles = setStyle({ el: popover, styles: [
			{ property: 'margin', value: '0' },
			{ property: 'inset', value: 'auto' },
		] });

		function update() {
			if (!trigger || !popover) {
				return;
			}

			const triggerRect = trigger.getBoundingClientRect();
			const viewport = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			const { top, left } = computeFallbackPosition({
				triggerRect,
				popoverEl: popover,
				placement: resolvedPlacement,
				viewport,
				offset,
			});

			popover.style.setProperty('top', `${top}px`);
			popover.style.setProperty('left', `${left}px`);
		}

		// Throttle scroll/resize updates to one per animation frame
		const scheduledUpdate = rafSchedule(update);

		let pendingFrame: number | null = null;

		const undoPositioning = combine(
			cleanupBaseStyles,
			// Position when the popover transitions to visible.
			// The popover starts hidden (`display: none` per the popover
			// UA stylesheet), so `offsetWidth`/`offsetHeight` are 0 until
			// `showPopover()` is called. We defer positioning to the next
			// animation frame because some browsers (Firefox) fire the
			// `toggle` event synchronously during `showPopover()`, before
			// the element has been laid out — so dimensions are still 0.
			// Waiting one frame guarantees layout has run and measurements
			// are accurate.
			bind(popover, {
				type: 'toggle',
				listener: (event: Event) => {
					const toggleEvent = event as ToggleEvent;
					if (toggleEvent.newState === 'open') {
						pendingFrame = requestAnimationFrame(update);
					}
				},
			}),
			bind(window, {
				type: 'scroll',
				listener: scheduledUpdate,
				options: { capture: true, passive: true },
			}),
			bind(window, {
				type: 'resize',
				listener: scheduledUpdate,
				options: { passive: true },
			}),
			() => {
				scheduledUpdate.cancel();
				if (pendingFrame !== null) {
					cancelAnimationFrame(pendingFrame);
				}
				popover.style.removeProperty('top');
				popover.style.removeProperty('left');
			},
		);

		return undoPositioning;
	}, [
		anchorRef,
		popoverRef,
		placement,
		anchorName,
		offset,
		forceFallbackPositioning,
		arrow,
	]);
}
