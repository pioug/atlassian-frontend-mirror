import { type RefObject, useLayoutEffect } from 'react';

import { setStyle } from './set-style';

/**
 * Applies the `shouldFitViewport` size caps directly to the
 * `position-area`-anchored popover host. Pure CSS — the browser owns every
 * value, so there is no measurement, no scroll/resize listeners, and no
 * `--ds-popper-anchor-*` custom properties.
 *
 * **Primary (placement) axis** is capped to `calc(100% - 5px - gap)`. Because
 * the host carries `position-area`, its containing block *is* the position-area
 * cell — the region between the anchor edge and the viewport edge — so `100%`
 * resolves to that distance. The popover is pushed `gap` into the cell by its
 * offset margin (`margin-*`, set by `useAnchorPosition`), so the gap is
 * subtracted as well to keep the legacy `viewportPadding = 5` on the far edge.
 * The cap is also more correct than measuring the requested placement: the cell
 * follows whichever side `position-try-fallbacks` actually flips to, so it
 * tracks the flip automatically.
 *
 * **Cross axis** is capped to `calc(100dvw|dvh - 10px)` (viewport, legacy
 * `2 * viewportPadding`). `display: flex` (plus a `min-*-size: 0` reset on the
 * child) lets an oversized child shrink and reflow to the cap. The host stays
 * `overflow: visible` so it never clips the consumer surface's `box-shadow`;
 * scrolling content that cannot reflow is the consumer surface's own
 * responsibility (it owns `overflow`), matching legacy `react-popper`, which
 * applied the cap to the consumer's own element.
 *
 * `min-inline-size` is reset to `0`. `useWidthFromAnchor({ mode: 'none' })`
 * floors the host at `max-content` so a too-narrow span overflows and drives
 * `position-try-fallbacks` rather than wrapping. That floor is the opposite of
 * fitting: when it exceeds a cap, CSS min/max resolution lets the min win and
 * the host overflows the viewport. In fit mode the caps must win, so the floor
 * is neutralised here; `setStyle` restores the prior inline value on cleanup.
 *
 * Verified in Chromium: `max-block-size: calc(100% - …)` on a `position: fixed`
 * + `position-area` element resolves `100%` to the cell, not the viewport.
 */
type TPlacementAxis = 'top' | 'bottom' | 'left' | 'right';

const CROSS_INLINE_CAP = 'calc(100dvw - 10px)';
const CROSS_BLOCK_CAP = 'calc(100dvh - 10px)';

/**
 * Legacy `viewportPadding` (`preventOverflow` padding) the popover kept from
 * every viewport edge under `react-popper`. The caps above already *reserve*
 * this space (`- 5px` on the primary far edge, `- 10px` = `2 * 5px` on the
 * cross axis), but nothing makes the reservation land on the viewport side:
 * the anchor-side gap is a real margin (`useAnchorPosition`'s `edgeMargin`),
 * the viewport side has none, so a capped popover packs flush against the
 * viewport edge it slid/flipped to. Re-applying the padding as a margin on the
 * three non-anchor sides puts the reserved space back on the viewport side.
 * `position-try` flips mirror margins and slides keep them per-side, so the
 * gap tracks whichever edge the browser settles on.
 */
const VIEWPORT_PADDING = '5px';

/**
 * The popover's three non-anchor margin sides for a given placement axis — the
 * primary *far* side plus both cross sides. The remaining (anchor-facing) side
 * already carries the offset gap from `useAnchorPosition` and is left alone.
 */
const NON_ANCHOR_MARGIN_SIDES: Record<TPlacementAxis, string[]> = {
	top: ['margin-block-start', 'margin-inline-start', 'margin-inline-end'],
	bottom: ['margin-block-end', 'margin-inline-start', 'margin-inline-end'],
	left: ['margin-inline-start', 'margin-block-start', 'margin-block-end'],
	right: ['margin-inline-end', 'margin-block-start', 'margin-block-end'],
};

/**
 * @param target        the `position-area`-anchored popover host
 * @param placementAxis the primary axis derived from the popper placement
 * @param gap           the offset distance the popover is pushed from the
 *                      anchor (CSS length), subtracted from the primary cap
 * @param isEnabled     mirrors the consumer's `shouldFitViewport` prop
 * @param isOpen        re-applies the caps after the host unmounts/remounts
 *                      across open cycles (the host is torn down on exit)
 */
export function useFitViewportMaxSize({
	target,
	placementAxis,
	gap,
	isEnabled,
	isOpen,
}: {
	target: RefObject<HTMLElement | null>;
	placementAxis: TPlacementAxis;
	gap: string;
	isEnabled: boolean;
	isOpen: boolean;
}): void {
	useLayoutEffect(() => {
		const element = target.current;
		if (!element || !isEnabled) {
			return;
		}

		const isBlockAxis = placementAxis === 'top' || placementAxis === 'bottom';
		const primaryAxisCap = `calc(100% - 5px - ${gap})`;

		const cleanupHost = setStyle({
			element,
			styles: [
				{ property: 'display', value: 'flex' },
				// Neutralise `useWidthFromAnchor`'s `min-inline-size: max-content`
				// floor so the caps below win and content reflows. `setStyle`
				// restores the floor on cleanup.
				{ property: 'min-inline-size', value: '0' },
				isBlockAxis
					? { property: 'max-block-size', value: primaryAxisCap }
					: { property: 'max-inline-size', value: primaryAxisCap },
				isBlockAxis
					? { property: 'max-inline-size', value: CROSS_INLINE_CAP }
					: { property: 'max-block-size', value: CROSS_BLOCK_CAP },
				// Park the reserved viewport padding on the non-anchor sides so a
				// capped popover keeps the legacy `viewportPadding` gap from the
				// viewport edge instead of sitting flush against it.
				...NON_ANCHOR_MARGIN_SIDES[placementAxis].map((property) => ({
					property,
					value: VIEWPORT_PADDING,
				})),
			],
		});

		// The host deliberately stays `overflow: visible`. An ancestor with
		// `overflow: auto` clips a descendant's `box-shadow`, so capping and
		// scrolling on the host would strip the elevation shadow from the
		// consumer surface. Instead the host only constrains size; scrolling
		// oversized content is the consumer surface's own responsibility,
		// matching the contract `@atlaskit/top-layer`'s `PopoverSurface` follows
		// (shadow and `overflow` on one element). For that surface (the host's
		// flex child) to be clamped to the cap and scroll its own content, it
		// must be allowed to shrink below its intrinsic size, so reset its
		// min-size floor.
		const child = element.firstElementChild;
		const cleanupChild =
			child instanceof HTMLElement
				? setStyle({
						element: child,
						styles: [
							{ property: 'min-block-size', value: '0' },
							{ property: 'min-inline-size', value: '0' },
						],
					})
				: undefined;

		return () => {
			cleanupHost();
			cleanupChild?.();
		};
	}, [target, placementAxis, gap, isEnabled, isOpen]);
}
