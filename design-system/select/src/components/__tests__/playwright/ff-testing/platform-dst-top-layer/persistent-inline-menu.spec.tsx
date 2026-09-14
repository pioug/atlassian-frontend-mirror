import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.beforeEach(async ({ page, skipAxeCheck }) => {
	await page.visitExample<
		typeof import('../../../../../../examples/36-persistent-inline-menu.tsx')
	>('design-system', 'select', 'persistent-inline-menu', { featureFlag });
	// The fixture exercises interaction behavior rather than running an accessibility audit.
	skipAxeCheck();
});

test.describe('Select persistent inline menu', () => {
	test('renders the listbox in the enclosing Popup', async ({ page }) => {
		const trigger = page.getByRole('button', { name: 'Single select' });
		await trigger.click();

		const popup = page.getByRole('dialog', { name: 'Single select' });
		await expect(popup.getByRole('listbox')).toBeVisible();
	});

	test('Escape closes the enclosing Popup', async ({ page }) => {
		const trigger = page.getByRole('button', { name: 'Single select' });
		await trigger.click();

		const popup = page.getByRole('dialog', { name: 'Single select' });
		await expect(popup.getByRole('listbox')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(popup).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('focuses a Select that mounts after the Popup loading state', async ({ page }) => {
		await page.getByRole('button', { name: 'Delayed select', exact: true }).click();

		const popup = page.getByRole('dialog', { name: 'Delayed select' });
		await expect(popup.getByText('Loading select...')).toBeVisible();

		const combobox = popup.getByRole('combobox', { name: 'Delayed select' });
		await expect(combobox).toBeVisible();
		await expect(combobox).toBeFocused();
	});

	test('reopens cached delayed content without showing its loading state again', async ({
		page,
	}) => {
		const trigger = page.getByRole('button', { name: 'Cached delayed select' });
		await trigger.click();

		const popup = page.getByRole('dialog', { name: 'Cached delayed select' });
		await expect(popup.getByText('Loading select...')).toBeVisible();
		await expect(popup.getByRole('combobox', { name: 'Cached delayed select' })).toBeFocused();

		await trigger.click();
		await expect(popup).toBeHidden();
		await trigger.click();

		await expect(popup.getByText('Loading select...')).toBeHidden();
		await expect(popup.getByRole('combobox', { name: 'Cached delayed select' })).toBeFocused();
	});
});
