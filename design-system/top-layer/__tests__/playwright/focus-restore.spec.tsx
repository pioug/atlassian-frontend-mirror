import { expect, test } from '@af/integration-testing';

// ─────────────────────────────────────────────────────────────────────────────
// Popup - native popover focus restoration
//
// The HTML Popover API handles focus restoration natively:
//   - Escape (hidePopover with focusPreviousElement=true) → restores focus to trigger
//   - Light dismiss / click outside (focusPreviousElement=false) → does NOT restore focus
//
// Each test covers both halves of this contract for one role in a single session,
// mirroring what a real user would experience: open, interact, dismiss via Escape,
// reopen, dismiss via click outside.
//
// WCAG 2.4.3 Focus Order
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Popup - native popover focus restoration', () => {
	// role="dialog" — Escape restores, light-dismiss does not
	test('role="dialog": Escape restores focus to trigger; light-dismiss does not', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);

		const trigger = page.getByTestId('dialog-trigger');
		const popup = page.getByTestId('dialog-popup');
		const innerButton = page.getByTestId('dialog-inner-button');

		// Open → move focus inside → Escape → focus returns to trigger
		await trigger.click();
		await expect(popup).toBeVisible();
		await innerButton.focus();
		await expect(innerButton).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(popup).toBeHidden();
		await expect(trigger).toBeFocused();

		// Reopen → move focus inside → click outside → focus does NOT return
		await trigger.click();
		await expect(popup).toBeVisible();
		await innerButton.focus();
		const viewport = page.viewportSize();
		await page.mouse.click(viewport!.width - 1, viewport!.height - 1);
		await expect(popup).toBeHidden();
		await expect(trigger).not.toBeFocused();
	});

	// role="menu" — Escape restores, light-dismiss does not
	test('role="menu": Escape restores focus to trigger; light-dismiss does not', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);

		const trigger = page.getByTestId('menu-trigger');
		const popup = page.getByTestId('menu-popup');
		const menuItem = page.getByTestId('menu-item');

		// Open → move focus inside → Escape → focus returns to trigger
		await trigger.click();
		await expect(popup).toBeVisible();
		await menuItem.focus();
		await expect(menuItem).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(popup).toBeHidden();
		await expect(trigger).toBeFocused();

		// Reopen → light-dismiss → focus does NOT return
		await trigger.click();
		await expect(popup).toBeVisible();
		await page.mouse.click(0, 0);
		await expect(popup).toBeHidden();
		await expect(trigger).not.toBeFocused();
	});

	// role="listbox" — Escape restores, light-dismiss does not
	test('role="listbox": Escape restores focus to trigger; light-dismiss does not', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);

		const trigger = page.getByTestId('listbox-trigger');
		const popup = page.getByTestId('listbox-popup');

		// Open → Escape → focus returns
		// listbox trigger is auto-focused on open — trial click for actionability
		await trigger.click();
		await expect(popup).toBeVisible();
		await expect(trigger).toBeFocused();
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(popup).toBeHidden();
		await expect(trigger).toBeFocused();

		// Reopen → light-dismiss → focus does NOT return
		await trigger.click();
		await expect(popup).toBeVisible();
		await page.mouse.click(0, 0);
		await expect(popup).toBeHidden();
		await expect(trigger).not.toBeFocused();
	});

	// role="tooltip" — focus must never move (tooltip is an informational overlay)
	// WCAG 1.4.13 Content on Hover or Focus — tooltip must not steal focus
	test('role="tooltip": focus does not move when tooltip opens or closes', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);

		const externalInput = page.getByTestId('external-input');
		await externalInput.focus();
		await expect(externalInput).toBeFocused();

		// Hover to show tooltip
		await page.getByTestId('tooltip-trigger').hover();
		await expect(page.getByTestId('tooltip-popup')).toBeVisible();

		// Focus must remain on the external input — tooltip never steals focus
		await expect(externalInput).toBeFocused();

		// Move mouse away to hide tooltip — focus still on external input
		await page.mouse.move(0, 0);
		await expect(page.getByTestId('tooltip-popup')).toBeHidden();
		await expect(externalInput).toBeFocused();
	});
});
