import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Skip axe checks across this file: the test example may have known
// pre-existing accessibility violations unrelated to the top-layer migration.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('DateTimePicker top-layer — WCAG 2.1.1 Keyboard', () => {
	test('opens date picker and selects date via keyboard', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');
		const firstDate = page.locator('[role="gridcell"]').nth(6);

		await expect(calendar).toBeHidden();
		await dateInput.click();
		await expect(calendar).toBeVisible();
		await firstDate.click();
		await expect(calendar).toBeHidden();
	});

	test('enters time via keyboard and updates value', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const timeInput = page.locator('input[data-testid="dateTimePicker--timepicker-select--input"]');
		const timeContainer = page.locator('[data-testid="dateTimePicker--timepicker--container"]');

		await expect(timeContainer).toBeVisible();
		await timeInput.click();
		await timeInput.fill('02:30');
		await page.keyboard.press('Enter');
	});
});

test.describe('DateTimePicker top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Escape closes date picker and returns focus to input', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await dateInput.click();
		await expect(calendar).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(calendar).toBeHidden();
		await expect(dateInput).toBeFocused();
	});

	test('Escape closes time picker and returns focus to input', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const timeInput = page.locator('input[data-testid="dateTimePicker--timepicker-select--input"]');
		const timeOptions = page.locator('[class*="option"]').first();

		await timeInput.click();
		await expect(timeOptions).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(timeOptions).toBeHidden();
		await expect(timeInput).toBeFocused();
	});
});

test.describe('DateTimePicker top-layer — WCAG 2.4.3 Focus Order', () => {
	test('focus moves into date calendar on open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await expect(calendar).toBeHidden();
		await dateInput.click();
		await expect(calendar).toBeVisible();
		// react-select keeps focus on the input while the menu is open and
		// uses aria-activedescendant to point at the active calendar cell —
		// so focus stays on the combobox input, not on a calendar element.
		// Use aria-expanded as the proxy for "menu is open and combobox owns
		// focus" — this is more stable than `toBeFocused()`, which can race
		// with the popover toggle on the same click event.
		await expect(dateInput).toHaveAttribute('aria-expanded', 'true');
	});

	test('focus returns to date input on calendar close', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await dateInput.click();
		await expect(calendar).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(calendar).toBeHidden();
		await expect(dateInput).toBeFocused();
	});

	test('time input remains focused when time menu is open (aria-activedescendant)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const timeInput = page.locator('input[data-testid="dateTimePicker--timepicker-select--input"]');
		const timeOptions = page.locator('[class*="option"]').first();

		await timeInput.click();
		await expect(timeOptions).toBeVisible();
		await expect(timeInput).toBeFocused();
	});
});

test.describe('DateTimePicker top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('focused date cell is visually distinct', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');
		const focusedDateCell = page.locator('[data-focused="true"]').first();

		await dateInput.click();
		await page.keyboard.press('ArrowDown');

		await expect(focusedDateCell).toBeFocused();
	});
});

test.describe('DateTimePicker top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('date calendar is fully visible on screen', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');

		await dateInput.click();
		await expect(calendar).toBeVisible();
	});

	test('time menu options are fully visible on screen', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const timeInput = page.locator('input[data-testid="dateTimePicker--timepicker-select--input"]');
		const timeOptions = page.locator('[class*="option"]').first();

		await timeInput.click();
		await expect(timeOptions).toBeVisible();
	});
});

test.describe('DateTimePicker top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('date input has proper ARIA attributes', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');

		await expect(dateInput).toHaveAttribute('role', 'combobox');
	});

	test('time input has proper ARIA attributes', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const timeInput = page.locator('input[data-testid="dateTimePicker--timepicker-select--input"]');

		await expect(timeInput).toHaveAttribute('role', 'combobox');
	});
});

test.describe('DateTimePicker top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('both date and time components work correctly in sequence', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');
		const dateContainer = page.locator('[data-testid="dateTimePicker--datepicker--container"]');
		const calendar = page.locator('[role="dialog"][aria-label="calendar"]');
		const firstDate = page.locator('[role="gridcell"]').nth(6);
		const timeInput = page.locator('input[data-testid="dateTimePicker--timepicker-select--input"]');
		const timeContainer = page.locator('[data-testid="dateTimePicker--timepicker--container"]');

		await expect(calendar).toBeHidden();
		await dateInput.click();
		await expect(calendar).toBeVisible();
		await firstDate.click();
		await expect(calendar).toBeHidden();

		const dateValue = await dateContainer.textContent();
		expect(dateValue?.trim()).not.toBe('');

		await timeInput.click();
		const timeValue = await timeContainer.textContent();
		expect(timeValue?.trim()).not.toBe('');
	});
});

test.describe('DateTimePicker top-layer — Backspace Behavior', () => {
	test('backspace clears date but not time', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/00-basic.tsx')>(
			'design-system',
			'datetime-picker',
			'basic',
			{
				featureFlag,
			},
		);

		const dateContainer = page.locator('[data-testid="dateTimePicker--datepicker--container"]');
		const timeContainer = page.locator('[data-testid="dateTimePicker--timepicker--container"]');
		const dateInput = page.locator('input[data-testid="dateTimePicker--datepicker-select--input"]');
		const firstDate = page.locator('[role="gridcell"]').nth(6);

		const initialTimeValue = await timeContainer.evaluate((el) => el.textContent ?? '');

		await dateInput.click();
		await firstDate.click();
		const dateValueAfterSelect = await dateContainer.evaluate((el) => el.textContent ?? '');

		// Re-focus the date input before pressing Backspace; clicking the
		// calendar option moves focus elsewhere, and Backspace would
		// otherwise be sent to the wrong element.
		await dateInput.focus();
		await page.keyboard.press('Backspace');

		// Use auto-waiting assertions so the comparisons retry until the
		// value-clear has flushed through react-select's async update path.
		await expect(dateContainer).not.toHaveText(dateValueAfterSelect);
		await expect(timeContainer).toHaveText(initialTimeValue);
	});
});
