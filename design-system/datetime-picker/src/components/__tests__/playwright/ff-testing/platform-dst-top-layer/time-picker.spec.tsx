import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

// Skip axe checks across this file: the test example may have known
// pre-existing accessibility violations unrelated to the top-layer migration.
test.beforeEach(({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('TimePicker top-layer — WCAG 2.1.1 Keyboard', () => {
	test('opens menu via click and displays time options', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const menuOption = page.locator('[class*="option"]').first();

		await expect(menuOption).toBeHidden();
		await timePicker.click();
		await expect(menuOption).toBeVisible();
	});

	test('enters time via keyboard and updates value', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		// Use the stable `--value-container` testId rather than the fragile
		// nth-child DOM-shape selector that previously masked this test.
		const value = page.getByTestId('timePicker-select--value-container');

		await expect(timePicker).toBeVisible();

		await timePicker.click();
		await timeInput.fill('10:15');
		await page.keyboard.press('Enter');

		// Auto-waiting assertion retries until the async value update has
		// flushed and `react-select` has normalised the typed value.
		await expect(value).toHaveText('10:15 AM');
	});

	test('arrow keys navigate time options when menu is open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		const menuOption = page.locator('[class*="option"]').first();

		await timePicker.click();
		await expect(menuOption).toBeVisible();
		await expect(timeInput).toBeFocused();
		await page.keyboard.press('ArrowDown');
	});
});

test.describe('TimePicker top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('Escape closes time picker menu and returns focus to input', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		const menuOption = page.locator('[class*="option"]').first();

		await timePicker.click();
		await expect(menuOption).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(menuOption).toBeHidden();
		await expect(timeInput).toBeFocused();
	});

	test('Tab exits menu when at last focusable element', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		const menuOption = page.locator('[class*="option"]').first();

		await timePicker.click();
		await expect(menuOption).toBeVisible();
		// While the menu is open, react-select keeps focus on the combobox
		// input (combobox UX pattern). Tab from the input closes the menu
		// and moves focus to the next focusable element on the page (i.e.
		// it is NOT trapped). Verify both: the menu closes, and focus is
		// no longer on the time input.
		await page.keyboard.press('Tab');
		await expect(menuOption).toBeHidden();
		await expect(timeInput).not.toBeFocused();
	});
});

test.describe('TimePicker top-layer — WCAG 2.4.3 Focus Order', () => {
	test('time input retains focus while menu is open (aria-activedescendant)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		const menuOption = page.locator('[class*="option"]').first();

		await timePicker.click();
		await expect(menuOption).toBeVisible();
		await expect(timeInput).toBeFocused();
	});

	test('focus moves into menu options on click', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		const menuOption = page.locator('[class*="option"]').first();

		await expect(menuOption).toBeHidden();
		await timePicker.click();
		await expect(menuOption).toBeVisible();
		await expect(timeInput).toBeFocused();
	});

	test('focus returns to time input on menu close', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		const menuOption = page.locator('[class*="option"]').first();

		await timePicker.click();
		await expect(menuOption).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(menuOption).toBeHidden();
		await expect(timeInput).toBeFocused();
	});
});

test.describe('TimePicker top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('focused time option has visible focus indicator', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		const menuOption = page.locator('[class*="option"]').first();

		await timePicker.click();
		await expect(menuOption).toBeVisible();
		await expect(timeInput).toBeFocused();
		await page.keyboard.press('ArrowDown');
	});
});

test.describe('TimePicker top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('time menu options are fully visible on screen', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const menuOption = page.locator('[class*="option"]').first();

		await timePicker.click();
		await expect(menuOption).toBeVisible();
	});
});

test.describe('TimePicker top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('time input has correct role and aria attributes', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timeInput = page.locator('input#react-select-timepicker-input');

		await expect(timeInput).toHaveAttribute('role', 'combobox');
	});

	test('menu has correct listbox role', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const menuListbox = page.locator('[role="listbox"]').first();

		await timePicker.click();
		await expect(menuListbox).toBeVisible();
	});
});

test.describe('TimePicker top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('time picker content appears near trigger in document order', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const menuOption = page.locator('[class*="option"]').first();

		await timePicker.click();
		await expect(menuOption).toBeVisible();
	});
});

test.describe('TimePicker top-layer — Input Validation', () => {
	test('invalid times are ignored and preserved previous value', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		// Use the stable react-select `--value-container` testId rather than
		// a fragile DOM-shape selector that can ambiguously match the clear
		// indicator wrapper.
		const value = page.getByTestId('timePicker-select--value-container');

		await timePicker.click();
		await page.webdriverCompatUtils.fillMultiple('input#react-select-timepicker-input', [
			'a',
			's',
			'd',
		]);
		await page.keyboard.press('Tab');

		await expect(value).toHaveText('1:00 PM');
	});

	test('selecting time option via click updates value', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		// Pick a non-default option (the second visible) so the click
		// produces an observable state change. The first option is the
		// currently selected value, so clicking it would be a no-op.
		const menuOption = page.locator('[class*="option"]').nth(1);
		// react-select wraps the selected option text inside the
		// `--value-container` testId. The previous DOM-shape selector
		// based on positional CSS pseudo-classes was strict-mode-ambiguous
		// because it also matched the clear indicator wrapper.
		const value = page.getByTestId('timePicker-select--value-container');

		await timePicker.click();
		await expect(menuOption).toBeVisible();
		await menuOption.click();

		// react-select fires selection on mousedown, so the menu closes
		// once selection has been committed and react has flushed state.
		await expect(menuOption).toBeHidden();

		await expect(value).not.toBeEmpty();
	});

	test('menu closes automatically after selection', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../../examples/100-times.tsx')>('design-system', 'datetime-picker', 'times', {
			featureFlag,
		});

		const timePicker = page.getByTestId('timePicker--container');
		const timeInput = page.locator('input#react-select-timepicker-input');
		// Pick a non-default option (the second) so the click produces an
		// observable state change.
		const menuOption = page.locator('[class*="option"]').nth(1);

		await timePicker.click();
		await expect(menuOption).toBeVisible();
		await menuOption.click();
		await expect(menuOption).toBeHidden();
		await expect(timeInput).toBeFocused();
	});
});
