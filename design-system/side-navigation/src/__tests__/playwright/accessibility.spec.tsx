import { expect, test } from '@af/integration-testing';

const goBackButton = "[data-testid='nestable-navigation-content--go-back-item']";

const nestedItem = "[data-testid='filter-nesting-item--item']";

test('Side-navigation, default should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'side-navigation', 'nested-side-navigation');

	await page.locator(nestedItem).first().click();
	await expect(page.locator(goBackButton).first()).toBeVisible();

	await page.locator(goBackButton).first().click();
	await expect(page.locator(nestedItem).first()).toBeVisible();
});
