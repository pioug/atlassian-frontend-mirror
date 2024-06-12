import { expect, test } from '@af/integration-testing';

const nestableNavigation = "[data-testid='nestable-navigation-content']";

const filterNestingItem = "[data-testid='filter-nesting-item--item']";

test('Focus should be on nested container while navigating via keyboard', async ({ page }) => {
	await page.visitExample('design-system', 'side-navigation', 'nested-side-navigation');
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
	await page.locator(nestableNavigation).first().click();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await expect(page.locator(nestableNavigation).first()).toBeFocused();
});

test('Nested container should not be focused while navigating via mouse', async ({ page }) => {
	await page.visitExample('design-system', 'side-navigation', 'nested-side-navigation');
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
	await page.locator(filterNestingItem).first().click();
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
});
