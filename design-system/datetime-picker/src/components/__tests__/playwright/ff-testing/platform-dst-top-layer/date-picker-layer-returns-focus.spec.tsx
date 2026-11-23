import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

/**
 * A popup that the field opened returns focus to the date input after the commit that closes it, so
 * the input's focus handler runs. That focus must not change whether the calendar is open. In the
 * browser, it must still come from inside the closed popup (`relatedTarget`).
 */
test('keeps the calendar open when a popup that the field opened returns focus to the input', async ({
	page,
}) => {
	await page.visitExample<
		typeof import('../../../../../../examples/testing-date-picker-layer-returns-focus.tsx')
	>('design-system', 'datetime-picker', 'testing-date-picker-layer-returns-focus', {
		featureFlag,
		'react-18-mode': 'modern',
	});

	const input = page.getByRole('combobox');
	const calendar = page.getByTestId('layer-returns-focus--calendar--calendar');
	const cancel = page.getByRole('button', { name: 'Cancel' });

	await input.click();
	await expect(calendar).toBeVisible();

	// F2 opens the popup: the calendar is held closed, and the popup takes focus.
	await page.keyboard.press('F2');
	await expect(calendar).toBeHidden();
	await expect(cancel).toBeFocused();

	// Cancel closes the popup. It returns focus to the input, and the calendar shows again.
	await page.keyboard.press('Enter');
	await expect(cancel).toBeHidden();
	await expect(input).toBeFocused();
	await expect(calendar).toBeVisible();
	await expect(input).toHaveAttribute('aria-expanded', 'true');
});
