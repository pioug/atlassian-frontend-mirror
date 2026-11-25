/**
 * The CSS Anchor Positioning path: `position-anchor`, `position-area`,
 * `position-try-fallbacks` and the gap and shift margins, all declared on the
 * popover so the browser owns placement and flipping. The twin of
 * `../javascript-fallback/apply-javascript-fallback-positioning`.
 */
import { isOverlapPlacement } from '../is-overlap-placement';
import {
	type TOverlapPlacement,
	type TPlacementAlign,
	type TResolvedPlacement,
} from '../resolve-placement';
import { setStyle, type TStyleDeclaration } from '../set-style';
import { crossAxisShiftMargins } from './cross-axis-shift-margins';
import { edgeMargin } from './edge-margin';
import { getFitMarginDeclarations } from './fit-margins';
import { getExistingAnchorName } from './get-existing-anchor-name';
import { placementToPositionArea } from './placement-to-position-area';
import { placementToTryFallbacks } from './placement-to-try-fallbacks';

/**
 * Maps the placement-axis edge to its matching alignment.
 */
const overlapAlignment: Record<TOverlapPlacement['edge'], TPlacementAlign> = {
	'overlap-start': 'start',
	'overlap-center': 'center',
	'overlap-end': 'end',
};

/**
 * CSS accepts unitless zero as a standalone length, but adding it to an anchor
 * coordinate in calc() requires a length unit.
 */
function toCalcLength(value: string): string {
	return /^[+-]?(?:0+|0*\.0+)(?:e[+-]?\d+)?$/i.test(value.trim()) ? '0px' : value;
}

/**
 * Expresses overlap alignment and offsets as logical CSS anchor insets.
 */
function getOverlapDeclarations({
	placement,
}: {
	placement: TOverlapPlacement;
}): TStyleDeclaration[] {
	const { gap, crossAxisShift } = placement.offset;
	const shift = toCalcLength(crossAxisShift.value);
	const crossAxisOffset = crossAxisShift.direction === 'forwards' ? shift : `calc(-1 * ${shift})`;
	return (['inline', 'block'] as const).flatMap((axis) => {
		const align = axis === placement.axis ? overlapAlignment[placement.edge] : placement.align;
		const property = axis === 'inline' ? 'justify-self' : 'align-self';
		const offset = axis === placement.axis ? toCalcLength(gap) : crossAxisOffset;
		// Offscreen inset points expand overflow alignment's bounds. Keep them in the viewport.
		if (align === 'center') {
			return [
				{ property, value: 'center' },
				{
					property: `inset-${axis}-start`,
					value: `clamp(0px, calc(anchor(center) + ${offset}), 100%)`,
				},
				{
					property: `inset-${axis}-end`,
					value: `clamp(0px, calc(anchor(center) - ${offset}), 100%)`,
				},
			];
		}
		return [
			{ property, value: `self-${align}` },
			{
				property: `inset-${axis}-${align}`,
				value: `clamp(0px, calc(anchor(self-${align}) ${
					align === 'end' ? '-' : '+'
				} ${offset}), 100%)`,
			},
		];
	});
}

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
	placement: TResolvedPlacement;
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

	// Anchor names are never removed: several popovers can share an anchor, and
	// even with reference counting an async React update could remove the name
	// while something else still uses it. See
	// `notes/decisions/anchor-name-lifetime.md`. Only a new name is written: a
	// name from a stylesheet may be a list, which an inline copy of its first entry
	// would collapse.
	if (existingAnchorName === null) {
		anchor.style.setProperty('anchor-name', anchorName);
	}

	// Reset the UA defaults and keep visibility under the consumer's control.
	const baseStyles: TStyleDeclaration[] = [
		{ property: 'position-anchor', value: anchorName },
		// anchors-visible can hide a clipped anchor's popover while it remains focusable.
		// See notes/decisions/position-visibility-always.md.
		{ property: 'position-visibility', value: 'always' },
		{ property: 'margin', value: '0' },
		{ property: 'inset', value: 'auto' },
	];

	if (isOverlapPlacement(placement)) {
		return setStyle({
			element: popover,
			styles: [
				...baseStyles,
				{ property: 'position-area', value: 'span-all' },
				{ property: 'position-try-fallbacks', value: 'none' },
				...getOverlapDeclarations({ placement }),
				...sizeStyles,
			],
		});
	}

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
		...baseStyles,
		{
			property: 'position-area',
			value: placementToPositionArea({ placement }),
		},
		{
			property: 'position-try-fallbacks',
			value: placementToTryFallbacks({ placement }),
		},
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

	return setStyle({ element: popover, styles: popoverStyles });
}
