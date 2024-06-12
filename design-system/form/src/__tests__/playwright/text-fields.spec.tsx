import { expect, test } from '@af/integration-testing';

const textFieldsTextarea = 'textarea[name="description"]';
const textFieldsTextfield = 'input[name="firstname"]';

test('Pressing ctrl + enter in the text area should focus on invalid field', async ({ page }) => {
	await page.visitExample('design-system', 'form', 'text-fields');
	await page.locator(textFieldsTextarea).first().click();
	await page.keyboard.press('Control+Enter');
	await expect(page.locator(textFieldsTextfield).first()).toBeFocused();
});
