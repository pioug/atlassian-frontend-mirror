import { expect, type Page, test } from '@af/integration-testing';

/**
 * An outside press on a manual popover with `useManualLightDismiss` does not return focus to the
 * trigger, as with native light dismiss. The popover opens with the keyboard, as Safari and
 * Firefox on macOS do not focus a clicked button.
 */

async function openWithFocusInside(page: Page) {
	await page.visitExample<
		typeof import('../../examples/169-testing-manual-light-dismiss-focus.tsx')
	>('design-system', 'top-layer', 'testing-manual-light-dismiss-focus');
	const trigger = page.getByTestId('trigger');
	await trigger.focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId('popover')).toBeVisible();
	const inside = page.getByTestId('inside');
	await inside.focus();
	await expect(inside).toBeFocused();
	return { trigger };
}

test.describe('useManualLightDismiss - focus after an outside press', () => {
	test('an outside press that leaves focus inside closes the popover without returning focus', async ({
		page,
	}) => {
		const { trigger } = await openWithFocusInside(page);

		// This element cancels `mousedown`, so the press does not move focus out of the popover.
		await page.getByTestId('press-without-focus').click();

		await expect(page.getByTestId('popover')).toBeHidden();
		await expect(trigger).not.toBeFocused();
		await expect(page.locator('body')).toBeFocused();
	});

	test('a plain outside press moves focus to the pressed element', async ({ page }) => {
		await openWithFocusInside(page);
		const outsideInput = page.getByTestId('outside-input');

		await outsideInput.click();

		await expect(page.getByTestId('popover')).toBeHidden();
		await expect(outsideInput).toBeFocused();
	});
});
