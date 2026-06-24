import { expect, test } from '@af/integration-testing';

/**
 * Popper: FF-on `shouldFitViewport` per-placement caps.
 *
 * Pre-Phase-7 the flag-on adapter capped popovers with a blanket
 * `calc(100vw - 10px)` / `calc(100vh - 10px)`, which let a wide
 * `placement="right"` popover overflow the right viewport edge. The
 * fix measures per-placement caps from the anchor's rect. This spec
 * asserts the popover stays inside the viewport with a 5px padding
 * margin on every side.
 */

const featureFlag = 'platform-dst-top-layer';
const VIEWPORT_PADDING = 5;

test('shouldFitViewport caps a wide right-placed popover to the right viewport edge', async ({
	page,
}) => {
	await page.setViewportSize({ width: 1024, height: 768 });
	await page.visitExample<typeof import('../../../examples/06-flag-fit-viewport-right.tsx')>(
		'design-system',
		'popper',
		'flag-fit-viewport-right',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	await expect(popper).toBeVisible();

	const box = await popper.boundingBox();
	expect(box).not.toBeNull();
	expect(box!.x + box!.width).toBeLessThanOrEqual(1024 - VIEWPORT_PADDING + 1);
});

test('shouldFitViewport recomputes the cap when the viewport is resized', async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 768 });
	await page.visitExample<typeof import('../../../examples/06-flag-fit-viewport-right.tsx')>(
		'design-system',
		'popper',
		'flag-fit-viewport-right',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	await expect(popper).toBeVisible();
	const boxBefore = await popper.boundingBox();
	expect(boxBefore).not.toBeNull();

	// Shrink the viewport; the per-placement cap must follow.
	await page.setViewportSize({ width: 600, height: 768 });

	const boxAfter = await popper.boundingBox();
	expect(boxAfter).not.toBeNull();
	expect(boxAfter!.x + boxAfter!.width).toBeLessThanOrEqual(600 - VIEWPORT_PADDING + 1);
	expect(boxAfter!.width).toBeLessThan(boxBefore!.width);
});

test('shouldFitViewport does not enter a host-resize feedback loop', async ({ page }) => {
	await page.setViewportSize({ width: 1024, height: 768 });
	await page.visitExample<typeof import('../../../examples/06-flag-fit-viewport-right.tsx')>(
		'design-system',
		'popper',
		'flag-fit-viewport-right',
		{ featureFlag },
	);

	const popper = page.getByTestId('popper');
	await expect(popper).toBeVisible();

	// Sample the bounding box twice across several animation frames. In
	// the buggy implementation the host kept resizing every frame as the
	// cap re-measured the host instead of the anchor. With the fix the
	// cap is derived from the (stable) anchor rect, so the host settles
	// on its first measurement and stays put.
	const boxA = await popper.boundingBox();
	await page.evaluate(
		() =>
			new Promise<void>((resolve) => {
				let frames = 0;
				function tick() {
					frames += 1;
					if (frames >= 30) {
						resolve();
						return;
					}
					requestAnimationFrame(tick);
				}
				requestAnimationFrame(tick);
			}),
	);
	const boxB = await popper.boundingBox();

	expect(boxA).not.toBeNull();
	expect(boxB).not.toBeNull();
	expect(boxB!.width).toBe(boxA!.width);
	expect(boxB!.height).toBe(boxA!.height);
	expect(boxB!.x).toBe(boxA!.x);
	expect(boxB!.y).toBe(boxA!.y);
});
