// Will be removed in scope of https://product-fabric.atlassian.net/browse/DSP-19675

import { expect, test } from '@af/integration-testing';

const trigger = '[data-testid="lite-mode-ddm--trigger"]';
const dropdownMenu = '[data-testid="lite-mode-ddm--content"]';

test('Verify that radio in dropdown menu transitions from unchecked to checked - using defaultSelected', async ({
	page,
}) => {
	await page.visitExample('design-system', 'dropdown-menu', 'testing-radio', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
	});
	await page.locator(trigger).first().click();

	await expect(page.locator(dropdownMenu).first()).toBeVisible();

	await expect(page.locator(`#cities button[aria-checked]`).nth(0)).not.toBeChecked();
	await expect(page.locator(`#cities button[aria-checked]`).nth(1)).toBeChecked();

	await page.locator('#sydney').first().click();
	await expect(page.locator(`#cities button[aria-checked]`).nth(0)).toBeChecked();
	await expect(page.locator(`#cities button[aria-checked]`).nth(1)).not.toBeChecked();
});

test('Verify that radio in dropdown menu can only have one selection in a group', async ({
	page,
}) => {
	await page.visitExample('design-system', 'dropdown-menu', 'testing-radio', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
	});
	await page.locator(trigger).first().click();

	await expect(page.locator(dropdownMenu).first()).toBeVisible();

	await expect(page.locator(`#other-cities button[aria-checked]`).nth(0)).toBeChecked();
	await expect(page.locator(`#other-cities button[aria-checked]`).nth(1)).not.toBeChecked();
	await expect(page.locator(`#other-cities button[aria-checked]`).nth(2)).not.toBeChecked();

	await page.locator('#perth').first().click();
	await expect(page.locator(`#other-cities button[aria-checked]`).nth(0)).not.toBeChecked();
	await expect(page.locator(`#other-cities button[aria-checked]`).nth(1)).not.toBeChecked();
	await expect(page.locator(`#other-cities button[aria-checked]`).nth(2)).toBeChecked();

	await page.locator('#adelaide').first().click();
	await expect(page.locator(`#other-cities button[aria-checked]`).nth(0)).toBeChecked();
	await expect(page.locator(`#other-cities button[aria-checked]`).nth(1)).not.toBeChecked();
	await expect(page.locator(`#other-cities button[aria-checked]`).nth(2)).not.toBeChecked();
});
