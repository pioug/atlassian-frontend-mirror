import { expect, test } from '@af/integration-testing';

test('Popup passes aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/19-popup-role-dialog.vr.ap.tsx')>(
		'design-system',
		'popup',
		'popup-role-dialog',
	);
	const trigger = page.getByTestId('popup-trigger');
	await trigger.focus();
	await trigger.press('Enter');
	const popup = page.getByTestId('popup');
	await expect(popup).toBeVisible();
	// The role is on `popup` (legacy) or on its top-layer container.
	const dialog = page.getByRole('dialog');
	await expect(dialog.filter({ has: popup }).or(dialog.and(popup))).toBeVisible();
});
