import type { Page } from '@playwright/test';

import { expect, test } from '@af/integration-testing';

// Url to test the example
// Css selectors used for the submit form test
const submitForm = 'form[name="submit-form"]';
const submitFormTextfield = 'input[name="search"]';
const formMessageTestId = 'form-message';
const formSubmittedData = 'form-submitted-data';
const formSubmittedMsg = 'You have successfully submitted!';
const formNotSubmittedMsg = 'You have not submitted yet';
const titleInputTestId = 'input-title';
const virtualListScrollContainerTestId = 'virtual-list-scroll-container';

const getEmojiButtons = async (page: Page) =>
	await page.getByTestId(virtualListScrollContainerTestId).getByRole('button').all();

test.describe('EmojiPicker In Form', () => {
	test('Pressing Enter on input inside emoji picker should NOT trigger form submit, but Enter on form input should trigger form submit', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/27-emoji-picker-in-form.tsx')>(
			'elements',
			'emoji',
			'emoji-picker-in-form',
		);
		await page.waitForSelector(submitForm);
		await page.type(submitFormTextfield, 'smile', { delay: 200 });
		await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
		const emojis = await getEmojiButtons(page);
		expect(emojis).toHaveLength(7);
		await page.keyboard.press('Enter');
		await expect(page.getByTestId(formMessageTestId)).toHaveText(formNotSubmittedMsg);
		// select emoji
		await emojis[0].focus();
		await page.keyboard.press('Enter');
		// fill in title
		await page.getByTestId(titleInputTestId).locator('input').fill('tada');
		// enter on text input should submit form automatically
		await page.keyboard.press('Enter');
		await expect(page.getByTestId(formMessageTestId)).toHaveText(formSubmittedMsg);
		await expect(page.getByTestId(formSubmittedData)).toHaveText(
			'{"title":"tada","emoji":":smile:"}',
		);
	});

	test('Pressing Ctrl+Enter on input inside emoji picker should NOT trigger form submit, but Ctrl+Enter on form input should trigger form submit', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/27-emoji-picker-in-form.tsx')>(
			'elements',
			'emoji',
			'emoji-picker-in-form',
		);
		await page.waitForSelector(submitForm);
		await page.type(submitFormTextfield, 'smile', { delay: 200 });
		await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
		const emojis = await getEmojiButtons(page);
		expect(emojis).toHaveLength(7);
		await page.keyboard.press('Control+Enter');
		await expect(page.getByTestId(formMessageTestId)).toHaveText(formNotSubmittedMsg);
		// select emoji
		await emojis[0].focus();
		await page.keyboard.press('Control+Enter');
		// fill in title
		await page.getByTestId(titleInputTestId).locator('input').type('tada');
		// enter on text input should submit form automatically
		await page.keyboard.press('Control+Enter');
		await expect(page.getByTestId(formMessageTestId)).toHaveText(formSubmittedMsg);
		await expect(page.getByTestId(formSubmittedData)).toHaveText(
			'{"title":"tada","emoji":":smile:"}',
		);
	});

	test('Pressing Enter on input inside emoji picker POPUP should NOT trigger form submit, Enter on form text input should trigger form submit', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/27-emoji-picker-in-form.tsx')>(
			'elements',
			'emoji',
			'emoji-picker-in-form',
		);
		await page.waitForSelector(submitForm);
		// enable emoji picker popup mode
		await page.getByText('emoji picker with no popup').click();
		await expect(page.getByText('emoji picker in popup')).toBeVisible();
		// open emoji picker
		await page.locator('button[aria-haspopup="true"]').click();

		await page.type(submitFormTextfield, 'smile', { delay: 200 });
		await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
		const emojis = await getEmojiButtons(page);
		expect(emojis).toHaveLength(7);
		await page.keyboard.press('Enter');
		await expect(page.getByTestId(formMessageTestId)).toHaveText(formNotSubmittedMsg);
		// select emoji
		await emojis[0].focus();
		await page.keyboard.press('Enter');
		// fill in title
		await page.getByTestId(titleInputTestId).locator('input').fill('tada');
		// enter on text input should submit form automatically
		await page.keyboard.press('Enter');
		await expect(page.getByTestId(formMessageTestId)).toHaveText(formSubmittedMsg);
		await expect(page.getByTestId(formSubmittedData)).toHaveText(
			'{"title":"tada","emoji":":smile:"}',
		);
	});

	test('Pressing Ctrl+Enter on input inside emoji picker POPUP should NOT trigger form submit, Ctrl+Enter on form text input should trigger form submit', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/27-emoji-picker-in-form.tsx')>(
			'elements',
			'emoji',
			'emoji-picker-in-form',
		);
		await page.waitForSelector(submitForm);
		// enable emoji picker popup mode
		await page.getByText('emoji picker with no popup').click();
		await expect(page.getByText('emoji picker in popup')).toBeVisible();
		// open emoji picker
		await page.locator('button[aria-haspopup="true"]').click();

		await page.type(submitFormTextfield, 'smile', { delay: 200 });
		await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();
		const emojis = await getEmojiButtons(page);
		expect(emojis).toHaveLength(7);
		await page.keyboard.press('Control+Enter');
		await expect(page.getByTestId(formMessageTestId)).toHaveText(formNotSubmittedMsg);
		// select emoji
		await emojis[0].focus();
		await page.keyboard.press('Control+Enter');
		// fill in title
		await page.getByTestId(titleInputTestId).locator('input').fill('tada');
		// enter on text input should submit form automatically
		await page.keyboard.press('Control+Enter');
		await expect(page.getByTestId(formMessageTestId)).toHaveText(formSubmittedMsg);
		await expect(page.getByTestId(formSubmittedData)).toHaveText(
			'{"title":"tada","emoji":":smile:"}',
		);
	});

	test('should capture and report a11y violations', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/27-emoji-picker-in-form.tsx')>(
			'elements',
			'emoji',
			'emoji-picker-in-form',
		);
		await page.waitForSelector(submitForm);
		await page.type(submitFormTextfield, 'smile', { delay: 200 });
		await expect(page.getByRole('heading', { name: 'Search results' })).toBeVisible();

		await expect(page).toBeAccessible();
	});
});
