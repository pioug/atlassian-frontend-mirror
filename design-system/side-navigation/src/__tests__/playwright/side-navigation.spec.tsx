import { expect, test } from '@af/integration-testing';

const nestableNavigation = "[data-testid='nestable-navigation-content']";

const filterNestingItem = "[data-testid='filter-nesting-item--item']";

const goBackButton = "[data-testid='nestable-navigation-content--go-back-item']";

test('Focus should be on the Go back button after triggering an element in the side navigation via keyboard', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/00-nested-side-navigation.vr.ap.tsx')>(
		'design-system',
		'side-navigation',
		'nested-side-navigation',
	);

	await page.locator(nestableNavigation).first().click();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await expect(page.locator(goBackButton).first()).toBeFocused();
});

test('When pressing the "Go back" button, focus should return to the triggering element via keyboard', async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../examples/00-nested-side-navigation.vr.ap.tsx')>(
		'design-system',
		'side-navigation',
		'nested-side-navigation',
	);
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
	await page.locator(nestableNavigation).first().click();
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await expect(page.locator(goBackButton).first()).toBeFocused();
	await page.keyboard.press('Enter');
	await expect(page.locator(filterNestingItem).first()).toBeFocused();
});

test('Nested container should not be focused while navigating via mouse', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/00-nested-side-navigation.vr.ap.tsx')>(
		'design-system',
		'side-navigation',
		'nested-side-navigation',
	);
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
	await page.locator(filterNestingItem).first().click();
	await expect(page.locator(nestableNavigation).first()).not.toBeFocused();
});
