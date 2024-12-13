import { expect, test } from '@af/integration-testing';

const creatableSelectContainer = '.value-container';
const creatableSelectMenu = '[role="listbox"]';
const creatableSelectMenuItem = '[id="react-select-2-option-0"]';
const noOptions = '[id="react-select-2-listbox"]';

const createSelectInput = '[id="async-creatable-example"]';

test(`Creatable-select should pass basic aXe audit`, async ({ page, skipAxeCheck }) => {
	await page.visitExample('design-system', 'select', 'creatable-select');
	await page.locator(creatableSelectContainer).first().click();

	await expect(page.locator(creatableSelectMenu)).toBeVisible();
	await expect(page.locator(creatableSelectContainer)).toHaveText('Select...');

	await page.locator(creatableSelectMenuItem).first().click();
	await page.locator(creatableSelectContainer).first().click();

	await expect(page.locator(creatableSelectContainer)).not.toHaveText('Select...');

	// TODO: Remove skip after https://product-fabric.atlassian.net/browse/DSP-21622 is done
	// Received:
	// Elements must meet minimum color contrast ratio thresholds (color-contrast)
	skipAxeCheck();
});

test(`Async-creatable-select should pass basic aXe audit`, async ({ page, skipAxeCheck }) => {
	await page.visitExample('design-system', 'select', 'async-creatable-select');

	await page.locator(creatableSelectContainer).first().click();

	await expect(page.locator(creatableSelectMenu)).toBeVisible();
	await expect(page.locator(noOptions)).toBeVisible();
	await expect(page.locator(noOptions)).toHaveText('No options');

	await page.locator(createSelectInput).fill('test');

	await expect(page.locator(creatableSelectMenuItem)).toBeVisible();
	await expect(page.locator(creatableSelectMenuItem)).toHaveText(/Create "test"/);
	await expect(page.locator(noOptions)).not.toHaveText('No options');

	// TODO: Remove skip after https://product-fabric.atlassian.net/browse/DSP-21622 is done
	// Received:
	// Elements must meet minimum color contrast ratio thresholds (color-contrast)
	skipAxeCheck();
});
