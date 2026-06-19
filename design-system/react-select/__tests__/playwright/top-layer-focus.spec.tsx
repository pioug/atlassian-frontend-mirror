import { expect, test } from '@af/integration-testing';

/**
 * Focus contract on the top-layer code path: DOM focus stays on the combobox
 * (virtual focus via `aria-activedescendant`), so `MenuPortalTopLayer`
 * intentionally suppresses `useInitialFocus`.
 *
 * See: `top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('react-select: top-layer focus contract', () => {
	test('initial focus: opening via ArrowDown keeps DOM focus on the combobox', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox', { name: 'City' });
		await combobox.focus();
		await page.keyboard.press('ArrowDown');

		await expect(page.getByRole('listbox')).toBeVisible();
		await expect(combobox).toBeFocused();
	});

	test('focus restoration: Escape closes the menu and keeps focus on the combobox', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox', { name: 'City' });
		await combobox.focus();
		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByRole('listbox')).toBeHidden();
		await expect(combobox).toBeFocused();

		// Re-assert after the reconcile window: a mis-firing re-open would
		// briefly re-show the listbox before settling back to hidden.
		await expect(page.getByRole('listbox')).toBeHidden({ timeout: 1000 });
		await expect(page.getByRole('listbox')).toHaveCount(0);
	});

	test('click inside the combobox while menu is open does NOT close the menu', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox', { name: 'City' });
		await combobox.focus();
		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('listbox')).toBeVisible();

		// Light-dismiss would hide on this pointerdown; the consumer
		// reconcile re-shows because the target is inside the control.
		await combobox.click();
		await expect(page.getByRole('listbox')).toBeVisible();

		// Re-assert after a no-op key press so any deferred close path has
		// had a chance to run.
		await page.keyboard.press('Shift');
		await expect(page.getByRole('listbox')).toBeVisible();
	});

	test('virtual focus: ArrowDown sets aria-activedescendant; DOM focus stays on combobox', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox', { name: 'City' });
		await combobox.focus();
		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('listbox')).toBeVisible();

		await expect(combobox).toHaveAttribute('aria-activedescendant', /.+/);
		await expect(combobox).toBeFocused();
	});

	test('focus restoration: Enter on highlighted option closes the menu and keeps focus on the combobox', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox', { name: 'City' });
		await combobox.focus();
		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.keyboard.press('Enter');
		await expect(page.getByRole('listbox')).toBeHidden();
		await expect(combobox).toBeFocused();
	});

	test('tab order: Shift+Tab from a closed combobox returns to the before button', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await page.getByRole('combobox', { name: 'City' }).focus();
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('before-button')).toBeFocused();
	});

	test('open -> close -> reopen cycle leaves DOM focus on the combobox', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = page.getByRole('combobox', { name: 'City' });
		await combobox.focus();
		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('listbox')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByRole('listbox')).toBeHidden();

		await page.keyboard.press('ArrowDown');
		await expect(page.getByRole('listbox')).toBeVisible();
		await expect(combobox).toBeFocused();
	});
});
