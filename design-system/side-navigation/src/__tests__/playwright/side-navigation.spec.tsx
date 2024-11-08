import { expect, test } from '@af/integration-testing';

const nestableNavigation = "[data-testid='nestable-navigation-content']";

const filterNestingItem = "[data-testid='filter-nesting-item--item']";

const goBackButton = "[data-testid='nestable-navigation-content--go-back-item']";

test('Focus should be on the Go back button after triggered an element in the side navigation, while navigating via keyboard, FF on', async ({
	page,
}) => {
	await page.visitExample('design-system', 'side-navigation', 'nested-side-navigation', {
		featureFlag: 'platform-side-navigation-keyboard-focus',
	});
	await page.locator(nestableNavigation).first().click();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await expect(page.locator(goBackButton).first()).toBeFocused();
});

test('When pressing the "Go back" button, the focus should return to the triggered element, while navigating via keyboard, FF on', async ({
	page,
}) => {
	await page.visitExample('design-system', 'side-navigation', 'nested-side-navigation', {
		featureFlag: 'platform-side-navigation-keyboard-focus',
	});
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
	await page.locator(nestableNavigation).first().click();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await page.keyboard.press('Enter');
	await expect(page.locator(filterNestingItem).first()).toBeFocused();
});

test('Focus should be on nested container while navigating via keyboard, FF off', async ({
	page,
}) => {
	await page.visitExample('design-system', 'side-navigation', 'nested-side-navigation');
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
	await page.locator(nestableNavigation).first().click();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await expect(page.locator(nestableNavigation).first()).toBeFocused();
});

test('Nested container should not be focused while navigating via mouse, FF off', async ({
	page,
}) => {
	await page.visitExample('design-system', 'side-navigation', 'nested-side-navigation');
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
	await page.locator(filterNestingItem).first().click();
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
});
