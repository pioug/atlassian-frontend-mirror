import { expect, test } from '@af/integration-testing';

const textFieldsTextarea = 'textarea[name="description"]';
const textFieldsTextfield = 'input[name="firstname"]';
const submitFormTextarea = 'textarea[name="description"]';
const submitFormTextfield = 'input[name="name"]';

test('Form component, text-fields should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'form', 'text-fields');
	await page.locator(textFieldsTextarea).first().hover();
	await expect(page.locator(textFieldsTextarea)).toBeVisible();

	await page.locator(textFieldsTextarea).first().click();
	await expect(page.locator(textFieldsTextarea)).toBeVisible();
	await expect(page.locator(textFieldsTextarea).first()).toBeVisible();

	await page.locator(textFieldsTextfield).first().hover();
	await expect(page.locator(textFieldsTextfield)).toBeVisible();

	await page.keyboard.press('Control+Enter');
	await expect(page.locator(textFieldsTextfield)).toBeVisible();
	await expect(page.locator(textFieldsTextfield).first()).toBeFocused();
});

test('Form component, submit-form should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'form', 'submit-form');
	await page.locator(submitFormTextfield).first().hover();
	await expect(page.locator(submitFormTextfield)).toBeVisible();

	await page.locator(submitFormTextfield).first().click();
	await expect(page.locator(submitFormTextfield)).toBeVisible();
	await expect(page.locator(submitFormTextfield)).toBeFocused();

	await page.locator(submitFormTextarea).first().hover();
	await expect(page.locator(submitFormTextarea)).toBeVisible();

	await page.locator(submitFormTextarea).first().click();
	await expect(page.locator(submitFormTextarea)).toBeVisible();
	await expect(page.locator(submitFormTextarea)).toBeFocused();
});
