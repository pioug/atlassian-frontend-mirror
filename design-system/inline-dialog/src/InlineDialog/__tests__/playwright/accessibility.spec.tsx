import { expect, test } from '@af/integration-testing';

const inlineDialogBtn = "[data-testid='open-inline-dialog-button']";

const inlineDialogTestId = "[data-testid='inline-dialog']";

test('InlineDialog should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'inline-dialog', 'testing');
	await page.locator(inlineDialogBtn).first().click();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
});
