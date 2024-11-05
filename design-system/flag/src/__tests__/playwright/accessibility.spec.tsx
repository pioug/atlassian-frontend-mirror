import { expect, test } from '@af/integration-testing';

const addFlagBtn = "[data-testid='AddFlag']";
const flagTestId = "[data-testid='MyFlagTestId--1']";
const flagActionTestId = "[data-testid='MyFlagTestId--1'] [data-testid='MyFlagAction']";

test('Flag should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'flag', 'testing');
	await page.locator(addFlagBtn).first().click();
	await expect(page.locator(flagTestId).first()).toBeVisible();
	await expect(page.locator(flagActionTestId).first()).toBeVisible();

	const alertPromise = page.waitForEvent('dialog', async (alertDialog) => {
		await alertDialog.accept();
		return true;
	});
	await page.locator(flagActionTestId).first().click();
	const alertDialog = await alertPromise;
	expect(alertDialog.type()).toBe('alert');
	expect(alertDialog.message()).toBe('Flag has been clicked!');
});
