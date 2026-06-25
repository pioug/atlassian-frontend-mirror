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
	await page.visitExample<typeof import('../../../../examples/00-single-select.tsx')>(
		'design-system',
		'select',
		'single-select',
	);
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectMenu)).toBeVisible();
	await page.getByRole('option', { name: 'Darwin' }).click();
	await expect(page.getByTestId(selectValueContainer)).toHaveText('Darwin');
});

test(`Multi-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/01-multi-select.tsx')>(
		'design-system',
		'select',
		'multi-select',
	);
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
	await page.visitExample<typeof import('../../../../examples/02-radio-select.tsx')>(
		'design-system',
		'select',
		'radio-select',
	);
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectMenu)).toBeVisible();
	await page.getByTestId(selectAdelaide).first().click();
	await expect(page.getByTestId(selectValueContainer)).not.toHaveText('Choose a City');
});

test(`Async-select should display a menu once clicked and not throwing errors`, async ({
	page,
}) => {
	await page.visitExample<typeof import('../../../../examples/06-async-select-with-callback.tsx')>(
		'design-system',
		'select',
		'async-select-with-callback',
	);
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
	await page.visitExample<typeof import('../../../../examples/03-checkbox-select.tsx')>(
		'design-system',
		'select',
		'checkbox-select',
	);
	await page.getByTestId(selectCheckbox).first().click();
	await expect(page.getByTestId(selectCheckboxMenu).first()).toBeVisible();
	await page.getByTestId(selectAdelaide).first().click();
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectValueContainer).first()).not.toHaveText('Choose a City');
});

test('A11yTexts can be provided through ariaLiveMessages prop', async ({ page }) => {
	await page.visitExample<typeof import('../../../../examples/07-with-isSearchable-false.tsx')>(
		'design-system',
		'select',
		'with-isSearchable-false',
	);
	await page.getByTestId(selectValueContainer).first().click();
	await expect(page.getByTestId(selectMenu)).toBeVisible();
	await page.getByTestId(selectAdelaide).first().click();
	await expect(page.getByTestId(selectValueContainer)).not.toHaveText('Choose a City');
	await expect(page.getByRole('status')).toHaveText('CUSTOM: option Adelaide is selected.');
});

test.describe('Select dropdown indicator voice-control accessibility', () => {
	test('with FF on: a named, non-tabbable button wraps the dropdown chevron and toggles the menu when clicked', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../examples/00-single-select.tsx')>(
			'design-system',
			'select',
			'single-select',
			{
				featureFlag: 'platform_dst_select_dropdown_voice_control',
			},
		);

		// The voice-control button is exposed in the accessibility tree with a clear name.
		const voiceControlButton = page.getByRole('button', { name: 'toggle select menu' });
		await expect(voiceControlButton).toBeVisible();
		await expect(voiceControlButton).toHaveAttribute('tabindex', '-1');

		// Menu starts closed.
		await expect(page.getByTestId(selectMenu)).toBeHidden();

		// Clicking the button (as voice control would do) opens the menu.
		await voiceControlButton.click();
		await expect(page.getByTestId(selectMenu)).toBeVisible();

		// Clicking again closes the menu (toggle behaviour, same as today's chevron click).
		await voiceControlButton.click();
		await expect(page.getByTestId(selectMenu)).toBeHidden();

		// Tab order: the voice-control button must NEVER receive Tab focus
		// (regardless of where focus currently sits, the button has tabindex=-1
		// so it's not a Tab stop). Tab-stop coverage for the input itself is
		// validated by the unit test; here we only need to prove the new
		// button is not in the tab order.
		await page.keyboard.press('Tab');
		await expect(voiceControlButton).not.toBeFocused();
	});

	test('with FF off: no voice-control button is rendered (legacy aria-hidden wrapper only)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../examples/00-single-select.tsx')>(
			'design-system',
			'select',
			'single-select',
		);

		await expect(page.getByRole('button', { name: 'toggle select menu' })).toHaveCount(0);
	});
});
