import { expect, test } from '@af/integration-testing';

test.describe('Popup - native popover focus restoration', () => {
	// Focus restoration is now handled natively by the browser's Popover API.
	// When a popover is closed via Escape, the browser automatically restores focus to the trigger.
	// When a popover is closed via light dismiss (click outside), the browser does NOT restore focus
	// per the HTML Popover spec (focusPreviousElement=false for light dismiss).

	test('role="dialog": focus restores to trigger on Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);
		const trigger = page.getByTestId('dialog-trigger');
		await trigger.click();
		await expect(page.getByTestId('dialog-popup')).toBeVisible();
		const innerButton = page.getByTestId('dialog-inner-button');
		await innerButton.focus();
		await expect(innerButton).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('dialog-popup')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('role="dialog": focus does NOT restore to trigger on light-dismiss', async ({ page }) => {
		// The HTML Popover spec passes focusPreviousElement=false for light dismiss,
		// so focus is not restored to the trigger when clicking outside.
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);
		const trigger = page.getByTestId('dialog-trigger');
		await trigger.click();
		await expect(page.getByTestId('dialog-popup')).toBeVisible();
		const innerButton = page.getByTestId('dialog-inner-button');
		await innerButton.focus();
		await expect(innerButton).toBeFocused();

		// Click outside the popup — use body's bottom-right area to avoid
		// hitting the trigger (which would toggle the popup back open).
		const viewport = page.viewportSize();
		await page.mouse.click(viewport!.width - 1, viewport!.height - 1);

		await expect(page.getByTestId('dialog-popup')).toBeHidden();
		await expect(trigger).not.toBeFocused();
	});

	test('role="menu": focus restores to trigger on Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);
		const trigger = page.getByTestId('menu-trigger');
		await trigger.click();
		await expect(page.getByTestId('menu-popup')).toBeVisible();
		const menuItem = page.getByTestId('menu-item');
		await menuItem.focus();
		await expect(menuItem).toBeFocused();
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('menu-popup')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('role="menu": focus does NOT restore to trigger on light-dismiss', async ({ page }) => {
		// The HTML Popover spec passes focusPreviousElement=false for light dismiss,
		// so focus is not restored to the trigger when clicking outside.
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);
		const trigger = page.getByTestId('menu-trigger');
		await trigger.click();
		await expect(page.getByTestId('menu-popup')).toBeVisible();
		await page.mouse.click(0, 0);
		await expect(page.getByTestId('menu-popup')).toBeHidden();
		await expect(trigger).not.toBeFocused();
	});

	test('role="listbox": focus restores to trigger on Escape', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);
		const trigger = page.getByTestId('listbox-trigger');
		await trigger.click();
		await expect(page.getByTestId('listbox-popup')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('listbox-popup')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('role="listbox": focus does NOT restore to trigger on light-dismiss', async ({ page }) => {
		// The HTML Popover spec passes focusPreviousElement=false for light dismiss,
		// so focus is not restored to the trigger when clicking outside.
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);
		const trigger = page.getByTestId('listbox-trigger');
		await trigger.click();
		await expect(page.getByTestId('listbox-popup')).toBeVisible();
		await page.mouse.click(0, 0);
		await expect(page.getByTestId('listbox-popup')).toBeHidden();
		await expect(trigger).not.toBeFocused();
	});

	test('role="tooltip": focus does NOT move on close', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/122-testing-popup-focus-restore.tsx')>(
			'design-system',
			'top-layer',
			'testing-popup-focus-restore',
		);
		const externalInput = page.getByTestId('external-input');
		await externalInput.focus();
		await expect(externalInput).toBeFocused();
		const trigger = page.getByTestId('tooltip-trigger');
		await trigger.hover();
		await expect(page.getByTestId('tooltip-popup')).toBeVisible();
		await page.mouse.move(0, 0);
		await expect(page.getByTestId('tooltip-popup')).toBeHidden();
		const activeTestId = await page.evaluate(() => {
			return document.activeElement?.getAttribute('data-testid') ?? null;
		});
		expect(activeTestId).not.toBe('tooltip-trigger');
	});
});
