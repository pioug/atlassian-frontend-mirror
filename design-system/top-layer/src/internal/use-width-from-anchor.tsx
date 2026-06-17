import { type RefObject, useLayoutEffect } from 'react';

import type { TWidthFromAnchorMode } from '../popover/types';

import { setStyle } from './set-style';

/**
 * Sets the width of a popover element relative to its anchor element.
 *
 * - `'match-anchor'` → `width: anchor-size(width)` - popover matches anchor width exactly.
 * - `'min-anchor'`   → `min-width: anchor-size(width)` - popover is at least as wide as anchor,
 *   but can grow wider.
 * - `'none'`         → no explicit width is set (default behaviour)
 *
 * Uses CSS `anchor-size(width)` when the browser supports it, falling back to a
 * one-off measurement of `anchor.offsetWidth`.
 *
 * Designed to be composed alongside `useAnchorPosition` for top-layer popovers.
 */
export function useWidthFromAnchor({
	mode,
	popoverRef,
	anchorRef,
	isOpen,
}: {
	mode: TWidthFromAnchorMode;
	popoverRef: RefObject<HTMLElement | null>;
	anchorRef: RefObject<HTMLElement | null>;
	isOpen: boolean;
}): void {
	useLayoutEffect(() => {
		const node = popoverRef.current;
		if (!node) {
			return;
		}

		// Feature-detect `anchor-size()` specifically (not just `anchor-name`)
		// so the JS fallback fires correctly in browsers that support anchor
		// positioning but not anchor sizing.
		const supportsAnchorSize =
			typeof CSS !== 'undefined' &&
			typeof CSS.supports === 'function' &&
			CSS.supports('width', 'anchor-size(width)');

		if (mode === 'match-anchor') {
			// Set an exact width matching the anchor.
			// `min-inline-size` is intentionally NOT set here - it would override the
			// explicit width constraint, allowing the popover to grow past the anchor's width.
			if (supportsAnchorSize) {
				return setStyle({
					element: node,
					styles: [{ property: 'width', value: 'anchor-size(width)' }],
				});
			}

			// JS fallback: one-off read of the anchor's width.
			const anchor = anchorRef.current;
			if (anchor) {
				return setStyle({
					element: node,
					styles: [{ property: 'width', value: `${anchor.offsetWidth}px` }],
				});
			}

			return;
		}

		// For 'min-anchor' and 'none', apply `min-inline-size: max-content` to ensure
		// correct position-try-fallbacks behaviour (popover margin box overflows the
		// viewport when its span region is too narrow, rather than wrapping content).
		const minInlineSizeStyle = { property: 'min-inline-size', value: 'max-content' };

		if (mode === 'min-anchor') {
			// Set a minimum width matching the anchor. The popover can grow wider
			// if its content requires it.
			if (supportsAnchorSize) {
				return setStyle({
					element: node,
					styles: [minInlineSizeStyle, { property: 'min-width', value: 'anchor-size(width)' }],
				});
			}

			const anchor = anchorRef.current;
			if (anchor) {
				return setStyle({
					element: node,
					styles: [minInlineSizeStyle, { property: 'min-width', value: `${anchor.offsetWidth}px` }],
				});
			}

			// No anchor available in JS fallback - still apply min-inline-size.
			return setStyle({ element: node, styles: [minInlineSizeStyle] });
		}

		// 'none' mode: no explicit width, but still apply `min-inline-size: max-content`.
		return setStyle({ element: node, styles: [minInlineSizeStyle] });
	}, [mode, popoverRef, anchorRef, isOpen]);
}
