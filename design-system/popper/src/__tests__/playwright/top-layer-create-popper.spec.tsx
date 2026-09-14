import { expect, type Page, test } from '@af/integration-testing';

/**
 * Popper: FF-on imperative `createPopper` adapter.
 *
 * The fixture puts the popper element inside a narrow `overflow: hidden`
 * clipping ancestor. Flag-off, the Popper.js engine leaves it as an in-flow
 * child and it is clipped. Flag-on, the adapter promotes it to
 * `popover="manual"` and CSS Anchor Positioning places it against the trigger
 * in the browser top layer, so it escapes the clip.
 */

const featureFlag = 'platform-dst-top-layer';
const example = 'flag-imperative-create-popper';

test('promotes the popper element into the top layer and anchors it to the trigger', async ({
	page,
}) => {
	await page.visitExample<
		typeof import('../../../examples/12-flag-imperative-create-popper.vr.ap.tsx')
	>('design-system', 'popper', example, { featureFlag });

	const popper = page.getByTestId('popper');
	await expect(popper).toBeVisible();
	await expect(popper).toHaveAttribute('popover', 'manual');

	const trigger = page.getByTestId('trigger');
	const triggerBox = await trigger.boundingBox();
	const popperBox = await popper.boundingBox();
	expect(triggerBox).not.toBeNull();
	expect(popperBox).not.toBeNull();

	// `placement: 'right'` with an 8px offset: the popper starts just after the
	// trigger's right edge and is vertically centred on it.
	expect(popperBox!.x).toBeGreaterThanOrEqual(triggerBox!.x + triggerBox!.width);
	const triggerCentre = triggerBox!.y + triggerBox!.height / 2;
	const popperCentre = popperBox!.y + popperBox!.height / 2;
	expect(Math.abs(popperCentre - triggerCentre)).toBeLessThanOrEqual(2);
});

/**
 * Hit-tests a point just outside the clipping ancestor's right edge but still
 * inside the popper's layout box. `boundingBox()` reports layout, not paint, so
 * a clipped element still has a box that extends past the clipper —
 * `elementFromPoint` is what actually distinguishes painted from clipped.
 */
async function isPopperPaintedOutsideTheClipper(page: Page): Promise<boolean> {
	const clipperBox = await page.getByTestId('clipper').boundingBox();
	const popperBox = await page.getByTestId('popper').boundingBox();
	expect(clipperBox).not.toBeNull();
	expect(popperBox).not.toBeNull();

	// The popper is 200px wide inside a 160px-wide clipper, so its box always
	// extends past the clipper's right edge.
	expect(popperBox!.x + popperBox!.width).toBeGreaterThan(clipperBox!.x + clipperBox!.width);

	const x = clipperBox!.x + clipperBox!.width + 10;
	const y = popperBox!.y + popperBox!.height / 2;

	return page.evaluate(
		({ x: pointX, y: pointY }) => {
			const element = document.elementFromPoint(pointX, pointY);
			return element?.closest('[data-testid="popper"]') !== null;
		},
		{ x, y },
	);
}

test('escapes an overflow:hidden clipping ancestor', async ({ page }) => {
	await page.visitExample<
		typeof import('../../../examples/12-flag-imperative-create-popper.vr.ap.tsx')
	>('design-system', 'popper', example, { featureFlag });

	await expect(page.getByTestId('popper')).toBeVisible();

	expect(await isPopperPaintedOutsideTheClipper(page)).toBe(true);
});

test('setOptions re-places the popper without recreating the instance', async ({ page }) => {
	await page.visitExample<
		typeof import('../../../examples/12-flag-imperative-create-popper.vr.ap.tsx')
	>('design-system', 'popper', example, { featureFlag });

	const popper = page.getByTestId('popper');
	const trigger = page.getByTestId('trigger');
	await expect(popper).toBeVisible();

	const triggerBox = await trigger.boundingBox();
	expect(triggerBox).not.toBeNull();

	await page.getByTestId('set-bottom').click();

	// `placement: 'bottom'` puts the popper below the trigger and centres it
	// horizontally, rather than beside it.
	await expect(async () => {
		const popperBox = await popper.boundingBox();
		expect(popperBox).not.toBeNull();
		expect(popperBox!.y).toBeGreaterThanOrEqual(triggerBox!.y + triggerBox!.height);
	}).toPass();

	// Still the same top-layer host: `setOptions` re-applies positioning, it
	// does not tear the popover down.
	await expect(popper).toHaveAttribute('popover', 'manual');
	await expect(popper).toBeVisible();
});

test('destroy returns the element to normal flow', async ({ page }) => {
	await page.visitExample<
		typeof import('../../../examples/12-flag-imperative-create-popper.vr.ap.tsx')
	>('design-system', 'popper', example, { featureFlag });

	const popper = page.getByTestId('popper');
	await expect(popper).toHaveAttribute('popover', 'manual');

	await page.getByTestId('destroy').click();

	// The promotion is reversed, so the element is a plain in-flow child of the
	// clipper again.
	await expect(popper).not.toHaveAttribute('popover');
	await expect(async () => {
		const clipperBox = await page.getByTestId('clipper').boundingBox();
		const popperBox = await popper.boundingBox();
		expect(clipperBox).not.toBeNull();
		expect(popperBox).not.toBeNull();
		expect(popperBox!.y).toBeGreaterThanOrEqual(clipperBox!.y);
	}).toPass();
});

test('flag-off leaves the element clipped by its ancestor', async ({ page }) => {
	await page.visitExample<
		typeof import('../../../examples/12-flag-imperative-create-popper.vr.ap.tsx')
	>('design-system', 'popper', example);

	const popper = page.getByTestId('popper');
	await expect(popper).toBeVisible();

	// The Popper.js engine positions in place; it never promotes to the top layer.
	await expect(popper).not.toHaveAttribute('popover');
	expect(await isPopperPaintedOutsideTheClipper(page)).toBe(false);
});
