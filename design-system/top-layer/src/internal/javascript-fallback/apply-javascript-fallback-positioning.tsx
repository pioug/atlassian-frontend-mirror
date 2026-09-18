/**
 * The JavaScript positioning fallback: measured `position: fixed` coordinates for
 * browsers without CSS Anchor Positioning.
 *
 * Best effort, degrading in that order: measured anchored position, then anchored
 * with unresolvable offsets treated as `0`, then centred in the viewport, and
 * always visible. The two hazards differ in kind: `new ResizeObserver` runs
 * synchronously in the layout effect, where a throw unmounts the React tree,
 * while `update` runs asynchronously, where the danger is an uncleared
 * `opacity: 0`.
 */
import { bind } from 'bind-event-listener';
import rafSchedule from 'raf-schd';

import { combine } from '../combine';
import { type TPlacement } from '../resolve-placement';
import { setStyle, type TStyleDeclaration } from '../set-style';
import { computeFallbackPosition } from './anchor-positioning-fallback';
import { resolveCssLengthToPixels } from './resolve-css-length-to-pixels';
import { warnFallbackFailure } from './warn-fallback-failure';

/**
 * Wrapped because jsdom throws on the unknown `:popover-open` selector.
 */
function isPopoverOpen(popover: HTMLElement): boolean {
	try {
		return popover.matches(':popover-open');
	} catch {
		return false;
	}
}

/**
 * Observes the popover until its first non-zero layout, then self-disconnects;
 * ongoing movement is handled by the scroll and resize listeners. The popover is
 * `display: none` until `showPopover()`, and some browsers fire `toggle` before
 * layout, so RAF-after-toggle is unreliable.
 *
 * `null` where `ResizeObserver` is missing (non-DOM jest environments). There is
 * then no measurement to wait for, so the caller positions immediately and must
 * not hide the popover, because no reveal would follow.
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

/**
 * The consumer's offsets in pixels. See `resolvedOffsets` below.
 */
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
	// Already in the top layer via the `popover` attribute, so this only resets the
	// UA defaults and writes measured `top` / `left`.
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
	let undoPosition: (() => void) | undefined;
	let undoHide: (() => void) | undefined;

	// Resolved once per open and per resize, reused across scrolls: resolving is a
	// full style and layout flush, and a scroll cannot change what a CSS length
	// resolves to. A resize can (viewport units), and so can a re-open (a token
	// retargeted while closed).
	let resolvedOffsets: TResolvedOffsets | null = null;

	function invalidateResolvedOffsets() {
		resolvedOffsets = null;
	}

	function getResolvedOffsets(): TResolvedOffsets {
		if (resolvedOffsets) {
			return resolvedOffsets;
		}
		// Probed INSIDE the popover: it is in the top layer, not the anchor's DOM
		// tree, so anywhere else resolves a token against a different scope.
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
		undoHide?.();
		undoHide = undefined;
	}

	function restorePosition() {
		undoPosition?.();
		undoPosition = undefined;
	}

	// `opacity: 0` not `visibility: hidden`: Firefox skips visibility-hidden
	// elements during `<dialog>` initial-focus traversal.
	function hideUntilPositioned() {
		// Keep the first snapshot, else we capture our own `opacity: 0`.
		if (undoHide) {
			return;
		}
		undoHide = setStyle({ element: popover, styles: [{ property: 'opacity', value: '0' }] });
	}

	/**
	 * Last resort. The base styles above reset the UA
	 * `[popover] { inset: 0; margin: auto }`, so a popover with no `top` / `left`
	 * sits in the viewport corner rather than centred.
	 */
	function centerInViewport() {
		restorePosition();
		undoPosition = setStyle({
			element: popover,
			styles: [
				{ property: 'inset', value: '0' },
				{ property: 'margin', value: 'auto' },
			],
		});
	}

	function update() {
		try {
			const triggerRect = anchor.getBoundingClientRect();
			const viewport = { width: window.innerWidth, height: window.innerHeight };
			const { gap, crossAxisShift } = getResolvedOffsets();

			const { top, left } = computeFallbackPosition({
				triggerRect,
				popoverEl: popover,
				placement,
				viewport,
				gap,
				crossAxisShift: {
					value: crossAxisShift,
					direction: placement.offset.crossAxisShift.direction,
				},
			});

			// A non-finite coordinate serialises to a declaration the browser drops,
			// landing the popover in the corner just as silently as a throw would.
			if (!Number.isFinite(top) || !Number.isFinite(left)) {
				centerInViewport();
				return;
			}

			// Restore first so the snapshot stays the consumer's value.
			restorePosition();
			undoPosition = setStyle({
				element: popover,
				styles: [
					{ property: 'top', value: `${top}px` },
					{ property: 'left', value: `${left}px` },
				],
			});
		} catch (error) {
			warnFallbackFailure({ error });
			// Anchoring needs the trigger geometry we just failed to get, so the
			// centred position is the only one left to degrade to.
			try {
				centerInViewport();
			} catch {}
		} finally {
			// Unconditional. A popover in the wrong place is recoverable on the
			// next scroll or resize; one left at `opacity: 0` is invisible forever.
			reveal();
		}
	}

	function invalidateAndUpdate() {
		invalidateResolvedOffsets();
		update();
	}

	// One update per animation frame. Scroll reuses the resolved offsets; resize
	// re-resolves them.
	const scheduledScrollUpdate = rafSchedule(update);
	const scheduledResizeUpdate = rafSchedule(invalidateAndUpdate);

	const firstLayoutObserver = createFirstLayoutObserver({ popover, onFirstLayout: update });

	function positionOnNextLayout() {
		// A token can have been retargeted while the popover was closed, so each
		// open re-resolves the offsets.
		invalidateResolvedOffsets();
		// No observer means no measurement is coming: position now, and do not
		// hide, because the reveal would never arrive.
		if (!firstLayoutObserver) {
			update();
			return;
		}
		hideUntilPositioned();
		firstLayoutObserver.observe(popover);
	}

	// The popover can already be open when this runs, in which case the initial
	// `toggle` has fired and the listener below would miss it.
	if (isPopoverOpen(popover)) {
		positionOnNextLayout();
	}

	return combine(
		cleanupBaseStyles,
		// Each open needs a fresh measurement, so hide and re-observe.
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
