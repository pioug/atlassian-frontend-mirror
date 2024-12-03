import { expect, test } from '@af/integration-testing';

test('Dynamic-table should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'dynamic-table', 'highlighted-row');

	const highlightedRowSelector = '[data-ts--dynamic-table--table-row--highlighted="true"]';
	const popupTrigger = page.locator(`${highlightedRowSelector} button:has-text("More")`);

	await expect(popupTrigger).toBeVisible();
	await expect(popupTrigger).toBeEnabled();

	await popupTrigger.click();
	await page.keyboard.press('Tab');

	const popupInnerElement = page.locator('button:has-text("James Madison")');

	await expect(popupInnerElement).toBeFocused();
});
