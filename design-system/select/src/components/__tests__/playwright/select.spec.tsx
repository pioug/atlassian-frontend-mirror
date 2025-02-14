/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

const testId = 'react-select';

const selectValueContainer = `${testId}-select--value-container`;
const selectMenu = `${testId}-select--listbox`;

const selectAdelaide = `${testId}-select--option-0`;
const selectMultiBrisbane = `${testId}-select--option-1`;

const selectCheckbox = `${testId}-select--control`;
const selectCheckboxMenu = `${testId}-select--listbox-container`;

test(`Single-select should display a menu once clicked and select a menu item`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'single-select');
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectMenu)).toBeVisible();
	await page.getByRole('option', { name: 'Darwin' }).click();
	await expect(page.getByTestId(selectValueContainer)).toHaveText('Darwin');
});

test(`Multi-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'multi-select');
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectMenu)).toBeVisible();
	await page.getByTestId(selectAdelaide).first().click();
	await page.getByTestId(selectValueContainer).first().click();
	await page.getByTestId(selectMultiBrisbane).first().click();
	await expect(page.getByTestId(selectValueContainer)).not.toHaveText('Choose a City');
});

test(`Radio-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'radio-select');
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectMenu)).toBeVisible();
	await page.getByTestId(selectAdelaide).first().click();
	await expect(page.getByTestId(selectValueContainer)).not.toHaveText('Choose a City');
});

test(`Async-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'async-select-with-callback');
	// Async example waits 1000ms before setting options.
	// eslint-disable-next-line playwright/no-wait-for-timeout
	await page.waitForTimeout(1000);
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectMenu)).toBeVisible();
	await page.getByTestId(selectAdelaide).first().click();
	await expect(page.getByTestId(selectValueContainer)).not.toHaveText('Choose a City');
});

test(`Checkbox-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample('design-system', 'select', 'checkbox-select');
	await page.getByTestId(selectCheckbox).first().click();
	await expect(page.getByTestId(selectCheckboxMenu).first()).toBeVisible();
	await page.getByTestId(selectAdelaide).first().click();
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectValueContainer).first()).not.toHaveText('Choose a City');
});
