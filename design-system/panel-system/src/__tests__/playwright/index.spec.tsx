import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='panel-system']";

test('PanelSystem should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample('design-system', 'panel-system', 'basic');
	await expect(page.locator(exampleComponent).first()).toBeVisible();
});
