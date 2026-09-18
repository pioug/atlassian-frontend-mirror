/* eslint-disable testing-library/prefer-screen-queries */

import { expect, type Page, test } from '@af/integration-testing';

import {
	DEFAULT_GAP,
	expectedFittedSize,
	expectGeometry,
	expectOnScreen,
	FALLBACK_MINIMUM_MAIN_AXIS_SIZE,
	marginBoxAround,
	MINIMUM_MARGIN_BOX,
	TOLERANCE,
	type TRect,
	VIEWPORT_PADDING,
} from './anchored-popover-geometry';

/**
 * Geometry coverage for the PER-AXIS half of `useAnchoredPopover`'s sizing:
 * everything that only appears once the two axes can DISAGREE. Fitting the whole
 * popover is in `fit-available-space.spec.tsx`; measuring and the shared numbers
 * are in `anchored-popover-geometry.tsx`.
 *
 * Assertions are geometry and never CSS declarations, per `notes/rules/testing.md`.
 * Each test branches on a runtime `CSS.supports` probe so Firefox asserts the
 * FALLBACK contract instead of being skipped.
 */

const VIEWPORT = { width: 400, height: 400 };

/**
 * Deliberately NON-SQUARE: in a 400x400 viewport a cap written against the wrong
 * viewport unit (`dvw` where `dvh` was meant) resolves to the same number.
 */
const WIDE_VIEWPORT = { width: 700, height: 400 };

/**
 * The same idea the other way up, for a trigger wider than the viewport.
 */
const TALL_VIEWPORT = { width: 400, height: 700 };

type TFixtureParams = {
	axis?: 'block' | 'inline';
	edge?: 'start' | 'end';
	align?: 'start' | 'center' | 'end';
	inlineSize?: 'content' | 'match-anchor' | 'min-anchor' | 'max-available';
	blockSize?: 'content' | 'match-anchor' | 'min-anchor' | 'max-available';
	/**
	 * `placement.minSize`. Omitted lets the default flip floor apply; `0` is the
	 * opt-out.
	 */
	minSize?: number;
	triggerBlockStart?: number;
	triggerInlineStart?: number;
	triggerBlockSize?: number;
	triggerInlineSize?: number;
	contentBlockSize?: number;
	contentInlineSize?: number;
	/**
	 * Two 120px inline blocks instead of the fixed box, so the popover CAN wrap
	 * (max-content 240, min-content 120). A fixed box's min-content width IS its
	 * max-content width, so with it "wrapped" and "overflowed" measure the same.
	 */
	wrappableContent?: boolean;
	forceFallback?: boolean;
};

async function openFixture({
	page,
	params,
	viewport = VIEWPORT,
}: {
	page: Page;
	params: TFixtureParams;
	viewport?: { width: number; height: number };
}): Promise<void> {
	// Set the viewport BEFORE loading, so the fixture's `100vh` page and the
	// popover's first layout both see the final size.
	await page.setViewportSize(viewport);

	const searchParams: { [key: string]: string | boolean } = {};
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined) {
			searchParams[key] = typeof value === 'boolean' ? value : String(value);
		}
	});

	await page.visitExample<typeof import('../../examples/161-testing-popover-anchored-size.tsx')>(
		'design-system',
		'top-layer',
		'testing-popover-anchored-size',
		searchParams,
	);

	await page.getByTestId('popover-trigger').click();
	await expect(page.getByTestId('popover-content')).toBeVisible();
}

/**
 * The backstop on both axes, and the only cap the JavaScript fallback has.
 */
function viewportCap({ extent }: { extent: number }): number {
	return extent - 2 * VIEWPORT_PADDING;
}

/**
 * The cell less the gap and the reserved padding. Placement axis, CSS path only.
 */
function cellCap({ cell }: { cell: number }): number {
	return cell - VIEWPORT_PADDING - DEFAULT_GAP;
}

test.describe('rule 1: fitting mirrors onto an axis still on content', () => {
	test('a block-axis fit caps the INLINE placement axis to its cell, and flips', async ({
		page,
		skipAxeCheck,
	}) => {
		skipAxeCheck();

		// The consumer named the CROSS axis, so the mirror has to cap inline too. The
		// cell cap keeps the 400px content on screen; the viewport cap would not.
		await openFixture({
			page,
			params: {
				axis: 'inline',
				edge: 'end',
				blockSize: 'max-available',
				triggerInlineStart: 280,
				triggerBlockStart: 190,
				contentInlineSize: 400,
				contentBlockSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host, viewport, isCssAnchorPositioning } = geometry;
				expectOnScreen(geometry);

				if (!isCssAnchorPositioning) {
					expect(host.width).toBeLessThanOrEqual(
						viewportCap({ extent: viewport.width }) + TOLERANCE,
					);
					return;
				}

				// Only 40px of room after the trigger, so the floor Rule 2 supplies
				// makes the popover overflow that cell and flip.
				const cellAfter = viewport.width - (trigger.x + trigger.width);
				expect(MINIMUM_MARGIN_BOX).toBeGreaterThan(cellAfter);
				expect(host.x + host.width).toBeLessThanOrEqual(trigger.x + TOLERANCE);

				const expected = expectedFittedSize({ cell: trigger.x, content: 400 });
				expect(Math.abs(host.width - expected)).toBeLessThanOrEqual(TOLERANCE);
			},
		});
	});

	test('an inline-axis fit alone floors the BLOCK placement axis', async ({
		page,
		skipAxeCheck,
	}) => {
		skipAxeCheck();

		// Rule 2 reads the RAW requested values: a fit request on the CROSS axis
		// still floors the placement axis. With no floor the 40px content fits the
		// 60px cell below the trigger and nothing moves. Rule 1's mirror is masked
		// here because a floor beats a max; `PER_AXIS_CAP_PARAMS` below unmasks it.
		await openFixture({
			page,
			params: {
				inlineSize: 'max-available',
				triggerBlockStart: 320,
				triggerInlineStart: 160,
				contentBlockSize: 40,
				contentInlineSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host, viewport, isCssAnchorPositioning } = geometry;
				expectOnScreen(geometry);

				if (!isCssAnchorPositioning) {
					// Rule 2 is a CSS-path rule: this path has no cell to overflow, and
					// measures the popover to pick a side instead.
					expect(host.y).toBeGreaterThanOrEqual(trigger.y + trigger.height - TOLERANCE);
					expect(host.height).toBeLessThan(FALLBACK_MINIMUM_MAIN_AXIS_SIZE);
					return;
				}

				// The floored margin box overflows the cell, so the popover moves, and
				// the floor is what makes it 150px tall rather than 40px.
				const cellBelow = viewport.height - (trigger.y + trigger.height);
				expect(MINIMUM_MARGIN_BOX).toBeGreaterThan(cellBelow);
				expect(host.y + host.height).toBeLessThanOrEqual(trigger.y + TOLERANCE);
				expect(Math.abs(host.height - FALLBACK_MINIMUM_MAIN_AXIS_SIZE)).toBeLessThanOrEqual(
					TOLERANCE,
				);
			},
		});
	});

	test('an explicit match-anchor inline size is NOT overridden by a block-axis fit', async ({
		page,
		skipAxeCheck,
	}) => {
		skipAxeCheck();

		// The `@atlaskit/popup` mapping for `shouldFitContainer` plus
		// `shouldFitViewport`. The content is much NARROWER than the trigger, so an
		// inline axis wrongly rewritten to `'max-available'` misses by 140px.
		await openFixture({
			page,
			params: {
				inlineSize: 'match-anchor',
				blockSize: 'max-available',
				triggerInlineStart: 100,
				triggerInlineSize: 200,
				triggerBlockStart: 100,
				contentInlineSize: 60,
				contentBlockSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host, isCssAnchorPositioning } = geometry;
				expectOnScreen(geometry);

				expect(Math.abs(host.width - trigger.width)).toBeLessThanOrEqual(TOLERANCE);
				// There is room below, so it stays where it was asked.
				expect(host.y).toBeGreaterThanOrEqual(trigger.y + trigger.height - TOLERANCE);

				if (!isCssAnchorPositioning) {
					// No floor on this path, so the height is the content's.
					expect(host.height).toBeLessThan(FALLBACK_MINIMUM_MAIN_AXIS_SIZE);
					return;
				}

				// Rule 2 still supplies the floor, so the 100px content is stretched to
				// it - the accepted cost.
				expect(Math.abs(host.height - FALLBACK_MINIMUM_MAIN_AXIS_SIZE)).toBeLessThanOrEqual(
					TOLERANCE,
				);
			},
		});
	});
});

/**
 * Rule 2's threshold, pinned from both sides. A capped popover flips only because
 * the floor makes its margin box overflow the cell, at exactly
 * `floor + gap + padding = 150 + 8 + 5`. These cells sit 7px either side of it,
 * so a floor that stopped being applied fails the second case and one applied
 * where it should not be fails the first.
 */
const FLIP_THRESHOLD_CASES = [
	{
		name: 'a cell just larger than the floor keeps the popover where it was asked',
		cell: 170,
		expectFlip: false,
	},
	{
		name: 'a cell just smaller than the floor moves it, rather than letterboxing it',
		cell: 156,
		expectFlip: true,
	},
] as const;

FLIP_THRESHOLD_CASES.forEach(({ name, cell, expectFlip }) => {
	test(`rule 2, the default flip floor: ${name}`, async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		const triggerBlockSize = 20;

		await openFixture({
			page,
			params: {
				blockSize: 'max-available',
				triggerBlockSize,
				triggerBlockStart: VIEWPORT.height - triggerBlockSize - cell,
				triggerInlineStart: 160,
				contentBlockSize: 300,
				contentInlineSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host, viewport, isCssAnchorPositioning } = geometry;
				expectOnScreen(geometry);

				if (!isCssAnchorPositioning) {
					// `computeFallbackPosition` compares raw space rather than overflowing
					// a cell, so it does not share the threshold.
					expect(host.height).toBeLessThanOrEqual(
						viewportCap({ extent: viewport.height }) + TOLERANCE,
					);
					return;
				}

				const cellBelow = viewport.height - (trigger.y + trigger.height);
				expect(MINIMUM_MARGIN_BOX > cellBelow).toBe(expectFlip);

				const hasFlipped = host.y + host.height <= trigger.y + TOLERANCE;
				expect(hasFlipped).toBe(expectFlip);

				expect(host.height).toBeGreaterThanOrEqual(FALLBACK_MINIMUM_MAIN_AXIS_SIZE - TOLERANCE);

				const occupiedCell = hasFlipped ? trigger.y : cellBelow;
				const expected = expectedFittedSize({ cell: occupiedCell, content: 300 });
				expect(Math.abs(host.height - expected)).toBeLessThanOrEqual(TOLERANCE);
			},
		});
	});
});

test('minSize: 0 caps the popover in place instead of moving it', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	// `minSize: 0` wins over rule 2's default, and with no floor the clamped
	// popover never overflows its cell. Same geometry as the flipping case above,
	// so `minSize` is the only difference.
	await openFixture({
		page,
		params: {
			blockSize: 'max-available',
			minSize: 0,
			triggerBlockStart: 320,
			triggerInlineStart: 160,
			contentBlockSize: 300,
			contentInlineSize: 100,
		},
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport, isCssAnchorPositioning } = geometry;
			expectOnScreen(geometry);

			if (!isCssAnchorPositioning) {
				expect(host.height).toBeLessThanOrEqual(
					viewportCap({ extent: viewport.height }) + TOLERANCE,
				);
				return;
			}

			const cellBelow = viewport.height - (trigger.y + trigger.height);
			// With the default floor this cell is too small and the popover flips.
			expect(MINIMUM_MARGIN_BOX).toBeGreaterThan(cellBelow);

			expect(host.y).toBeGreaterThanOrEqual(trigger.y + trigger.height - TOLERANCE);
			const expected = expectedFittedSize({ cell: cellBelow, content: 300, floor: 0 });
			expect(Math.abs(host.height - expected)).toBeLessThanOrEqual(TOLERANCE);
			expect(host.height).toBeLessThan(FALLBACK_MINIMUM_MAIN_AXIS_SIZE);
		},
	});
});

/**
 * The floor is the ANCHOR's size when the placement axis is anchor-relative, not
 * 150px. Do not reintroduce `max(150px, anchor-size(…))`: the 150px term only won
 * by overriding a size the consumer asked for, so
 * `<Popup shouldFitContainer shouldFitViewport>` on a 40px icon trigger opened a
 * 150px-wide popover. See `notes/decisions/width-from-anchor-floors.md`.
 *
 * The SIZE is pinned here and the FLIP in the threshold pair below. No path
 * branch, since the anchor floor resolves to the same length on each.
 */
test("a small match-anchor placement axis renders at the anchor's size, not at 150px", async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	// An inline placement, so the anchor-relative axis IS the floored placement
	// axis. Three outcomes are distinguishable: 40px the anchor, 150px the floor
	// that used to win, 200px `'match-anchor'` no longer being a definite size.
	await openFixture({
		page,
		viewport: WIDE_VIEWPORT,
		params: {
			axis: 'inline',
			edge: 'end',
			align: 'start',
			inlineSize: 'match-anchor',
			blockSize: 'max-available',
			triggerInlineStart: 100,
			triggerInlineSize: 40,
			triggerBlockStart: 100,
			contentInlineSize: 200,
			contentBlockSize: 100,
		},
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport } = geometry;
			expectOnScreen(geometry);

			// The fixture really is smaller than the old floor, so this measures the fix.
			expect(trigger.width).toBeLessThan(FALLBACK_MINIMUM_MAIN_AXIS_SIZE);

			expect(Math.abs(host.width - trigger.width)).toBeLessThanOrEqual(TOLERANCE);
			expect(host.width).toBeLessThan(FALLBACK_MINIMUM_MAIN_AXIS_SIZE);

			// There is room for the whole margin box, so the width above is a size
			// rather than a consequence of landing in a smaller cell.
			const cellAfter = viewport.width - (trigger.x + trigger.width);
			expect(cellAfter).toBeGreaterThan(marginBoxAround({ size: trigger.width }));
			expect(host.x).toBeGreaterThanOrEqual(trigger.x + trigger.width - TOLERANCE);
		},
	});
});

/**
 * The smaller floor still flips: the threshold moves with it, to
 * `40 + 8 + 5 = 53px`, so these cells sit 7px either side of 53.
 *
 * `'min-anchor'` rather than `'match-anchor'` deliberately: a definite
 * `inline-size` overflows a small cell on its own, so it would flip with no floor
 * at all. Here the content is NARROWER than the anchor, so the floor is the only
 * thing sizing the popover above 20px.
 */
const ANCHOR_FLIP_THRESHOLD_CASES = [
	{
		name: 'a cell just larger than the anchor floor keeps the popover where it was asked',
		cell: 60,
		expectFlip: false,
	},
	{
		name: 'a cell just smaller than the anchor floor moves it to the roomy side',
		cell: 46,
		expectFlip: true,
	},
] as const;

ANCHOR_FLIP_THRESHOLD_CASES.forEach(({ name, cell, expectFlip }) => {
	test(`the anchor floor still drives a flip: ${name}`, async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		const triggerInlineSize = 40;

		await openFixture({
			page,
			viewport: WIDE_VIEWPORT,
			params: {
				axis: 'inline',
				edge: 'end',
				align: 'start',
				inlineSize: 'min-anchor',
				blockSize: 'max-available',
				triggerInlineSize,
				triggerInlineStart: WIDE_VIEWPORT.width - triggerInlineSize - cell,
				triggerBlockStart: 190,
				contentInlineSize: 20,
				contentBlockSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host, viewport } = geometry;
				expectOnScreen(geometry);

				// The floor is the anchor's size on both paths, so the content never
				// sizes the popover.
				expect(Math.abs(host.width - trigger.width)).toBeLessThanOrEqual(TOLERANCE);
				expect(host.width).toBeLessThan(FALLBACK_MINIMUM_MAIN_AXIS_SIZE);

				const cellAfter = viewport.width - (trigger.x + trigger.width);
				expect(marginBoxAround({ size: trigger.width }) > cellAfter).toBe(expectFlip);

				// No path branch: CSS moves it when the 53px floored margin box overflows
				// the cell, the fallback when the 48px popover plus gap no longer fits.
				// Both thresholds sit inside 46…60.
				const hasFlipped = host.x + host.width <= trigger.x + TOLERANCE;
				expect(hasFlipped).toBe(expectFlip);
			},
		});
	});
});

/**
 * The cap is per-axis, and the mirror decides which axis gets the cell. The two
 * tests below are the same fixture with ONE parameter changed, and in both the
 * inline axis asks to fit and is the CROSS axis of a block placement:
 *
 * - `blockSize: 'content'`: rule 1 fills it, so the block axis takes the CELL cap
 *   and letterboxes in place.
 * - `blockSize: 'match-anchor'`: rule 1 skips an explicit value, so it keeps only
 *   the viewport backstop, exceeds the cell, and moves instead.
 *
 * `minSize: 0` in both, because a floor beats a max: at the default floor both
 * cases come out at 150px and the two caps are indistinguishable.
 */
const PER_AXIS_CAP_PARAMS = {
	inlineSize: 'max-available',
	minSize: 0,
	// 120px tall, so the anchor's block size is clear of both the 80px cell below
	// it and the 67px that cell's cap would allow.
	triggerBlockSize: 120,
	triggerBlockStart: 200,
	triggerInlineStart: 300,
	triggerInlineSize: 80,
	// Taller than the anchor, so a height equal to the anchor is not the content.
	contentBlockSize: 300,
	contentInlineSize: 100,
} as const;

test('the mirror fills a content block axis, which then takes the CELL cap and stays put', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	await openFixture({
		page,
		viewport: WIDE_VIEWPORT,
		params: { ...PER_AXIS_CAP_PARAMS, blockSize: 'content' },
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport, isCssAnchorPositioning } = geometry;
			expectOnScreen(geometry);

			if (!isCssAnchorPositioning) {
				// No cell on this path, so the viewport cap is the whole contract.
				expect(host.height).toBeLessThanOrEqual(
					viewportCap({ extent: viewport.height }) + TOLERANCE,
				);
				return;
			}

			const cellBelow = viewport.height - (trigger.y + trigger.height);
			// Capped to the cell, not the viewport: a viewport cap would let the 300px
			// content run past the bottom of the screen.
			const expected = expectedFittedSize({ cell: cellBelow, content: 300, floor: 0 });
			expect(Math.abs(host.height - expected)).toBeLessThanOrEqual(TOLERANCE);
			expect(host.height).toBeLessThan(viewportCap({ extent: viewport.height }));

			// A clamped popover's margin box is exactly its cell, so nothing moves it.
			expect(host.y).toBeGreaterThanOrEqual(trigger.y + trigger.height - TOLERANCE);
		},
	});
});

test('an explicit match-anchor block axis keeps the viewport backstop, so it overflows the cell and moves', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	await openFixture({
		page,
		viewport: WIDE_VIEWPORT,
		params: { ...PER_AXIS_CAP_PARAMS, blockSize: 'match-anchor' },
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport } = geometry;
			expectOnScreen(geometry);

			// Exactly the anchor's block size; under a whole-popover cap it would be 67px.
			expect(Math.abs(host.height - trigger.height)).toBeLessThanOrEqual(TOLERANCE);

			const cellBelow = viewport.height - (trigger.y + trigger.height);
			// Taller than the cell cap would have allowed, so that cap was not applied.
			expect(host.height).toBeGreaterThan(cellCap({ cell: cellBelow }) + TOLERANCE);
			expect(host.height).toBeLessThanOrEqual(viewportCap({ extent: viewport.height }) + TOLERANCE);

			// Free to exceed the cell, so its margin box overflows and it moves.
			expect(marginBoxAround({ size: host.height })).toBeGreaterThan(cellBelow);
			expect(host.y + host.height).toBeLessThanOrEqual(trigger.y + TOLERANCE);
		},
	});
});

/**
 * `placement.minSize` COMPOSES with the anchor floor through `max()`, not
 * first-wins. The two cases put `minSize` either side of the 120px anchor, so the
 * operator is under test rather than one lucky number. First-wins returned 40px,
 * which was a `<DropdownMenu shouldFitContainer minSize={40}>` on a wide trigger
 * silently dropping its "at least as wide as the trigger" contract.
 *
 * Four outcomes are distinguishable: 20px content, 40px, 120px anchor, 200px
 * `minSize`. Nothing is fitting, so the floor is the sole author of the height.
 */
const MIN_SIZE_COMPOSITION_CASES = [
	{
		name: 'a minSize UNDER the anchor floor leaves the anchor floor standing',
		minSize: 40,
		expectAnchorWins: true,
	},
	{
		name: 'a minSize OVER the anchor floor wins the max()',
		minSize: 200,
		expectAnchorWins: false,
	},
] as const;

/**
 * Smaller than every candidate floor, so no result can be the content's height.
 */
const COMPOSITION_CONTENT_BLOCK_SIZE = 20;

MIN_SIZE_COMPOSITION_CASES.forEach(({ name, minSize, expectAnchorWins }) => {
	test(`minSize composes with the anchor floor: ${name}`, async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		await openFixture({
			page,
			viewport: WIDE_VIEWPORT,
			params: {
				blockSize: 'min-anchor',
				minSize,
				// High enough that the 240px cell below holds the tallest case, so
				// the height is a floor rather than a cell.
				triggerBlockStart: 40,
				triggerBlockSize: 120,
				triggerInlineStart: 300,
				triggerInlineSize: 80,
				contentBlockSize: COMPOSITION_CONTENT_BLOCK_SIZE,
				contentInlineSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host } = geometry;
				expectOnScreen(geometry);

				const composed = Math.max(minSize, trigger.height);
				expect(Math.abs(host.height - composed)).toBeLessThanOrEqual(TOLERANCE);

				// Restate which term won, so a failure names the semantics.
				expect(trigger.height > minSize).toBe(expectAnchorWins);
				if (expectAnchorWins) {
					// The assertion that fails under the old first-wins chain.
					expect(host.height).toBeGreaterThan(minSize + TOLERANCE);
				} else {
					expect(host.height).toBeGreaterThan(trigger.height + TOLERANCE);
				}

				// Neither answer is the content, so a floor is the author of the height.
				expect(host.height).toBeGreaterThan(COMPOSITION_CONTENT_BLOCK_SIZE + TOLERANCE);

				// There is room below for the whole margin box, so nothing moved it.
				expect(host.y).toBeGreaterThanOrEqual(trigger.y + trigger.height - TOLERANCE);
			},
		});
	});
});

test('the viewport backstop caps a match-anchor popover on an oversized trigger: INLINE axis', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	/**
	 * The backstop, with NO fit value on either axis: `'match-anchor'` alone set a
	 * definite `inline-size` with nothing above it, so a trigger wider than the
	 * viewport produced a popover wider than the viewport. The 600px trigger starts
	 * at -100px so its centre is the viewport centre, which keeps the
	 * `align: 'center'` popover on screen for a stateable reason.
	 */
	await openFixture({
		page,
		viewport: TALL_VIEWPORT,
		params: {
			inlineSize: 'match-anchor',
			triggerInlineStart: -100,
			triggerInlineSize: 600,
			triggerBlockStart: 100,
			contentInlineSize: 100,
			contentBlockSize: 100,
		},
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport } = geometry;

			// The fixture really is oversized, so this measures a cap.
			expect(trigger.width).toBeGreaterThan(viewport.width);

			expectOnScreen(geometry);
			expect(host.width).toBeLessThan(trigger.width);
			// The anchor is wider than the viewport, so the backstop is what binds.
			const expected = viewportCap({ extent: viewport.width });
			expect(Math.abs(host.width - expected)).toBeLessThanOrEqual(TOLERANCE);
		},
	});
});

test('the viewport backstop caps a match-anchor popover on an oversized trigger: BLOCK axis', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	/**
	 * The other half of the same backstop: `max-block-size` is a separate
	 * declaration, so the inline case above says nothing about it. The placement
	 * axis is INLINE, because a `block-end` placement cannot express this fixture -
	 * a trigger taller than the viewport leaves no cell either side, so the fallback
	 * chain rather than the cap would decide the outcome.
	 */
	await openFixture({
		page,
		viewport: { width: 700, height: 400 },
		params: {
			axis: 'inline',
			edge: 'end',
			blockSize: 'match-anchor',
			triggerBlockStart: -100,
			triggerBlockSize: 600,
			triggerInlineStart: 100,
			contentInlineSize: 100,
			contentBlockSize: 100,
		},
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport } = geometry;

			// The fixture really is oversized, so this measures a cap.
			expect(trigger.height).toBeGreaterThan(viewport.height);

			expectOnScreen(geometry);
			// Without the backstop this is the anchor's full height.
			expect(host.height).toBeLessThan(trigger.height);
			// The anchor is taller than the viewport, so the backstop is what binds.
			const expected = viewportCap({ extent: viewport.height });
			expect(Math.abs(host.height - expected)).toBeLessThanOrEqual(TOLERANCE);
		},
	});
});

/**
 * The backstop on a `'min-anchor'` PLACEMENT axis, where a floor can defeat it.
 * The two tests below are the same fixture with only `blockSize` changed, and each
 * is the mutation guard for the other:
 *
 * - nothing fitting: the anchor floor is clamped. CSS resolves the min after the
 *   max, so an unclamped floor made the backstop inert, which was live for
 *   `<DropdownMenu shouldFitContainer>` on a `left-*` / `right-*` placement.
 * - fitting: the floor stays uncapped, because there its job is to exceed the cap
 *   so the margin box overflows and `position-try-fallbacks` runs.
 *
 * On the JS fallback the second case collapses onto the first, the clamp being
 * conditional on there being a cell to overflow. See
 * `notes/decisions/width-from-anchor-floors.md`.
 *
 * No `expectOnScreen`, deliberately: with an anchor this oversized no floor rule
 * can keep the popover fully on screen. The contract under test is its EXTENT.
 */
const OVERSIZED_MIN_ANCHOR_PARAMS = {
	axis: 'inline',
	edge: 'end',
	align: 'start',
	inlineSize: 'min-anchor',
	triggerInlineSize: 800,
	triggerInlineStart: -400,
	triggerBlockStart: 190,
	triggerBlockSize: 20,
	// Far smaller than every candidate floor, so the width below is a floor.
	contentInlineSize: 100,
	contentBlockSize: 100,
} as const;

test('an UNFITTED min-anchor placement axis is clamped to the backstop, not floored past it', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	await openFixture({
		page,
		viewport: WIDE_VIEWPORT,
		params: { ...OVERSIZED_MIN_ANCHOR_PARAMS, blockSize: 'content' },
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport } = geometry;
			const cap = viewportCap({ extent: viewport.width });

			// The fixture really is oversized, so what follows measures the clamp.
			expect(trigger.width).toBeGreaterThan(cap);
			expect(trigger.width).toBeGreaterThan(viewport.width);

			// Unclamped, the floor is the anchor's full 800px and a min beats a max,
			// so the backstop would be inert.
			expect(host.width).toBeLessThanOrEqual(cap + TOLERANCE);
			// Narrower than the trigger it was told to match, which only the clamp does.
			expect(host.width).toBeLessThan(trigger.width);
			// Exactly on the backstop, so the clamp bound rather than a cell.
			expect(Math.abs(host.width - cap)).toBeLessThanOrEqual(TOLERANCE);
		},
	});
});

test('a FITTING min-anchor placement axis keeps its floor uncapped, at the anchor size', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	/**
	 * Why the clamp above is conditional. Make it unconditional and this popover
	 * comes out at the 690px backstop instead of the anchor's 800px, so
	 * `'min-anchor'` stops meaning "at least the anchor's size". The overhang this
	 * pins is the accepted cost of an uncapped floor, not a desirable rendering.
	 */
	await openFixture({
		page,
		viewport: WIDE_VIEWPORT,
		params: { ...OVERSIZED_MIN_ANCHOR_PARAMS, blockSize: 'max-available' },
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport, isCssAnchorPositioning } = geometry;
			const cap = viewportCap({ extent: viewport.width });

			expect(trigger.width).toBeGreaterThan(cap);

			if (!isCssAnchorPositioning) {
				// The clamp is conditional on there being a cell to overflow, not on
				// the fit value, so this case collapses onto the unfitted one above.
				expect(Math.abs(host.width - cap)).toBeLessThanOrEqual(TOLERANCE);
				expect(host.width).toBeLessThan(trigger.width);
				return;
			}

			// Exactly the anchor's size: the floor won over the backstop.
			expect(Math.abs(host.width - trigger.width)).toBeLessThanOrEqual(TOLERANCE);
			// Wider than the backstop would have allowed, so it cannot have bound.
			expect(host.width).toBeGreaterThan(cap + TOLERANCE);

			// Overflow detection is still live, which is the point of leaving it uncapped.
			const cellAfter = viewport.width - (trigger.x + trigger.width);
			expect(marginBoxAround({ size: host.width })).toBeGreaterThan(cellAfter);
		},
	});
});

/**
 * `'match-anchor'` and `'min-anchor'` on the BLOCK axis, which no consumer reaches
 * today. The 300px content is taller than the anchor, which separates the two:
 * `'match-anchor'` is an exact size and clamps to 120, `'min-anchor'` is a floor
 * and lets the content grow. The 80x120 trigger also makes the `'match-anchor'`
 * case a wrong-AXIS guard, since reading the anchor's WIDTH produces 80.
 */
const BLOCK_ANCHOR_SIZE_CASES = [
	{
		name: "match-anchor is exactly the anchor's block size, even for taller content",
		blockSize: 'match-anchor',
		expectedHeight: 120,
	},
	{
		name: 'min-anchor lets taller content grow past the anchor',
		blockSize: 'min-anchor',
		expectedHeight: 300,
	},
] as const;

BLOCK_ANCHOR_SIZE_CASES.forEach(({ name, blockSize, expectedHeight }) => {
	test(`anchor-relative block sizing: ${name}`, async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		await openFixture({
			page,
			// Taller viewport, so neither case is near the cap and nothing flips:
			// the size, not the position, is under test.
			viewport: { width: 400, height: 600 },
			params: {
				blockSize,
				triggerBlockStart: 40,
				triggerBlockSize: 120,
				triggerInlineStart: 160,
				triggerInlineSize: 80,
				contentBlockSize: 300,
				contentInlineSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host } = geometry;
				expectOnScreen(geometry);

				expect(Math.abs(host.height - expectedHeight)).toBeLessThanOrEqual(TOLERANCE);
				// Restated against the measured anchor, so the numbers cannot drift.
				expect(host.height).toBeGreaterThanOrEqual(trigger.height - TOLERANCE);
			},
		});
	});
});

/**
 * Fitting an INLINE placement axis, where the real production traffic is. Both
 * cases are shapes shipped today: the ADS side-nav flyout menu item
 * (`right-start` with `shouldFitViewport`) and the people-and-teams hierarchy
 * pickers (`left-start`). Each trigger is hard against the edge it was asked to
 * open toward, so it has to flip and be capped to the cell it lands in.
 */
const PROTECTED_BRANCH_CASES = [
	{
		name: 'right-start, as the ADS side-nav flyout menu item uses it',
		edge: 'end',
		triggerInlineStart: 280,
		flipsTowardStart: true,
	},
	{
		name: 'left-start, as the people-and-teams team hierarchy pickers use it',
		edge: 'start',
		triggerInlineStart: 40,
		flipsTowardStart: false,
	},
] as const;

PROTECTED_BRANCH_CASES.forEach(({ name, edge, triggerInlineStart, flipsTowardStart }) => {
	test(`fitting an inline placement axis still flips: ${name}`, async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		await openFixture({
			page,
			params: {
				axis: 'inline',
				edge,
				align: 'start',
				// What `shouldFitViewport` maps to: both axes.
				inlineSize: 'max-available',
				blockSize: 'max-available',
				triggerInlineStart,
				triggerBlockStart: 60,
				contentInlineSize: 400,
				contentBlockSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host, viewport, isCssAnchorPositioning } = geometry;
				expectOnScreen(geometry);

				if (!isCssAnchorPositioning) {
					expect(host.width).toBeLessThanOrEqual(
						viewportCap({ extent: viewport.width }) + TOLERANCE,
					);
					return;
				}

				const cellTowardStart = trigger.x;
				const cellTowardEnd = viewport.width - (trigger.x + trigger.width);
				const requestedCell = flipsTowardStart ? cellTowardEnd : cellTowardStart;
				const occupiedCell = flipsTowardStart ? cellTowardStart : cellTowardEnd;

				// The requested side is too small for the floored margin box, hence the flip.
				expect(MINIMUM_MARGIN_BOX).toBeGreaterThan(requestedCell);

				if (flipsTowardStart) {
					expect(host.x + host.width).toBeLessThanOrEqual(trigger.x + TOLERANCE);
				} else {
					expect(host.x).toBeGreaterThanOrEqual(trigger.x + trigger.width - TOLERANCE);
				}

				// Capped to the cell it flipped INTO, not the viewport: a viewport cap
				// would leave the 400px content overhanging.
				const expected = expectedFittedSize({ cell: occupiedCell, content: 400 });
				expect(Math.abs(host.width - expected)).toBeLessThanOrEqual(TOLERANCE);
			},
		});
	});
});

/**
 * Rule 4: a non-anchor-relative inline axis is its NATURAL width. That is the
 * row-action "..." menu near the inline-end edge of the screen, with no fit value
 * involved.
 *
 * WRAPPABLE content, because a fixed-size box cannot tell the two apart (see
 * `wrappableContent`). The trigger sits 100px from the inline-end edge, so a
 * start-aligned popover has a 100px cell; the content's 240px max-content is
 * wider than that and narrower than the viewport, and its 120px min-content would
 * fit the cell if it wrapped.
 */
test('a content-sized popover overflows a narrow span cell and slides, rather than wrapping into it', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	await openFixture({
		page,
		params: {
			align: 'start',
			wrappableContent: true,
			triggerInlineStart: 300,
			triggerBlockStart: 100,
		},
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport } = geometry;
			expectOnScreen(geometry);

			const cellAfterStart = viewport.width - trigger.x;
			// Wider than the cell it was asked to open into: it did not wrap to it.
			// True on both paths, since the fallback's containing block is the viewport.
			expect(host.width).toBeGreaterThan(cellAfterStart + TOLERANCE);
			// Wrapped it would be the 120px min-content; at its natural width it is
			// at least the 240px max-content.
			expect(host.width).toBeGreaterThanOrEqual(240 - TOLERANCE);
			// And narrower than the backstop, so the width is the content's, not a cap.
			expect(host.width).toBeLessThan(viewportCap({ extent: viewport.width }) - TOLERANCE);
			// Moved off its start alignment to stay on screen.
			expect(host.x).toBeLessThan(trigger.x - TOLERANCE);
		},
	});
});

/**
 * The fit margins keep a start / end-aligned popover ON the anchor edge it was
 * asked to align with. A `span-*` cell aligns the MARGIN box to that edge, so
 * padding the anchor-facing cross side would inset the border box; only the
 * viewport-facing side may carry it.
 */
const ALIGNED_FIT_CASES: {
	name: string;
	params: TFixtureParams;
	/**
	 * The signed distance between the two edges that should coincide.
	 */
	measure: (geometry: { trigger: TRect; host: TRect }) => number;
}[] = [
	{
		name: 'bottom-start lines up with the trigger start edge',
		params: { align: 'start', triggerInlineStart: 100, triggerBlockStart: 100 },
		measure: ({ trigger, host }) => host.x - trigger.x,
	},
	{
		name: 'bottom-end lines up with the trigger end edge',
		params: { align: 'end', triggerInlineStart: 200, triggerBlockStart: 100 },
		measure: ({ trigger, host }) => host.x + host.width - (trigger.x + trigger.width),
	},
	{
		name: 'right-start lines up with the trigger top edge',
		params: {
			axis: 'inline',
			edge: 'end',
			align: 'start',
			triggerInlineStart: 100,
			triggerBlockStart: 100,
		},
		measure: ({ trigger, host }) => host.y - trigger.y,
	},
];

ALIGNED_FIT_CASES.forEach(({ name, params, measure }) => {
	test(`a fitting popover keeps its alignment: ${name}`, async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		// Roomy in every direction with 100px of content in a 400px viewport, so
		// nothing slides or flips it and the alignment is the requested one.
		await openFixture({
			page,
			params: {
				...params,
				blockSize: 'max-available',
				contentInlineSize: 100,
				contentBlockSize: 100,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const { trigger, host } = geometry;
				expectOnScreen(geometry);

				// Exactly aligned. Padding the anchor-facing cross side reads 5px here.
				expect(Math.abs(measure({ trigger, host }))).toBeLessThanOrEqual(TOLERANCE);
			},
		});
	});
});

test('forceFallbackPositioning: fitting caps to the viewport and measures the anchor', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	/**
	 * The JavaScript path, forced, so all three engines assert it. Two things used
	 * to go wrong here because the fit half of the recipe could not see this option:
	 * the placement axis got `calc(100% - …)`, which with no `position-area`
	 * constrains nothing; and `'match-anchor'` was written as
	 * `anchor-size(self-inline)`, which has nothing to resolve against.
	 *
	 * No path branch, because the runtime probe still reports support here.
	 */
	await openFixture({
		page,
		viewport: WIDE_VIEWPORT,
		params: {
			forceFallback: true,
			inlineSize: 'match-anchor',
			blockSize: 'max-available',
			triggerInlineStart: 100,
			triggerInlineSize: 200,
			triggerBlockStart: 100,
			contentInlineSize: 800,
			contentBlockSize: 800,
		},
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport } = geometry;
			expectOnScreen(geometry);

			const expectedHeight = viewportCap({ extent: viewport.height });
			expect(Math.abs(host.height - expectedHeight)).toBeLessThanOrEqual(TOLERANCE);

			expect(Math.abs(host.width - trigger.width)).toBeLessThanOrEqual(TOLERANCE);
		},
	});
});

test('forceFallbackPositioning: the flip floor is NOT written, so a popover that fits stays put', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	/**
	 * The floor is a flip driver and nothing else, and this path has nothing for it
	 * to drive: `computeFallbackPosition` picks a side from the popover's MEASURED
	 * size. Do not start emitting it here - 40px of content with 90px of room below
	 * it then measures 150, neither side fits, and the popover flips ABOVE its
	 * trigger for no reason.
	 */
	await openFixture({
		page,
		params: {
			forceFallback: true,
			blockSize: 'max-available',
			triggerBlockStart: 290,
			triggerInlineStart: 160,
			contentBlockSize: 40,
			contentInlineSize: 100,
		},
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host } = geometry;
			expectOnScreen(geometry);

			// Still below the requested edge, and clear of the trigger.
			expect(host.y).toBeGreaterThanOrEqual(trigger.y + trigger.height - TOLERANCE);
			// Sized to its content, not inflated to the floor.
			expect(host.height).toBeLessThan(FALLBACK_MINIMUM_MAIN_AXIS_SIZE);
		},
	});
});
