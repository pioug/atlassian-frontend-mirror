/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

const testId = 'react-select';

const creatableSelectContainer = `${testId}-select--value-container`;
const creatableSelectMenu = `${testId}-select--listbox`;
const creatableSelectMenuItem = `${testId}-select--option-0`;
const noOptions = `${testId}-select--no-options`;

const createSelectInput = `${testId}-select--input`;

test(`Creatable-select should pass basic aXe audit`, async ({ page, skipAxeCheck }) => {
	await page.visitExample('design-system', 'select', 'creatable-select', {
		featureFlag: 'design_system_select-a11y-improvement',
	});
	await page.getByTestId(creatableSelectContainer).first().click();

	await expect(page.getByTestId(creatableSelectMenu)).toBeVisible();
	await expect(page.getByTestId(creatableSelectContainer)).toHaveText('Select...');

	await page.getByTestId(creatableSelectMenuItem).first().click();
	await page.getByTestId(creatableSelectContainer).first().click();

	await expect(page.getByTestId(creatableSelectContainer)).not.toHaveText('Select...');

	// TODO: Remove skip after https://product-fabric.atlassian.net/browse/DSP-21622 is done
	// Received:
	// Elements must meet minimum color contrast ratio thresholds (color-contrast)
	skipAxeCheck();
});

test(`Async-creatable-select should pass basic aXe audit`, async ({ page }) => {
	await page.visitExample('design-system', 'select', 'async-creatable-select', {
		featureFlag: 'design_system_select-a11y-improvement',
	});

	await page.getByTestId(creatableSelectContainer).first().click();
	await expect(page.getByTestId(creatableSelectMenu)).toBeVisible();

	await expect(page.getByTestId(noOptions)).toBeVisible();
	await expect(page.getByTestId(noOptions)).toHaveText('No options');

	await page.getByTestId(createSelectInput).fill('test');

	await expect(page.getByTestId(creatableSelectMenuItem)).toBeVisible();
	await expect(page.getByTestId(creatableSelectMenuItem)).toHaveText(/Create "test"/);
	await expect(page.getByTestId(creatableSelectMenuItem)).not.toHaveText('No options');
});
