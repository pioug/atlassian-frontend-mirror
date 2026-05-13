import { expect, test } from '@af/integration-testing';

test.describe('Flag top-layer — Accessibility', () => {
	test('Flag should pass basic aXe audit', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/99-testing.tsx')>(
			'design-system',
			'flag',
			'testing',
		);

		// Arrange: Add a flag
		await page.getByTestId('AddFlag').click();
		await expect(page.getByTestId('MyFlagTestId--1')).toBeVisible();
		await expect(page.getByTestId('MyFlagTestId--1').getByTestId('MyFlagAction')).toBeVisible();

		// Act: Click action button
		const actionButton = page.getByTestId('MyFlagTestId--1').getByTestId('MyFlagAction');
		const alertPromise = page.waitForEvent('dialog', async (alertDialog) => {
			await alertDialog.accept();
			return true;
		});
		await actionButton.click();

		// Assert: Alert should appear
		await alertPromise;
	});
});
