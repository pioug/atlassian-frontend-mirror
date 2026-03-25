/* eslint-disable testing-library/prefer-screen-queries */
import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

test.describe('Dialog - open and close', () => {
	test('opens via trigger click (showModal)', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-basic');

		await page.getByTestId('dialog-trigger').click();

		await expect(page.getByTestId('dialog-body')).toBeVisible();
	});

	// WCAG 2.1.2 No Keyboard Trap - Escape always dismisses with correct reason
	test('closes on Escape with reason "escape"', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-close-reason');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('dialog-body')).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('escape');
	});

	// WCAG 2.1.2 No Keyboard Trap - backdrop click fires onClose with reason "overlay-click"
	test('closes on backdrop click with reason "overlay-click"', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-close-reason');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		const dialog = page.locator('dialog');
		const box = await dialog.boundingBox();
		invariant(box, 'dialog bounding box should exist');

		await page.mouse.click(1, 1);

		await expect(page.getByTestId('dialog-body')).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('overlay-click');
	});

	test('onClose is called before dialog closes (Escape)', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-close-timing');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('close-reason')).toHaveText('escape', { timeout: 500 });
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		await page.waitForFunction(() => !document.querySelector('dialog[open]'));
		await expect(page.getByTestId('dialog-body')).toBeHidden();
	});

	test('onClose is called before dialog closes (backdrop click)', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-close-timing');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		await page.mouse.click(1, 1);

		await expect(page.getByTestId('close-reason')).toHaveText('overlay-click', { timeout: 500 });
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		await page.waitForFunction(() => !document.querySelector('dialog[open]'));
		await expect(page.getByTestId('dialog-body')).toBeHidden();
	});

	// WCAG 2.1.1 Keyboard - dialog close button is reachable via keyboard
	test('close button can be activated via keyboard', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-basic');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-body')).toBeVisible();

		let foundCloseButton = false;
		for (let i = 0; i < 10; i++) {
			await page.keyboard.press('Tab');
			// eslint-disable-next-line playwright/no-conditional-in-test -- searching for close button via tabbing
			const hasAriaLabel = await page.evaluate(() => {
				return document.activeElement?.getAttribute('aria-label') === 'Close';
			});
			// eslint-disable-next-line playwright/no-conditional-in-test -- searching for close button via tabbing
			if (hasAriaLabel) {
				foundCloseButton = true;
				break;
			}
		}

		expect(foundCloseButton).toBe(true);

		await page.keyboard.press('Enter');

		await expect(page.getByTestId('dialog-body')).toBeHidden();
	});
});

test.describe('Dialog - focus', () => {
	// WCAG 2.4.3 Focus Order - focus moves into the dialog on open
	test('focus moves into dialog on open', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-focus-trap');

		await page.getByTestId('dialog-trigger').click();

		const isFocusInsideDialog = await page.evaluate(() => {
			const dialog = document.querySelector('dialog');
			return dialog?.contains(document.activeElement) ?? false;
		});

		expect(isFocusInsideDialog).toBe(true);
	});

	// WCAG 2.4.3 Focus Order - focus returns to trigger on dismiss
	test('focus returns to trigger on close', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-focus-return');

		const trigger = page.getByTestId('dialog-trigger');
		await trigger.click();

		await expect(page.getByTestId('dialog-button')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(trigger).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order - Tab cycles within modal dialog (focus wrap)
	test('Tab cycles within modal dialog and wraps directly from last to first', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-tab-trap');

		await page.getByTestId('dialog-trigger').click();

		const dialog = page.locator('dialog');
		await expect(dialog).toBeVisible();

		const focusableCount = await page.evaluate(() => {
			const d = document.querySelector('dialog');
			const focusable = d?.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
			);
			return focusable?.length ?? 0;
		});

		expect(focusableCount).toBeGreaterThanOrEqual(4);

		// showModal() auto-focuses the Close button (first focusable element).
		// Tab through each remaining element and verify focus stays in the dialog.
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('button-a')).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('button-b')).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(page.getByTestId('button-c')).toBeFocused();

		// After the last focusable element, Tab wraps directly to the first
		// focusable element (the Close button) — no <body> intermediate step.
		// This matches the WAI-ARIA APG Dialog (Modal) pattern.
		await page.keyboard.press('Tab');
		const wrappedToFirst = await page.evaluate(() => {
			return document.activeElement?.getAttribute('aria-label') === 'Close';
		});
		expect(wrappedToFirst).toBe(true);

		// Verify focus never reached background content.
		const outsideWasFocused = await page.evaluate(() => {
			const btn = document.querySelector('[data-testid="outside-button"]') as HTMLElement;
			btn?.focus();
			return document.activeElement === btn;
		});
		expect(outsideWasFocused).toBe(false);
	});

	// WCAG 2.4.3 Focus Order - Shift+Tab cycles backward within modal dialog
	test('Shift+Tab cycles backward and wraps directly from first to last', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-tab-trap');

		await page.getByTestId('dialog-trigger').click();

		const dialog = page.locator('dialog');
		await expect(dialog).toBeVisible();

		// showModal() auto-focuses the Close button (first focusable element).
		// Shift+Tab wraps directly to the last focusable element — no <body>
		// intermediate step. This matches the WAI-ARIA APG Dialog (Modal) pattern.
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('button-c')).toBeFocused();

		// Continue Shift+Tab through the remaining elements in reverse order.
		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('button-b')).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(page.getByTestId('button-a')).toBeFocused();

		// Shift+Tab from button-a wraps directly to the Close button.
		await page.keyboard.press('Shift+Tab');
		const wrappedToClose = await page.evaluate(() => {
			return document.activeElement?.getAttribute('aria-label') === 'Close';
		});
		expect(wrappedToClose).toBe(true);
	});

	// WCAG 2.4.3 Focus Order - background elements are inert when modal is open
	test('background content is inert when modal dialog is open', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-tab-trap');

		await page.getByTestId('dialog-trigger').click();

		const dialog = page.locator('dialog');
		await expect(dialog).toBeVisible();

		const couldFocusOutside = await page.evaluate(() => {
			const btn = document.querySelector('[data-testid="outside-button"]') as HTMLElement;
			btn?.focus();
			return document.activeElement === btn;
		});

		expect(couldFocusOutside).toBe(false);
	});

	// WCAG 2.4.7 Focus Visible - focus indicator on elements inside a dialog
	test(':focus-visible on button inside dialog after keyboard navigation', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-focus-trap');

		await page.getByTestId('dialog-trigger').click();

		await page.keyboard.press('Tab');

		const focusedElement = page.getByTestId('first-button');
		await expect(focusedElement).toBeFocused();

		const hasFocusVisible = await focusedElement.evaluate((el) => {
			return el.matches(':focus-visible');
		});

		expect(hasFocusVisible).toBe(true);
	});

	// WCAG 2.4.11 Focus Not Obscured - dialog in top layer is never obscured
	test('dialog content in top layer is not obscured by other elements', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-basic');

		await page.getByTestId('dialog-trigger').click();

		const dialog = page.locator('dialog');
		await expect(dialog).toBeVisible();

		const isVisible = await page.evaluate(() => {
			const d = document.querySelector('dialog');
			if (!d) {
				return false;
			}
			const rect = d.getBoundingClientRect();
			return rect.width > 0 && rect.height > 0;
		});

		expect(isVisible).toBe(true);

		await page.keyboard.press('Tab');

		const focusedElementVisible = await page.evaluate(() => {
			const el = document.activeElement;
			if (!el) {
				return false;
			}
			const rect = el.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) {
				return false;
			}
			const centerX = rect.left + rect.width / 2;
			const centerY = rect.top + rect.height / 2;
			const topEl = document.elementFromPoint(centerX, centerY);
			return el === topEl || el.contains(topEl);
		});

		expect(focusedElementVisible).toBe(true);
	});

	// TODO: Add test for dynamic content inside dialog (lazy loading).
	// When focusable elements are added or removed dynamically while a dialog
	// is open, the native focus trap should correctly update its cycle.
	// This should be addressed as part of the lazy loading work.
});

test.describe('Dialog - autofocus', () => {
	// The browser's dialog focusing algorithm focuses the element with the
	// HTML autofocus attribute when showModal() is called.
	test('HTML autofocus attribute is respected by showModal()', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-autofocus');

		await page.getByTestId('open-default').click();

		const dialog = page.locator('dialog');
		await expect(dialog).toBeVisible();

		// The button with autofocus should be focused, not the first focusable element.
		await expect(page.getByTestId('button-autofocus')).toBeFocused();
	});

	// Consumers can use getFirstFocusable to override the browser's autofocus
	// behavior and explicitly focus the first focusable element.
	test('getFirstFocusable overrides HTML autofocus attribute', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-autofocus');

		await page.getByTestId('open-override').click();

		const dialog = page.locator('dialog');
		await expect(dialog).toBeVisible();

		// getFirstFocusable should have moved focus to the close button,
		// overriding the autofocus attribute on button-autofocus.
		await expect(page.getByTestId('close-button')).toBeFocused();
	});
});

test.describe('Dialog - ARIA', () => {
	// WCAG 4.1.2 Name, Role, Value - dialog has role="dialog" (native)
	test('dialog element has native dialog role', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-basic');

		await page.getByTestId('dialog-trigger').click();

		const dialog = page.locator('dialog');
		await expect(dialog).toBeVisible();

		const role = await dialog.evaluate((el) => el.getAttribute('role'));
		// eslint-disable-next-line playwright/no-conditional-in-test -- native dialog may or may not have explicit role attr
		expect(role === null || role === 'dialog').toBe(true);
	});

	// WCAG 4.1.2 Name, Role, Value - dialog has aria-labelledby pointing to title
	test('heading is associated via aria-labelledby', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-basic');

		await page.getByTestId('dialog-trigger').click();

		const dialog = page.locator('dialog');
		/* eslint-disable playwright/prefer-web-first-assertions -- need actual value for CSS selector */
		const labelledBy = await dialog.getAttribute('aria-labelledby');
		expect(labelledBy).toBeTruthy();
		/* eslint-enable playwright/prefer-web-first-assertions */

		const heading = page.locator(`#${labelledBy}`);
		await expect(heading).toHaveText('Test dialog');
	});

	// WCAG 4.1.2 Name, Role, Value - close button has accessible name
	test('close button has aria-label', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-basic');

		await page.getByTestId('dialog-trigger').click();

		const closeButton = page.locator('dialog button[aria-label="Close"]');
		await expect(closeButton).toBeVisible();
		await expect(closeButton).toHaveAttribute('aria-label', 'Close');
	});

	// WCAG 4.1.3 Status Messages - native <dialog> has implicit role="dialog" for SR announcement
	test('dialog has a role that enables screen reader announcement', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-dialog-basic');

		await page.getByTestId('dialog-trigger').click();

		const dialog = page.locator('dialog');
		const dialogRole = await dialog.evaluate((el) => el.getAttribute('role') ?? 'dialog');
		expect(dialogRole).toBe('dialog');
	});
});
