/**
 * Positioning AND anchor-relative sizing for top-layer popovers. Anchors an
 * ELEMENT; to anchor a viewport coordinate use `useAnchoredPopoverAtPoint`.
 *
 * Two runtime paths, each a function that applies its styles and returns the
 * cleanup: CSS Anchor Positioning in `./anchor-positioning`, and the JavaScript
 * fallback in `./javascript-fallback`. The path is resolved ONCE, at the top of
 * the hook, and threaded through positioning, sizing and margins.
 *
 * See `notes/architecture/positioning.md` and
 * `notes/decisions/fit-available-space.md`.
 */
import { type RefObject, useLayoutEffect, useMemo } from 'react';

import { useId } from '@atlaskit/ds-lib/use-id';

import { applyAnchorPositioning } from './anchor-positioning/apply-anchor-positioning';
import {
	getAnchoredPopoverSizeDeclarations,
	type TAnchorSizeValues,
	type TPopoverAxisSize,
	type TPopoverWritingMode,
} from './anchored-popover-size';
import { applyJavaScriptFallbackPositioning } from './javascript-fallback/apply-javascript-fallback-positioning';
import { resolvePlacement, type TPlacement, type TPlacementOptions } from './resolve-placement';
import { supportsAnchorPositioning } from './supports-anchor-positioning';
import { supportsAnchorSize } from './supports-anchor-size';

/**
 * Which way the popover's inline axis runs. Maps every physical measurement below
 * onto a logical axis: the viewport unit of each cap and the anchor's measured
 * size. A style read, not a layout read, so it is cheap enough to take for every
 * popover.
 */
function getPopoverWritingMode({ popover }: { popover: HTMLElement }): TPopoverWritingMode {
	// `String()` because not every test environment implements `writing-mode`.
	const writingMode = String(getComputedStyle(popover).writingMode);
	const isVertical = writingMode.startsWith('vertical') || writingMode.startsWith('sideways');
	return isVertical ? 'vertical' : 'horizontal';
}

/**
 * Measured stand-in for `anchor-size(self-*)`, used wherever `anchor-size()` is
 * not: the JavaScript fallback, and browsers with anchor positioning but no
 * `anchor-size()`.
 *
 * `offsetWidth` / `offsetHeight` are physical, so the axis is picked from the
 * POPOVER's `writing-mode`. Deliberately not memoized: a cached anchor size is a
 * stale one. Runs once per effect, not per frame.
 */
function measureAnchorSize({
	anchor,
	writingMode,
}: {
	anchor: HTMLElement;
	writingMode: TPopoverWritingMode;
}): TAnchorSizeValues {
	if (writingMode === 'vertical') {
		return { inline: `${anchor.offsetHeight}px`, block: `${anchor.offsetWidth}px` };
	}
	return { inline: `${anchor.offsetWidth}px`, block: `${anchor.offsetHeight}px` };
}

const NO_ANCHOR_SIZE: TAnchorSizeValues = { inline: null, block: null };

const CSS_ANCHOR_SIZE: TAnchorSizeValues = {
	inline: 'anchor-size(self-inline)',
	block: 'anchor-size(self-block)',
};

function isAnchorRelative(size: TPopoverAxisSize): boolean {
	return size === 'match-anchor' || size === 'min-anchor';
}

/**
 * The `anchor-name` written to an anchor that does not already carry one, as a CSS
 * `<dashed-ident>`. `useId()` is the same source as every other id in the design
 * system, including the popover's own `id` that `aria-controls` and `popovertarget`
 * point at, so it is unique exactly where those are and collides exactly where
 * they do. See `useAnchoredPopover` for the one case that needs the host's help.
 *
 * `@atlaskit/ds-lib`'s `useId` already swaps React's `:` and `«»` for `_`. The
 * replace covers a host `identifierPrefix`, which may carry characters a
 * `<dashed-ident>` cannot.
 */
function useNewAnchorName(): string {
	const id = useId();
	return useMemo(() => `--anchor-${id.replace(/[^A-Za-z0-9_-]/g, '_')}`, [id]);
}

/**
 * A referentially-stable, fully-resolved `TPlacement`, so a fresh inline
 * `placement` object does not re-run the effect.
 */
function useStablePlacement(placement: TPlacementOptions): TPlacement {
	const resolved = resolvePlacement({ placement });
	const axis = resolved.axis;
	const edge = resolved.edge;
	const align = resolved.align;
	const minSize = resolved.minSize;
	const gap = resolved.offset.gap;
	const shiftValue = resolved.offset.crossAxisShift.value;
	const shiftDirection = resolved.offset.crossAxisShift.direction;
	// Rebuilt from primitive deps, so the factory does not close over `resolved`
	// and exhaustive-deps can verify it.
	return useMemo(
		() => ({
			axis,
			edge,
			align,
			minSize,
			offset: {
				gap,
				crossAxisShift: { value: shiftValue, direction: shiftDirection },
			},
		}),
		[axis, edge, align, minSize, gap, shiftValue, shiftDirection],
	);
}

/**
 * Exported so `useAnchoredPopoverAtPoint` can forward the options it does not own.
 */
export type TAnchoredPopoverOptions = {
	/**
	 * The element to position against. The ref OBJECT must be referentially stable,
	 * as the effect depends on it. `.current` may be `null` on the first render.
	 */
	anchorRef: RefObject<HTMLElement | null>;
	/**
	 * `false` means "do not position": the hook applies nothing and touches no DOM,
	 * so another strategy can own the popover. Defaults to `true`.
	 *
	 * A disabled hook holds no `setStyle` snapshot, which is what lets a consumer
	 * call this AND `useAnchoredPopoverAtPoint` on one popover with COMPLEMENTARY
	 * values. Two enabled hooks nest their snapshots, and React unwinds them in
	 * commit order rather than write order, so a stale inline value can survive.
	 */
	isEnabled?: boolean;
	/**
	 * Element being positioned. May be unmounted between opens; see `isOpen`.
	 */
	popoverRef: RefObject<HTMLElement | null>;
	/**
	 * Where the popover sits relative to the anchor, plus `offset.gap`,
	 * `offset.crossAxisShift` and `minSize`. Required, because the sizing rules read
	 * the placement axis; individual fields are optional. See `TPlacementOptions`.
	 */
	placement: TPlacementOptions;
	/**
	 * Re-runs the effect across open cycles, so styles and listeners follow the live
	 * host element through a remount.
	 */
	isOpen: boolean;
	/**
	 * How wide the popover is, defaulting to `'content'`: the natural width, so a
	 * popover too wide for the space beside its anchor slides to a roomier side
	 * rather than wrapping into it. Both axes take the same four values under the
	 * same rules - see `TPopoverAxisSize` in `anchored-popover-size.tsx`.
	 */
	inlineSize?: TPopoverAxisSize;
	/**
	 * The block-axis twin of `inlineSize`, so `'max-available'` caps the HEIGHT.
	 */
	blockSize?: TPopoverAxisSize;
	/**
	 * Leaves `inline-size` to the popover element's own styles, skipping
	 * `TPopoverAxisSize` rule 4. For an element the consumer owns and may have given
	 * a `width` of its own - `@atlaskit/popper`'s imperative `createPopper` adapter
	 * is the case. Everything positioning an unstyled `Popover` host leaves this
	 * `false`.
	 */
	shouldPreserveInlineSize?: boolean;
	/**
	 * Forces the JavaScript positioning fallback, so it can be exercised in any
	 * environment.
	 *
	 * @internal Testing only. Also switches sizing to measured pixels, because
	 * `anchor-size()` has no anchor to resolve against without `position-anchor`.
	 */
	forceFallbackPositioning?: boolean;
};

/**
 * Positions and sizes a popover relative to an anchor. Owns every inline style on
 * the popover host: where it goes, how big it is relative to its anchor, and the
 * margins that keep it clear of the anchor and the viewport edge. It knows nothing
 * about visibility or animation - compose it with `Popover`.
 *
 * On modern browsers the browser handles flipping via CSS Anchor Positioning;
 * otherwise it falls back to measured `position: fixed` coordinates, re-run on
 * scroll and resize.
 *
 * `inlineSize` and `blockSize` both default to `'content'`. Two rules are
 * surprising: fitting one axis also fits an axis left on `'content'`, and fitting
 * either axis floors the placement axis. See `TPopoverAxisSize`.
 *
 * **Several React roots on one page.** The `anchor-name` this hook writes to an
 * anchor that has none is minted from `useId()`, like every other id in the design
 * system. `useId()` is unique within a root; across roots it is unique for
 * client-rendered roots but NOT for roots that hydrate the same markup, where it
 * is derived from tree position. Two anchors carrying one name resolve to the last
 * in tree order, so a popover can attach to another root's trigger. A host that
 * hydrates more than one root must give each a distinct `identifierPrefix` (on
 * `hydrateRoot` and the matching server render). That is already required for the
 * popover's own `id`, which `aria-controls` and `popovertarget` point at, and for
 * every `aria-*` id the design system mints. A bundle with two copies of
 * `react-dom` has the same exposure for client-rendered roots.
 *
 * @example Position a popover below its trigger
 * ```tsx
 * const triggerRef = useRef<HTMLButtonElement>(null);
 * const popoverRef = useRef<HTMLDivElement>(null);
 *
 * useAnchoredPopover({
 *   anchorRef: triggerRef,
 *   popoverRef,
 *   placement: { axis: 'block', edge: 'end' },
 *   isOpen,
 * });
 * ```
 *
 * @example Match the trigger's width and keep the popover on screen
 * ```tsx
 * // What `<Popup shouldFitContainer shouldFitViewport>` maps to.
 * useAnchoredPopover({
 *   anchorRef: triggerRef,
 *   popoverRef,
 *   placement: { axis: 'block', edge: 'end' },
 *   isOpen,
 *   inlineSize: 'match-anchor',
 *   blockSize: 'max-available',
 * });
 * ```
 *
 * @example Switch to a cursor position mid-mount
 * ```tsx
 * // Complementary `isEnabled`, so exactly one hook owns the popover.
 * const shared = { popoverRef, placement, isOpen };
 *
 * useAnchoredPopover({ ...shared, anchorRef: triggerRef, isEnabled: !mousePos });
 * useAnchoredPopoverAtPoint({
 *   ...shared,
 *   isEnabled: Boolean(mousePos),
 *   getPoint: () => mousePosRef.current,
 * });
 * ```
 */
export function useAnchoredPopover({
	anchorRef,
	popoverRef,
	placement,
	isOpen,
	isEnabled = true,
	inlineSize = 'content',
	blockSize = 'content',
	shouldPreserveInlineSize = false,
	forceFallbackPositioning = false,
}: TAnchoredPopoverOptions): void {
	// Stable for the life of the hook instance, so it follows a replacement anchor
	// element (the point hook remounts its `<div>`).
	const fallbackAnchorName = useNewAnchorName();

	const stablePlacement = useStablePlacement(placement);

	useLayoutEffect(() => {
		if (!isEnabled) {
			return;
		}

		// Resolved once, so positioning, sizing and margins cannot disagree about it.
		const isUsingCssAnchorPositioning = supportsAnchorPositioning() && !forceFallbackPositioning;

		// BOTH probes: a browser can have positioning without sizing, and
		// `anchor-size()` needs the `position-anchor` only the CSS path writes.
		const canUseAnchorSize = isUsingCssAnchorPositioning && supportsAnchorSize();

		const trigger = anchorRef.current;
		const popover = popoverRef.current;

		if (!trigger || !popover) {
			return;
		}

		// Fitting also reserves padding from the viewport edge as a margin.
		const isFitting = inlineSize === 'max-available' || blockSize === 'max-available';

		// Always read: the viewport caps are always written, and their unit follows
		// the popover's writing mode.
		const writingMode = getPopoverWritingMode({ popover });

		// Skipped where possible, so a position-only consumer pays no layout read.
		// Fitting on the CSS path needs it to clamp the default flip floor; see
		// `getDefaultPlacementAxisFloor`.
		const needsAnchorSize =
			isAnchorRelative(inlineSize) ||
			isAnchorRelative(blockSize) ||
			(isFitting && isUsingCssAnchorPositioning);

		const anchorSize: TAnchorSizeValues = needsAnchorSize
			? canUseAnchorSize
				? CSS_ANCHOR_SIZE
				: measureAnchorSize({ anchor: trigger, writingMode })
			: NO_ANCHOR_SIZE;

		const sizeStyles = getAnchoredPopoverSizeDeclarations({
			placement: stablePlacement,
			inlineSize,
			blockSize,
			isUsingCssAnchorPositioning,
			anchorSize,
			writingMode,
			shouldPreserveInlineSize,
		});

		if (isUsingCssAnchorPositioning) {
			return applyAnchorPositioning({
				anchor: trigger,
				popover,
				placement: stablePlacement,
				sizeStyles,
				isFitting,
				fallbackAnchorName,
			});
		}

		return applyJavaScriptFallbackPositioning({
			anchor: trigger,
			popover,
			placement: stablePlacement,
			sizeStyles,
		});
	}, [
		isEnabled,
		anchorRef,
		popoverRef,
		stablePlacement,
		inlineSize,
		blockSize,
		shouldPreserveInlineSize,
		fallbackAnchorName,
		forceFallbackPositioning,
		isOpen,
	]);
}
