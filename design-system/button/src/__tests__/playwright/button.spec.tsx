import { expect, test } from '@af/integration-testing';

test.describe('Button', () => {
	test('works as a dropdown trigger when using an icon render prop', async ({ page }) => {
		await page.visitExample('design-system', 'button', 'as-dropdown-trigger');

		await page.getByTestId('button').click();

		await expect(page.getByTestId('dropdown--content')).toBeVisible();
	});
});
