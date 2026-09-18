/**
 * The CSS Anchor Positioning path: `position-anchor`, `position-area`,
 * `position-try-fallbacks` and the gap / shift margins, all declared on the
 * popover so the browser owns placement and flipping. The twin of
 * `../javascript-fallback/apply-javascript-fallback-positioning`.
 */
import { type TPlacement } from '../resolve-placement';
import { setStyle, type TStyleDeclaration } from '../set-style';
import { crossAxisShiftMargins } from './cross-axis-shift-margins';
import { edgeMargin } from './edge-margin';
import { getFitMarginDeclarations } from './fit-margins';
import { getExistingAnchorName } from './get-existing-anchor-name';
import { placementToPositionArea } from './placement-to-position-area';
import { placementToTryFallbacks } from './placement-to-try-fallbacks';

/**
 * Returns the cleanup.
 */
export function applyAnchorPositioning({
	anchor,
	popover,
	placement,
	sizeStyles,
	isFitting,
	fallbackAnchorName,
}: {
	anchor: HTMLElement;
	popover: HTMLElement;
	placement: TPlacement;
	sizeStyles: TStyleDeclaration[];
	/**
	 * Whether either axis is `'max-available'`, which also reserves padding from
	 * the viewport edge as a margin.
	 */
	isFitting: boolean;
	/**
	 * Written to the anchor when it does not already carry one.
	 */
	fallbackAnchorName: string;
}): () => void {
	// Reuse rather than mint: another popover may already be anchored to it, or a
	// CONSUMER may have set it on their own element, as `post-office` does.
	const existingAnchorName = getExistingAnchorName(anchor);
	const anchorName = existingAnchorName ?? fallbackAnchorName;

	const gap = edgeMargin({
		placement,
		offset: placement.offset.gap,
	});
	const crossAxisShift = crossAxisShiftMargins({
		placement,
		crossAxisShiftCssValue: placement.offset.crossAxisShift.value,
		direction: placement.offset.crossAxisShift.direction,
	});

	const popoverStyles: TStyleDeclaration[] = [
		{ property: 'position-anchor', value: anchorName },
		{
			property: 'position-area',
			value: placementToPositionArea({ placement }),
		},
		{
			property: 'position-try-fallbacks',
			value: placementToTryFallbacks({ placement }),
		},
		/**
		 * **`position-visibility: always`**
		 *
		 * `position-visibility` is used to control the visibility of an anchored
		 * popover based on the visibility of the element being anchored to (the target).
		 *
		 * Default `position-visibility` value: `anchors-visible` → hide the anchored
		 * popover when the target is fully clipped by an ancestor (eg a scroll container)
		 * or is `visibility:hidden`.
		 * Sadly this "automatic hiding" does not actually "close" the popover,
		 * so things like `:popover-open` are still active, even though the popover
		 * is no longer painted and no longer receives pointer input. Chrome keeps it
		 * focusable and in the accessibility tree, so keyboard and screen reader users
		 * can still land inside a surface that is not painted.
		 * Per-engine behaviour: `notes/decisions/position-visibility-always.md`.
		 *
		 * Generally we have not run into issues with the default (`anchors-visible`)
		 *
		 * Exceptions:
		 *  - Target is intentionally not visible (eg `position:absolute` moving it outside of
		 *    its parent's "clipped boundary", or a `visibility:hidden` trigger)
		 *  - A trigger is scrolled out of its scroll container while the popover is open.
		 *
		 * We are switching from `anchors-visible` → `always` _for now_ to force no
		 * automatic hiding of the popover. There seems to be no compelling reason to use
		 * the default value. If one arises in the future, we could look towards making
		 *  this behaviour configurable.
		 */
		{ property: 'position-visibility', value: 'always' },
		// Reset browser default popover positioning that conflicts
		// with anchor positioning (UA: `inset: 0; margin: auto;`)
		{ property: 'margin', value: '0' },
		{ property: 'inset', value: 'auto' },
		gap,
		// When fitting, the shift margins come back COMPOSED with the reserved
		// viewport padding, rather than being written twice.
		...(isFitting
			? getFitMarginDeclarations({
					placement,
					crossAxisShiftMargins: crossAxisShift,
				})
			: crossAxisShift),
		...sizeStyles,
	];

	// Anchor names are never cleaned up: multiple popovers can share an anchor,
	// and even with reference counting an async React update could remove the name
	// while something else still uses it. See
	// `notes/decisions/anchor-name-lifetime.md`. Only written when minted: a name
	// from a stylesheet may be a list, which an inline copy of its first entry
	// would collapse.
	if (existingAnchorName === null) {
		anchor.style.setProperty('anchor-name', anchorName);
	}

	return setStyle({ element: popover, styles: popoverStyles });
}
