/**
 * The CSS Anchor Positioning path: `position-anchor`, `position-area`,
 * `position-try-fallbacks` and the gap and shift margins, all declared on the
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
 * Writes the anchor positioning styles to the popover, and an `anchor-name` to
 * the anchor when it has none. Returns a cleanup that restores the popover's
 * previous inline styles. The `anchor-name` stays on the anchor.
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
	 * Written to the anchor when it does not already carry an `anchor-name`.
	 */
	fallbackAnchorName: string;
}): () => void {
	// Reuse the existing name rather than write a new one: another popover may already be anchored to it, or a
	// CONSUMER may have set it on their own element, as `post-office` does.
	const existingAnchorName = getExistingAnchorName({ element: anchor });
	const anchorName = existingAnchorName ?? fallbackAnchorName;

	const gapMargin = edgeMargin({
		placement,
		offset: placement.offset.gap,
	});
	const shiftMargins = crossAxisShiftMargins({
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
		 * The initial value, `anchors-visible`, lets the browser hide the popover
		 * when its anchor is fully clipped by an ancestor (for example a scroll
		 * container) or is `visibility: hidden`. This hiding does not close the
		 * popover: `:popover-open` still matches, but the popover is not painted and
		 * gets no pointer input. Chrome also keeps it focusable and in the
		 * accessibility tree, so keyboard and screen reader users can land inside a
		 * surface they cannot see.
		 *
		 * The default is usually fine. It fails when:
		 *  - The anchor is hidden on purpose (for example `position: absolute` moves
		 *    it outside its parent's clip, or it is `visibility: hidden`).
		 *  - The anchor scrolls out of its scroll container while the popover is
		 *    open.
		 *
		 * `always` turns the automatic hiding off. There is no strong reason to keep
		 * the default. If one comes up, this could become configurable. Per-engine
		 * behaviour: `notes/decisions/position-visibility-always.md`.
		 */
		{ property: 'position-visibility', value: 'always' },
		// Reset the UA popover styles (`inset: 0; margin: auto`), which conflict
		// with anchor positioning.
		{ property: 'margin', value: '0' },
		{ property: 'inset', value: 'auto' },
		gapMargin,
		// When fitting, the shift margins come back COMPOSED with the reserved
		// viewport padding, rather than being written twice.
		...(isFitting
			? getFitMarginDeclarations({
					placement,
					crossAxisShiftMargins: shiftMargins,
				})
			: shiftMargins),
		...sizeStyles,
	];

	// Anchor names are never removed: several popovers can share an anchor, and
	// even with reference counting an async React update could remove the name
	// while something else still uses it. See
	// `notes/decisions/anchor-name-lifetime.md`. Only a new name is written: a
	// name from a stylesheet may be a list, which an inline copy of its first entry
	// would collapse.
	if (existingAnchorName === null) {
		anchor.style.setProperty('anchor-name', anchorName);
	}

	return setStyle({ element: popover, styles: popoverStyles });
}
