/**
 * **JavaScript positioning fallback**
 *
 * Writes measured `position: fixed` coordinates for browsers without CSS Anchor
 * Positioning.
 *
 * Best effort. The popover is always visible, and the position degrades in this
 * order:
 *
 * 1. Anchored, at the measured position.
 * 2. Anchored, with unresolvable offsets treated as `0`.
 * 3. Centred in the viewport.
 *
 * The two hazards differ in kind:
 *
 * - `new ResizeObserver` runs synchronously in the layout effect, where a throw
 *   unmounts the React tree.
 * - `updatePosition` runs asynchronously, where the danger is an `opacity: 0`
 *   that is never cleared.
 */
import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import { combine } from '../combine';
import { type TPlacement } from '../resolve-placement';
import { setStyle, type TStyleDeclaration } from '../set-style';
import { computeFallbackPosition } from './anchor-positioning-fallback';
import { resolveCssLengthToPixels } from './resolve-css-length-to-pixels';
import { warnFallbackFailure } from './warn-fallback-failure';

// Wrapped because jsdom throws on the unknown `:popover-open` selector.
function isPopoverOpen({ popover }: { popover: HTMLElement }): boolean {
	try {
		return popover.matches(':popover-open');
	} catch {
		return false;
	}
}

/**
 * Creates an observer that calls `onFirstLayout` at the first non-zero layout
 * of the popover, then disconnects. The scroll and resize listeners handle
 * movement after that. The popover is `display: none` until `showPopover()`,
 * and some browsers fire `toggle` before layout, so a RAF after `toggle` is
 * unreliable.
 *
 * Returns `null` when `ResizeObserver` is missing (non-DOM jest environments)
 * or its constructor throws. There is then no measurement to wait for, so the
 * caller positions immediately and must not hide the popover, because no
 * reveal would follow.
 */
function createFirstLayoutObserver({
	popover,
	onFirstLayout,
}: {
	popover: HTMLElement;
	onFirstLayout: () => void;
}): ResizeObserver | null {
	if (typeof ResizeObserver === 'undefined') {
		return null;
	}

	try {
		const observer = new ResizeObserver(() => {
			if (popover.offsetWidth > 0 && popover.offsetHeight > 0) {
				onFirstLayout();
				observer.disconnect();
			}
		});
		return observer;
	} catch (error) {
		warnFallbackFailure({ error });
		return null;
	}
}

// The placement offsets in pixels. See `resolvedOffsets` below.
type TResolvedOffsets = {
	gap: number;
	crossAxisShift: number;
};

/**
 * Positions `popover` against `anchor` from measurements, and keeps it there
 * across opens, scroll and resize. Returns the cleanup.
 *
 * No fit margins on this path: the gap and the cross-axis shift are coordinate
 * deltas here, so writing them as margins too would double-apply them.
 */
export function applyJavaScriptFallbackPositioning({
	anchor,
	popover,
	placement,
	sizeStyles,
}: {
	anchor: HTMLElement;
	popover: HTMLElement;
	placement: TPlacement;
	sizeStyles: TStyleDeclaration[];
}): () => void {
	// The `popover` attribute already puts the popover in the top layer. Reset the
	// UA `margin` and `inset` so that the measured `top` / `left` apply, and write
	// the size styles.
	const cleanupBaseStyles = setStyle({
		element: popover,
		styles: [
			{ property: 'margin', value: '0' },
			{ property: 'inset', value: 'auto' },
			...sizeStyles,
		],
	});

	// The popover can be consumer-owned (`@atlaskit/popper`'s `createPopper`),
	// so restore prior inline values rather than removing ours.
	let cleanupPositionStyles: (() => void) | undefined;
	let cleanupHideStyles: (() => void) | undefined;

	// Resolved once per open and per resize, and reused across scrolls. Resolving
	// is a full style and layout flush, and a scroll cannot change what a CSS
	// length resolves to. A resize can (viewport units), and so can a re-open (a
	// token retargeted while closed).
	let resolvedOffsets: TResolvedOffsets | null = null;

	function invalidateResolvedOffsets() {
		resolvedOffsets = null;
	}

	function getResolvedOffsets(): TResolvedOffsets {
		if (resolvedOffsets) {
			return resolvedOffsets;
		}
		// Probe INSIDE the popover, so a length resolves against the popover's font
		// size and custom-property scope, not the anchor's.
		resolvedOffsets = {
			gap: resolveCssLengthToPixels({ value: placement.offset.gap, container: popover }),
			crossAxisShift: resolveCssLengthToPixels({
				value: placement.offset.crossAxisShift.value,
				container: popover,
			}),
		};
		return resolvedOffsets;
	}

	function reveal() {
		cleanupHideStyles?.();
		cleanupHideStyles = undefined;
	}

	function restorePosition() {
		cleanupPositionStyles?.();
		cleanupPositionStyles = undefined;
	}

	// `opacity: 0` not `visibility: hidden`: Firefox skips visibility-hidden
	// elements during `<dialog>` initial-focus traversal.
	function hideUntilPositioned() {
		// Keep the first snapshot, else we capture our own `opacity: 0`.
		if (cleanupHideStyles) {
			return;
		}
		cleanupHideStyles = setStyle({
			element: popover,
			styles: [{ property: 'opacity', value: '0' }],
		});
	}

	/**
	 * Last resort. The base styles above reset the UA
	 * `[popover] { inset: 0; margin: auto }`, so a popover with no `top` / `left`
	 * sits in the viewport corner rather than centred.
	 */
	function centerInViewport() {
		restorePosition();
		cleanupPositionStyles = setStyle({
			element: popover,
			styles: [
				{ property: 'inset', value: '0' },
				{ property: 'margin', value: 'auto' },
			],
		});
	}

	function updatePosition() {
		try {
			const anchorRect = anchor.getBoundingClientRect();
			const viewport = { width: window.innerWidth, height: window.innerHeight };
			const { gap, crossAxisShift } = getResolvedOffsets();

			const { top, left } = computeFallbackPosition({
				anchorRect,
				popover,
				placement,
				viewport,
				gap,
				crossAxisShift: {
					value: crossAxisShift,
					direction: placement.offset.crossAxisShift.direction,
				},
			});

			// A non-finite coordinate serialises to a declaration the browser drops.
			// That leaves the popover in the corner, as silently as a throw would.
			if (!Number.isFinite(top) || !Number.isFinite(left)) {
				centerInViewport();
				return;
			}

			// Restore first so the snapshot stays the consumer's value.
			restorePosition();
			cleanupPositionStyles = setStyle({
				element: popover,
				styles: [
					{ property: 'top', value: `${top}px` },
					{ property: 'left', value: `${left}px` },
				],
			});
		} catch (error) {
			warnFallbackFailure({ error });
			// Anchored positioning failed, so the centred position is the only one left
			// to degrade to.
			try {
				centerInViewport();
			} catch {}
		} finally {
			// Always reveal. A popover in the wrong place recovers on the next scroll or
			// resize. A popover left at `opacity: 0` stays invisible.
			reveal();
		}
	}

	function invalidateOffsetsAndUpdatePosition() {
		invalidateResolvedOffsets();
		updatePosition();
	}

	// One update per animation frame. Scroll reuses the resolved offsets. Resize
	// resolves them again.
	const scheduledScrollUpdate = rafSchedule(updatePosition);
	const scheduledResizeUpdate = rafSchedule(invalidateOffsetsAndUpdatePosition);

	const firstLayoutObserver = createFirstLayoutObserver({
		popover,
		onFirstLayout: updatePosition,
	});

	function positionOnNextLayout() {
		// A token can have been retargeted while the popover was closed, so each
		// open resolves the offsets again.
		invalidateResolvedOffsets();
		// No observer means no measurement is coming: position now, and do not
		// hide, because the reveal would never arrive.
		if (!firstLayoutObserver) {
			updatePosition();
			return;
		}
		hideUntilPositioned();
		firstLayoutObserver.observe(popover);
	}

	// The popover can already be open when this runs. Then the initial `toggle`
	// has fired, and the listener below would miss it.
	if (isPopoverOpen({ popover })) {
		positionOnNextLayout();
	}

	return combine(
		cleanupBaseStyles,
		// Each open needs a fresh measurement, so hide and observe again.
		bind(popover, {
			type: 'toggle',
			listener: (event: Event) => {
				const toggleEvent = event as ToggleEvent;
				if (toggleEvent.newState === 'open') {
					positionOnNextLayout();
				}
			},
		}),
		() => firstLayoutObserver?.disconnect(),
		bind(window, {
			type: 'scroll',
			listener: scheduledScrollUpdate,
			options: { capture: true, passive: true },
		}),
		bind(window, {
			type: 'resize',
			listener: scheduledResizeUpdate,
			options: { passive: true },
		}),
		() => {
			scheduledScrollUpdate.cancel();
			scheduledResizeUpdate.cancel();
			restorePosition();
			reveal();
		},
	);
}
