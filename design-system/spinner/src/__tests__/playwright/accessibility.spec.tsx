import { expect, test } from '@af/integration-testing';

test('Spinner should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'spinner', 'basic');
	const spinner = page.getByTestId('spinner');
	await expect(spinner).toBeVisible();
});
