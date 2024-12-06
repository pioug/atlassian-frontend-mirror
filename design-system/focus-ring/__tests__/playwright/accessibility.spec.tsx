import { expect, test } from '@af/integration-testing';

test('focus ring should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'focus-ring', 'basic');
	const input = page.getByTestId('input');
	input.focus();
	await expect(input).toBeVisible();
});
