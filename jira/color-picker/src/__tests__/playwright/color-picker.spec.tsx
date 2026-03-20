import { expect, test } from '@af/integration-testing';

test.describe('color picker', () => {
	test('should open the color picker when clicked', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/00-color-picker.tsx')>(
			'jira',
			'color-picker',
			'color-picker',
		);

		await expect(page.getByRole('combobox')).toBeHidden();

		await page.getByRole('button', { name: 'Purple selected, Change color' }).click();
		await expect(page.getByRole('combobox')).toBeVisible();
	});
});
