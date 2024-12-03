import { expect, test } from '@af/integration-testing';

test('Date picker should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'datetime-picker', 'date-picker-states');
	const calendarButton = page.getByLabel('Stock').and(page.getByRole('button'));
	await expect(calendarButton).toBeVisible();

	await calendarButton.click();
	await expect(page.getByTestId('datepicker-1--calendar--calendar')).toBeVisible();
});

test('Date picker (disabled) should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'datetime-picker', 'date-picker-disabled');
	const calendarButton = page.getByLabel('Date picker').and(page.getByRole('button'));
	await expect(calendarButton).toBeVisible();
	await calendarButton.click();
	await expect(page.getByLabel('calendar', { exact: true })).toBeVisible();
});

test('Time picker should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'datetime-picker', 'time-picker-states');
	const timePicker = page.getByLabel('Stock');
	await expect(timePicker).toBeVisible();

	await timePicker.click();
	await expect(page.getByTestId('timepicker-1--popper--container')).toBeVisible();
});

test('DateTime picker should pass base aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'datetime-picker', 'datetime-picker-states');
	const calendarButton = page.getByLabel('Stock, date').and(page.getByRole('button'));
	await expect(calendarButton).toBeVisible();

	await calendarButton.click();
	await expect(page.getByLabel('calendar', { exact: true })).toBeVisible();
});
