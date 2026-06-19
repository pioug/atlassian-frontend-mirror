import { expect, type Page, test } from '@af/integration-testing';

/**
 * Smoke coverage for `MenuPortalTopLayer` with the flag on: open / close /
 * select on the top-layer path. Detailed focus contract is in
 * `top-layer-focus.spec.tsx`.
 *
 * Note: react-select's combobox is opened via keyboard (ArrowDown / Space) or
 * by clicking the outer control wrapper (not the inner input that owns the
 * combobox role). Helpers below target the wrapper testId for robustness.
 */

const featureFlag = 'platform-dst-top-layer';

async function openMenu(page: Page) {
	const combobox = page.getByRole('combobox', { name: 'City' });
	await combobox.focus();
	await page.keyboard.press('ArrowDown');
	return combobox;
}

test.describe('react-select: top-layer smoke', () => {
	test('opens the menu in a top-layer popover element', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await openMenu(page);

		const listbox = page.getByRole('listbox');
		await expect(listbox).toBeVisible();
		// The menu wrapper must live inside a `[popover]` element when the
		// flag is on.
		const popoverAncestor = listbox.locator('xpath=ancestor::*[@popover][1]');
		await expect(popoverAncestor).toHaveCount(1);
	});

	test('selecting an option with keyboard closes the menu and updates the value', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await openMenu(page);
		await expect(page.getByRole('listbox')).toBeVisible();

		// Move highlight down to Brisbane (second option) and select.
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');

		await expect(page.getByRole('listbox')).toBeHidden();
		await expect(page.getByText('Brisbane', { exact: true })).toBeVisible();
	});

	test('clicking outside the menu dismisses it (light-dismiss)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await openMenu(page);
		await expect(page.getByRole('listbox')).toBeVisible();

		// Click the "before" button (above the Select). The "after" button
		// sits directly below the Select where the menu drops, so clicking
		// it lands on a menu option, not on outside content.
		await page.getByTestId('before-button').click();
		await expect(page.getByRole('listbox')).toBeHidden();
	});

	test('clicking the control opens the menu and it stays open', async ({ page }) => {
		// Regression guard: react-select opens from `onMouseDown`, so a
		// synchronous `showPopover()` would be light-dismissed on the matching
		// pointerup. The deferred-open path keeps the menu visible.
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await page.getByTestId('react-select-select--control').click();

		const listbox = page.getByRole('listbox');
		await expect(listbox).toBeVisible();
	});

	test('clicking the input while the menu is open does not dismiss the menu', async ({
		page,
	}) => {
		// Regression guard: the Select input lives outside the top-layer
		// popover, so light-dismiss would close the menu on input click.
		// `MenuPortalTopLayer` re-opens when the close comes from inside
		// the control.
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = await openMenu(page);
		const listbox = page.getByRole('listbox');
		await expect(listbox).toBeVisible();

		// Click the combobox (the inner input element) while the menu is open.
		await combobox.click();

		await expect(listbox).toBeVisible();
		// `aria-expanded` mirrors `Select.menuIsOpen`. Both must stay true; a
		// stale `menuIsOpen` would tear the menu down on the next render.
		await expect(combobox).toHaveAttribute('aria-expanded', 'true');
	});

	test('aria-controls links the combobox to the listbox even when portaled', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'react-select',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const combobox = await openMenu(page);
		const listbox = page.getByRole('listbox');
		await expect(listbox).toBeVisible();

		await expect(combobox).toHaveAttribute('aria-controls', /.+/);
		const ariaControls = await combobox.getAttribute('aria-controls');
		await expect(page.locator(`#${ariaControls}`)).toBeVisible();
	});
});
