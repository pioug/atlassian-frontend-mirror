import { expect, test } from '@af/integration-testing';

test.describe('color picker', () => {
	test.describe('when platform_dst_layer_observer_select is disabled', () => {
		test('should open the color picker when clicked', async ({ page }) => {
			await page.visitExample('jira', 'color-picker', 'color-picker');

			await expect(page.getByRole('combobox')).toBeHidden();

			await page.getByRole('button', { name: 'Purple selected, Change color' }).click();
			await expect(page.getByRole('combobox')).toBeVisible();
		});
	});

	test.describe('when platform_dst_layer_observer_select is enabled', () => {
		test('should open the color picker when clicked', async ({ page }) => {
			await page.visitExample('jira', 'color-picker', 'color-picker', {
				featureFlag: 'platform_dst_layer_observer_select',
			});

			await expect(page.getByRole('combobox')).toBeHidden();

			await page.getByRole('button', { name: 'Purple selected, Change color' }).click();
			await expect(page.getByRole('combobox')).toBeVisible();
		});
	});
});
