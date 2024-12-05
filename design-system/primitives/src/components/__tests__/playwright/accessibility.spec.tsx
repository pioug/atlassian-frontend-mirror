import { expect, test } from '@af/integration-testing';

test.describe('Primitives components should pass basic aXe audit', () => {
	test('Box, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample('design-system', 'primitives', 'box-basic-compiled');

		await expect(page.locator('[data-testid="box-basic"]')).toBeVisible();
	});

	test('Flex, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample('design-system', 'primitives', 'flex');

		await expect(page.locator('[data-testid="flex-basic"]')).toBeVisible();
	});
	test('Grid, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample('design-system', 'primitives', 'grid-compiled');

		await expect(page.locator('[data-testid="grid-basic"]').first()).toBeVisible();
	});
	test('Inline, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample('design-system', 'primitives', 'inline-basic');

		await expect(page.locator('[data-testid="inline-example"]')).toBeVisible();
	});

	test('Stack, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample('design-system', 'primitives', 'stack-basic-compiled');

		await expect(page.locator('[data-testid="stack-example"]')).toBeVisible();
	});

	test('Text, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample('design-system', 'primitives', 'text-compiled');

		await expect(page.locator('[data-testid="text-example"]').first()).toBeVisible();
	});
});
