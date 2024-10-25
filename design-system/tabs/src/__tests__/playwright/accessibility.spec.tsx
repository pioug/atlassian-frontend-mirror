import { expect, test } from '@af/integration-testing';

test('Tooltip should be visible when tab is focused', async ({ page }) => {
	await page.visitExample('design-system', 'tabs', 'custom-tab-components');
	await page.locator('[data-testid="tooltip-tab1"]').focus();
	await expect(page.locator('[data-testid="tooltip-tab1"]')).toBeFocused();
	await expect(page.getByRole('tooltip', { name: 'Tooltip for tab 1' })).toBeVisible();
});
