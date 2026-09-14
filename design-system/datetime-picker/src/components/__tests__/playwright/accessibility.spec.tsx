import { expect, test } from '@af/integration-testing';

test('Date picker should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/10-date-picker-states.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-states',
		{ 'react-18-mode': 'modern' },
	);
	const calendarButton = page.getByLabel('Stock').and(page.getByRole('button'));
	await expect(calendarButton).toBeVisible();

	await calendarButton.click();
	await expect(page.getByTestId('datepicker-1--calendar--calendar')).toBeVisible();
});

test('Date picker (disabled) should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/12-date-picker-disabled.tsx')>(
		'design-system',
		'datetime-picker',
		'date-picker-disabled',
		{ 'react-18-mode': 'modern' },
	);
	const calendarButton = page.getByLabel('Date picker').and(page.getByRole('button'));
	await expect(calendarButton).toBeVisible();
	await calendarButton.click();
	await expect(page.getByLabel('calendar', { exact: true })).toBeVisible();
});

test('Time picker should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/30-time-picker-states.tsx')>(
		'design-system',
		'datetime-picker',
		'time-picker-states',
		{ 'react-18-mode': 'modern' },
	);
	const timePicker = page.getByLabel('Stock');
	await expect(timePicker).toBeVisible();

	await timePicker.click();
	await expect(page.getByTestId('timepicker-1--popper--container')).toBeVisible();
});

test('DateTime picker should pass base aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/20-datetime-picker-states.tsx')>(
		'design-system',
		'datetime-picker',
		'datetime-picker-states',
		{ 'react-18-mode': 'modern' },
	);
	const calendarButton = page.getByRole('button', { name: 'Stock, date, Open calendar' });
	await expect(calendarButton).toBeVisible();

	await calendarButton.click();
	await expect(page.getByLabel('calendar', { exact: true })).toBeVisible();
});
