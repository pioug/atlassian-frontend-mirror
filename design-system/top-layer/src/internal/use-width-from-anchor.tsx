import { type RefObject, useLayoutEffect } from 'react';

import once from '@atlaskit/ds-lib/once';

import type { TWidthFromAnchorMode } from '../popover/types';

import { setStyle } from './set-style';

/**
 * Probes anchor SIZING, separately from `anchor-name` (see
 * `supportsAnchorPositioning`): some browsers have positioning but not sizing.
 * `once()` for SSR safety.
 */
const supportsAnchorSize = once((): boolean => {
	if (
		typeof window === 'undefined' ||
		typeof CSS === 'undefined' ||
		typeof CSS.supports !== 'function'
	) {
		return false;
	}
	return CSS.supports('min-inline-size', 'anchor-size(self-inline)');
});

/**
 * The JS fallback's stand-in for `anchor-size(self-inline)`. `offsetWidth` / `offsetHeight` are
 * physical, so the axis is picked from the popover's `writing-mode`. Anything not horizontal is
 * treated as vertical, and an unknown or empty value falls back to `offsetWidth`.
 */
function getFallbackAnchorInlineSize({
	anchor,
	popover,
}: {
	anchor: HTMLElement;
	popover: HTMLElement;
}): number {
	// `String()` because not every test environment implements `writing-mode`.
	const writingMode = String(getComputedStyle(popover).writingMode);
	const isVertical = writingMode.startsWith('vertical') || writingMode.startsWith('sideways');
	return isVertical ? anchor.offsetHeight : anchor.offsetWidth;
}

/**
 * Sets the width of a popover element relative to its anchor element.
 *
 * - `'match-anchor'` → `inline-size: anchor-size(self-inline)`, exact
 * - `'min-anchor'`   → `min-inline-size: anchor-size(self-inline)`, floor only
 * - `'none'`         → `min-inline-size: max-content`, content floor (default)
 *
 * `self-inline` is the inline axis of the element USING the function (the popover), never the
 * anchor, so it matches the axis `inline-size` constrains. See
 * `notes/decisions/width-from-anchor-floors.md`.
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

		if (mode === 'match-anchor') {
			// No floor here: it would let the popover grow past the anchor.
			if (supportsAnchorSize()) {
				return setStyle({
					element: node,
					styles: [{ property: 'inline-size', value: 'anchor-size(self-inline)' }],
				});
			}

			const anchor = anchorRef.current;
			if (anchor) {
				return setStyle({
					element: node,
					styles: [
						{
							property: 'inline-size',
							value: `${getFallbackAnchorInlineSize({ anchor, popover: node })}px`,
						},
					],
				});
			}

			return;
		}

		if (mode === 'min-anchor') {
			// One floor only. The content floor from mode 'none' deliberately does not also apply
			// here, and cannot: it would need this same property. See the decision note.
			if (supportsAnchorSize()) {
				return setStyle({
					element: node,
					styles: [{ property: 'min-inline-size', value: 'anchor-size(self-inline)' }],
				});
			}

			const anchor = anchorRef.current;
			if (anchor) {
				return setStyle({
					element: node,
					styles: [
						{
							property: 'min-inline-size',
							value: `${getFallbackAnchorInlineSize({ anchor, popover: node })}px`,
						},
					],
				});
			}

			// Nothing to measure, so no floor.
			return;
		}

		// Makes a too-narrow span overflow and drive `position-try-fallbacks` instead of wrapping.
		// `@atlaskit/popper` resets this exact property to `0` for its fit-to-viewport mode.
		return setStyle({
			element: node,
			styles: [{ property: 'min-inline-size', value: 'max-content' }],
		});
	}, [mode, popoverRef, anchorRef, isOpen]);
}
