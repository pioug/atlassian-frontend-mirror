import { expect, test } from '@af/integration-testing';

test('max size is not applied if the viewport is large enough', async ({ page }) => {
	await page.visitExample('design-system', 'popper', 'basic-positioning');

	const popper = page.locator('[data-testid="popper"]');

	await expect(popper).toBeVisible();
	await expect(popper).toBeInViewport();

	const maxWidth = await popper.evaluate((element) => getComputedStyle(element).maxWidth);
	expect(maxWidth).toBe('none');
});

test('max size is correctly applied', async ({ page }) => {
	await page.visitExample('design-system', 'popper', 'max-size');

	const popper = page.locator('[data-testid="placement--right"]');

	await expect(popper).toBeVisible();
	await expect(popper).toBeInViewport();

	const maxWidth = await popper.evaluate((element) => getComputedStyle(element).maxWidth);
	expect(maxWidth).not.toBe('none');
});

test('max size updates when page gets smaller', async ({ page }) => {
	await page.visitExample('design-system', 'popper', 'max-size');

	const popper = page.locator('[data-testid="placement--right"]');

	// Default size, but making it explicit
	await page.setViewportSize({ width: 1280, height: 720 });
	await expect(popper).toBeVisible();
	await expect(popper).toBeInViewport();

	const maxWidthStart = await popper.evaluate((element) => getComputedStyle(element).maxWidth);
	const maxWidthStartNum = parseInt(maxWidthStart, 10);

	await page.setViewportSize({ width: 1080, height: 720 });
	await expect(popper).toBeVisible();
	await expect(popper).toBeInViewport();

	const maxWidthEnd = await popper.evaluate((element) => getComputedStyle(element).maxWidth);
	const maxWidthEndNum = parseInt(maxWidthEnd, 10);

	expect(maxWidthEndNum).toBeLessThan(maxWidthStartNum);
});

test('max size updates when page gets bigger', async ({ page }) => {
	await page.visitExample('design-system', 'popper', 'max-size');

	const popper = page.locator('[data-testid="placement--right"]');

	// Default size, but making it explicit
	await page.setViewportSize({ width: 1280, height: 720 });
	await expect(popper).toBeVisible();
	await expect(popper).toBeInViewport();

	const maxWidthStart = await popper.evaluate((element) => getComputedStyle(element).maxWidth);
	const maxWidthStartNum = parseInt(maxWidthStart, 10);

	await page.setViewportSize({ width: 1480, height: 720 });
	await expect(popper).toBeVisible();
	await expect(popper).toBeInViewport();

	const maxWidthEnd = await popper.evaluate((element) => getComputedStyle(element).maxWidth);
	const maxWidthEndNum = parseInt(maxWidthEnd, 10);

	expect(maxWidthEndNum).toBeGreaterThan(maxWidthStartNum);
});
