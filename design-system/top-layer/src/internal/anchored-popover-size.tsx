import { type TPlacement, type TPlacementAxis } from './resolve-placement';
import { type TStyleDeclaration } from './set-style';

/**
 * The space kept clear between a popover and the viewport edge. Matches legacy
 * `@atlaskit/popper`'s `preventOverflow` padding of `5`.
 */
export const VIEWPORT_PADDING = '5px';

/**
 * The upper bound for the default placement-axis floor while fitting. A capped
 * popover never overflows, so it never flips; this floor makes the margin box
 * overflow a too-small cell so `position-try-fallbacks` fires. A flip driver and
 * nothing else, so the JavaScript fallback, which has no cell to overflow, never
 * writes it. See `getPlacementAxisFloor`.
 *
 * 150px is the value the flip was measured with, not a design constant
 * (`notes/plans/should-fit-viewport.md`). Deliberately not a `space.*` token:
 * theming it would move the flip threshold, and so change which side a popover
 * lands on.
 */
export const FALLBACK_MINIMUM_MAIN_AXIS_SIZE = '150px';

/**
 * Which way the POPOVER's inline axis runs; `'vertical'` covers the `vertical-*`
 * and `sideways-*` writing modes. Measured rather than assumed, because every
 * logical property this module writes resolves against the popover's own writing
 * mode, and so must the viewport unit paired with it.
 */
export type TPopoverWritingMode = 'horizontal' | 'vertical';

/**
 * The dynamic viewport unit for one of the popover's axes. Not `dvi` / `dvb`:
 * css-values-4 defines those against the ROOT element's writing mode, while the
 * `max-{axis}-size` they are written to follows the popover's, so a popover in a
 * `vertical-rl` subtree of a horizontal document would be capped by the wrong
 * dimension.
 */
function viewportUnit({
	axis,
	writingMode,
}: {
	axis: TPlacementAxis;
	writingMode: TPopoverWritingMode;
}): string {
	const isHorizontalAxis = (axis === 'inline') === (writingMode === 'horizontal');
	return isHorizontalAxis ? 'dvw' : 'dvh';
}

/**
 * How one axis of an anchored popover is sized. Both axes take these four values
 * under identical rules.
 *
 * - `'content'`: sized by its content. Named after `flex-basis: content`; NOT
 *   `'auto'`, whose CSS meaning for a positioned box is shrink-to-fit, the very
 *   behaviour rule 4 removes.
 * - `'match-anchor'`: exactly the anchor's size on this axis.
 * - `'min-anchor'`: at least the anchor's size on this axis, free to grow.
 * - `'max-available'`: at most the space between the anchor and the viewport
 *   edge, content-sized below that. Capped by the `position-area` cell on the
 *   placement axis and by the viewport on the cross axis (a `span-*` cell is
 *   narrower than the viewport, so capping to it would wrap content that fits on
 *   screen).
 *
 * Four rules apply on top:
 *
 * 1. Fitting one axis fills a `'content'` other axis with `'max-available'` too.
 *    An explicit value is never overridden, so caps stay strictly per-axis.
 * 2. Fitting either axis floors the placement axis, because flipping is a
 *    whole-popover outcome. See `getPlacementAxisFloor`.
 * 3. The viewport cap is unconditional, so a non-fitting axis still cannot
 *    overhang the screen. `'max-available'` and `'content'` are therefore
 *    indistinguishable on the cross axis.
 * 4. A non-anchor-relative inline axis gets `inline-size: max-content`. Under
 *    `position-area` the containing block is the cell, so a CSS `auto` inline
 *    size shrink-to-fits a too-narrow cell and WRAPS into it, never overflowing
 *    and so never sliding to the roomier side. The caps still beat it, because a
 *    max beats a definite size. Not needed on the block axis, which does not
 *    wrap, nor on the JavaScript fallback, whose containing block is the
 *    viewport. Consumers opt out with `shouldPreserveInlineSize`.
 *
 * See `notes/decisions/fit-available-space.md`.
 */
export type TPopoverAxisSize = 'content' | 'match-anchor' | 'min-anchor' | 'max-available';

/**
 * Narrowed rather than `string`, so a typo cannot reach `setStyle` as a
 * silently-ignored property name.
 */
export type TPopoverSizeProperty =
	| `${TPlacementAxis}-size`
	| `min-${TPlacementAxis}-size`
	| `max-${TPlacementAxis}-size`;

/**
 * The anchor's size along each axis, as a CSS length. `null` when nothing needs
 * it, so the measurement is skipped.
 *
 * The CSS path uses the `self-` keywords, whose axes are the POPOVER's, so each
 * value matches the axis of the property it is set on (`anchor-size(inline)` and
 * `anchor-size(width)` are both silently wrong in a vertical writing mode). The
 * JavaScript fallback uses a measured pixel length, because `anchor-size()` needs
 * a `position-anchor` that path never sets. See
 * `notes/decisions/width-from-anchor-floors.md`.
 */
export type TAnchorSizeValues = Record<TPlacementAxis, string | null>;

function getCrossAxis(axis: TPlacementAxis): TPlacementAxis {
	return axis === 'block' ? 'inline' : 'block';
}

/**
 * The whole viewport, less the reserved padding on both sides. Rule 3's backstop.
 */
function viewportCap({
	axis,
	writingMode,
}: {
	axis: TPlacementAxis;
	writingMode: TPopoverWritingMode;
}): string {
	return `calc(100${viewportUnit({ axis, writingMode })} - 2 * ${VIEWPORT_PADDING})`;
}

/**
 * The position-area cell cap, for the placement axis only. The host carries
 * `position-area`, so per css-anchor-position-1 the cell is its containing block:
 * `100%` is the anchor edge to the viewport edge, and it follows whichever side
 * `position-try-fallbacks` settles on. Percentages do not subtract margins, so
 * the gap is subtracted here.
 *
 * Meaningless on the JavaScript fallback, whose containing block is the viewport,
 * so that path gets `viewportCap` on both axes.
 */
function cellCap({ gap }: { gap: string }): string {
	return `calc(100% - ${VIEWPORT_PADDING} - ${gap})`;
}

/**
 * The anchor term of the placement-axis floor, and the one place it is capped.
 *
 * `'match-anchor'` earns a floor only where it can flip: a definite size clamps to
 * the cap and shrinks below the anchor instead of flipping.
 *
 * The `canFlip` clamp is deliberate both ways. With no flip in play an unclamped
 * floor beats `max-{axis}-size` (CSS resolves `min` last), making the viewport
 * backstop inert. With a flip in play, clamping would stop the floor exceeding
 * the cell cap, which is what drives the flip.
 */
function getPlacementAxisAnchorFloor({
	placementAxis,
	placementAxisSize,
	anchorValue,
	canFlip,
	writingMode,
}: {
	placementAxis: TPlacementAxis;
	placementAxisSize: TPopoverAxisSize;
	anchorValue: string | null;
	canFlip: boolean;
	writingMode: TPopoverWritingMode;
}): string | undefined {
	const hasAnchorFloor =
		placementAxisSize === 'min-anchor' || (placementAxisSize === 'match-anchor' && canFlip);

	if (!hasAnchorFloor || anchorValue === null) {
		return undefined;
	}

	if (canFlip) {
		return anchorValue;
	}

	return `min(${anchorValue}, ${viewportCap({ axis: placementAxis, writingMode })})`;
}

/**
 * The default flip floor, clamped so that SOME cell can always hold it.
 *
 * The two cells either side of the anchor add up to the viewport less the anchor,
 * so the roomier one is at least half of that. A floor whose margin box fits
 * inside that half is guaranteed a cell somewhere in the fallback chain.
 * Unclamped, a short viewport with a centred anchor has NO cell that holds
 * 150px: every try-fallback overflows, the browser reverts to the base position,
 * and the floor pushes the popover past the viewport edge.
 *
 * This is NOT the `min(floor, cellCap)` that suppresses flipping: it is relative
 * to the VIEWPORT, so a small base cell still overflows it. `max(0px, …)` states
 * the lower bound for an anchor taller than the viewport.
 */
function getDefaultPlacementAxisFloor({
	placementAxis,
	anchorValue,
	gap,
	writingMode,
}: {
	placementAxis: TPlacementAxis;
	anchorValue: string | null;
	gap: string;
	writingMode: TPopoverWritingMode;
}): string {
	if (anchorValue === null) {
		return FALLBACK_MINIMUM_MAIN_AXIS_SIZE;
	}
	// The viewport term and the anchor term must measure the SAME axis; see
	// `viewportUnit`.
	const viewport = `100${viewportUnit({ axis: placementAxis, writingMode })}`;
	const halfOfRemainingViewport = `calc((${viewport} - ${anchorValue}) / 2 - ${gap} - ${VIEWPORT_PADDING})`;
	return `min(${FALLBACK_MINIMUM_MAIN_AXIS_SIZE}, max(0px, ${halfOfRemainingViewport}))`;
}

/**
 * The placement-axis floor: explicit minimums COMPOSE, the default does not.
 *
 * `placement.minSize` and the anchor term are both explicit requests, so they
 * compose as `max()`. `FALLBACK_MINIMUM_MAIN_AXIS_SIZE` never composes: it only
 * ever won by overriding a size the consumer asked for, and the anchor term drives
 * the flip on its own. Knock-on, intended: `minSize: 0` no longer removes an
 * anchor floor, because `max(0px, anchor)` IS the anchor.
 */
function getPlacementAxisFloor({
	minSize,
	placementAxis,
	placementAxisSize,
	anchorValue,
	gap,
	canFlip,
	writingMode,
}: {
	minSize: string | undefined;
	placementAxis: TPlacementAxis;
	placementAxisSize: TPopoverAxisSize;
	anchorValue: string | null;
	gap: string;
	canFlip: boolean;
	writingMode: TPopoverWritingMode;
}): string | undefined {
	const anchorFloor = getPlacementAxisAnchorFloor({
		placementAxis,
		placementAxisSize,
		anchorValue,
		canFlip,
		writingMode,
	});

	if (minSize !== undefined) {
		return anchorFloor === undefined ? minSize : `max(${minSize}, ${anchorFloor})`;
	}

	if (anchorFloor !== undefined) {
		return anchorFloor;
	}

	if (!canFlip) {
		return undefined;
	}

	return getDefaultPlacementAxisFloor({ placementAxis, anchorValue, gap, writingMode });
}

/**
 * The whole size recipe for an anchored popover, in one place. Pure, so the truth
 * table is unit-testable without a browser, and every size property on the
 * popover host has exactly one writer.
 *
 * While anything is fitting on the CSS path, the placement-axis floor is never
 * clamped to the CELL cap. Its whole job is to exceed it: overflow detection
 * reads the margin box AFTER the clamp (css-anchor-position-1 §6.5), so
 * `min(floor, cap)` suppresses `position-try-fallbacks` entirely. The cross-axis
 * floor is always clamped, because there it is a size contract rather than a flip
 * driver.
 *
 * See `notes/decisions/fit-available-space.md` for the full recipe and the
 * measured evidence.
 */
export function getAnchoredPopoverSizeDeclarations({
	placement,
	inlineSize,
	blockSize,
	isUsingCssAnchorPositioning,
	anchorSize,
	writingMode,
	shouldPreserveInlineSize = false,
}: {
	/**
	 * Supplies the axis, the gap and `minSize`.
	 */
	placement: TPlacement;
	/**
	 * The requested size, before rule 1 fills a `'content'` axis.
	 */
	inlineSize: TPopoverAxisSize;
	/**
	 * The requested size, before rule 1 fills a `'content'` axis.
	 */
	blockSize: TPopoverAxisSize;
	/**
	 * `false` on the JavaScript fallback path, which has no position-area cell, so
	 * both axes get the viewport cap and no flip floor is written.
	 */
	isUsingCssAnchorPositioning: boolean;
	/**
	 * Already resolved for the active path. See `TAnchorSizeValues`.
	 */
	anchorSize: TAnchorSizeValues;
	/**
	 * Picks the physical viewport unit for each logical axis. See `viewportUnit`.
	 */
	writingMode: TPopoverWritingMode;
	/**
	 * `true` skips rule 4, for an element the consumer owns and may have given a
	 * `width` that an inline `max-content` would override.
	 */
	shouldPreserveInlineSize?: boolean;
}): TStyleDeclaration<TPopoverSizeProperty>[] {
	const placementAxis = placement.axis;
	const crossAxis = getCrossAxis(placementAxis);

	// Rule 1. Feeds the per-axis CAPS only.
	const size: Record<TPlacementAxis, TPopoverAxisSize> = {
		inline:
			inlineSize === 'content' && blockSize === 'max-available' ? 'max-available' : inlineSize,
		block: blockSize === 'content' && inlineSize === 'max-available' ? 'max-available' : blockSize,
	};

	// Rule 2 reads the requested values instead, un-mirrored: flipping is a
	// whole-popover outcome, so a fit request on either axis turns the floor on.
	const isFitting = inlineSize === 'max-available' || blockSize === 'max-available';

	// ...but only where the floor is what causes the flip. On the JavaScript
	// fallback a floor only inflates the measured size the side is picked from, so
	// it would flip a popover that fits.
	const canFlip = isFitting && isUsingCssAnchorPositioning;

	const declarations: TStyleDeclaration<TPopoverSizeProperty>[] = [
		// Rule 3: both caps are always written. Only the placement axis can take the
		// cell cap.
		{
			property: `max-${placementAxis}-size`,
			value:
				size[placementAxis] === 'max-available' && isUsingCssAnchorPositioning
					? cellCap({ gap: placement.offset.gap })
					: viewportCap({ axis: placementAxis, writingMode }),
		},
		{ property: `max-${crossAxis}-size`, value: viewportCap({ axis: crossAxis, writingMode }) },
	];

	// Rule 4. Only for a non-anchor-relative inline axis, so `'match-anchor'` below
	// stays the one writer of `inline-size` when it applies. CSS path only: the
	// fallback's containing block is the viewport, where shrink-to-fit already IS
	// the natural width for anything that fits on screen.
	if (
		isUsingCssAnchorPositioning &&
		!shouldPreserveInlineSize &&
		(size.inline === 'content' || size.inline === 'max-available')
	) {
		declarations.push({ property: 'inline-size', value: 'max-content' });
	}

	// A max beats a definite size, so the caps above still win over this.
	for (const axis of [placementAxis, crossAxis]) {
		const anchorValue = anchorSize[axis];
		if (size[axis] === 'match-anchor' && anchorValue !== null) {
			declarations.push({ property: `${axis}-size`, value: anchorValue });
		}
	}

	const placementAxisFloor = getPlacementAxisFloor({
		minSize: placement.minSize,
		placementAxis,
		placementAxisSize: size[placementAxis],
		anchorValue: anchorSize[placementAxis],
		gap: placement.offset.gap,
		canFlip,
		writingMode,
	});
	if (placementAxisFloor !== undefined) {
		declarations.push({ property: `min-${placementAxis}-size`, value: placementAxisFloor });
	}

	// A size contract, not a flip driver, so it is clamped to the cap.
	const crossAxisAnchorValue = anchorSize[crossAxis];
	if (size[crossAxis] === 'min-anchor' && crossAxisAnchorValue !== null) {
		declarations.push({
			property: `min-${crossAxis}-size`,
			value: `min(${crossAxisAnchorValue}, ${viewportCap({ axis: crossAxis, writingMode })})`,
		});
	}

	return declarations;
}
