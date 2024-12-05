import { expect, test } from '@af/integration-testing';

const readViewContentWrapper = 'button[data-testid="custom-title--edit-button"] + div';

test('PageHeader default should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'page-header', 'default');

	await expect(page.getByText('How to use the page header component')).toBeVisible();
});

test('PageHeader custom-title should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'page-header', 'custom-title');

	await expect(page.getByText('Editable title')).toBeVisible();
	const readView = page.locator(readViewContentWrapper);
	await readView.click();

	const confirm = page.getByRole('button', { name: 'Confirm' });
	await expect(confirm).toBeVisible();

	await confirm.click();
	await expect(page.getByRole('button', { name: 'Confirm' })).toBeHidden();
});
