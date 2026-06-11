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
import { type RefObject, useId, useLayoutEffect, useMemo } from 'react';

import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import once from '@atlaskit/ds-lib/once';

import { type TPlacementOptions } from '../internal/resolve-placement';

import { computeFallbackPosition } from './anchor-positioning-fallback';
import { combine } from './combine';
import { placementToPositionArea } from './placement-to-position-area';
import { placementToTryFallbacks } from './placement-to-try-fallbacks';
import { resolveCssLengthToPixels } from './resolve-css-length-to-pixels';
import { getPlacement, type TPlacement } from './resolve-placement';
import { setStyle } from './set-style';

// `getPlacement` is intentionally NOT re-exported here - import it directly
// from `./resolve-placement` so search-and-jump lands at the source of truth.

/**
 * Module-scope no-op `ResizeObserver` used in non-DOM jest environments where
 * `ResizeObserver` is `undefined`. Hoisted out of the effect to avoid
 * allocating a new class declaration on every run.
 */
const NoopResizeObserver = class {
	observe() {}
	unobserve() {}
	disconnect() {}
};

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
 * Uses `once()` for lazy evaluation: safe for SSR and avoids hydration mismatches.
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
 * Returns a referentially-stable, fully-resolved `TPlacement`. `useMemo` is
 * keyed on the primitive fields of the input so a fresh inline `placement`
 * object on every render does not produce a fresh resolved object. Both
 * `getPlacement` and the equality check are skipped when the inputs are
 * unchanged.
 */
function useStablePlacement(placement: TPlacementOptions): TPlacement {
	// Resolve to the fully-defaulted primitives BEFORE the memo so the deps
	// array sees the same key for `{}`, `undefined` fields, and explicit
	// defaults. Otherwise `axis: undefined` and `axis: 'block'` would be
	// treated as different inputs and re-run the downstream effect.
	const resolved = getPlacement({ placement });
	const axis = resolved.axis;
	const edge = resolved.edge;
	const align = resolved.align;
	const gap = resolved.offset.gap;
	const shiftValue = resolved.offset.crossAxisShift.value;
	const shiftDirection = resolved.offset.crossAxisShift.direction;
	// Rebuild the placement object inside the memo from the resolved primitive
	// deps so the factory does not close over the (potentially fresh) outer
	// `resolved` reference, and `react-hooks/exhaustive-deps` can verify the
	// deps array.
	return useMemo(
		() => ({
			axis,
			edge,
			align,
			offset: {
				gap,
				crossAxisShift: { value: shiftValue, direction: shiftDirection },
			},
		}),
		[axis, edge, align, gap, shiftValue, shiftDirection],
	);
}

/**
 * Hook that positions an element relative to an anchor element using
 * CSS Anchor Positioning (with a JS fallback for older browsers).
 *
 * This hook is the positioning primitive. It has no knowledge of popovers,
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
// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export function useAnchorPosition({
	anchorRef,
	popoverRef,
	placement = {},
	forceFallbackPositioning = false,
	isEnabled = true,
	isOpen,
}: {
	/**
	 * Element to position relative to.
	 */
	anchorRef: RefObject<HTMLElement | null>;
	/**
	 * Element being positioned (typically a popover).
	 *
	 * The popover host may be unmounted between opens (the `Popover`
	 * primitive unmounts after its exit animation). Pass `isOpen` so the
	 * positioning effect re-runs against the freshly mounted element on
	 * the next open. Without it, the effect's bound listeners and styles
	 * would target the previous (detached) element.
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
	 * When `false`, the hook is a no-op and applies no positioning.
	 * Defaults to `true`.
	 */
	isEnabled?: boolean;
	/**
	 * Whether the popover is currently open. Drives a re-run of the
	 * positioning effect when the popover host element is unmounted
	 * and remounted across open cycles, so listeners and styles are
	 * always wired to the live host element.
	 */
	isOpen: boolean;
}): void {
	const id = useId();
	// Stabilize `placement` object so the same object literal
	// value returns an object with the same reference
	const stablePlacement = useStablePlacement(placement);

	useLayoutEffect(() => {
		if (!isEnabled) {
			return;
		}

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
			// Hoist crossAxisShift to a single computation; reused below to
			// populate the active `--ds-cross-axis-shift-margin-*` custom
			// property for the named arrow @position-try rules.
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
					value: placementToTryFallbacks({ placement: stablePlacement }),
				},
				// Reset browser default popover positioning that conflicts
				// with anchor positioning (UA: `inset: 0; margin: auto;`)
				{ property: 'margin', value: '0' },
				{ property: 'inset', value: 'auto' },
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
			// `crossAxisShift` IS the active margin - reuse instead of recomputing.
			const crossAxisShiftActive = crossAxisShift;
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

			/**
			 * **We are never cleaning up anchor names**
			 *
			 * _Rationale_
			 *
			 * - Multiple popovers can share the same anchor element.
			 * - Sometimes the `useAnchorPosition` hook and `Popover`
			 *   are not in the same component.
			 * - There can be times when, even with reference counting, we
			 *   could remove the anchor-name while it is still being used
			 *   by something else - especially with async react updates
			 *   which can cause tearing
			 *
			 * _More_
			 *
			 * See `notes/decisions/anchor-name-lifetime.md`
			 */
			trigger.style.setProperty('anchor-name', anchorName);

			const undoPositioning = combine(setStyle({ el: popover, styles: popoverStyles }));

			return undoPositioning;
		}

		// JS fallback
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
			// px, rem, etc) to pixels. The probe is mounted INSIDE the popover
			// itself so the resolved length matches the scope a token would
			// resolve against from inside the popover content. (The popover
			// lives in the top layer, not the trigger's DOM tree, so probing
			// at `popover.parentElement` would resolve in a different scope
			// than the consumer's token authoring expects.)
			const gapPx = resolveCssLengthToPixels({
				value: gapCssValue,
				container: popover,
			});
			const crossAxisShiftPx = resolveCssLengthToPixels({
				value: crossAxisShiftCssValue,
				container: popover,
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
		// `ResizeObserver` is missing in some non-DOM jest environments
		// (e.g. post-office's `node` environment). Fall back to a no-op
		// observer there. The scroll/resize listeners below still keep
		// the popover positioned in the rare case the consumer also
		// polyfilled `showPopover` but not `ResizeObserver`. Real
		// browsers always have it. The `NoopResizeObserver` class is
		// hoisted to module scope (see top of file) so we do not allocate
		// a new constructor on every effect run.
		const ResizeObserverImpl =
			typeof ResizeObserver !== 'undefined' ? ResizeObserver : NoopResizeObserver;
		const resizeObserver = new ResizeObserverImpl(() => {
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
			// elements during `<dialog>` initial-focus traversal. See
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
	}, [anchorRef, popoverRef, stablePlacement, forceFallbackPositioning, isEnabled, id, isOpen]);
}
