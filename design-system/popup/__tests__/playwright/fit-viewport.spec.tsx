/* eslint-disable testing-library/prefer-screen-queries */

import invariant from 'tiny-invariant';

import { expect, type Page, test } from '@af/integration-testing';

/**
 * `Popup`'s `shouldFitViewport`, asserted as geometry on both code paths. On the
 * top-layer path the prop did nothing: its whole implementation was
 * `overflow: auto` on a wrapper inside a `PopoverSurface` that already set it,
 * and `overflow: auto` with no cap is inert.
 *
 * The assertions are path-agnostic, so they double as the legacy/top-layer parity
 * check: a scroll container exists, is within the viewport, actually scrolls, and
 * can bring the control at the bottom of the content on screen. The first three
 * are what make this more than a reachability test, which a popover clamped to a
 * 53px letterbox also passes.
 *
 * The flag is toggled with a bare `featureFlag` key and omitted entirely for
 * flag-off, which is the only form the examples page understands.
 */

const TOP_LAYER_FLAG = 'platform-dst-top-layer';

/**
 * Sub-pixel layout differences.
 */
const TOLERANCE = 1;

const VIEWPORT = { width: 400, height: 400 };

/**
 * The nearest ancestor of the content whose `overflow` is scrollable. Found by
 * walking up rather than by `testId`, because the two code paths put it on
 * different elements and the point is that SOMETHING scrolls.
 */
async function readScrollContainer({ page }: { page: Page }): Promise<{
	top: number;
	bottom: number;
	clientHeight: number;
	scrollHeight: number;
	viewportHeight: number;
} | null> {
	return page.evaluate(() => {
		const content = document.querySelector('[data-testid="fit-popup-body"]');
		let element = content?.parentElement ?? null;

		while (element) {
			const overflowY = window.getComputedStyle(element).overflowY;
			if (overflowY === 'auto' || overflowY === 'scroll') {
				break;
			}
			element = element.parentElement;
		}

		if (!element) {
			return null;
		}

		const rect = element.getBoundingClientRect();
		return {
			top: rect.top,
			bottom: rect.bottom,
			clientHeight: element.clientHeight,
			scrollHeight: element.scrollHeight,
			viewportHeight: window.innerHeight,
		};
	});
}

async function openFixture({
	page,
	params,
	isTopLayer,
}: {
	page: Page;
	params: { [key: string]: string };
	isTopLayer: boolean;
}): Promise<void> {
	await page.setViewportSize(VIEWPORT);
	await page.visitExample<typeof import('../../examples/98-testing-fit-viewport.tsx')>(
		'design-system',
		'popup',
		'testing-fit-viewport',
		isTopLayer ? { ...params, featureFlag: TOP_LAYER_FLAG } : params,
	);

	await page.getByTestId('fit-popup-trigger').click();
	await expect(page.getByTestId('fit-popup-body')).toBeVisible();
}

/**
 * The trigger sits 300px down a 400px viewport, so there are only ~80px below it
 * and the 400px-tall content cannot possibly fit on either side unclamped.
 */
const CRAMPED = { triggerBlockStart: '300', contentBlockSize: '400' };

[
	{ name: 'top-layer', isTopLayer: true },
	{ name: 'legacy', isTopLayer: false },
].forEach(({ name, isTopLayer }) => {
	test(`${name}: a fitting popup is capped, on screen, and scrolls`, async ({ page }) => {
		await openFixture({ page, params: { ...CRAMPED, fit: 'true' }, isTopLayer });

		await expect(async () => {
			const scroller = await readScrollContainer({ page });
			invariant(scroller, 'the popup should have a scroll container');

			expect(scroller.top).toBeGreaterThanOrEqual(-TOLERANCE);
			expect(scroller.bottom).toBeLessThanOrEqual(scroller.viewportHeight + TOLERANCE);
			expect(scroller.scrollHeight).toBeGreaterThan(scroller.clientHeight);
		}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });

		// The reported symptom: the control at the bottom of the content has to be
		// reachable. Scrolling the popup's own container must bring it on screen.
		await page.getByTestId('fit-popup-footer-action').scrollIntoViewIfNeeded();
		await expect(page.getByTestId('fit-popup-footer-action')).toBeInViewport();
	});
});

test('top-layer: the cap reaches a custom popupComponent', async ({ page }) => {
	// The consumer's element is the direct child of the popover host, so the cap
	// has to reach it through the flex context. The container also keys its own
	// `overflow: auto` off `shouldFitViewport`, which the top-layer path did not
	// forward, so this covers both halves.
	await openFixture({
		page,
		params: { ...CRAMPED, fit: 'true', container: 'custom' },
		isTopLayer: true,
	});

	await expect(async () => {
		const container = await page.evaluate(() => {
			const element = document.querySelector('[data-testid="fit-popup-container"]');
			if (!element) {
				return null;
			}
			const rect = element.getBoundingClientRect();
			return {
				top: rect.top,
				bottom: rect.bottom,
				clientHeight: element.clientHeight,
				scrollHeight: element.scrollHeight,
				overflowY: window.getComputedStyle(element).overflowY,
				viewportHeight: window.innerHeight,
			};
		});

		invariant(container, 'the custom popup container should be rendered');

		// The prop reached the container.
		expect(container.overflowY).toBe('auto');
		// The host cap reached the container.
		expect(container.bottom).toBeLessThanOrEqual(container.viewportHeight + TOLERANCE);
		expect(container.top).toBeGreaterThanOrEqual(-TOLERANCE);
		expect(container.scrollHeight).toBeGreaterThan(container.clientHeight);
	}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
});

/**
 * `xcss` on `<Popup>` has to reach the DOM on both paths. Legacy applies it to the
 * container element; the top-layer path, with no custom `popupComponent`, applies it
 * to a wrapper inside `PopoverSurface`. Either way it is the content's PARENT, so
 * the assertion is path-agnostic. The content is 160px wide by its own styles, so
 * only the consumer's `width: 280px` can make that parent 280px wide. Before the
 * wrapper the top-layer path dropped the prop, and four call sites lost their width.
 */
[
	{ name: 'top-layer', isTopLayer: true },
	{ name: 'legacy', isTopLayer: false },
].forEach(({ name, isTopLayer }) => {
	test(`${name}: an xcss width on <Popup> reaches the rendered DOM`, async ({ page }) => {
		await openFixture({
			page,
			params: { triggerBlockStart: '100', contentBlockSize: '100', width: 'fixed' },
			isTopLayer,
		});

		await expect(async () => {
			const parentWidth = await page.evaluate(() => {
				const content = document.querySelector('[data-testid="fit-popup-body"]');
				return content?.parentElement?.getBoundingClientRect().width ?? null;
			});
			invariant(parentWidth !== null, 'the popup content should have a parent element');

			expect(Math.abs(parentWidth - 280)).toBeLessThanOrEqual(TOLERANCE);
		}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
	});
});

/**
 * The control: fitting stays OPT-IN, since fitting by default would be a
 * placement change for ~53 call sites. Two ways to be opted out, failing to two
 * different regressions: an explicit `false` fails if the adapter stops reading
 * the prop, and the prop left OFF additionally fails if the
 * `shouldFitViewport = false` default in `popup-top-layer.tsx` is flipped.
 *
 * Measured on the SCROLL CONTAINER, because `fit-popup-body` carries a hard 400px
 * `blockSize` and `getBoundingClientRect` ignores an ancestor's `overflow`. The
 * container is capped and scrolls in BOTH states, the viewport backstop being
 * unconditional; what fitting adds is the cell cap and the flip floor.
 */
const OPT_OUT_CASES = [
	{ name: 'an explicit shouldFitViewport={false}', fit: 'false' },
	{ name: 'the prop left off, so the adapter default decides', fit: undefined },
] as const;

OPT_OUT_CASES.forEach(({ name, fit }) => {
	test(`top-layer: not fitted to the space beside the trigger, with ${name}`, async ({ page }) => {
		await openFixture({
			page,
			params: fit === undefined ? { ...CRAMPED } : { ...CRAMPED, fit },
			isTopLayer: true,
		});

		await expect(async () => {
			const scroller = await readScrollContainer({ page });
			invariant(scroller, 'the popup should have a scroll container');

			// It starts on screen, next to the trigger, and runs off the bottom: a
			// popup left where it was anchored rather than one moved or clamped.
			expect(scroller.top).toBeLessThan(scroller.viewportHeight);
			expect(scroller.bottom).toBeGreaterThan(scroller.viewportHeight + TOLERANCE);
		}).toPass({ timeout: 10_000, intervals: [50, 100, 200, 500] });
	});
});
