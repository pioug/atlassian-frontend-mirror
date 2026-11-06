import { expect, type Page, test } from '@af/integration-testing';

/**
 * Focus return when a top-layer Select menu with focusable content closes. Select hides the
 * menu's Popover and unmounts the menu after the close, so the platform rule applies: focus that
 * is inside the menu returns to the element that had focus when the menu opened.
 *
 * Menus open with the keyboard, as Safari and Firefox on macOS do not focus a clicked button.
 */

const featureFlag = 'platform-dst-top-layer';

async function visit(page: Page) {
	await page.visitExample<
		typeof import('../../../../examples/testing-top-layer-menu-focus-return.tsx')
	>('design-system', 'react-select', 'testing-top-layer-menu-focus-return', { featureFlag });
}

async function openFromButton(page: Page) {
	const opener = page.getByTestId('opener');
	await opener.focus();
	await page.keyboard.press('Enter');
	const close = page.getByTestId('from-button-close');
	await expect(close).toBeVisible();
	await close.focus();
	await expect(close).toBeFocused();
	return { opener, close };
}

test.describe('react-select top-layer menu - focus return on close', () => {
	test('returns focus to the opener when a button in the menu closes it', async ({ page }) => {
		await visit(page);
		const { opener } = await openFromButton(page);

		await page.keyboard.press('Enter');

		await expect(opener).toBeFocused();
		// The menu unmounts after its close finishes.
		await expect(page.getByTestId('from-button-select--listbox-container')).toHaveCount(0);
	});

	test('returns focus to the opener when Escape closes the menu', async ({ page }) => {
		await visit(page);
		const { opener } = await openFromButton(page);

		await page.keyboard.press('Escape');

		await expect(opener).toBeFocused();
		await expect(page.getByTestId('from-button-select--listbox-container')).toHaveCount(0);
	});

	test('does not return focus after an outside press that leaves focus in the menu', async ({
		page,
	}) => {
		await visit(page);
		const { opener } = await openFromButton(page);

		await page.getByTestId('press-without-focus').click();

		await expect(page.getByTestId('from-button-select--listbox-container')).toHaveCount(0);
		await expect(opener).not.toBeFocused();
		await expect(page.locator('body')).toBeFocused();
	});

	test('reopens when the menu opens again during its close', async ({ page }) => {
		await visit(page);
		const { opener } = await openFromButton(page);
		const closeAndReopen = page.getByTestId('from-button-close-and-reopen');
		await closeAndReopen.focus();

		await page.keyboard.press('Enter');

		await expect(page.getByTestId('from-button-select--listbox-container')).toBeVisible();
		await expect(closeAndReopen).toBeFocused();
		// The next close still returns focus to the opener.
		await page.getByTestId('from-button-close').focus();
		await page.keyboard.press('Enter');
		await expect(opener).toBeFocused();
		await expect(page.getByTestId('from-button-select--listbox-container')).toHaveCount(0);
	});

	test('does not reopen an openMenuOnFocus menu when focus returns to the input', async ({
		page,
	}) => {
		await visit(page);
		const input = page.getByRole('combobox', { name: 'Opens on focus' });
		await input.focus();
		const close = page.getByTestId('open-on-focus-close');
		await expect(close).toBeVisible();
		await close.focus();

		await page.keyboard.press('Enter');

		await expect(input).toBeFocused();
		await expect(input).toHaveAttribute('aria-expanded', 'false');
		await expect(page.getByTestId('open-on-focus-select--listbox-container')).toHaveCount(0);
	});
});
