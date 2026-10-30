import {
	type TCrossAxisShiftDirection,
	type TPlacement,
	type TPlacementAxis,
} from '../resolve-placement';
import { type TStyleDeclaration } from '../set-style';
import { type TLogicalMarginProperty } from './fit-margins';

/**
 * The cross-axis shift, written antisymmetrically on BOTH cross-axis sides rather
 * than as one margin. Do not collapse it to one side: a single margin widens the
 * margin box, so `anchor-center` moves the border box by only half the value, a
 * `<position-area>` fallback that slides across the cross axis drops it
 * entirely, and the wider box changes where the popover is judged to overflow.
 *
 * A positive value always moves the popover toward the cross-axis END, so
 * `direction: 'forwards'` means the same thing for every `align` value. See
 * `notes/decisions/placement-offset.md`.
 */
export function crossAxisShiftMargins({
	placement,
	crossAxisShiftCssValue,
	direction,
}: {
	placement: TPlacement;
	crossAxisShiftCssValue: string;
	direction: TCrossAxisShiftDirection;
}): TStyleDeclaration<TLogicalMarginProperty>[] {
	const crossAxis: TPlacementAxis = placement.axis === 'block' ? 'inline' : 'block';
	// `calc()` rather than JavaScript math, so opaque values such as design tokens
	// negate correctly.
	const negatedValue = `calc(-1 * ${crossAxisShiftCssValue})`;
	const isForwards = direction === 'forwards';
	return [
		{
			property: `margin-${crossAxis}-start`,
			value: isForwards ? crossAxisShiftCssValue : negatedValue,
		},
		{
			property: `margin-${crossAxis}-end`,
			value: isForwards ? negatedValue : crossAxisShiftCssValue,
		},
	];
}
