import { expect, type Page, test } from '@af/integration-testing';

// The input and its in-place menu are one field for focus, inside a top-layer modal.

const featureFlag = 'platform-dst-top-layer';

async function openMenu(page: Page) {
	await page.visitExample<
		typeof import('../../../../examples/testing-top-layer-focus-in-menu.tsx')
	>('design-system', 'react-select', 'testing-top-layer-focus-in-menu', { featureFlag });
	const input = page.getByRole('combobox', { name: 'Fruit' });
	await input.focus();
	await page.keyboard.press('ArrowDown');
	await expect(page.getByRole('listbox')).toBeVisible();
	return { input, counts: page.getByTestId('counts') };
}

test.describe('react-select top-layer menu - focus in the menu', () => {
	test('Tab enters the menu without a blur, and Shift+Tab returns with no new focus', async ({
		page,
	}) => {
		const { input, counts } = await openMenu(page);

		await page.keyboard.press('Tab');
		await expect(page.getByRole('button', { name: /Edit fruit/ })).toBeFocused();
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.keyboard.press('Shift+Tab');
		await expect(input).toBeFocused();
		await expect(counts).toHaveText('focus 1, blur 0, modal open');
	});

	test('Tab past the menu content leaves the field and closes the menu', async ({ page }) => {
		const { counts } = await openMenu(page);

		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');

		await expect(page.getByRole('button', { name: 'After' })).toBeFocused();
		await expect(page.getByRole('listbox')).toBeHidden();
		await expect(counts).toHaveText('focus 1, blur 1, modal open');
	});

	test('Enter on a button in the menu presses it and keeps the menu open', async ({ page }) => {
		await openMenu(page);
		await page.keyboard.press('Tab');

		await page.keyboard.press('Enter');

		await expect(page.getByRole('button', { name: 'Edit fruit (1)' })).toBeFocused();
		await expect(page.getByRole('listbox')).toBeVisible();
	});

	test('Escape from the menu content closes only the menu', async ({ page }) => {
		const { input, counts } = await openMenu(page);
		await page.keyboard.press('Tab');

		await page.keyboard.press('Escape');

		await expect(page.getByRole('listbox')).toBeHidden();
		await expect(input).toBeFocused();
		await expect(counts).toHaveText('focus 1, blur 0, modal open');
	});

	test('a close from a button in the menu returns focus to the input, with no blur', async ({
		page,
	}) => {
		const { input, counts } = await openMenu(page);
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused();

		await page.keyboard.press('Enter');

		await expect(page.getByRole('listbox')).toBeHidden();
		await expect(input).toBeFocused();
		await expect(counts).toHaveText('focus 1, blur 0, modal open');
	});
});
