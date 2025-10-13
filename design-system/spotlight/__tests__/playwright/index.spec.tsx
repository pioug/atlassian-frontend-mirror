import { expect, test } from '@af/integration-testing';

const exampleComponent = "[data-testid='spotlight']";

test('Spotlight should be able to be identified by data-testid', async ({ page }) => {
	await page.visitExample('design-system', 'spotlight', 'card');
	await expect(page.locator(exampleComponent).first()).toBeVisible();
});
