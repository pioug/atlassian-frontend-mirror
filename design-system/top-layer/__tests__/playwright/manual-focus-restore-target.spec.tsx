import { expect, type Page, test } from '@af/integration-testing';

/**
 * The element that a manual `Popover` returns focus to is never inside the popover. Popovers open
 * with the keyboard, as Safari and Firefox on macOS do not focus a clicked button.
 */

async function visit(page: Page) {
	await page.visitExample<
		typeof import('../../examples/168-testing-manual-focus-restore-target.tsx')
	>('design-system', 'top-layer', 'testing-manual-focus-restore-target');
}

test.describe('Manual Popover focus restoration target', () => {
	for (const name of ['strict', 'plain']) {
		test(`returns focus to the trigger after content moved focus inside on open (${name})`, async ({
			page,
		}) => {
			await visit(page);
			const trigger = page.getByTestId(`${name}-trigger`);
			await trigger.focus();

			// The popover mounts open and its content moves focus inside in a passive effect.
			await page.keyboard.press('Enter');
			await expect(page.getByTestId(`${name}-inside`)).toBeFocused();
			await page.getByTestId(`${name}-close`).focus();
			await page.keyboard.press('Enter');

			await expect(page.getByTestId(`${name}-popover`)).toBeHidden();
			await expect(trigger).toBeFocused();
		});
	}

	test('returns focus to the trigger after the popover reopens during its close', async ({
		page,
	}) => {
		await visit(page);
		const trigger = page.getByTestId('reopen-trigger');
		const popover = page.getByTestId('reopen-popover');
		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(popover).toBeVisible();
		await page.getByTestId('reopen-close-and-reopen').focus();

		// Close, then reopen in the same task, while focus is still inside.
		await page.keyboard.press('Enter');
		await expect(popover).toBeVisible();
		await page.getByTestId('reopen-close').focus();
		await page.keyboard.press('Enter');

		await expect(popover).toBeHidden();
		await expect(trigger).toBeFocused();
	});
});
