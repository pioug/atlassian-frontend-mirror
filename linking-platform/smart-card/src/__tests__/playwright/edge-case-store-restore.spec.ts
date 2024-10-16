/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Edge cases', () => {
	test('should fully reload links after redux store was reset', async ({ page }) => {
		page.visitExample('linking-platform', 'smart-card', 'vr-edge-case-redux-store-reset');

		await expect(page.getByTestId('inline-card-resolved-view')).toBeVisible();

		await page.getByTestId('reset-redux-store-button').click();

		await expect(page.getByTestId('inline-card-resolved-view')).toBeVisible();
	});
});
