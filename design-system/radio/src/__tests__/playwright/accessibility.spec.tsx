import { expect, test } from '@af/integration-testing';

test('should allow interaction with radio buttons and pass aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'radio', 'form-example');

	await page.locator('input[name="color"][value="red"]').check();
	await expect(page.locator('input[name="color"][value="red"]')).toBeChecked();

	await page.locator('input[name="fruit"][value="orange"]').check();
	await expect(page.locator('input[name="fruit"][value="orange"]')).toBeChecked();

	const disabledRadio = page.locator('input[name="city"][value="gallifrey"]');
	await expect(disabledRadio).toBeDisabled();

	await page.locator('input[name="weather"][value="windy"]').check();
	await expect(page.locator('input[name="weather"][value="windy"]')).toBeChecked();
});
