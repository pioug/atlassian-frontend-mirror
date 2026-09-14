import { expect, test } from '@af/integration-testing';

/**
 * Date picker: focus contract on the top-layer code path.
 *
 * `DatePicker` renders its calendar inside the top-layer react-select menu.
 * Opening from the input keeps DOM focus on the combobox; the calendar remains
 * reachable in normal Tab order.
 *
 * The focus contract is therefore:
 *
 * 1. Open from the input: focus remains on the combobox.
 * 2. Escape: the popover closes and focus is restored to the combobox input.
 * 3. Tab: focus moves from the input into the calendar without closing it.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Date picker: top-layer focus contract', () => {
	test('pointer interaction: clicking the input opens the calendar', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'datetime-picker',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox');
		await combobox.click();

		await expect(page.getByRole('grid')).toBeVisible();
		await expect(combobox).toHaveAttribute('aria-expanded', 'true');
	});

	test('initial focus: opening from the input keeps focus on the combobox', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'datetime-picker',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox');
		await combobox.focus();

		const calendar = page.getByRole('grid');
		await expect(calendar).toBeVisible();
		await expect(combobox).toBeFocused();
	});

	test('focus restoration: Escape closes the popover and focus returns to the combobox input', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'datetime-picker',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox');
		await combobox.focus();

		const calendar = page.getByRole('grid');
		await expect(calendar).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(calendar).toBeHidden();
		await expect(combobox).toBeFocused();
	});

	test('focus movement: Tab moves focus from the input into the calendar', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'datetime-picker',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox');
		await combobox.focus();

		const calendar = page.getByRole('grid');
		await expect(calendar).toBeVisible();
		await expect(combobox).toBeFocused();

		const previousYearButton = page.getByTestId('date-picker--calendar--previous-year');
		await page.keyboard.press('Tab');
		await expect(previousYearButton).toBeFocused();
		await expect(calendar).toBeVisible();
	});
});
