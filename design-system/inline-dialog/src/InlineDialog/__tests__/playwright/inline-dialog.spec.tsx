import { expect, test } from '@af/integration-testing';

const inlineDialogBtn = "[data-testid='open-inline-dialog-button']";

const inlineDialogTestId = "[data-testid='inline-dialog']";

const openModalBtn = "[data-testid='open-modal-button']";

const modalTestId = "[data-testid='modal']";

const datePickerContainer = "[data-testid='date-picker--container']";

test('InlineDialog should be able to be identified and clicked by data-testid', async ({
	page,
	skipAxeCheck,
}) => {
	await page.visitExample('design-system', 'inline-dialog', 'testing');
	await page.locator(inlineDialogBtn).first().click();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	await expect(page.locator(inlineDialogTestId).first()).toHaveText('Hello!');

	// Selected button text fails contrast when hovered
	// https://product-fabric.atlassian.net/browse/DSP-19090
	skipAxeCheck();
});

test('InlineDialog with Open Modal button should open modal', async ({ page }) => {
	await page.visitExample('design-system', 'inline-dialog', 'modal');
	await page.locator(inlineDialogBtn).first().click();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	await page.locator(openModalBtn).first().click();
	await expect(page.locator(modalTestId).first()).toBeVisible();
});

test('InlineDialog should stay open when modal is closed through button click', async ({
	page,
}) => {
	await page.visitExample('design-system', 'inline-dialog', 'modal');
	await page.locator(inlineDialogBtn).first().click();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	await page.locator(openModalBtn).first().click();
	await expect(page.locator(modalTestId).first()).toBeVisible();
	await page.locator("[data-testid='primary']").first().click();
	await expect(page.locator(inlineDialogBtn).first()).toBeVisible();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();

	expect(await page.webdriverCompatUtils.isDetached(modalTestId)).toBe(true);
});

test('InlineDialog should stay open when user clicks modal blanket', async ({ page }) => {
	await page.visitExample('design-system', 'inline-dialog', 'modal');
	await page.locator(inlineDialogBtn).first().click();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	await page.locator(openModalBtn).first().click();
	await expect(page.locator(modalTestId).first()).toBeVisible();
	await page.locator("[data-testid='modal--blanket']").first().click();
	await expect(page.locator(inlineDialogBtn).first()).toBeVisible();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();

	expect(await page.webdriverCompatUtils.isDetached(modalTestId)).toBe(true);
});

test('InlineDialog should close correctly after modal is closed', async ({ page }) => {
	await page.visitExample('design-system', 'inline-dialog', 'modal');
	await page.locator(inlineDialogBtn).first().click();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	await page.locator(openModalBtn).first().click();
	await expect(page.locator(modalTestId).first()).toBeVisible();
	await page.locator("[data-testid='modal--blanket']").first().click();
	await page.locator('#examples').first().click();
	await expect(page.locator(inlineDialogBtn).first()).toBeVisible();

	expect(await page.webdriverCompatUtils.isDetached(modalTestId)).toBe(true);
});

test('InlineDialog should work with Select and set value correctly', async ({ page }) => {
	await page.visitExample('design-system', 'inline-dialog', 'select-datepicker');
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	await expect(page.locator('.react-select__control').first()).toBeVisible();
	await page.locator('.react-select__control').first().click();
	await expect(page.locator('.react-select__menu')).toBeVisible();
	await page.locator('.react-select__option:nth-child(1)').first().click();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	await expect(page.locator('.react-select__value-container').first()).toHaveText('value 1');
});

test('InlineDialog should work correctly with DatePicker component', async ({ page }) => {
	await page.visitExample('design-system', 'inline-dialog', 'select-datepicker');
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
	await expect(page.locator(datePickerContainer).first()).toBeVisible();
	await expect(page.locator(inlineDialogTestId).first()).toBeVisible();
});
