/* eslint-disable testing-library/prefer-screen-queries */

import invariant from 'tiny-invariant';

import { expect, type Page, test } from '@af/integration-testing';

import {
	DEFAULT_GAP,
	defaultFloor,
	defaultFloorFor,
	expectedFittedSize,
	expectGeometry,
	expectOnScreen,
	FALLBACK_MINIMUM_MAIN_AXIS_SIZE,
	marginBoxAround,
	MINIMUM_MARGIN_BOX,
	TOLERANCE,
	VIEWPORT_PADDING,
} from './anchored-popover-geometry';

/**
 * Geometry coverage for `useAnchoredPopover`'s `'max-available'` sizing. The
 * per-axis sizing values and the unconditional viewport backstop are in
 * `anchored-popover-size.spec.tsx`; measuring and the shared numbers are in
 * `anchored-popover-geometry.tsx`.
 *
 * Per `notes/rules/testing.md`, size is asserted as observable geometry rather
 * than as CSS declarations, and as both the SIZE and the SIDE: a popover clamped
 * to a 53px letterbox is still scrollable, so reachability is true of the broken
 * state too.
 *
 * The recipe has a different contract on each path, so each test probes
 * `CSS.supports` at runtime and asserts whichever ran:
 *
 * - CSS Anchor Positioning: the placement axis is capped to the position-area
 *   cell, and a floor makes a too-small cell overflow so the popover flips.
 * - JS fallback: both axes are capped to the viewport and
 *   `computeFallbackPosition` picks the roomier side itself. No anchor-edge cap
 *   there yet, so what is asserted is that the viewport cap reaches the content.
 */

type TFixtureParams = {
	fit?: boolean;
	axis?: 'block' | 'inline';
	edge?: 'start' | 'end';
	align?: 'start' | 'center' | 'end';
	animate?: boolean;
	/**
	 * Overrides the inline axis alone, so it can be combined with `fit`.
	 */
	inlineSize?: 'content' | 'min-anchor' | 'match-anchor' | 'max-available';
	triggerBlockStart?: number;
	triggerInlineStart?: number;
	contentBlockSize?: number;
	contentInlineSize?: number;
	/**
	 * Swaps `PopoverSurface` for a child that keeps `overflow: visible`, which is
	 * the shape most custom `popupComponent` containers have.
	 */
	nonScrollingChild?: boolean;
};

async function openFixture({
	page,
	params,
	viewport,
}: {
	page: Page;
	params: TFixtureParams;
	viewport: { width: number; height: number };
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

	await page.visitExample<
		typeof import('../../examples/160-testing-popover-fit-available-space.tsx')
	>('design-system', 'top-layer', 'testing-popover-fit-available-space', searchParams);

	await page.getByTestId('popover-trigger').click();
	await expect(page.getByTestId('popover-content')).toBeVisible();
}

/**
 * The four cases from the ticket, plus F. `expectFlip` is not an independent
 * expectation: it is "the floored margin box > requested cell", recomputed in
 * the test from the measured trigger.
 *
 * Where `calc-size()` is supported, the default floor is the content's own size
 * up to the viewport clamp (`defaultFloorFor`). That changes B, F and G:
 *
 * - B hugs its 100px content instead of being padded to 150px.
 * - F flips at its own 60px.
 * - G, taller than 150px, flips to the side that holds it at full size, where
 *   the fixed floor leaves it below and scrolling. `expectFlipWithContentSizedFloor`
 *   is the only case that differs by engine.
 */
const BLOCK_AXIS_CASES = [
	{
		name: 'A - flips to the roomy side rather than shrinking to 27px',
		viewport: { width: 400, height: 400 },
		triggerBlockStart: 340,
		contentBlockSize: 200,
		expectFlip: true,
	},
	{
		name: 'B - stays where the consumer asked when it fits',
		viewport: { width: 400, height: 400 },
		triggerBlockStart: 200,
		contentBlockSize: 100,
		expectFlip: false,
	},
	{
		name: 'C - ticket geometry, trigger low: flips and scrolls',
		viewport: { width: 320, height: 256 },
		triggerBlockStart: 170,
		contentBlockSize: 400,
		expectFlip: true,
	},
	{
		name: 'D - ticket geometry, trigger high: stays below and scrolls',
		viewport: { width: 320, height: 256 },
		triggerBlockStart: 60,
		contentBlockSize: 400,
		expectFlip: false,
	},
	{
		// Not from the ticket. Short content in a 30px cell: it still flips where
		// the floor is content-sized, because its own 73px margin box overflows the
		// cell. A cap with no floor at all letterboxes it to 17px below instead.
		name: 'F - short content in a too-small cell: flips, at its own size where calc-size() is supported',
		viewport: { width: 400, height: 400 },
		triggerBlockStart: 350,
		contentBlockSize: 60,
		expectFlip: true,
	},
	{
		// 170px below the 20px trigger, 210px above. The 175px content needs
		// `175 + 13 = 188`, so it fits above only. The fixed floor's 163px margin
		// box fits below, so it stays there and scrolls at 157px. The content-sized
		// floor is the content itself (under the 177px clamp), so it overflows below
		// and flips above at full size.
		name: 'G - content taller than 150px that fits only above: flips at full size where calc-size() is supported',
		viewport: { width: 400, height: 400 },
		triggerBlockStart: 210,
		contentBlockSize: 175,
		expectFlip: false,
		expectFlipWithContentSizedFloor: true,
	},
] as const;

BLOCK_AXIS_CASES.forEach((blockAxisCase) => {
	const { name, viewport, triggerBlockStart, contentBlockSize } = blockAxisCase;
	const expectFlip = blockAxisCase.expectFlip;
	const expectFlipWithContentSizedFloor =
		'expectFlipWithContentSizedFloor' in blockAxisCase
			? blockAxisCase.expectFlipWithContentSizedFloor
			: blockAxisCase.expectFlip;

	test(`fits the available block space: ${name}`, async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		await openFixture({
			page,
			viewport,
			params: { fit: true, triggerBlockStart, contentBlockSize },
		});

		await expectGeometry({
			page,
			assert: ({ trigger, host, viewport: vp, isCssAnchorPositioning, isContentSizedFloor }) => {
				// Both paths: on screen, which is the assertion the shipped bug failed.
				expect(host.y).toBeGreaterThanOrEqual(-TOLERANCE);
				expect(host.y + host.height).toBeLessThanOrEqual(vp.height + TOLERANCE);

				if (!isCssAnchorPositioning) {
					// No anchor-edge cap on this path, so the contract is that the viewport
					// cap reaches the content at all, which needs the flex formatting
					// context `Popover` establishes on the host.
					expect(host.height).toBeLessThanOrEqual(vp.height - 2 * VIEWPORT_PADDING + TOLERANCE);
					return;
				}

				const cellBelow = vp.height - (trigger.y + trigger.height);
				const cellAbove = trigger.y;
				const floor = defaultFloorFor({
					content: contentBlockSize,
					isContentSizedFloor,
					viewportExtent: vp.height,
					anchorExtent: trigger.height,
				});

				const isFlipExpected = isContentSizedFloor ? expectFlipWithContentSizedFloor : expectFlip;
				const hasFlipped = host.y + host.height <= trigger.y + TOLERANCE;
				expect(hasFlipped).toBe(isFlipExpected);
				// Restated from the recipe, so a failure says which half broke.
				expect(marginBoxAround({ size: floor }) > cellBelow).toBe(isFlipExpected);

				const cell = hasFlipped ? cellAbove : cellBelow;
				const expected = expectedFittedSize({ cell, content: contentBlockSize, floor });
				expect(Math.abs(host.height - expected)).toBeLessThanOrEqual(TOLERANCE);
			},
		});
	});
});

test('E - a viewport too short for the 150px floor on EITHER side: the floor yields, the popover flips and stays on screen', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	// The case A-D do not cover: no cell holds `150 + gap + padding`. Unclamped,
	// every try-fallback overflows, the browser reverts to the base position and
	// the floor pushes the popover off the bottom. Clamped against the viewport it
	// is `(300 - 20) / 2 - 13 = 127`, whose margin box (140) overflows the 130px
	// cell below and fits the 150px cell above - so the asymmetric trigger is what
	// makes the flip observable.
	const viewport = { width: 400, height: 300 };
	const contentBlockSize = 400;

	await openFixture({
		page,
		viewport,
		params: { fit: true, triggerBlockStart: 150, contentBlockSize },
	});

	await expectGeometry({
		page,
		assert: (geometry) => {
			const { trigger, host, viewport: vp, isCssAnchorPositioning } = geometry;
			// The assertion the unclamped floor fails: fully on screen.
			expectOnScreen(geometry);

			const cellBelow = vp.height - (trigger.y + trigger.height);
			const cellAbove = trigger.y;
			// The fixture really is the case: neither cell holds the unclamped floor.
			expect(MINIMUM_MARGIN_BOX).toBeGreaterThan(cellBelow);
			expect(MINIMUM_MARGIN_BOX).toBeGreaterThan(cellAbove);

			if (!isCssAnchorPositioning) {
				expect(host.height).toBeLessThanOrEqual(vp.height - 2 * VIEWPORT_PADDING + TOLERANCE);
				return;
			}

			const floor = defaultFloor({ viewportExtent: vp.height, anchorExtent: trigger.height });
			// The clamp bound, and still overflows the requested cell, so it flips.
			expect(floor).toBeLessThan(FALLBACK_MINIMUM_MAIN_AXIS_SIZE);
			expect(marginBoxAround({ size: floor })).toBeGreaterThan(cellBelow);
			expect(marginBoxAround({ size: floor })).toBeLessThanOrEqual(cellAbove);

			const hasFlipped = host.y + host.height <= trigger.y + TOLERANCE;
			expect(hasFlipped).toBe(true);

			// Capped to the cell it landed in; the content is taller than any cell.
			const expected = expectedFittedSize({ cell: cellAbove, content: contentBlockSize, floor });
			expect(Math.abs(host.height - expected)).toBeLessThanOrEqual(TOLERANCE);
		},
	});
});

test('fits the available inline space, and flips across the inline axis', async ({
	page,
	skipAxeCheck,
}) => {
	skipAxeCheck();

	const viewport = { width: 400, height: 400 };
	// 40px of room to the inline-end of the 80px trigger, 280px to its start.
	await openFixture({
		page,
		viewport,
		params: {
			fit: true,
			axis: 'inline',
			edge: 'end',
			triggerInlineStart: 280,
			triggerBlockStart: 190,
			contentInlineSize: 200,
			contentBlockSize: 100,
		},
	});

	await expectGeometry({
		page,
		assert: ({ trigger, host, viewport: vp, isCssAnchorPositioning }) => {
			expect(host.x).toBeGreaterThanOrEqual(-TOLERANCE);
			expect(host.x + host.width).toBeLessThanOrEqual(vp.width + TOLERANCE);

			// Both paths should move it to the roomy side; only the CSS path has a
			// cell-derived width to assert.
			expect(host.x + host.width).toBeLessThanOrEqual(trigger.x + TOLERANCE);

			if (!isCssAnchorPositioning) {
				expect(host.width).toBeLessThanOrEqual(vp.width - 2 * VIEWPORT_PADDING + TOLERANCE);
				return;
			}

			const cellAfter = vp.width - (trigger.x + trigger.width);
			expect(MINIMUM_MARGIN_BOX).toBeGreaterThan(cellAfter);

			const expected = expectedFittedSize({ cell: trigger.x, content: 200 });
			expect(Math.abs(host.width - expected)).toBeLessThanOrEqual(TOLERANCE);
		},
	});
});

/**
 * Fitting is opt-in, and turning it on changes the outcome measurably. The
 * control for the cases above, as a matched PAIR: the same fixture with `fit`
 * flipped and nothing else, so each case is the mutation guard for the other.
 *
 * The viewport backstop is unconditional, so what fitting adds to the placement
 * axis is the CELL cap, the FLOOR and the 5px viewport padding. The fixture lets
 * them decide the SIDE in every CSS engine: a 70px cell holds the unfitted
 * popover's 68px margin box (`60 + 8`) and not the fitted one's, which is 73px
 * with a content-sized floor (`60 + 8 + 5`) and 163px with the 150px floor. The
 * floor also decides the SIZE where it is not content-sized (150px, not 60px).
 *
 * The floor is what makes the fitted case move. Without it the cell cap shrinks
 * the popover to 57px, which fits the cell, so it would stay below.
 *
 * On the JavaScript fallback the two cases are indistinguishable, and that is the
 * contract: the cell cap needs a `position-area` and the floor only has a job
 * where it can overflow one. `60 + 8` fits the 70px cell there, so both stay.
 */
const OPT_IN_VIEWPORT = { width: 700, height: 400 };

/**
 * Smaller than the floor, so a popover floored at 150px cannot be mistaken for
 * this.
 */
const OPT_IN_CONTENT_BLOCK_SIZE = 60;

/**
 * Between the unfitted margin box (`content + gap`) and the fitted one
 * (`content + gap + padding`, or larger with the 150px floor), which is what
 * makes the two cases land on different sides.
 */
const OPT_IN_CELL_BELOW = 70;

// The fixture's trigger is a fixed 80x20.
const OPT_IN_TRIGGER_BLOCK_SIZE = 20;

const OPT_IN_TRIGGER_BLOCK_START =
	OPT_IN_VIEWPORT.height - OPT_IN_TRIGGER_BLOCK_SIZE - OPT_IN_CELL_BELOW;

const OPT_IN_CASES = [
	{
		name: 'without the option the popover is its content, in a cell a fitted one flips out of',
		fit: false,
		expected: { height: OPT_IN_CONTENT_BLOCK_SIZE, isFlipped: false },
		expectedWithContentSizedFloor: { height: OPT_IN_CONTENT_BLOCK_SIZE, isFlipped: false },
	},
	{
		name: 'with the option the same popover is floored, and flips out of that cell',
		fit: true,
		expected: { height: FALLBACK_MINIMUM_MAIN_AXIS_SIZE, isFlipped: true },
		// Floored at its own size, which still overflows the cell.
		expectedWithContentSizedFloor: { height: OPT_IN_CONTENT_BLOCK_SIZE, isFlipped: true },
	},
] as const;

OPT_IN_CASES.forEach(({ name, fit, expected, expectedWithContentSizedFloor }) => {
	test(`fitting is opt-in: ${name}`, async ({ page, skipAxeCheck }) => {
		skipAxeCheck();

		await openFixture({
			page,
			viewport: OPT_IN_VIEWPORT,
			params: {
				fit,
				triggerBlockStart: OPT_IN_TRIGGER_BLOCK_START,
				// Centred on the inline axis, so the cross axis never has to be
				// rescued and the block axis is the only thing being measured.
				triggerInlineStart: 300,
				contentBlockSize: OPT_IN_CONTENT_BLOCK_SIZE,
			},
		});

		await expectGeometry({
			page,
			assert: (geometry) => {
				const {
					trigger,
					host,
					viewport: vp,
					isCssAnchorPositioning,
					isContentSizedFloor,
				} = geometry;
				expectOnScreen(geometry);

				if (!isCssAnchorPositioning) {
					// Both cases: the content's height, below the trigger it fits under,
					// inside the unconditional backstop.
					expect(Math.abs(host.height - OPT_IN_CONTENT_BLOCK_SIZE)).toBeLessThanOrEqual(TOLERANCE);
					expect(host.y).toBeGreaterThanOrEqual(trigger.y + trigger.height - TOLERANCE);
					expect(host.height).toBeLessThanOrEqual(vp.height - 2 * VIEWPORT_PADDING + TOLERANCE);
					return;
				}

				const cellBelow = vp.height - (trigger.y + trigger.height);
				// Measured rather than assumed: the cell holds the unfitted margin box and
				// neither fitted one, so the two cases differ in side in every CSS engine.
				expect(OPT_IN_CONTENT_BLOCK_SIZE + DEFAULT_GAP).toBeLessThanOrEqual(cellBelow);
				expect(marginBoxAround({ size: OPT_IN_CONTENT_BLOCK_SIZE })).toBeGreaterThan(cellBelow);
				expect(MINIMUM_MARGIN_BOX).toBeGreaterThan(cellBelow);

				const { height, isFlipped } = isContentSizedFloor
					? expectedWithContentSizedFloor
					: expected;

				// The floor is the sole author of the fitted height: the cap of the cell
				// it lands in is larger than the content.
				expect(Math.abs(host.height - height)).toBeLessThanOrEqual(TOLERANCE);

				// The side from both ends, so each case pins where the popover IS.
				const hasFlipped = host.y + host.height <= trigger.y + TOLERANCE;
				const isBelowTrigger = host.y >= trigger.y + trigger.height - TOLERANCE;
				expect(hasFlipped).toBe(isFlipped);
				expect(isBelowTrigger).toBe(!isFlipped);

				// The backstop is on in BOTH cases.
				expect(host.height).toBeLessThanOrEqual(vp.height - 2 * VIEWPORT_PADDING + TOLERANCE);
			},
		});
	});
});

test('the capped surface scrolls its overflowing content', async ({ page, skipAxeCheck }) => {
	skipAxeCheck();

	// Case C, where the content is far taller than either cell, so the cap binds.
	//
	// Also the WebKit flex-collapse pin: the surface is the flex child of a
	// `display: flex` host, and on WebKit a size-constrained flex column with an
	// `overflow: auto` child can collapse to zero height. See
	// notes/decisions/safari-popover-flex-collapse.md
	await openFixture({
		page,
		viewport: { width: 320, height: 256 },
		params: { fit: true, triggerBlockStart: 170, contentBlockSize: 400 },
	});

	await expect(async () => {
		const surface = await page.evaluate(() => {
			const host = document.querySelector('[data-testid="popover-content"]')?.closest('[popover]');
			const element = host?.firstElementChild;
			if (!element) {
				return null;
			}
			return { clientHeight: element.clientHeight, scrollHeight: element.scrollHeight };
		});

		invariant(surface, 'popover surface should exist');
		expect(surface.clientHeight).toBeGreaterThan(0);
		expect(surface.scrollHeight).toBeGreaterThan(surface.clientHeight);
	}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
});

test('the cap reaches a child that does NOT scroll', async ({ page, skipAxeCheck }) => {
	skipAxeCheck();

	/**
	 * `PopoverSurface` scrolls, so its automatic minimum size already computes to
	 * `0`. A custom `popupComponent` usually keeps `overflow: visible`, and there a
	 * flex item's `min-inline-size: auto` stays CONTENT-based per css-flexbox-1
	 * §4.5, so without the reset in `Popover`'s stylesheet the child refuses to
	 * shrink and hangs out of the capped host.
	 *
	 * 600px of content on the CROSS axis in a 320px viewport, so the two states
	 * differ by 290px. The block axis is deliberately roomy: the automatic minimum
	 * only applies to the flex MAIN axis, and a flip would make the cap the thing
	 * under test instead.
	 *
	 * Two live regressions this pins: `<Popup shouldFitViewport>` with
	 * `FixedWidthPopupComponent` (jql-builder) and with portfolio-3's
	 * `CustomPopupContainer`.
	 */
	await openFixture({
		page,
		viewport: { width: 320, height: 400 },
		params: {
			fit: true,
			nonScrollingChild: true,
			triggerBlockStart: 40,
			contentBlockSize: 100,
			contentInlineSize: 600,
		},
	});

	await expect(async () => {
		const measured = await page.evaluate(() => {
			const child = document.querySelector('[data-testid="popover-surface"]');
			const host = child?.closest('[popover]');
			if (!child || !host) {
				return null;
			}
			return {
				childWidth: child.getBoundingClientRect().width,
				hostWidth: host.getBoundingClientRect().width,
				viewportWidth: window.innerWidth,
			};
		});

		invariant(measured, 'popover surface should exist');
		// Shrunk to the host rather than staying at its 600px content width.
		expect(Math.abs(measured.childWidth - measured.hostWidth)).toBeLessThanOrEqual(TOLERANCE);
		expect(measured.childWidth).toBeLessThanOrEqual(
			measured.viewportWidth - 2 * VIEWPORT_PADDING + TOLERANCE,
		);
	}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
});

test('a closed fitting popover is not left displayed', async ({ page, skipAxeCheck }) => {
	skipAxeCheck();

	/**
	 * An INLINE `display: flex` would outrank the UA
	 * `[popover]:not(:popover-open) { display: none }` rule, leaving a closed
	 * popover laid out at full size as a hit-testable ghost. Un-animated, because
	 * an exit animation's fill-mode opacity would mask it.
	 *
	 * `hidePopover()` directly rather than through the React `isOpen` prop, so the
	 * element is still mounted when it is measured.
	 */
	await openFixture({
		page,
		viewport: { width: 400, height: 400 },
		params: { fit: true, animate: false, triggerBlockStart: 100, contentBlockSize: 200 },
	});

	await expectGeometry({ page, assert: ({ host }) => expect(host.height).toBeGreaterThan(0) });

	const closed = await page.evaluate(() => {
		const host = document.querySelector('[data-testid="popover-content"]')?.closest('[popover]');
		if (!(host instanceof HTMLElement)) {
			return null;
		}
		host.hidePopover();
		const rect = host.getBoundingClientRect();
		return {
			display: window.getComputedStyle(host).display,
			width: rect.width,
			height: rect.height,
		};
	});

	invariant(closed, 'popover host should still be mounted after hidePopover()');
	expect(closed.display).toBe('none');
	expect(closed.width).toBe(0);
	expect(closed.height).toBe(0);
});

test.describe('reduced motion', () => {
	// WebKit never settles this interaction, and not because of fitting: the
	// pre-existing `animation-lifecycle.spec.tsx` tests time out the same way. The
	// closed-state contract is covered on all three engines by the `hidePopover()`
	// test above; this adds the React lifecycle half.
	test.fixme(
		({ browserName }) => browserName === 'webkit',
		'WebKit does not settle a popover close in this environment; see animation-lifecycle.spec.tsx',
	);

	test('a fitting popover unmounts on close under reduced motion', async ({
		page,
		skipAxeCheck,
	}) => {
		skipAxeCheck();

		// The other exposure for the same defect: `prefers-reduced-motion` sets
		// `animation-name: none`, so there is no fill-mode opacity to mask a ghost.
		await page.emulateMedia({ reducedMotion: 'reduce' });

		await openFixture({
			page,
			viewport: { width: 400, height: 400 },
			params: { fit: true, animate: true, triggerBlockStart: 100, contentBlockSize: 200 },
		});

		await expectGeometry({ page, assert: ({ host }) => expect(host.height).toBeGreaterThan(0) });

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		// `toBeHidden()` also passes for an element laid out off-screen, and a ghost
		// is neither: it is displayed at full size.
		await expect(page.locator('[popover]')).toHaveCount(0);
	});
});
