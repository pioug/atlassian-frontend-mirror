import { expect, test } from '@af/integration-testing';

test('Disabled Textarea should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'textarea', 'basic');
	const disabledTextarea = page.getByTestId('disabledTextArea');
	await expect(disabledTextarea.first()).toHaveAttribute('disabled');
	await expect(disabledTextarea).toBeVisible();
});

test('Textarea should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'textarea', 'basic');
	const textarea = page.getByTestId('autoResizeTextArea');
	await expect(textarea).toBeVisible();
});
