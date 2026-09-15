import {
	getAnchoredPopoverSizeDeclarations,
	type TAnchorSizeValues,
	type TPopoverAxisSize,
	type TPopoverWritingMode,
} from '../anchored-popover-size';
import { getFitMarginDeclarations } from '../anchor-positioning/fit-margins';
import { resolvePlacement, type TPlacementOptions } from '../resolve-placement';

/**
 * Unit coverage for the DECLARATIONS the size recipe emits.
 *
 * These assertions stop at the declaration boundary: jsdom has no layout and no
 * cascade, so it cannot tell you whether a percentage cap constrains anything.
 * That is what `__tests__/playwright/fit-available-space.spec.tsx` is for.
 *
 * What is worth unit-testing is the pure logic, where a silent mistake is
 * invisible in a screenshot: which axis each cap lands on and which reference it
 * uses, that the cap is PER-AXIS while the floor is not, which value the floor
 * takes, whether it is clamped, and that the cross-axis shift is COMPOSED with
 * the viewport padding rather than overwritten.
 *
 * Both positioning paths are exercised, because the resolver takes
 * `isUsingCssAnchorPositioning` as a parameter rather than probing for it.
 */

const ANCHOR: TAnchorSizeValues = {
	inline: 'anchor-size(self-inline)',
	block: 'anchor-size(self-block)',
};

const NO_ANCHOR: TAnchorSizeValues = { inline: null, block: null };

function sizesFor({
	placement,
	inlineSize = 'content',
	blockSize = 'content',
	isUsingCssAnchorPositioning = true,
	anchorSize = NO_ANCHOR,
	writingMode = 'horizontal',
	shouldPreserveInlineSize,
}: {
	placement: TPlacementOptions;
	inlineSize?: TPopoverAxisSize;
	blockSize?: TPopoverAxisSize;
	isUsingCssAnchorPositioning?: boolean;
	anchorSize?: TAnchorSizeValues;
	writingMode?: TPopoverWritingMode;
	shouldPreserveInlineSize?: boolean;
}): { [property: string]: string } {
	return getAnchoredPopoverSizeDeclarations({
		placement: resolvePlacement({ placement }),
		inlineSize,
		blockSize,
		isUsingCssAnchorPositioning,
		anchorSize,
		writingMode,
		shouldPreserveInlineSize,
	}).reduce<{ [property: string]: string }>((accumulator, { property, value }) => {
		accumulator[property] = value;
		return accumulator;
	}, {});
}

function marginsFor({
	placement,
	crossAxisShift,
}: {
	placement: TPlacementOptions;
	crossAxisShift?: string;
}): { [property: string]: string } {
	const resolved = resolvePlacement({ placement });
	const crossAxis = resolved.axis === 'block' ? 'inline' : 'block';
	return getFitMarginDeclarations({
		placement: resolved,
		crossAxisShiftMargins:
			crossAxisShift === undefined
				? []
				: [
						{ property: `margin-${crossAxis}-start`, value: crossAxisShift },
						{ property: `margin-${crossAxis}-end`, value: `calc(-1 * ${crossAxisShift})` },
					],
	}).reduce<{ [property: string]: string }>((accumulator, { property, value }) => {
		accumulator[property] = value;
		return accumulator;
	}, {});
}

/**
 * The 150px constant, clamped so the roomier cell beside the anchor can always
 * hold its margin box (`floor + gap + padding`).
 */
function clampedDefaultFloor({
	axis,
	gap = 'var(--ds-space-100, 8px)',
}: {
	axis: 'block' | 'inline';
	gap?: string;
}): string {
	const unit = axis === 'block' ? 'dvh' : 'dvw';
	return `min(150px, max(0px, calc((100${unit} - anchor-size(self-${axis})) / 2 - ${gap} - 5px)))`;
}

describe('the unconditional viewport backstop', () => {
	it('caps both axes to the viewport even when nothing was asked for', () => {
		// The full object, so an extra or missing declaration fails: rule 4's
		// natural width is the only other thing an unconfigured popover gets.
		expect(sizesFor({ placement: { axis: 'block', edge: 'end' } })).toEqual({
			'max-block-size': 'calc(100dvh - 2 * 5px)',
			'max-inline-size': 'calc(100dvw - 2 * 5px)',
			'inline-size': 'max-content',
		});
	});

	it('pairs each logical axis with the viewport unit for the POPOVER writing mode', () => {
		// In `vertical-rl` the popover's inline axis runs top to bottom, so its
		// inline cap must be against the viewport HEIGHT. `dvi` / `dvb` would not do
		// this: css-values-4 resolves them against the ROOT element's writing mode.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			writingMode: 'vertical',
		});

		expect(declarations['max-inline-size']).toBe('calc(100dvh - 2 * 5px)');
		expect(declarations['max-block-size']).toBe('calc(100dvw - 2 * 5px)');
	});

	it('mixes the viewport term and the anchor term of the default floor on the same axis', () => {
		// `anchor-size(self-block)` is the popover's block axis, so the viewport it is
		// subtracted from must be measured along that same axis: the WIDTH in a
		// vertical writing mode.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			blockSize: 'max-available',
			anchorSize: ANCHOR,
			writingMode: 'vertical',
		});

		expect(declarations['min-block-size']).toBe(
			'min(150px, max(0px, calc((100dvw - anchor-size(self-block)) / 2 - var(--ds-space-100, 8px) - 5px)))',
		);
	});

	it('still caps the axis carrying an exact anchor size, which is the bug it fixes', () => {
		// A `match-anchor` popover on a full-width trigger used to overhang the
		// viewport, because nothing capped it.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'match-anchor',
			anchorSize: ANCHOR,
		});

		expect(declarations['inline-size']).toBe('anchor-size(self-inline)');
		expect(declarations['max-inline-size']).toBe('calc(100dvw - 2 * 5px)');
	});
});

describe("'max-available' caps", () => {
	it('caps the placement axis to the position-area cell, less the gap and the padding', () => {
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			blockSize: 'max-available',
		});

		expect(declarations['max-block-size']).toBe('calc(100% - 5px - var(--ds-space-100, 8px))');
	});

	it('subtracts a consumer gap from the cell cap, so the popover never sits off the edge', () => {
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end', offset: { gap: 20 } },
			blockSize: 'max-available',
		});

		expect(declarations['max-block-size']).toBe('calc(100% - 5px - 20px)');
	});

	it('caps the cross axis to the viewport rather than to the cell', () => {
		// Capping the cross axis to the cell would be a behaviour change: for a
		// `span-*` placement the cell is narrower than the viewport, so content
		// that fits on screen today would start wrapping.
		const blockAxis = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'max-available',
			blockSize: 'max-available',
		});
		const inlineAxis = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'max-available',
			blockSize: 'max-available',
		});

		expect(blockAxis['max-inline-size']).toBe('calc(100dvw - 2 * 5px)');
		expect(inlineAxis['max-block-size']).toBe('calc(100dvh - 2 * 5px)');
	});

	it('swaps which axis gets the cell cap when the placement axis is inline', () => {
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'start' },
			inlineSize: 'max-available',
		});

		expect(declarations['max-inline-size']).toBe('calc(100% - 5px - var(--ds-space-100, 8px))');
		expect(declarations['max-block-size']).toBe('calc(100dvh - 2 * 5px)');
	});

	it('caps ONLY the axes that asked to fit, leaving an explicit axis on the backstop', () => {
		// `blockSize: 'match-anchor'` answers the placement axis explicitly, so
		// rule 1's mirror skips it and it never sees the cell cap. The FLOOR still
		// lands on it, flipping being a whole-popover outcome.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'max-available',
			blockSize: 'match-anchor',
			anchorSize: ANCHOR,
		});

		expect(declarations['max-block-size']).toBe('calc(100dvh - 2 * 5px)');
		expect(declarations['max-inline-size']).toBe('calc(100dvw - 2 * 5px)');
		expect(declarations['block-size']).toBe('anchor-size(self-block)');
		expect(declarations['min-block-size']).toBe('anchor-size(self-block)');
	});
});

/**
 * Rule 1 is a CAP rule and nothing else: it decides whether the placement axis
 * gets the cell cap or only the viewport backstop. What it does NOT do is turn
 * the floor on - that is rule 2, which reads the requested values rather than the
 * mirrored ones.
 */
describe('Rule 1: the mirror fills an unset axis, and never overrides an explicit one', () => {
	it('produces the cell cap on the placement axis when only the CROSS axis asked to fit', () => {
		// A consumer cannot always know which axis is the placement axis, so
		// `blockSize: 'max-available'` on a left/right placement still caps inline.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			blockSize: 'max-available',
			inlineSize: 'content',
		});

		expect(declarations['max-inline-size']).toBe('calc(100% - 5px - var(--ds-space-100, 8px))');
		expect(declarations['min-inline-size']).toBe('150px');
	});

	it('never overrides an axis that was answered explicitly', () => {
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'match-anchor',
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['inline-size']).toBe('anchor-size(self-inline)');
		expect(declarations['max-inline-size']).toBe('calc(100dvw - 2 * 5px)');
	});
});

describe('Rule 2: the flip floor on the placement axis', () => {
	it('is off when nothing is fitting', () => {
		expect(sizesFor({ placement: { axis: 'block', edge: 'end' } })).not.toHaveProperty(
			'min-block-size',
		);
	});

	it('defaults on whenever anything is fitting, so a too-small cell overflows', () => {
		// A cap alone suppresses `position-try-fallbacks`: overflow detection reads
		// the margin box AFTER the clamp, so the floor is what makes the overflow
		// real. Both placements, since the units and keywords are per-axis.
		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end' },
				blockSize: 'max-available',
				anchorSize: ANCHOR,
			}),
		).toHaveProperty('min-block-size', clampedDefaultFloor({ axis: 'block' }));

		expect(
			sizesFor({
				placement: { axis: 'inline', edge: 'end' },
				inlineSize: 'max-available',
				anchorSize: ANCHOR,
			}),
		).toHaveProperty('min-inline-size', clampedDefaultFloor({ axis: 'inline' }));
	});

	it('clamps the default floor so the roomier cell can always hold its margin box', () => {
		// The two cells either side of the anchor sum to `viewport - anchor`, so the
		// roomier one is at least half of that. Unclamped, a short viewport with a
		// centred anchor has NO cell that holds `150 + gap + 5`. The clamp is
		// relative to the VIEWPORT, so a small cell still overflows it: this is not
		// the `min(floor, cellCap)` that suppresses flipping. The consumer's gap is
		// inside the clamp, being inside the margin box.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end', offset: { gap: 20 } },
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-block-size']).toBe(
			'min(150px, max(0px, calc((100dvh - anchor-size(self-block)) / 2 - 20px - 5px)))',
		);
		// The cell cap, for contrast: the floor is NOT clamped against this.
		expect(declarations['max-block-size']).toBe('calc(100% - 5px - 20px)');
	});

	it('falls back to the raw 150px when the anchor size is unknown', () => {
		// A safety net rather than a live branch: the hook always supplies the anchor
		// size while fitting on the CSS path.
		expect(
			sizesFor({ placement: { axis: 'block', edge: 'end' }, blockSize: 'max-available' }),
		).toHaveProperty('min-block-size', '150px');
	});

	it('goes on the placement axis only, never on the cross axis', () => {
		const blockAxis = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'max-available',
			blockSize: 'max-available',
		});
		const inlineAxis = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'max-available',
			blockSize: 'max-available',
		});

		expect(blockAxis).not.toHaveProperty('min-inline-size');
		expect(inlineAxis).not.toHaveProperty('min-block-size');
	});

	it('is overridden by an explicit placement.minSize', () => {
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end', minSize: 40 },
			blockSize: 'max-available',
		});

		expect(declarations['min-block-size']).toBe('40px');
	});

	it('honours minSize: 0 as the "cap me but do not move me" escape hatch', () => {
		// `0` must survive rather than being treated as "not specified" and
		// replaced by the 150px default.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end', minSize: 0 },
			blockSize: 'max-available',
		});

		expect(declarations['min-block-size']).toBe('0px');
	});

	it('applies an explicit minSize even when nothing is fitting', () => {
		expect(
			sizesFor({ placement: { axis: 'inline', edge: 'end', minSize: '10rem' } }),
		).toHaveProperty('min-inline-size', '10rem');
	});
});

/**
 * Rule 4 keeps the overflow real: under `position-area` a CSS `auto` inline size
 * shrink-to-fits the cell and WRAPS into it, so it never slides to the roomier
 * side. A definite size, so the caps (a max) still beat it - `useWidthFromAnchor`
 * wrote it as a MIN, which beat the caps instead and is why it was once dropped.
 */
describe('Rule 4: a non-anchor-relative inline axis is its natural width', () => {
	it("writes max-content for 'content', on both placement axes", () => {
		expect(sizesFor({ placement: { axis: 'block', edge: 'end' } })).toHaveProperty(
			'inline-size',
			'max-content',
		);
		expect(sizesFor({ placement: { axis: 'inline', edge: 'end' } })).toHaveProperty(
			'inline-size',
			'max-content',
		);
	});

	it("writes max-content for 'max-available' too, so it stays indistinguishable from 'content' on the cross axis", () => {
		// The cap does the fitting; the natural width only decides whether a
		// too-narrow cell is wrapped into or overflowed.
		expect(
			sizesFor({ placement: { axis: 'block', edge: 'end' }, inlineSize: 'max-available' }),
		).toHaveProperty('inline-size', 'max-content');
		expect(
			sizesFor({ placement: { axis: 'inline', edge: 'end' }, inlineSize: 'max-available' }),
		).toHaveProperty('inline-size', 'max-content');
	});

	it('is NOT written on the JavaScript fallback', () => {
		// The containing block is the viewport there, so shrink-to-fit already IS the
		// natural width for anything that fits on screen.
		expect(
			sizesFor({ placement: { axis: 'block', edge: 'end' }, isUsingCssAnchorPositioning: false }),
		).not.toHaveProperty('inline-size');
	});

	it('is skipped for a consumer-owned element with shouldPreserveInlineSize', () => {
		// `@atlaskit/popper`'s imperative `createPopper` positions the CALLER's
		// element, whose own stylesheet `width` an inline `max-content` would
		// override - it shrank a 200px-wide element to its content before this
		// opt-out existed. The caps are still written, being a max not a size.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			shouldPreserveInlineSize: true,
		});

		expect(declarations).not.toHaveProperty('inline-size');
		expect(declarations['max-inline-size']).toBe('calc(100dvw - 2 * 5px)');
	});

	it("does not stop 'match-anchor' when shouldPreserveInlineSize is set", () => {
		// The opt-out is about the DEFAULT; an explicit anchor-relative request still
		// wins, because the consumer asked for it.
		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end' },
				inlineSize: 'match-anchor',
				anchorSize: ANCHOR,
				shouldPreserveInlineSize: true,
			}),
		).toHaveProperty('inline-size', 'anchor-size(self-inline)');
	});

	it("yields to an anchor-relative inline axis: 'match-anchor' is the one writer of inline-size", () => {
		// On the raw declarations rather than through `sizesFor`, whose object
		// reduction would let a duplicated `inline-size` collapse to the last one.
		const inlineSizes = getAnchoredPopoverSizeDeclarations({
			placement: resolvePlacement({ placement: { axis: 'block', edge: 'end' } }),
			inlineSize: 'match-anchor',
			blockSize: 'content',
			isUsingCssAnchorPositioning: true,
			anchorSize: ANCHOR,
			writingMode: 'horizontal',
		}).filter(({ property }) => property === 'inline-size');

		expect(inlineSizes).toEqual([{ property: 'inline-size', value: 'anchor-size(self-inline)' }]);
	});

	it("is not written for 'min-anchor', which wraps down to the anchor's width by design", () => {
		// `min-anchor` is a floor at the anchor and free to WRAP above it: the
		// documented contrast with `'content'` in the narrow-span VR fixtures.
		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end' },
				inlineSize: 'min-anchor',
				anchorSize: ANCHOR,
			}),
		).not.toHaveProperty('inline-size');
	});

	it('never writes a natural size on the block axis, where block flow does not wrap', () => {
		expect(
			sizesFor({ placement: { axis: 'inline', edge: 'end' }, blockSize: 'max-available' }),
		).not.toHaveProperty('block-size');
	});
});

describe('anchor-relative sizing', () => {
	it("gives 'match-anchor' an exact size on either axis", () => {
		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end' },
				blockSize: 'match-anchor',
				anchorSize: ANCHOR,
			}),
		).toHaveProperty('block-size', 'anchor-size(self-block)');

		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end' },
				inlineSize: 'match-anchor',
				anchorSize: ANCHOR,
			}),
		).toHaveProperty('inline-size', 'anchor-size(self-inline)');
	});

	it('emits nothing anchor-relative when the anchor size is unavailable', () => {
		// The JS fallback has nothing to measure when there is no anchor element.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'match-anchor',
			anchorSize: NO_ANCHOR,
		});

		expect(declarations).not.toHaveProperty('inline-size');
	});

	it("CLAMPS a 'min-anchor' floor on the cross axis to the cap", () => {
		// There the floor is a size contract, and CSS min/max resolution lets a min
		// beat a max: a full-width trigger would otherwise floor the popover wider
		// than the viewport.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'min-anchor',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe(
			'min(anchor-size(self-inline), calc(100dvw - 2 * 5px))',
		);
	});

	it("still CLAMPS a 'min-anchor' floor on the cross axis while the popover is fitting", () => {
		// The guard against mirroring the placement-axis logic onto the cross axis:
		// there the floor is a size contract with no flip to drive, so `canFlip` must
		// not unclamp it.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'min-anchor',
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe(
			'min(anchor-size(self-inline), calc(100dvw - 2 * 5px))',
		);
		// And the placement axis is floored by the clamped default, not the anchor.
		expect(declarations['min-block-size']).toBe(clampedDefaultFloor({ axis: 'block' }));
	});

	it("CLAMPS an UNFITTED 'min-anchor' floor on the placement axis to the cap", () => {
		// The live bug this fixes: `<DropdownMenu shouldFitContainer>` on a `left-*` /
		// `right-*` placement, where CSS resolves the min after the max, so an
		// unclamped floor made the backstop inert and a wide trigger floored the menu
		// off screen. Nothing is lost: with no cell cap the floor has no flip to drive.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'min-anchor',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe(
			'min(anchor-size(self-inline), calc(100dvw - 2 * 5px))',
		);
		// The floor is clamped to exactly the cap's value, so neither can defeat
		// the other.
		expect(declarations['max-inline-size']).toBe('calc(100dvw - 2 * 5px)');
	});

	it("leaves a FITTING 'min-anchor' floor on the placement axis UNCLAMPED", () => {
		// The guard against simplifying the clamp above into an unconditional one:
		// while something is fitting, exceeding the cap is what makes the popover
		// overflow a too-small cell, so `min(floor, cap)` here silently restores the
		// flip suppression the floor exists to fix.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'min-anchor',
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe('anchor-size(self-inline)');
	});

	it('clamps BOTH axes when neither is fitting and both are anchor-relative', () => {
		// The two clamps come from different code paths, so this pins that each uses
		// the unit for ITS OWN axis. A `dvw` / `dvh` swap is invisible in any test
		// that asserts one axis.
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'min-anchor',
			blockSize: 'min-anchor',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-block-size']).toBe(
			'min(anchor-size(self-block), calc(100dvh - 2 * 5px))',
		);
		expect(declarations['min-inline-size']).toBe(
			'min(anchor-size(self-inline), calc(100dvw - 2 * 5px))',
		);
	});

	it("floors a fitting 'min-anchor' placement axis at the anchor size, NOT at 150px", () => {
		// The anchor size REPLACES the 150px default rather than composing with it:
		// `max(150px, anchor-size(…))` only ever won by overriding a size the
		// consumer asked for (a 40px icon trigger rendered 150px wide).
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'min-anchor',
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe('anchor-size(self-inline)');
		// Inline was answered explicitly, so it keeps the viewport backstop. Neither
		// axis gets a cell cap: only the placement axis can, and the axis that asked
		// to fit is the cross one.
		expect(declarations['max-inline-size']).toBe('calc(100dvw - 2 * 5px)');
	});

	it("floors a fitting 'match-anchor' placement axis at the anchor size", () => {
		// The live bug this makes unrepresentable: `match-anchor` + fitting + an
		// inline placement axis used to get a cap and NO floor, which is full flip
		// suppression, a definite size clamping silently to the max. With an UNCAPPED
		// floor the min beats the max, so the popover keeps the anchor's width,
		// overflows a too-small cell and flips.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'match-anchor',
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['inline-size']).toBe('anchor-size(self-inline)');
		expect(declarations['min-inline-size']).toBe('anchor-size(self-inline)');
	});

	it('falls back to 150px when the anchor size is unavailable', () => {
		// `null` must not reach the declaration, and the popover still needs SOME
		// floor or it cannot flip. With no anchor size to clamp against, that is the
		// raw constant.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'min-anchor',
			blockSize: 'max-available',
			anchorSize: NO_ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe('150px');
	});

	it('COMPOSES an explicit minSize with the anchor floor, rather than replacing it', () => {
		// Two EXPLICIT requests, and `max()` is the operator for "satisfy both". A
		// first-wins chain let `minSize: 40` on a `<DropdownMenu shouldFitContainer>`
		// with a 200px trigger produce a 40px menu. Only the 150px DEFAULT is an
		// alternative rather than a term.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end', minSize: 40 },
			inlineSize: 'min-anchor',
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe('max(40px, anchor-size(self-inline))');
	});

	it('composes minSize with the CLAMPED anchor floor when nothing is fitting', () => {
		// The nesting: `max(minSize, min(anchor, cap))`, not
		// `min(max(minSize, anchor), cap)`. Only the ANCHOR term is clamped, because
		// `minSize` already overhangs the backstop on an axis with no anchor floor,
		// so clamping it only for `'min-anchor'` would make one input behave two ways.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end', minSize: 40 },
			inlineSize: 'min-anchor',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe(
			'max(40px, min(anchor-size(self-inline), calc(100dvw - 2 * 5px)))',
		);
	});

	it("composes on a fitting 'match-anchor' placement axis too", () => {
		// The other way to earn an anchor floor. Same composition, and a non-pixel
		// `minSize` so the two terms are not silently added up somewhere.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end', minSize: '10rem' },
			inlineSize: 'match-anchor',
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe('max(10rem, anchor-size(self-inline))');
	});

	it('keeps the anchor floor under minSize: 0, which no longer removes it', () => {
		// The knock-on of composing: `max(0px, anchor)` IS the anchor, so `minSize: 0`
		// means "do not apply the flip floor", not "break my `min-anchor` contract".
		// It still opts out entirely where there is no anchor floor - the case below.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end', minSize: 0 },
			inlineSize: 'min-anchor',
			blockSize: 'max-available',
			anchorSize: ANCHOR,
		});

		expect(declarations['min-inline-size']).toBe('max(0px, anchor-size(self-inline))');
	});

	it('emits minSize ALONE where there is no anchor floor to compose with', () => {
		// An unfitted `'match-anchor'` placement axis earns no anchor floor (nothing
		// to flip out of), so there is nothing to compose and `minSize: 0` really is
		// zero.
		expect(
			sizesFor({
				placement: { axis: 'inline', edge: 'end', minSize: 40 },
				inlineSize: 'match-anchor',
				anchorSize: ANCHOR,
			}),
		).toHaveProperty('min-inline-size', '40px');

		expect(
			sizesFor({
				placement: { axis: 'inline', edge: 'end', minSize: 0 },
				inlineSize: 'match-anchor',
				anchorSize: ANCHOR,
			}),
		).toHaveProperty('min-inline-size', '0px');
	});

	it('emits minSize alone when the anchor size is unavailable', () => {
		// There is no `max(40px, null)`: the anchor term drops out and the consumer's
		// minimum is the whole floor.
		expect(
			sizesFor({
				placement: { axis: 'inline', edge: 'end', minSize: 40 },
				inlineSize: 'min-anchor',
				blockSize: 'max-available',
				anchorSize: NO_ANCHOR,
			}),
		).toHaveProperty('min-inline-size', '40px');
	});

	it('emits no floor at all when the anchor size is unavailable and nothing is fitting', () => {
		// Neither term applies and the 150px default needs a fit request, so the
		// placement axis keeps only the viewport backstop.
		expect(
			sizesFor({
				placement: { axis: 'inline', edge: 'end' },
				inlineSize: 'min-anchor',
				anchorSize: NO_ANCHOR,
			}),
		).not.toHaveProperty('min-inline-size');
	});

	it("does NOT floor an unfitted 'match-anchor' placement axis", () => {
		// With no cell cap there is nothing to flip out of, so an uncapped floor
		// would only defeat the viewport backstop.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'match-anchor',
			anchorSize: ANCHOR,
		});

		expect(declarations).not.toHaveProperty('min-inline-size');
	});
});

describe('the JavaScript fallback path', () => {
	it('caps both axes to the viewport, and writes NO flip floor', () => {
		// No cell cap: with no `position-area` the containing block is the viewport,
		// so `calc(100% - …)` would silently become a whole-viewport cap. No floor
		// either: this path picks a side from the popover's MEASURED size, so a 150px
		// floor on 40px of content flips it off a side it fits on.
		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end' },
				inlineSize: 'max-available',
				blockSize: 'max-available',
				isUsingCssAnchorPositioning: false,
			}),
		).toEqual({
			'max-block-size': 'calc(100dvh - 2 * 5px)',
			'max-inline-size': 'calc(100dvw - 2 * 5px)',
		});
	});

	it("writes a measured 'match-anchor' size as pixels on either axis", () => {
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'match-anchor',
			blockSize: 'match-anchor',
			isUsingCssAnchorPositioning: false,
			anchorSize: { inline: '240px', block: '40px' },
		});

		expect(declarations['inline-size']).toBe('240px');
		expect(declarations['block-size']).toBe('40px');
	});

	it('still honours an explicit minSize, which is a consumer request and not a flip driver', () => {
		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end', minSize: 200 },
				blockSize: 'max-available',
				isUsingCssAnchorPositioning: false,
			}),
		).toHaveProperty('min-block-size', '200px');
	});

	it('clamps a FITTING anchor floor here, because there is no flip for it to drive', () => {
		// On the CSS path this floor is deliberately left uncapped so it can overflow
		// the cell. Here exceeding the viewport cap would only push the popover off
		// screen, so it takes the same clamped form as an unfitted axis.
		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end' },
				blockSize: 'min-anchor',
				inlineSize: 'max-available',
				isUsingCssAnchorPositioning: false,
				anchorSize: { inline: '240px', block: '40px' },
			}),
		).toHaveProperty('min-block-size', 'min(40px, calc(100dvh - 2 * 5px))');
	});

	it("does not floor a 'match-anchor' placement axis, fitting or not", () => {
		// The floor a fitting `'match-anchor'` axis earns on the CSS path exists so
		// the popover flips rather than shrinking silently to the cap. Shrinking IS
		// the right outcome here.
		expect(
			sizesFor({
				placement: { axis: 'block', edge: 'end' },
				blockSize: 'match-anchor',
				inlineSize: 'max-available',
				isUsingCssAnchorPositioning: false,
				anchorSize: { inline: '240px', block: '40px' },
			}),
		).not.toHaveProperty('min-block-size');
	});

	it('takes measured pixel lengths for anchor-relative sizes', () => {
		const declarations = sizesFor({
			placement: { axis: 'block', edge: 'end' },
			inlineSize: 'min-anchor',
			isUsingCssAnchorPositioning: false,
			anchorSize: { inline: '240px', block: '40px' },
		});

		expect(declarations['min-inline-size']).toBe('min(240px, calc(100dvw - 2 * 5px))');
	});

	it('clamps an unfitted anchor floor on the PLACEMENT axis here too', () => {
		// Same declaration as on the CSS path, with the measured length in place of
		// `anchor-size()`, so the geometry test can assert one contract on all three
		// engines rather than branching on the path.
		const declarations = sizesFor({
			placement: { axis: 'inline', edge: 'end' },
			inlineSize: 'min-anchor',
			isUsingCssAnchorPositioning: false,
			anchorSize: { inline: '240px', block: '40px' },
		});

		expect(declarations['min-inline-size']).toBe('min(240px, calc(100dvw - 2 * 5px))');
	});
});

describe('the fit margins', () => {
	it('reserves the viewport padding on the placement-axis side facing the viewport', () => {
		// The gap is on the anchor-facing side, so the padding goes on the other
		// one - the side the popover would otherwise sit flush against.
		expect(marginsFor({ placement: { axis: 'block', edge: 'end' } })).toHaveProperty(
			'margin-block-end',
			'5px',
		);
		expect(marginsFor({ placement: { axis: 'block', edge: 'start' } })).toHaveProperty(
			'margin-block-start',
			'5px',
		);
		expect(marginsFor({ placement: { axis: 'inline', edge: 'end' } })).toHaveProperty(
			'margin-inline-end',
			'5px',
		);
	});

	it('composes the cross-axis shift with the padding instead of overwriting it', () => {
		// The regression this exists for: `@atlaskit/popper` wrote `5px` onto both
		// cross-axis sides, which are exactly the two sides carrying the
		// antisymmetric shift, so any consumer offset was silently dropped.
		const declarations = marginsFor({
			placement: { axis: 'block', edge: 'end' },
			crossAxisShift: '40px',
		});

		expect(declarations['margin-inline-start']).toBe('calc(40px + 5px)');
		expect(declarations['margin-inline-end']).toBe('calc(calc(-1 * 40px) + 5px)');
	});

	it('keeps the composed pair antisymmetric, so anchor-center still centres the popover', () => {
		// Equal additions to both sides move the margin box's edges outward by the
		// same amount, so its centre does not move and the shift still displaces
		// the border box by its full value.
		const declarations = marginsFor({
			placement: { axis: 'inline', edge: 'end' },
			crossAxisShift: 'var(--ds-space-100, 8px)',
		});

		expect(declarations['margin-block-start']).toBe('calc(var(--ds-space-100, 8px) + 5px)');
		expect(declarations['margin-block-end']).toBe(
			'calc(calc(-1 * var(--ds-space-100, 8px)) + 5px)',
		);
	});

	it('pads only the viewport-facing cross side for a START-aligned popover', () => {
		// A `span-*` cell aligns the MARGIN box to the anchor's edge, so padding the
		// anchor-facing side would inset the border box 5px from the edge the
		// consumer asked it to line up with.
		const declarations = marginsFor({
			placement: { axis: 'block', edge: 'end', align: 'start' },
			crossAxisShift: '40px',
		});

		expect(declarations['margin-inline-start']).toBe('40px');
		expect(declarations['margin-inline-end']).toBe('calc(calc(-1 * 40px) + 5px)');
	});

	it('pads only the viewport-facing cross side for an END-aligned popover, mirrored', () => {
		const declarations = marginsFor({
			placement: { axis: 'inline', edge: 'end', align: 'end' },
			crossAxisShift: '40px',
		});

		expect(declarations['margin-block-start']).toBe('calc(40px + 5px)');
		expect(declarations['margin-block-end']).toBe('calc(-1 * 40px)');
	});

	it('still pads the placement-axis side for every alignment', () => {
		for (const align of ['start', 'center', 'end'] as const) {
			expect(
				marginsFor({ placement: { axis: 'block', edge: 'end', align }, crossAxisShift: '0px' }),
			).toHaveProperty('margin-block-end', '5px');
		}
	});
});
