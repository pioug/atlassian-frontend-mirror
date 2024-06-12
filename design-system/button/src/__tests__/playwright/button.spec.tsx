import { expect, test } from '@af/integration-testing';

test.describe('Button', () => {
	test('show alert on click', async ({ page }) => {
		await page.visitExample('design-system', 'button', 'testing-old-button');

		const alertPromise = page.waitForEvent('dialog', async (alertDialog) => {
			await alertDialog.accept();
			return true;
		});

		await page.getByRole('button').click();

		const alertDialog = await alertPromise;
		expect(alertDialog.type()).toBe('alert');
		expect(alertDialog.message()).toBe('Button has been clicked!');
	});
});
