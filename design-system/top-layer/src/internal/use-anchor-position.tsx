/**
 * Anchor positioning for top-layer popovers. See
 * `notes/architecture/positioning.md` for the full model.
 *
 * Two runtime paths: CSS Anchor Positioning (modern browsers) and a JS
 * fallback that measures the trigger and writes `top`/`left`.
 *
 * Both paths honour `offset.gap` and `offset.crossAxisShift`. The
 * CSS path passes the values through as strings; the JS fallback resolves
 * them to pixels via a hidden DOM probe (see `resolveCssLengthToPixels`)
 * so tokens, `calc()`, `var()`, etc all work. The JS fallback hides the
 * popover with `opacity: 0` until the first measurement completes, so it
 * is never painted at the wrong location.
 */
import { type RefObject, useId, useLayoutEffect, useRef } from 'react';

import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import once from '@atlaskit/ds-lib/once';

import { type TArrowPreset } from '../arrow/types';
import { type TPlacementOptions } from '../internal/resolve-placement';

import { computeFallbackPosition } from './anchor-positioning-fallback';
import { combine } from './combine';
import { resolveCssLengthToPixels } from './resolve-css-length-to-pixels';
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
 *
 * **Why `flip-inline flip-block` (or `flip-block flip-inline`) is included:**
 *
 * When a popup is in a viewport corner (e.g. inline-end align-end at the
 * top-right), flipping only the primary axis (`flip-inline`) moves the popup
 * to the left but keeps the same cross-axis span direction (e.g. upward),
 * which is still off-screen. The combined keyword `flip-inline flip-block`
 * mirrors the popup diagonally — it flips BOTH the position-area AND both
 * inline and block margins simultaneously, placing the popup at the
 * diagonally opposite corner where there is always space.
 *
 * Named `position-area` entries (e.g. `inline-start span-block-end`) in
 * `position-try-fallbacks` do NOT update margins, so only the `flip-*`
 * tactic keywords correctly flip the gap margin along with the position.
 */
export function placementToTryFallbacks({ placement }: { placement: TPlacementOptions }): string {
	const { axis, edge, align } = getPlacement({ placement });
	const crossAxis = axis === 'block' ? 'inline' : 'block';
	const flippedEdge = edge === 'start' ? 'end' : 'start';

	if (align !== 'center') {
		const sameEdge = `${axis}-${edge}`;
		const oppositeEdge = `${axis}-${flippedEdge}`;
		const flipKeyword = axis === 'block' ? 'flip-block' : 'flip-inline';
		const flipCrossKeyword = axis === 'block' ? 'flip-inline' : 'flip-block';
		// Try same-edge shifts first; two flip entries cover single-edge then corner overflow.
		// Legacy Popper fallbacks for e.g. bottom-start: [bottom, bottom-end, top-start, top, top-end, auto].
		return [
			`${sameEdge} span-${crossAxis}-${align === 'start' ? 'end' : 'start'}`,
			sameEdge,
			`${sameEdge} span-${crossAxis}-${align === 'start' ? 'start' : 'end'}`,
			flipKeyword,
			`${flipKeyword} ${flipCrossKeyword}`,
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
 * Returns true when the popover is currently open. Wrapped because the
 * `:popover-open` pseudo-class is not implemented in some test environments
 * (e.g. jsdom), where `matches` throws on unknown selectors.
 */
function isPopoverOpen(popover: HTMLElement): boolean {
	try {
		return popover.matches(':popover-open');
	} catch {
		return false;
	}
}

/**
 * Detects whether the browser supports CSS Anchor Positioning.
 * Uses `once()` for lazy evaluation — safe for SSR and avoids hydration mismatches.
 */
const supportsAnchorPositioning = once((): boolean => {
	if (
		typeof window === 'undefined' ||
		typeof CSS === 'undefined' ||
		typeof CSS.supports !== 'function'
	) {
		return false;
	}
	return CSS.supports('anchor-name', '--a');
});

/**
 * Returns the CSS margin declaration that creates a gap between the
 * popover and its trigger on the side facing the anchor.
 *
 * For example, a `block-end` placement (popover below) gets
 * `margin-block-start: 8px` to push it away from the trigger's bottom edge.
 */
function edgeMargin({ placement, offset }: { placement: TPlacement; offset: string }): {
	property: string;
	value: string;
} {
	const { axis, edge } = placement;
	const value = offset;

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
 * Cross-axis shift margin. Margin side matches the popover's anchored
 * cross-axis edge: `align: 'start'` uses the START margin, `align: 'end'`
 * uses the END margin with the sign inverted (so `forwards` is always
 * positive), `align: 'center'` uses START. Margin on the un-anchored side
 * has no effect under CSS Anchor Positioning.
 */
function crossAxisShiftMargin({
	placement,
	crossAxisShiftCssValue,
	direction,
}: {
	placement: TPlacement;
	crossAxisShiftCssValue: string;
	direction: 'forwards' | 'backwards';
}): {
	property: string;
	value: string;
} {
	const { axis, align } = placement;
	const directionSign = direction === 'forwards' ? 1 : -1;
	const crossAxis = axis === 'block' ? 'inline' : 'block';
	const useEndSide = align === 'end';
	const side = useEndSide ? 'end' : 'start';
	const sideSign = useEndSide ? -1 : 1;
	const finalSign = directionSign * sideSign;
	// Wrap any string in calc() with the sign factor. CSS handles the math.
	const value = finalSign === 1 ? crossAxisShiftCssValue : `calc(-1 * ${crossAxisShiftCssValue})`;
	return {
		property: `margin-${crossAxis}-${side}`,
		value,
	};
}

/**
 * Returns a referentially-stable, fully-resolved `TPlacement`: the same
 * reference is preserved across renders as long as the resolved shape
 * does not change.
 */
function useStablePlacement(placement: TPlacementOptions): TPlacement {
	const resolved = getPlacement({ placement });
	const stableRef = useRef<TPlacement>(resolved);

	if (!isResolvedPlacementEqual(stableRef.current, resolved)) {
		stableRef.current = resolved;
	}

	return stableRef.current;
}

/**
 * Shallow-equals two fully-resolved placements. Avoids `JSON.stringify` so
 * the comparison cost stays proportional to the number of fields.
 */
function isResolvedPlacementEqual(a: TPlacement, b: TPlacement): boolean {
	return (
		a.axis === b.axis &&
		a.edge === b.edge &&
		a.align === b.align &&
		a.offset.gap === b.offset.gap &&
		a.offset.crossAxisShift.value === b.offset.crossAxisShift.value &&
		a.offset.crossAxisShift.direction === b.offset.crossAxisShift.direction
	);
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
 *
 * `placement` may be a fresh inline object on every render: a structural
 * comparison is used internally so re-runs are skipped when the resolved
 * placement shape is unchanged.
 */
export function useAnchorPosition({
	anchorRef,
	popoverRef,
	placement = {},
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
	 * `offset.gap` and `offset.crossAxisShift` are part of the
	 * placement object.
	 *
	 * All fields are optional. Omitted fields fall back to:
	 *   - `axis`: `'block'`
	 *   - `edge`: `'end'`
	 *   - `align`: `'center'`
	 *   - `offset.gap`: `token('space.100', '8px')`
	 *   - `offset.crossAxisShift.value`: `'0px'`
	 *   - `offset.crossAxisShift.direction`: `'forwards'`
	 *
	 * The full default placement (`{}`) renders the popover centered
	 * below the trigger with one `space.100` of gap and no cross-axis
	 * shift.
	 *
	 * `offset.gap` and `offset.crossAxisShift.value` accept either a
	 * number (pixels) or a CSS length string (eg `token('space.200')`).
	 */
	placement?: TPlacementOptions;
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
	// Stabilize `placement` object so the same object literal
	// value returns an object with the same reference
	const stablePlacement = useStablePlacement(placement);

	useLayoutEffect(() => {
		const trigger = anchorRef.current;
		const popover = popoverRef.current;

		if (!trigger || !popover) {
			return;
		}

		const gapCssValue = stablePlacement.offset.gap;
		const crossAxisShiftCssValue = stablePlacement.offset.crossAxisShift.value;

		const shouldForceFallback = Boolean(forceFallbackPositioning);

		if (supportsAnchorPositioning() && !shouldForceFallback) {
			// Reuse an existing `anchor-name` if the element already has one.
			// Another popover might already be anchored to the old name.
			const anchorName =
				trigger.style.getPropertyValue('anchor-name') || `--anchor-${id.replace(/:/g, '')}`;

			const gap = edgeMargin({
				placement: stablePlacement,
				offset: gapCssValue,
			});
			const crossAxisShift = crossAxisShiftMargin({
				placement: stablePlacement,
				crossAxisShiftCssValue,
				direction: stablePlacement.offset.crossAxisShift.direction,
			});

			const popoverStyles: Array<{ property: string; value: string }> = [
				{ property: 'position-anchor', value: anchorName },
				{
					property: 'position-area',
					value: placementToPositionArea({ placement: stablePlacement }),
				},
				{
					property: 'position-try-fallbacks',
					value: arrow
						? arrow.getTryFallbacks({ placement: stablePlacement })
						: placementToTryFallbacks({ placement: stablePlacement }),
				},
				// Reset browser default popover positioning that conflicts
				// with anchor positioning (UA: `inset: 0; margin: auto;`)
				{ property: 'margin', value: '0' },
				{ property: 'inset', value: 'auto' },
				// Ensures the popup's margin box overflows the viewport when its span region is too
				// narrow, triggering position-try-fallbacks correctly rather than wrapping content.
				{ property: 'min-inline-size', value: 'max-content' },
				// Main-axis gap between the popover and its trigger
				{ property: gap.property, value: gap.value },
				// Cross-axis shift
				{ property: crossAxisShift.property, value: crossAxisShift.value },
			];

			// Surface the active cross-axis shift value as a custom property so
			// each named arrow @position-try rule can re-apply it after a flip.
			// The four properties cover (cross-axis, side); only one is non-zero
			// at a time.
			popoverStyles.push({ property: '--ds-cross-axis-shift-margin-start', value: '0px' });
			popoverStyles.push({ property: '--ds-cross-axis-shift-margin-end', value: '0px' });
			popoverStyles.push({
				property: '--ds-cross-axis-shift-margin-block-start',
				value: '0px',
			});
			popoverStyles.push({
				property: '--ds-cross-axis-shift-margin-block-end',
				value: '0px',
			});
			const crossAxisShiftActive = crossAxisShiftMargin({
				placement: stablePlacement,
				crossAxisShiftCssValue,
				direction: stablePlacement.offset.crossAxisShift.direction,
			});
			// Map margin property to its corresponding custom property name.
			const customPropertyByMarginProperty: Record<string, string> = {
				'margin-inline-start': '--ds-cross-axis-shift-margin-start',
				'margin-inline-end': '--ds-cross-axis-shift-margin-end',
				'margin-block-start': '--ds-cross-axis-shift-margin-block-start',
				'margin-block-end': '--ds-cross-axis-shift-margin-block-end',
			};
			const crossAxisShiftCustomProperty =
				customPropertyByMarginProperty[crossAxisShiftActive.property];
			if (crossAxisShiftCustomProperty) {
				popoverStyles.push({
					property: crossAxisShiftCustomProperty,
					value: crossAxisShiftActive.value,
				});
			}

			if (arrow) {
				// Set the arrow size variable used by the injected arrow CSS
				// and the @position-try rules for margin values.
				popoverStyles.push({ property: '--ds-arrow-size', value: gapCssValue });
				// Mark the popover root as the arrow host. The ARROW_CSS targets
				// [data-ds-popover-arrow] to apply clip-path: inset(0) margin-box
				// and box-shadow: none. Must be on the popover root (not a child)
				// because that's where useAnchorPosition sets the margin gap.
				popover.setAttribute('data-ds-popover-arrow', '');
			}

			/**
			 * **We are never cleaning up anchor names**
			 *
			 * _Rationale_
			 *
			 * - Multiple popovers can share the same anchor element.
			 * - Sometimes the `useAnchorPosition` hook and `Popover`
			 *   are not in the same component.
			 * - There can be times when, even with reference counting, we
			 *   could remove the anchor-name while it's still being used
			 *   by something else - especially with async react updates
			 *   which can cause tearing
			 *
			 * _More_
			 *
			 * See `notes/decisions/anchor-name-lifetime.md`
			 */
			trigger.style.setProperty('anchor-name', anchorName);

			const undoPositioning = combine(
				setStyle({ el: popover, styles: popoverStyles }),
				arrow ? () => popover.removeAttribute('data-ds-popover-arrow') : () => {},
			);

			return undoPositioning;
		}

		// ── JS fallback ──
		// The popover is already in the browser's top layer via popover="auto",
		// so it does not need position:fixed. We only reset the UA defaults
		// (inset: 0; margin: auto) and set top/left based on measurements.
		const cleanupBaseStyles = setStyle({
			el: popover,
			styles: [
				{ property: 'margin', value: '0' },
				{ property: 'inset', value: 'auto' },
			],
		});

		function update() {
			if (!trigger || !popover) {
				return;
			}

			const triggerRect = trigger.getBoundingClientRect();
			const viewport = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			// Resolve consumer-supplied CSS length strings (tokens, calc, var,
			// px, rem, etc) to pixels. The probe is mounted next to the popover
			// so it inherits the same custom-property scope and font size.
			// `popover.parentElement` is guaranteed to exist for any rendered
			// popover (the popover itself is appended somewhere in the tree),
			// but fall back to the popover element if not for safety.
			const probeContainer = popover.parentElement ?? popover;
			const gapPx = resolveCssLengthToPixels({
				value: gapCssValue,
				container: probeContainer,
			});
			const crossAxisShiftPx = resolveCssLengthToPixels({
				value: crossAxisShiftCssValue,
				container: probeContainer,
			});

			const { top, left } = computeFallbackPosition({
				triggerRect,
				popoverEl: popover,
				placement: stablePlacement,
				viewport,
				gap: gapPx,
				crossAxisShift: {
					value: crossAxisShiftPx,
					direction: stablePlacement.offset.crossAxisShift.direction,
				},
			});

			popover.style.setProperty('top', `${top}px`);
			popover.style.setProperty('left', `${left}px`);
			// Reveal the popover only after it has been positioned.
			// See the toggle listener below for why we hide on open.
			popover.style.removeProperty('opacity');
		}

		// Throttle scroll/resize updates to one per animation frame
		const scheduledUpdate = rafSchedule(update);

		// Wait for the FIRST valid layout before measuring: the popover
		// is `display: none` until `showPopover()`, and some browsers
		// fire `toggle` before layout, so RAF-after-toggle is unreliable.
		// ResizeObserver fires once the browser has real dimensions.
		// Self-disconnects after one valid measurement; ongoing
		// scroll/resize is handled by the window listeners below.
		const resizeObserver = new ResizeObserver(() => {
			if (popover.offsetWidth > 0 && popover.offsetHeight > 0) {
				update();
				resizeObserver.disconnect();
			}
		});

		// If the popover is already open by the time this effect runs (for
		// example, the parent `useAnchorPosition` effect runs after the child
		// `Popover` effect that called `showPopover()`), the initial `toggle`
		// event has already fired and our listener below would miss it. Start
		// observing immediately so the first measurement still happens.
		if (isPopoverOpen(popover)) {
			popover.style.setProperty('opacity', '0');
			resizeObserver.observe(popover);
		}

		const undoPositioning = combine(
			cleanupBaseStyles,
			// On every open: hide synchronously so the user never sees
			// the UA-default position, then re-observe for a fresh
			// measurement. We use `opacity: 0` rather than
			// `visibility: hidden` because Firefox skips visibility-hidden
			// elements during `<dialog>` initial-focus traversal — see
			// `form-in-popup.spec.tsx` on `desktop-firefox`.
			bind(popover, {
				type: 'toggle',
				listener: (event: Event) => {
					const toggleEvent = event as ToggleEvent;
					if (toggleEvent.newState === 'open') {
						popover.style.setProperty('opacity', '0');
						resizeObserver.observe(popover);
					}
				},
			}),
			() => resizeObserver.disconnect(),
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
				popover.style.removeProperty('top');
				popover.style.removeProperty('left');
				popover.style.removeProperty('opacity');
			},
		);

		return undoPositioning;
	}, [anchorRef, popoverRef, stablePlacement, forceFallbackPositioning, arrow, id]);
}
