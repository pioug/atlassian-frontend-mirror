import { expect, test } from '@af/integration-testing';
test('Popup passes aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'popup', 'popup-role-dialog');
	const trigger = page.getByTestId('popup-trigger');
	await trigger.focus();
	await trigger.press('Enter');
	const popup = page.getByTestId('popup');
	await expect(popup).toBeVisible();
	await expect(popup).toHaveAttribute('role', 'dialog');
});
