import { expect, test } from '@af/integration-testing';

test('PanelSystem should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample('design-system', 'panel-system', 'basic-panel');
	const panel = page.getByTestId('basic-panel');
	await expect(panel).toBeVisible();
});
