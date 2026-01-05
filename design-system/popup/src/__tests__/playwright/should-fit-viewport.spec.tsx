import { expect, test } from '@af/integration-testing';

test('should be scrollable when shouldFitViewport is true', async ({ page, skipAxeCheck }) => {
	// The example is just for tests
	skipAxeCheck();

	await page.visitExample('design-system', 'popup', 'should-fit-viewport', {
		featureFlag: 'platform_dst_nav4_flyoutmenuitem_render_to_parent',
	});

	// Open popup
	await page.getByRole('button', { name: 'Popup trigger' }).click();

	// Check the overflow style on the popup container
	const popupContainer = page.getByTestId('popup-content');
	await expect(popupContainer).toHaveCSS('overflow', 'auto');
});

test('should not be scrollable when shouldFitViewport is false', async ({ page, skipAxeCheck }) => {
	// The example is just for tests
	skipAxeCheck();

	await page.visitExample('design-system', 'popup', 'should-fit-viewport', {
		featureFlag: 'platform_dst_nav4_flyoutmenuitem_render_to_parent',
	});

	// Toggle should fit viewport to false
	await page.getByRole('button', { name: 'Toggle should fit viewport' }).click();

	// Open popup
	await page.getByRole('button', { name: 'Popup trigger' }).click();

	// Check the overflow style on the popup container
	const popupContainer = page.getByTestId('popup-content');
	await expect(popupContainer).not.toHaveCSS('overflow', 'auto');
});
