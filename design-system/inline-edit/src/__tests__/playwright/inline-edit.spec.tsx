// This is not using RTL
/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

/* Css selectors used for the inline edit tests */
const editInput = 'edit-view';

test.describe('Inline Edit Validation', () => {
	const readViewContentWrapper = 'button[data-testid="validation--edit-button"] + div';
	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'inline-edit', 'validation');
	});
	test('Displays error message', async ({ page }) => {
		const readView = page.locator(readViewContentWrapper);
		await readView.click();

		const input = page.getByTestId(editInput);
		await input.click();
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Backspace');

		await expect(page.locator('div#error-message')).toBeVisible();
	});

	test('Should hide edit view after submit', async ({ page }) => {
		const readView = page.locator(readViewContentWrapper);
		await readView.click();

		const input = page.getByTestId(editInput);
		await expect(input).toBeFocused();
		await page.keyboard.insertText('hello');

		const confirm = page.getByRole('button', { name: 'Confirm' });
		await confirm.click();

		await expect(readView).toBeVisible();
		await expect(input).toBeHidden();
		await expect(confirm).toBeHidden();
	});
});

test.describe('Default Inline Edit', () => {
	const readViewContentWrapper = 'button[data-testid="inline-edit--edit-button"] + div';
	test.beforeEach(async ({ page }) => {
		await page.visitExample('design-system', 'inline-edit', 'basic-usage');
	});
	test('Should hide edit button after confirmation', async ({ page }) => {
		const readView = page.locator(readViewContentWrapper);
		await readView.click();

		const confirm = page.getByRole('button', { name: 'Confirm' });
		await expect(confirm).toBeVisible();

		await confirm.click();
		await expect(page.getByRole('button', { name: 'Confirm' })).toBeHidden();
	});

	test('Should hide edit button after pressing Enter', async ({ page }) => {
		const readView = page.locator(readViewContentWrapper);
		await readView.click();

		const input = page.getByRole('textbox', { name: 'Inline edit' });
		await expect(input).toBeFocused();
		await page.keyboard.press('Enter');

		await expect(page.getByRole('button', { name: 'Confirm' })).toBeHidden();
	});

	test('Should remain editable after navigating by keyboard', async ({ page }) => {
		const edit = page.getByRole('button', { name: 'Edit' });
		await edit.focus();
		await page.keyboard.press('Enter');

		const input = page.getByRole('textbox', { name: 'Inline edit' });
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
		await expect(input).toBeFocused();

		input.clear();
		input.fill('New content');
		await expect(input).toHaveValue('New content');

		page.click('body');
		await expect(page.getByTestId('read-view')).toHaveText('New content');
	});
});

test.describe('Inline Edit with Datepicker', () => {
	test('Selecting a date in a datepicker using keyboard should return to edit view', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'inline-edit', 'inline-edit-with-datepicker');
		const edit = page.getByRole('button', { name: /Select date and time/ });
		await edit.focus();
		const dtpEditView = page.locator('[data-testid="datetimepicker"]');

		// Test that we are not yet in edit view
		await expect(dtpEditView).toBeHidden();

		// Enter edit mode
		await page.keyboard.press('Enter');
		await expect(dtpEditView).toBeVisible();

		// Tab to calendar button
		await page.keyboard.press('Tab');
		await page.keyboard.press('Tab');
		// Open calendar using button
		await page.keyboard.press('Enter');

		// Tab to date
		await page.keyboard.press('Tab'); // Prev year
		await page.keyboard.press('Tab'); // Prev month
		await page.keyboard.press('Tab'); // Next month
		await page.keyboard.press('Tab'); // Next year
		await page.keyboard.press('Tab'); // Date
		// Select different date
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('ArrowLeft');
		await page.keyboard.press('Enter');

		// Test that we are still in edit view
		await expect(dtpEditView).toBeVisible();
	});
});
