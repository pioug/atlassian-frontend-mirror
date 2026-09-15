import { expect, type Page, test } from '@af/integration-testing';

/**
 * `shouldFitViewport` parity between legacy popper.js and the top-layer adapter.
 * Asserts the observable contract rather than a declaration, because the two
 * paths write the cap to different elements: legacy to the consumer's element,
 * top-layer to the `Popover` host. The negative case is the exception — "not
 * capped" has no geometry — so it reads a declaration instead.
 */

const TOP_LAYER_FLAG = 'platform-dst-top-layer';

/**
 * Legacy `viewportPadding`, preserved by the top-layer recipe.
 */
const VIEWPORT_PADDING = 5;

/**
 * Sub-pixel layout differences.
 */
const TOLERANCE = 1;

const FLAG_STATES = [
	{ label: 'FF-off (legacy popper.js)', featureFlag: undefined },
	{ label: 'FF-on (top-layer adapter)', featureFlag: TOP_LAYER_FLAG },
] as const;

/**
 * Reads the effective inline cap off whichever element OWNS it: the `Popover`
 * host under the top-layer adapter, the consumer's own element under legacy.
 *
 * A viewport cap resolves to pixels; a cell cap survives as a `calc()`, so
 * `parseFloat` gives `NaN`. Mapping that to `Infinity` lets one numeric
 * comparison also cover legacy's "no cap", but it makes a cell cap
 * indistinguishable from the healthiest state — hence `capRaw` for the caller.
 */
function readInlineCap(element: Element): {
	capRaw: string;
	capPx: number;
	viewportWidth: number;
} {
	const target = element.closest('[popover]') ?? element;
	const computed = getComputedStyle(target);
	const raw =
		computed.maxInlineSize && computed.maxInlineSize !== 'none'
			? computed.maxInlineSize
			: computed.maxWidth;
	const capPx = Number.parseFloat(raw);
	return {
		capRaw: raw,
		capPx: Number.isNaN(capPx) ? Number.POSITIVE_INFINITY : capPx,
		// Read in the page so the assertion does not depend on the project's
		// configured viewport. `100dvi` is the same length as `window.innerWidth`
		// (both include the classic scrollbar gutter).
		viewportWidth: window.innerWidth,
	};
}

async function measureWidth({ page, testId }: { page: Page; testId: string }): Promise<number> {
	const width = await page.locator(`[data-testid="${testId}"]`).evaluate((element) => {
		return element.getBoundingClientRect().width;
	});
	return width;
}

for (const { label, featureFlag } of FLAG_STATES) {
	const params: { [key: string]: string | boolean } = featureFlag ? { featureFlag } : {};

	test(`no cell cap is applied if the viewport is large enough [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/00-basic-positioning.vr.ap.tsx')>(
			'design-system',
			'popper',
			'basic-positioning',
			params,
		);

		const popper = page.locator('[data-testid="popper"]');

		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		// This example does not pass `shouldFitViewport`, so the popper must not be
		// capped to its `position-area` cell.
		const { capRaw, capPx, viewportWidth } = await popper.evaluate(readInlineCap);

		// A percentage is the cell cap's signature; neither legitimate value has one.
		expect(capRaw).not.toContain('%');

		// An absolute cap has to be a whole-viewport one. `Infinity` (legacy: no
		// cap) and the flag-on viewport backstop both clear this bar.
		expect(capPx).toBeGreaterThanOrEqual(viewportWidth - 2 * VIEWPORT_PADDING - TOLERANCE);
	});

	test(`max size is correctly applied [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/03-max-size.vr.ap.tsx')>(
			'design-system',
			'popper',
			'max-size',
			params,
		);

		const popper = page.locator('[data-testid="placement--right"]');

		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		// The content is `110vw`, so an uncapped popper cannot fit. Being capped
		// shows as staying clear of the viewport edge, and scrolling.
		await expect(async () => {
			const measured = await popper.evaluate((element) => ({
				right: element.getBoundingClientRect().right,
				clientWidth: element.clientWidth,
				scrollWidth: element.scrollWidth,
				viewportWidth: window.innerWidth,
			}));

			expect(measured.right).toBeLessThanOrEqual(
				measured.viewportWidth - VIEWPORT_PADDING + TOLERANCE,
			);
			expect(measured.scrollWidth).toBeGreaterThan(measured.clientWidth);
		}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
	});

	test(`max size updates when page gets smaller [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/03-max-size.vr.ap.tsx')>(
			'design-system',
			'popper',
			'max-size',
			params,
		);

		const popper = page.locator('[data-testid="placement--right"]');

		// Default size, but making it explicit
		await page.setViewportSize({ width: 1280, height: 720 });
		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();
		const widthStart = await measureWidth({ page, testId: 'placement--right' });

		await page.setViewportSize({ width: 1080, height: 720 });
		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		await expect(async () => {
			const widthEnd = await measureWidth({ page, testId: 'placement--right' });
			expect(widthEnd).toBeLessThan(widthStart);
		}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
	});

	test(`max size updates when page gets bigger [${label}]`, async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/03-max-size.vr.ap.tsx')>(
			'design-system',
			'popper',
			'max-size',
			params,
		);

		const popper = page.locator('[data-testid="placement--right"]');

		// Default size, but making it explicit
		await page.setViewportSize({ width: 1280, height: 720 });
		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();
		const widthStart = await measureWidth({ page, testId: 'placement--right' });

		await page.setViewportSize({ width: 1480, height: 720 });
		await expect(popper).toBeVisible();
		await expect(popper).toBeInViewport();

		await expect(async () => {
			const widthEnd = await measureWidth({ page, testId: 'placement--right' });
			expect(widthEnd).toBeGreaterThan(widthStart);
		}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
	});
}
