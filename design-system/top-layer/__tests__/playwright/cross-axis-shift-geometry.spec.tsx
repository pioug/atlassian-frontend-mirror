/* eslint-disable testing-library/prefer-screen-queries */
import invariant from 'tiny-invariant';

import { expect, type Page, test } from '@af/integration-testing';

/**
 * Geometry coverage for `offset.crossAxisShift`.
 *
 * Per `notes/rules/testing.md`, size and position are asserted as observable
 * geometry rather than as CSS declarations. That rule is what these tests are
 * for: every bug below emitted exactly the declaration it was supposed to emit,
 * and the browser then did something other than what was intended, so a
 * `toHaveCSS('margin-inline-start', '40px')` assertion passed throughout.
 *
 * Each test measures the popover twice, once with no shift and once with the
 * shift applied, and asserts the DISTANCE between the two. Measuring a delta
 * rather than an absolute coordinate keeps the assertion independent of the
 * trigger's position and of the popover's intrinsic size.
 */

const SHIFT = 40;

// Sub-pixel layout differences between engines. This package runs its specs on
// Chromium, Firefox and WebKit.
const TOLERANCE = 1;

type TShiftParams = {
	axis?: 'block' | 'inline';
	align?: 'start' | 'center' | 'end';
	shift?: number;
	shiftDirection?: 'forwards' | 'backwards';
	forceFallback?: boolean;
};

type TBox = { x: number; y: number; width: number; height: number };

/**
 * Opens the positioning fixture with the given placement and returns the
 * popover HOST's box. The host is the element carrying the margins, so it is the
 * box the shift acts on.
 */
async function measurePopoverHost({
	page,
	params,
}: {
	page: Page;
	params: TShiftParams;
}): Promise<TBox> {
	const searchParams: { [key: string]: string | boolean } = {};
	if (params.axis) {
		searchParams.axis = params.axis;
	}
	if (params.align) {
		searchParams.align = params.align;
	}
	if (params.shift !== undefined) {
		searchParams.shift = String(params.shift);
	}
	if (params.shiftDirection) {
		searchParams.shiftDirection = params.shiftDirection;
	}
	if (params.forceFallback) {
		searchParams.forceFallback = true;
	}

	await page.visitExample<typeof import('../../examples/112-testing-popover-positioning.tsx')>(
		'design-system',
		'top-layer',
		'testing-popover-positioning',
		searchParams,
	);

	await page.getByTestId('popover-trigger').click();
	await expect(page.getByTestId('popover-content')).toBeVisible();

	/**
	 * Wait for the popover to actually be POSITIONED, not merely present.
	 *
	 * The JavaScript fallback measures the trigger asynchronously (a
	 * `ResizeObserver` waits for the first valid layout) and keeps the popover at
	 * `opacity: 0` until that completes. `toBeVisible()` ignores opacity, so
	 * without this wait the fallback cases are measured at their unpositioned
	 * origin, which is a STABLE position and so would survive the settle check
	 * below. The CSS Anchor Positioning path never sets opacity, so it passes
	 * this immediately.
	 */
	await page.waitForFunction(() => {
		const content = document.querySelector('[data-testid="popover-content"]');
		const host = content?.closest('[popover]');
		if (!host) {
			return false;
		}
		return window.getComputedStyle(host).opacity === '1';
	});

	/**
	 * Then wait for the box to settle.
	 *
	 * Engines do not all resolve `position-area` in the same frame the styles are
	 * written. WebKit in particular can report the popover at its user-agent
	 * default (centered in the viewport) for a frame, which produces a plausible
	 * but wrong measurement rather than an obvious failure.
	 */
	await page.evaluate(() => {
		function readRect(): string | null {
			const content = document.querySelector('[data-testid="popover-content"]');
			const host = content?.closest('[popover]');
			const rect = host?.getBoundingClientRect();
			return rect ? `${rect.x},${rect.y},${rect.width},${rect.height}` : null;
		}

		return new Promise<void>((resolve, reject) => {
			let previous: string | null = null;
			let matches = 0;
			let frames = 0;

			function tick() {
				frames += 1;
				if (frames > 120) {
					reject(new Error('popover box never settled'));
					return;
				}

				const current = readRect();
				if (current !== null && current === previous) {
					matches += 1;
					if (matches >= 3) {
						resolve();
						return;
					}
				} else {
					matches = 0;
				}
				previous = current;
				requestAnimationFrame(tick);
			}

			requestAnimationFrame(tick);
		});
	});

	const box = await page.evaluate(() => {
		const content = document.querySelector('[data-testid="popover-content"]');
		const host = content?.closest('[popover]');
		const rect = host?.getBoundingClientRect();
		if (!rect) {
			return null;
		}
		return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
	});

	invariant(box, 'popover host bounding box should exist');
	return box;
}

/**
 * The coordinate the shift acts on, which is the popover's ANCHORED cross-axis
 * edge.
 *
 * Measuring the anchored edge rather than always measuring `x` keeps the result
 * independent of the popover's width. That matters because the popover has no
 * explicit width, so it is shrink-to-fit against a containing block whose size
 * the shift margins themselves change, and a sub-pixel difference in the
 * resulting width would otherwise show up as a difference in `x`.
 */
function anchoredEdge({ box, params }: { box: TBox; params: TShiftParams }): number {
	const isBlockAxis = (params.axis ?? 'block') === 'block';
	const leading = isBlockAxis ? box.x : box.y;
	const size = isBlockAxis ? box.width : box.height;
	const align = params.align ?? 'center';

	if (align === 'end') {
		return leading + size;
	}
	if (align === 'center') {
		return leading + size / 2;
	}
	return leading;
}

/**
 * The signed cross-axis displacement the shift produced. Positive is toward the
 * cross-axis end.
 */
async function measureShiftDistance({
	page,
	params,
}: {
	page: Page;
	params: TShiftParams;
}): Promise<number> {
	const unshifted = await measurePopoverHost({ page, params: { ...params, shift: 0 } });
	const shifted = await measurePopoverHost({ page, params: { ...params, shift: SHIFT } });

	return anchoredEdge({ box: shifted, params }) - anchoredEdge({ box: unshifted, params });
}

test.describe('crossAxisShift geometry', () => {
	test('align center moves the FULL shift, not half', async ({ page }) => {
		const distance = await measureShiftDistance({ page, params: { align: 'center' } });

		// `align: 'center'` is centered with `anchor-center`, which centers the
		// popover's MARGIN box. A single-sided shift margin moved the border box
		// only SHIFT / 2, so this assertion is what distinguishes the fix.
		expect(Math.abs(distance - SHIFT)).toBeLessThanOrEqual(TOLERANCE);
	});

	test('align start moves the full shift', async ({ page }) => {
		const distance = await measureShiftDistance({ page, params: { align: 'start' } });

		expect(Math.abs(distance - SHIFT)).toBeLessThanOrEqual(TOLERANCE);
	});

	test('align end moves the full shift, in the same direction as align start', async ({ page }) => {
		const distance = await measureShiftDistance({ page, params: { align: 'end' } });

		// `forwards` means toward the cross-axis end for EVERY align value, so a
		// positive displacement here, matching the `align: 'start'` case.
		expect(Math.abs(distance - SHIFT)).toBeLessThanOrEqual(TOLERANCE);
	});

	test('backwards moves the full shift toward the cross-axis start', async ({ page }) => {
		const distance = await measureShiftDistance({
			page,
			params: { align: 'center', shiftDirection: 'backwards' },
		});

		expect(Math.abs(distance + SHIFT)).toBeLessThanOrEqual(TOLERANCE);
	});

	test('inline-axis placement shifts along the block axis', async ({ page }) => {
		const distance = await measureShiftDistance({ page, params: { axis: 'inline' } });

		expect(Math.abs(distance - SHIFT)).toBeLessThanOrEqual(TOLERANCE);
	});

	test('the JS fallback shifts the same direction and distance as the CSS path', async ({
		page,
	}) => {
		const cssPath = await measureShiftDistance({ page, params: { align: 'end' } });
		const fallback = await measureShiftDistance({
			page,
			params: { align: 'end', forceFallback: true },
		});

		// The fallback applied a per-align sign inversion that only makes sense
		// for margins, so for `align: 'end'` it moved the popover the OPPOSITE
		// direction to the CSS path. Comparing the two paths directly is the
		// assertion that catches a reintroduction.
		expect(Math.abs(fallback - cssPath)).toBeLessThanOrEqual(TOLERANCE);
		expect(Math.abs(fallback - SHIFT)).toBeLessThanOrEqual(TOLERANCE);
	});
});
