import { expect, test } from '@af/integration-testing';

const trigger = '[data-testid="lite-mode-ddm--trigger"]';

const dropdownMenu = '[data-testid="lite-mode-ddm--content"]';

test('Verify that checkbox in dropdown menu transitions from unchecked to checked - using defaultSelected', async ({
	page,
}) => {
	await page.visitExample('design-system', 'dropdown-menu', 'testing-checkbox');
	await page.locator(trigger).first().click();

	await expect(page.locator(dropdownMenu).first()).toBeVisible();

	await expect(page.locator(`button[aria-checked]`).nth(0)).not.toBeChecked();
	await expect(page.locator(`button[aria-checked]`).nth(1)).toBeChecked();

	await page.locator('#sydney').first().click();
	await expect(page.locator(`button[aria-checked]`).nth(0)).toBeChecked();
	await expect(page.locator(`button[aria-checked]`).nth(1)).toBeChecked();
});

test('Verify that checkbox in dropdown menu transitions from unchecked to checked - using isSelected', async ({
	page,
}) => {
	await page.visitExample('design-system', 'dropdown-menu', 'testing-checkbox-stateless');
	await page.locator(trigger).first().click();

	await expect(page.locator(dropdownMenu).first()).toBeVisible();

	await expect(page.locator(`button[aria-checked]`).nth(0)).not.toBeChecked();
	await expect(page.locator(`button[aria-checked]`).nth(1)).not.toBeChecked();

	await page.locator('#sydney').first().click();
	await expect(page.locator(`button[aria-checked]`).nth(0)).toBeChecked();
	await expect(page.locator(`button[aria-checked]`).nth(1)).not.toBeChecked();
});
