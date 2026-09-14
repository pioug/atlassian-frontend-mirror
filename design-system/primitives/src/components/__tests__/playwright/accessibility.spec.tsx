import { expect, test } from '@af/integration-testing';

test.describe('Primitives components should pass basic aXe audit', () => {
	test('Box, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/01-box-basic-compiled.tsx')>(
			'design-system',
			'primitives',
			'box-basic-compiled',
		);

		await expect(page.locator('[data-testid="box-basic"]')).toBeVisible();
	});

	test('Flex, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/61-flex.vr.ap.tsx')>(
			'design-system',
			'primitives',
			'flex',
		);

		await expect(page.locator('[data-testid="flex-basic"]')).toBeVisible();
	});
	test('Grid, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/60-grid-compiled.tsx')>(
			'design-system',
			'primitives',
			'grid-compiled',
		);

		await expect(page.locator('[data-testid="grid-basic"]').first()).toBeVisible();
	});
	test('Inline, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/10-inline-basic.vr.ap.tsx')>(
			'design-system',
			'primitives',
			'inline-basic',
		);

		await expect(page.locator('[data-testid="inline-example"]')).toBeVisible();
	});

	test('Stack, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../examples/20-stack-basic-compiled.vr.ap.tsx')
		>('design-system', 'primitives', 'stack-basic-compiled');

		await expect(page.locator('[data-testid="stack-example"]')).toBeVisible();
	});

	test('Text, should pass basic aXe audit', async ({ page }) => {
		await page.visitExample<typeof import('../../../../examples/70-text-compiled.vr.ap.tsx')>(
			'design-system',
			'primitives',
			'text-compiled',
		);

		await expect(page.locator('[data-testid="text-example"]').first()).toBeVisible();
	});
});
