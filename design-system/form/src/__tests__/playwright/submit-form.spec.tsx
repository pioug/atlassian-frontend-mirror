import { expect, test } from '@af/integration-testing';

const submitFormTextarea = 'textarea[name="description"]';
const submitFormTextfield = 'input[name="name"]';
const submitFormSubmitted = 'div#submitted';

test('Pressing ctrl + enter in the text area after entering input should submit the form', async ({
	page,
}) => {
	await page.visitExample('design-system', 'form', 'submit-form');
	await page.locator(submitFormTextfield).first().fill('Jane Chan');
	await page.locator(submitFormTextarea).first().click();
	await page.keyboard.press('Control+Enter');
	await expect(page.locator(submitFormSubmitted).first()).toHaveText(
		'You have successfully submitted!',
	);
});
