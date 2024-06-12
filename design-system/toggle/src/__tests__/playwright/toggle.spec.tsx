import { expect, test } from '@af/integration-testing';

const toggleStateless = "[data-testid='my-toggle-stateless']";

const toggleBtn = "[data-testid='my-toggle-button']";

const toggleRegular = "[data-testid='my-regular-stateful-toggle']";

const toggleLarge = "[data-testid='my-large-stateful-toggle']";

const toggleStatelessInput = "[data-testid='my-toggle-stateless--input']";

const toggleLargeInput = "[data-testid='my-large-stateful-toggle--input']";

test('Toggle should be able to be identified and checked by data-testid', async ({ page }) => {
	await page.visitExample('design-system', 'toggle', 'testing');
	await expect(page.locator(toggleStateless).first()).toBeVisible();
	await expect(page.locator(toggleRegular).first()).toBeVisible();
	await expect(page.locator(toggleLarge).first()).toBeVisible();

	// Click on the toggle button stateless.
	await expect(page.locator(toggleStatelessInput)).not.toBeChecked();
	await page.locator(toggleBtn).first().click();
	await expect(page.locator(toggleStatelessInput)).toBeChecked();

	// You can't interact with a stateless toggle so clicking should not change the state.
	await expect(page.locator(toggleStatelessInput)).toBeChecked();
	await page.locator(toggleStateless).first().click();
	await expect(page.locator(toggleStatelessInput)).toBeChecked(); // remains checked

	// You can interact with a stateful toggle.
	await expect(page.locator(toggleRegular)).not.toBeChecked();
	await page.locator(toggleRegular).first().click();
	await expect(page.locator(toggleRegular)).toBeChecked();

	// You can get the state.
	await expect(page.locator(toggleLargeInput)).toBeChecked();
});
