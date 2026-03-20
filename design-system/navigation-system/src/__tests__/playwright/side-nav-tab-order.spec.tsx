/**
 * We can't use a unit test for this as the side nav is hidden below 64rem, so we can't tab
 * in the test environment.
 */

import { expect, test } from '@af/integration-testing';

function getTabKey(browserName: string): 'Tab' | 'Alt+Tab' {
	// For webkit (Safari), we need to press Alt + Tab.
	// Reference: https://github.com/microsoft/playwright/issues/5609
	if (browserName === 'webkit') {
		return 'Alt+Tab';
	}

	return 'Tab';
}

test.describe('side nav tab order', () => {
	test('should have correct tab order - side nav, then side nav panel splitter, then main', async ({
		page,
		browserName,
	}) => {
		await page.visitExample<typeof import('../../../examples/side-nav-layering.tsx')>(
			'design-system',
			'navigation-system',
			'side-nav-layering',
			{
				featureFlag: 'navx-full-height-sidebar',
			},
		);

		// Focus on the last menu item
		await page.getByRole('button', { name: 'Expandable menu item with long content' }).focus();

		// Tabbing should go to the panel splitter
		await page.keyboard.press(getTabKey(browserName));
		await expect(page.getByRole('slider', { name: 'Resize side nav' })).toBeFocused();

		// Tabbing should go to the button inside the side nav
		await page.keyboard.press(getTabKey(browserName));

		await expect(page.getByRole('button', { name: 'Configure settings' })).toBeFocused();
	});
});
