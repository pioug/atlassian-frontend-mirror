import { expect, type Page, test } from '@af/integration-testing';

/**
 * `<Popper>` keeps painting a surface whose anchor the browser judges hidden, in
 * both gate states. Only a browser can see this: a strongly hidden popover keeps
 * `:popover-open`, `opacity` and a correct rect, and merely stops being painted.
 *
 * Hit-testing is the detector here because `popper` runs chromium-only (no
 * `atlassian.integrationTests.additionalBrowsers`). It would not transfer: Safari
 * 26 stops painting yet still answers `elementsFromPoint` with the popover, and
 * Firefox 153 does not implement the hiding. See
 * `top-layer/notes/decisions/position-visibility-always.md`.
 *
 * Asserting the `position-visibility` declaration instead would be the smell
 * `top-layer/notes/rules/testing.md` was written about: a declaration can be
 * present, correct and have no effect. What the declaration DOES is photographed
 * at its source in `top-layer/__tests__/vr-tests/popover-position-visibility.vr.tsx`,
 * so the imperative `createPopper` adapter — which shares the one
 * `applyAnchorPositioning` call that writes it — needs nothing here.
 */
const featureFlag = 'platform-dst-top-layer';

/**
 * The `data-testid` of whatever paints at the centre of `testId`'s own box.
 */
async function paintedAtCentreOf(page: Page, testId: string): Promise<string | null> {
	const box = await page.getByTestId(testId).boundingBox();
	expect(box).not.toBeNull();

	return page.evaluate(
		({ x, y }) => {
			const element = document.elementFromPoint(x, y);
			const owner = element?.closest('[data-testid]');
			return owner ? owner.getAttribute('data-testid') : null;
		},
		{ x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
	);
}

async function expectSurfaceToBePainted(page: Page): Promise<void> {
	// Retried on a short budget, so a placement that settles a frame late is not
	// read early. A real regression here is permanent.
	await expect(async () => {
		expect(await paintedAtCentreOf(page, 'popper')).toBe('popper');
	}).toPass({ timeout: 5_000 });
}

test.describe('<Popper>', () => {
	const example = 'flag-clipped-anchor';

	test('the surface stays painted when the browser judges the anchor hidden', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/13-flag-clipped-anchor.tsx')>(
			'design-system',
			'popper',
			example,
			{ featureFlag },
		);

		await expect(page.getByTestId('popper')).toBeVisible();

		// Guards the fixture: an anchor that stops being clipped makes the
		// assertion below vacuous.
		await expect(page.getByTestId('popper')).toHaveAttribute('data-is-reference-hidden', 'true');

		await expectSurfaceToBePainted(page);
	});

	test('flag-off parity: the surface stays painted when the anchor is hidden', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/13-flag-clipped-anchor.tsx')>(
			'design-system',
			'popper',
			example,
		);

		await expect(page.getByTestId('popper')).toBeVisible();
		await expect(page.getByTestId('popper')).toHaveAttribute('data-is-reference-hidden', 'true');

		await expectSurfaceToBePainted(page);
	});
});
