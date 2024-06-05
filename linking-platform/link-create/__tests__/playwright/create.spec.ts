import { expect, test } from '@af/integration-testing';

test.describe('Link Create', () => {
	test('should be able to use a basic create form to create an object', async ({ page }) => {
		await page.visitExample('linking-platform', 'link-create', 'basic');

		const trigger = page.getByRole('button', { name: 'Create' });

		await expect(trigger).toBeVisible();

		await trigger.click();

		const modal = page.getByTestId('link-create-form');

		const textField = modal.getByLabel('Enter some Text');
		await textField.fill('Some text');

		const selectField = modal.getByTestId('link-create-async-select');
		await selectField.getByLabel('Select an option').click();
		await selectField.getByRole('combobox').fill('Option 1');
		const pageOption = selectField.getByText('Option 1', { exact: true });
		await pageOption.click();

		await expect(page.getByLabel('Enter some Text')).toBeVisible();

		// Submit the form!
		await modal.getByRole('button', { name: 'Create' }).click();

		await expect(page.getByTestId('link-create-form')).toBeHidden();

		await expect(page.getByRole('link')).toHaveAttribute(
			'href',
			'https://atlassian.com/product/new-object-id',
		);
	});
});
