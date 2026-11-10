import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.describe('UserPicker inside a modal on the top layer', () => {
	test.beforeEach(async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/99-testing-escape-in-modal.tsx')
		>('elements', 'user-picker', 'testing-escape-in-modal', { featureFlag });
	});

	test('Escape closes the menu and the picker keeps focus', async ({ page }) => {
		await page.getByRole('button', { name: 'Open modal' }).click();
		const modal = page.getByRole('dialog', { name: 'Assign' });
		await expect(modal).toBeVisible();

		const picker = modal.getByRole('combobox', { name: 'Assignee' });
		await picker.click();
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByRole('listbox')).toBeHidden();
		await expect(picker).toBeFocused();
		await expect(modal).toBeVisible();
	});

	test('the next Escape closes the modal and returns focus to its trigger', async ({ page }) => {
		const trigger = page.getByRole('button', { name: 'Open modal' });
		await trigger.click();
		const modal = page.getByRole('dialog', { name: 'Assign' });
		const picker = modal.getByRole('combobox', { name: 'Assignee' });
		await picker.click();
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByRole('listbox')).toBeHidden();
		await page.keyboard.press('Escape');

		await expect(modal).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});
