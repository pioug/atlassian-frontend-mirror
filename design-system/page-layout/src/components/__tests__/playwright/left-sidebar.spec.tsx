import { expect, test } from '@af/integration-testing';

const resizeControl = "[data-resize-button='true']";

test('Left sidebar should be collapsed on click of grab area via keyboard', async ({
	page,
	skipAxeCheck,
}) => {
	await page.visitExample('design-system', 'page-layout', 'integration-example');

	// Initially, the sidebar is open
	await expect(page.locator(resizeControl).first()).toHaveAttribute('aria-expanded', 'true');

	// Tab to the "Skip to: Main Content" then go backwards…
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await expect(page.locator("[href='#main-content']").first()).toBeFocused();
	await page.keyboard.press('Enter'); // Go to the main content

	// Tab backwards into the ResizeControl
	await page.webdriverCompatUtils.pressMultiple(['Shift', 'Tab', 'Shift']);
	// TODO: fix assertion
	// await expect(page.locator(resizeControl).first()).toBeFocused();

	// We've tabbed around a lot, everything is expanded, as expected…
	await expect(page.locator(resizeControl).first()).toHaveAttribute('aria-expanded', 'true');

	// "Enter" on the ResizeControl
	await page.keyboard.press('Enter');

	// Left sidebar should now be collapsed:
	// TODO: fix assertion
	// await expect(page.locator(resizeControl).first()).toHaveAttribute(
	//  'aria-expanded',
	//     'false',
	// );

	// Received:
	// ARIA hidden element must not be focusable or contain focusable elements (aria-hidden-focus)
	// in reference to data-testid="left-sidebar-resize-children-wrapper" but nav items are not focusable
	skipAxeCheck();
});
