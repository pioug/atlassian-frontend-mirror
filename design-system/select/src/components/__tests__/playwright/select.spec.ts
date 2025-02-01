/* eslint-disable @repo/internal/fs/filename-pattern-match */
import { expect, test } from '@af/integration-testing';

const selectDefault = '.react-select__value-container';
const selectMenu = '.react-select__menu';

const selectMultiAdelaide = '[role="option"]:nth-child(1)';
const selectMultiBrisbane = '[role="option"]:nth-child(2)';

const selectRadioAdelaide = '[role="option"]:nth-child(1)';

const selectCheckbox = '.select__control';
const selectCheckboxMenu = '.select__menu';

const selectedValue = '.react-select__value-container';
const selectedValueContainer = '.select__value-container';

test(`Single-select should display a menu once clicked and select a menu item`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'single-select');
	await page.locator(selectDefault).first().click();
	await expect(page.locator(selectMenu)).toBeVisible();
	await page.getByRole('option', { name: 'Darwin' }).click();
	await expect(page.locator(selectedValue)).toHaveText('Darwin');
});

test(`Multi-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'multi-select');
	await page.locator(selectDefault).first().click();
	await expect(page.locator(selectMenu)).toBeVisible();
	await page.locator(selectMultiAdelaide).first().click();
	await page.locator(selectDefault).first().click();
	await page.locator(selectMultiBrisbane).first().click();
	await expect(page.locator(selectedValue)).not.toHaveText('Choose a City');
});

test(`Radio-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'radio-select');
	await page.locator(selectDefault).first().click();
	await expect(page.locator(selectMenu)).toBeVisible();
	await page.locator(selectRadioAdelaide).first().click();
	await expect(page.locator(selectedValue)).not.toHaveText('Choose a City');
});

test(`Async-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'async-select-with-callback');
	// Async example waits 1000ms before setting options.
	// eslint-disable-next-line playwright/no-wait-for-timeout
	await page.waitForTimeout(1000);
	await page.locator(selectDefault).first().click();
	await expect(page.locator(selectMenu)).toBeVisible();
	await page.locator(selectRadioAdelaide).first().click();
	await expect(page.locator(selectedValue)).not.toHaveText('Choose a City');
});

test(`Checkbox-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'checkbox-select');
	await page.locator(selectCheckbox).first().click();
	await expect(page.locator(selectCheckboxMenu).first()).toBeVisible();
	await page.locator(selectRadioAdelaide).first().click();
	await page.locator(selectedValueContainer).first().click();
	await expect(page.locator(selectedValueContainer).first()).not.toHaveText('Choose a City');
});
