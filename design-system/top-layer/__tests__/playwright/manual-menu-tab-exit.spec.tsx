import { expect, test } from '@af/integration-testing';

/**
 * Tab in a menu of `manual` popovers closes the menu in its `keydown` listener (as `DropdownMenu`
 * does). `Popover` returns focus to the trigger before the browser acts on the Tab, so the Tab moves
 * on from the trigger, as for an `auto` popover.
 *
 * Shift+Tab tells the two apart: without the return, it moves to the trigger (the element before
 * the menu in the DOM), not to "Before". Playwright sends keys to Firefox from script, so no
 * microtask runs before the Tab default action: `useArrowNavigation` runs the return at once.
 *
 * The menu opens by keyboard, so the trigger is the element that had focus at open in every browser.
 *
 * See notes/decisions/wrappers-ask-first-close.md ("Focus return").
 */

test.beforeEach(async ({ page, browserName }) => {
	// Playwright WebKit leaves focus on `<body>` after the Tab, with or without the focus return. The
	// DropdownMenu nested Tab-exit specs fail the same way on master.
	test.fixme(browserName === 'webkit', 'Playwright WebKit: focus is on the body after the Tab');
	await page.visitExample<typeof import('../../examples/177-testing-manual-menu-tab-exit.tsx')>(
		'design-system',
		'top-layer',
		'testing-manual-menu-tab-exit',
	);
	await page.getByTestId('trigger').focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId('item')).toBeFocused();
});

test('Tab closes the menu and moves focus to the element after the trigger', async ({ page }) => {
	await page.keyboard.press('Tab');

	await expect(page.getByRole('menu', { name: 'Options' })).toBeHidden();
	await expect(page.getByTestId('after')).toBeFocused();
});

test('Shift+Tab closes the menu and moves focus to the element before the trigger', async ({
	page,
}) => {
	await page.keyboard.press('Shift+Tab');

	await expect(page.getByRole('menu', { name: 'Options' })).toBeHidden();
	await expect(page.getByTestId('before')).toBeFocused();
});

test('Shift+Tab in the nested menu closes both menus and moves focus to the element before the trigger', async ({
	page,
}) => {
	await page.getByTestId('nested-trigger').focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.getByTestId('nested-item')).toBeFocused();

	await page.keyboard.press('Shift+Tab');

	await expect(page.getByRole('menu', { name: 'Options' })).toBeHidden();
	await expect(page.getByRole('menu', { name: 'More' })).toBeHidden();
	await expect(page.getByTestId('before')).toBeFocused();
});
