import { expect, test } from '@af/integration-testing';

test.describe('Inline Edit textarea-usage should pass basic aXe audit', () => {
	const readViewContentWrapper = 'button[data-testid="textarea-usage--edit-button"] + div';
	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'inline-edit', 'textarea-usage');
	});
	test('Should hide edit button after confirmation', async ({ page }) => {
		const readView = page.locator(readViewContentWrapper);
		await readView.click();

		const confirm = page.getByRole('button', { name: 'Confirm' });
		await expect(confirm).toBeVisible();

		await confirm.click();
		await expect(page.getByRole('button', { name: 'Confirm' })).toBeHidden();
	});

	test('Should remain editable after navigating by keyboard', async ({ page }) => {
		const edit = page.getByRole('button', { name: 'Edit' });
		await edit.focus();
		await page.keyboard.press('Enter');

		const input = page.getByRole('textbox', { name: 'Inline edit' });
		await expect(input).toBeVisible();
		await expect(input).toBeFocused();
		await page.keyboard.press('Tab');

		const confirm = page.getByRole('button', { name: 'Confirm' });
		await expect(confirm).toBeFocused();
		await page.keyboard.press('Tab');

		const cancel = page.getByRole('button', { name: 'Cancel' });
		await expect(cancel).toBeFocused();
	});

	test('Should edit content after clicking outside', async ({ page }) => {
		const readView = page.locator(readViewContentWrapper);
		await readView.click();
		const input = page.getByRole('textbox', { name: 'Inline edit' });
		await expect(input).toBeVisible();
		await expect(input).toBeFocused();

		await input.clear();
		await input.fill('New content');
		await expect(input).toHaveValue('New content');

		await expect(input).toHaveValue('New content');

		await page.click('body');
		await expect(input).toHaveValue('New content');
	});
});
