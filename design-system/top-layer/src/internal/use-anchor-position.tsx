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
import {
	resolvePlacement,
	type TCrossAxisShiftDirection,
	type TPlacement,
	type TPlacementAxis,
	type TPlacementEdge,
} from './resolve-placement';
import { setStyle, type TStyleDeclaration } from './set-style';

// `resolvePlacement` is intentionally NOT re-exported here - import it directly
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
 * Every logical margin property this module can write: one per axis, per side.
 *
 * Deriving the union from `TPlacementAxis` and `TPlacementEdge` rather than
 * writing the four names out keeps it in step with the placement model, and
 * makes `CROSS_AXIS_SHIFT_CUSTOM_PROPERTY` below exhaustive by construction.
 */
type TLogicalMarginProperty = `margin-${TPlacementAxis}-${TPlacementEdge}`;

/**
 * The custom property mirroring each cross-axis shift margin.
 *
 * These are written for the planned named arrow `@position-try` rules. Nothing
 * reads them yet, and the shift no longer depends on them: the antisymmetric
 * margins written by `crossAxisShiftMargins` survive a cross-axis slide on
 * their own.
 *
 * Keyed on `TLogicalMarginProperty` and not on `string`, so a margin property
 * that has no custom property (or a custom property whose margin no longer
 * exists) is a compile error rather than an `undefined` lookup that reaches
 * `setStyle` as `{ property: undefined, value }`.
 */
const CROSS_AXIS_SHIFT_CUSTOM_PROPERTY: Record<TLogicalMarginProperty, string> = {
	'margin-inline-start': '--ds-cross-axis-shift-margin-start',
	'margin-inline-end': '--ds-cross-axis-shift-margin-end',
	'margin-block-start': '--ds-cross-axis-shift-margin-block-start',
	'margin-block-end': '--ds-cross-axis-shift-margin-block-end',
};

const ZEROED_CROSS_AXIS_SHIFT_CUSTOM_PROPERTIES: TStyleDeclaration[] = Object.values(
	CROSS_AXIS_SHIFT_CUSTOM_PROPERTY,
).map((property) => ({ property, value: '0px' }));

/**
 * Returns the CSS margin declaration that creates a gap between the
 * popover and its trigger on the side facing the anchor.
 *
 * For example, a `block-end` placement (popover below) gets
 * `margin-block-start: 8px` to push it away from the trigger's bottom edge.
 */
function edgeMargin({
	placement,
	offset,
}: {
	placement: TPlacement;
	offset: string;
}): TStyleDeclaration<TLogicalMarginProperty> {
	const { axis, edge } = placement;
	// The gap sits on the side FACING the anchor, which is always the side
	// opposite the placement edge.
	const anchorFacingEdge: TPlacementEdge = edge === 'end' ? 'start' : 'end';
	return { property: `margin-${axis}-${anchorFacingEdge}`, value: offset };
}

/**
 * **The cross-axis shift margins.**
 *
 * The shift is written antisymmetrically on BOTH cross-axis sides
 * (`start: +value`, `end: -value`) rather than as a single margin on the side
 * picked from `align`. Two separate behaviours require it:
 *
 * 1. **`align: 'center'` is centered with `anchor-center`, which centers the
 *    popover's MARGIN box on the anchor.** A single-sided margin widens the
 *    margin box, so it displaces the border box by only half its value. An
 *    antisymmetric pair leaves the margin box width unchanged (`+value` and
 *    `-value` sum to zero) while moving its center by the full value.
 * 2. **`position-try-fallbacks` can slide the popover onto the opposite
 *    cross-axis side.** A `<position-area>` fallback keeps the base style's
 *    margins, and margin on the un-anchored side has no effect, so a
 *    single-sided margin is silently dropped once the browser slides across the
 *    cross axis. With both sides written, whichever side ends up anchored moves
 *    the popover the same physical direction.
 *
 * Leaving the margin box width unchanged also means the shift does not move
 * the point at which `position-try-fallbacks` decides the popover overflows.
 *
 * A `<try-tactic>` fallback (`flip-block`, `flip-inline`) behaves differently to
 * a `<position-area>` one: it SWAPS the start and end margins rather than
 * keeping them, which is what preserves the gap through a flip. So a flip across
 * the cross axis mirrors the shift along with the rest of the placement, rather
 * than preserving its physical direction. Only the diagonal fallback does that,
 * and only for `align: 'start' | 'end'`. See `placementToTryFallbacks`.
 *
 * A positive value always moves the popover toward the cross-axis END, so
 * `direction: 'forwards'` means the same thing for every `align` value. See
 * `notes/decisions/placement-offset.md`.
 */
function crossAxisShiftMargins({
	placement,
	crossAxisShiftCssValue,
	direction,
}: {
	placement: TPlacement;
	crossAxisShiftCssValue: string;
	direction: TCrossAxisShiftDirection;
}): TStyleDeclaration<TLogicalMarginProperty>[] {
	const crossAxis: TPlacementAxis = placement.axis === 'block' ? 'inline' : 'block';
	// Wrap any string in calc() with the sign factor. CSS handles the math,
	// so opaque values such as design tokens negate correctly.
	const negated = `calc(-1 * ${crossAxisShiftCssValue})`;
	const isForwards = direction === 'forwards';
	return [
		{
			property: `margin-${crossAxis}-start`,
			value: isForwards ? crossAxisShiftCssValue : negated,
		},
		{
			property: `margin-${crossAxis}-end`,
			value: isForwards ? negated : crossAxisShiftCssValue,
		},
	];
}

/**
 * Returns a referentially-stable, fully-resolved `TPlacement`. The memo is
 * keyed on the resolved primitive fields so a fresh inline `placement` object
 * (or undefined fields vs explicit defaults) does not produce a fresh result.
 */
function useStablePlacement(placement: TPlacementOptions): TPlacement {
	const resolved = resolvePlacement({ placement });
	const axis = resolved.axis;
	const edge = resolved.edge;
	const align = resolved.align;
	const gap = resolved.offset.gap;
	const shiftValue = resolved.offset.crossAxisShift.value;
	const shiftDirection = resolved.offset.crossAxisShift.direction;
	// Rebuild inside the memo from primitive deps so the factory does not
	// close over the outer `resolved` reference and exhaustive-deps can verify.
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
			// Computed once; also mirrored into the
			// `--ds-cross-axis-shift-margin-*` custom properties below.
			const crossAxisShift = crossAxisShiftMargins({
				placement: stablePlacement,
				crossAxisShiftCssValue,
				direction: stablePlacement.offset.crossAxisShift.direction,
			});

			const popoverStyles: TStyleDeclaration[] = [
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
				gap,
				...crossAxisShift,
				// Zero every side first so the two sides that are NOT on the
				// active cross axis do not keep a value from a previous placement.
				...ZEROED_CROSS_AXIS_SHIFT_CUSTOM_PROPERTIES,
				...crossAxisShift.map(({ property, value }) => ({
					property: CROSS_AXIS_SHIFT_CUSTOM_PROPERTY[property],
					value,
				})),
			];

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

			return setStyle({ element: popover, styles: popoverStyles });
		}

		// JS fallback. The popover is already in the top layer via
		// popover="auto", so we only reset UA defaults and set top/left
		// based on measurements.
		const cleanupBaseStyles = setStyle({
			element: popover,
			styles: [
				{ property: 'margin', value: '0' },
				{ property: 'inset', value: 'auto' },
			],
		});

		// The popover can be consumer-owned (`@atlaskit/popper`'s `createPopper`),
		// so restore prior inline values rather than removing ours.
		let undoPosition: (() => void) | undefined;
		let undoHide: (() => void) | undefined;

		// `opacity: 0` not `visibility: hidden`: Firefox skips visibility-hidden
		// elements during `<dialog>` initial-focus traversal.
		function hideUntilPositioned() {
			// Keep the first snapshot, else we capture our own `opacity: 0`.
			// (`!popover` is for TS: narrowing does not reach nested functions.)
			if (!popover || undoHide) {
				return;
			}
			undoHide = setStyle({ element: popover, styles: [{ property: 'opacity', value: '0' }] });
		}

		function reveal() {
			undoHide?.();
			undoHide = undefined;
		}

		function restorePosition() {
			undoPosition?.();
			undoPosition = undefined;
		}

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

			// Restore first so the snapshot stays the consumer's value.
			restorePosition();
			undoPosition = setStyle({
				element: popover,
				styles: [
					{ property: 'top', value: `${top}px` },
					{ property: 'left', value: `${left}px` },
				],
			});
			reveal();
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
			hideUntilPositioned();
			resizeObserver.observe(popover);
		}

		const undoPositioning = combine(
			cleanupBaseStyles,
			// Each open needs a fresh measurement, so hide and re-observe.
			bind(popover, {
				type: 'toggle',
				listener: (event: Event) => {
					const toggleEvent = event as ToggleEvent;
					if (toggleEvent.newState === 'open') {
						hideUntilPositioned();
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
				restorePosition();
				reveal();
			},
		);

		return undoPositioning;
	}, [anchorRef, popoverRef, stablePlacement, forceFallbackPositioning, isEnabled, id, isOpen]);
}
