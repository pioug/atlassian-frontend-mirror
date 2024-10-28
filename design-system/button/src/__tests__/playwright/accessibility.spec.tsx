import { expect, test } from '@af/integration-testing';

test('Button should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'button');
	await expect(page.getByRole('button', { name: 'Button' })).toBeVisible();
});

test('Button in hover state should pass contrast tests', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'button');
	await page.getByRole('button', { name: 'Button' }).hover();
	await expect(page.getByRole('button')).toBeVisible();
});

test('Button in focus state should pass contrast tests', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'button');
	await page.getByRole('button', { name: 'Button' }).focus();
	await expect(page.getByRole('button')).toBeFocused();
});

test('IconButton should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'icon-button');
	await expect(page.locator('[data-testid="default"]')).toBeVisible();
});

test('IconButton in hover state should pass contrast tests', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'icon-button');
	await page.locator('[data-testid="default"]').hover();
	await expect(page.locator('[data-testid="default"]')).toBeVisible();
});

test('IconButton in focus state should pass contrast tests', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'icon-button');
	await page.locator('[data-testid="default"]').focus();
	await expect(page.locator('[data-testid="default"]')).toBeFocused();
});

test('LinkButton should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'icon-button');
	await expect(page.locator('[data-testid="link-icon-button"]')).toBeVisible();
});

test('LinkButton in hover state should pass contrast tests', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'icon-button');
	await page.locator('[data-testid="link-icon-button"]').hover();
	await expect(page.locator('[data-testid="link-icon-button"]')).toBeVisible();
});

test('LinkButton in focus state should pass contrast tests', async ({ page }) => {
	await page.visitExample('design-system', 'button', 'icon-button');
	await page.locator('[data-testid="link-icon-button"]').focus();
	await expect(page.locator('[data-testid="link-icon-button"]')).toBeFocused();
});
