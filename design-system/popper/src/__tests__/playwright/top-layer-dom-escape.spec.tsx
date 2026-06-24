import { expect, type Locator, test } from '@af/integration-testing';

/**
 * Popper: FF-on top-layer escape.
 *
 * The migration's headline guarantee is that the popper surface
 * escapes clipping ancestors via the native Popover top-layer.
 * Under the HTML popover spec the DOM tree is unchanged - the
 * surface stays inside its declared parent - but it is painted in
 * the top layer, so it is visible at coordinates outside the
 * clipping ancestor's bounding box.
 *
 * This spec asserts:
 *   1. the popper surface is hosted by a `[popover="manual"]` element
 *      (i.e. it is actually using the top-layer Popover API, not a
 *      plain `<div>`), and
 *   2. the surface paints outside the clipping ancestor's rect (i.e.
 *      it is not clipped). A regression that rendered a plain `<div>`
 *      with no `popover` attribute would fail check 1; a regression
 *      that failed to enter the top layer would fail check 2.
 */
const featureFlag = 'platform-dst-top-layer';

type TEscapeInfo = {
	popoverMode: string | null;
	popperRight: number;
	clipperRight: number;
};

async function readEscapeInfo(popper: Locator): Promise<TEscapeInfo> {
	return popper.evaluate((node) => {
		const host = node.closest('[popover]');
		const popperRect = node.getBoundingClientRect();
		// eslint-disable-next-line @atlaskit/platform/no-direct-document-usage -- test-only DOM probe
		const clipperEl = document.querySelector('[data-testid="clipper"]');
		const clipperRect = clipperEl ? clipperEl.getBoundingClientRect() : null;
		return {
			popoverMode: host ? host.getAttribute('popover') : null,
			popperRight: popperRect.right,
			clipperRight: clipperRect ? clipperRect.right : Number.POSITIVE_INFINITY,
		};
	});
}

test('popper surface paints in the top layer outside its clipping ancestor', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/11-flag-top-layer-escape.tsx')>(
		'design-system',
		'popper',
		'flag-top-layer-escape',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	await expect(popper).toBeVisible();

	const info = await readEscapeInfo(popper);

	// Surface must be hosted by a top-layer `<Popover>`, not a plain
	// `<div>`. A regression that bypassed the Popover host would fail
	// this assertion.
	expect(info.popoverMode).toBe('manual');

	// Surface must paint past the clipper's right edge. Placement is
	// `right`, so the popper sits to the right of the trigger; in a
	// 160px-wide `overflow:hidden` clipper, the 240px-wide popper
	// would be clipped without top-layer hoisting.
	expect(info.popperRight).toBeGreaterThan(info.clipperRight);
});
