import once from '@atlaskit/ds-lib/once';

import { getPlacement, placementToPositionArea } from '../internal/use-anchor-positioning';
import { type TPlacementOptions } from '../popup/types';

import { type TArrowPreset } from './types';

/**
 * CSS for popover arrows using the `clip-path: inset() margin-box` technique.
 *
 * How it works:
 * 1. Four arrow shapes exist simultaneously as `::before` (top/bottom) and
 *    `::after` (left/right) hexagonal pseudo-elements.
 * 2. `clip-path: inset(0) margin-box` clips the popover to its margin-box.
 * 3. Margin on the anchor-facing side pushes the popover away, creating space
 *    where one arrow "escapes" the clip boundary and becomes visible.
 * 4. `@position-try` rules change both `position-area` and `margin` when
 *    flipping, ensuring the correct arrow is always shown.
 *
 * Constraints:
 * - `box-shadow` must be `none` (interferes with `clip-path: inset() margin-box`)
 * - `::before` and `::after` are consumed — consumers cannot use them
 * - Arrow pseudo-elements use `background: inherit` from the popover element
 *
 * @see https://goulet.dev/posts/tooltip-with-popover-and-anchor-positioning/
 */
const ARROW_CSS = `
[data-ds-popover-arrow] {
  clip-path: inset(var(--ds-arrow-offset, 0px)) margin-box;
  box-shadow: none;
}

/* Top and Bottom arrows (vertical hexagon) */
[data-ds-popover-arrow]::before {
  content: "";
  position: absolute;
  z-index: -1;
  background: inherit;
  left: 50%;
  transform: translateX(-50%);
  width: calc(var(--ds-arrow-size, 8px) * 2);
  height: calc(100% + var(--ds-arrow-size, 8px) * 2);
  top: calc(var(--ds-arrow-size, 8px) * -1);
  clip-path: polygon(
    0 var(--ds-arrow-size, 8px),
    50% 0,
    100% var(--ds-arrow-size, 8px),
    100% calc(100% - var(--ds-arrow-size, 8px)),
    50% 100%,
    0 calc(100% - var(--ds-arrow-size, 8px))
  );
}

/* Left and Right arrows (horizontal hexagon) */
[data-ds-popover-arrow]::after {
  content: "";
  position: absolute;
  z-index: -1;
  background: inherit;
  top: 50%;
  transform: translateY(-50%);
  height: calc(var(--ds-arrow-size, 8px) * 2);
  width: calc(100% + var(--ds-arrow-size, 8px) * 2);
  left: calc(var(--ds-arrow-size, 8px) * -1);
  clip-path: polygon(
    var(--ds-arrow-size, 8px) 0,
    calc(100% - var(--ds-arrow-size, 8px)) 0,
    100% 50%,
    calc(100% - var(--ds-arrow-size, 8px)) 100%,
    var(--ds-arrow-size, 8px) 100%,
    0 50%
  );
}

/* ── @position-try rules ──
 * One rule per possible position-area value.
 * Each sets the position-area and the correct margin direction
 * so the arrow on the anchor-facing side is revealed.
 *
 * Margin direction per edge:
 *   block-start  (above anchor) → margin-block-end   (bottom, facing anchor)
 *   block-end    (below anchor) → margin-block-start  (top, facing anchor)
 *   inline-start (left of anchor) → margin-inline-end (right, facing anchor)
 *   inline-end   (right of anchor) → margin-inline-start (left, facing anchor)
 */

/* Single-axis centered */
@position-try --ds-arrow-block-start {
  position-area: block-start;
  margin: 0;
  margin-block-end: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-block-end {
  position-area: block-end;
  margin: 0;
  margin-block-start: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-inline-start {
  position-area: inline-start;
  margin: 0;
  margin-inline-end: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-inline-end {
  position-area: inline-end;
  margin: 0;
  margin-inline-start: var(--ds-arrow-size, 8px);
}

/* Block edge + inline span */
@position-try --ds-arrow-block-start-span-inline-start {
  position-area: block-start span-inline-start;
  margin: 0;
  margin-block-end: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-block-start-span-inline-end {
  position-area: block-start span-inline-end;
  margin: 0;
  margin-block-end: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-block-end-span-inline-start {
  position-area: block-end span-inline-start;
  margin: 0;
  margin-block-start: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-block-end-span-inline-end {
  position-area: block-end span-inline-end;
  margin: 0;
  margin-block-start: var(--ds-arrow-size, 8px);
}

/* Inline edge + block span */
@position-try --ds-arrow-inline-start-span-block-start {
  position-area: inline-start span-block-start;
  margin: 0;
  margin-inline-end: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-inline-start-span-block-end {
  position-area: inline-start span-block-end;
  margin: 0;
  margin-inline-end: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-inline-end-span-block-start {
  position-area: inline-end span-block-start;
  margin: 0;
  margin-inline-start: var(--ds-arrow-size, 8px);
}
@position-try --ds-arrow-inline-end-span-block-end {
  position-area: inline-end span-block-end;
  margin: 0;
  margin-inline-start: var(--ds-arrow-size, 8px);
}
`;

// ── Placement utilities ──

/**
 * Converts a `position-area` value to a CSS rule name by replacing spaces with hyphens
 * and prepending `--ds-arrow-`.
 *
 * @example positionAreaToRuleName('block-end span-inline-start') → '--ds-arrow-block-end-span-inline-start'
 */
function positionAreaToRuleName({ positionArea }: { positionArea: string }): string {
	return `--ds-arrow-${positionArea.replace(/ /g, '-')}`;
}

/**
 * Returns `position-try-fallbacks` using named `@position-try` rules
 * that change both `position-area` and `margin` when flipping.
 *
 * This is required for the arrow technique because built-in keywords
 * (`flip-block`, `flip-inline`) only flip `position-area` — they do
 * not update the margin direction needed to reveal the correct arrow.
 */
function getTryFallbacks({ placement }: { placement: TPlacementOptions }): string {
	const { axis, edge, align } = getPlacement({ placement });

	if (align === 'center') {
		// Single-axis: only flip the edge
		const flippedEdge = edge === 'start' ? 'end' : 'start';
		return positionAreaToRuleName({
			positionArea: placementToPositionArea({ placement: { axis, edge: flippedEdge } }),
		});
	}

	// Compound placement: try flipping edge, alignment, and both
	const flippedEdge = edge === 'start' ? 'end' : 'start';
	const flippedAlign = align === 'start' ? 'end' : 'start';

	return [
		positionAreaToRuleName({
			positionArea: placementToPositionArea({ placement: { axis, edge: flippedEdge, align } }),
		}),
		positionAreaToRuleName({
			positionArea: placementToPositionArea({ placement: { axis, edge, align: flippedAlign } }),
		}),
		positionAreaToRuleName({
			positionArea: placementToPositionArea({
				placement: { axis, edge: flippedEdge, align: flippedAlign },
			}),
		}),
	].join(', ');
}

/**
 * Creates an arrow preset for popover content.
 *
 * The returned object is passed to `PopoverContent`'s `arrow` prop.
 * It carries the CSS string and fallback logic so that consumers who
 * don't use arrows pay no bundle cost.
 *
 * The arrows inherit their background from the popover element.
 * When `arrow` is active, `PopoverContent` does not reset `background`
 * to `transparent`, allowing the UA default (`canvas`) or a consumer-set
 * background to show through.
 *
 * @example
 * ```tsx
 * import { arrow } from '@atlaskit/top-layer/arrow';
 *
 * const myArrow = arrow();
 *
 * <Popup.Content arrow={myArrow} />
 * ```
 */
export const arrow = once(
	(): TArrowPreset => ({
		name: 'arrow',
		css: ARROW_CSS,
		getTryFallbacks,
	}),
) as () => TArrowPreset;

export type { TArrowPreset } from './types';
