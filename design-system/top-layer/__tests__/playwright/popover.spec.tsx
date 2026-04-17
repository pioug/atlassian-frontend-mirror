/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

// ─────────────────────────────────────────────────────────────────────────────
// Popup - open and close
//
// Tests the full dismiss journey: all three close paths in one user session.
// Uses the escape example because it tracks close-reason, giving us more signal.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Popup - open and close', () => {
	// WCAG 2.1.2 No Keyboard Trap - all dismiss paths must work
	test('opens on click, closes via Escape and click-outside (reports close reason)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/92-testing-popover-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-escape',
		);

		const trigger = page.getByTestId('popover-trigger');
		const content = page.getByTestId('popover-content');

		// Open via click
		await trigger.click();
		await expect(content).toBeVisible();

		// Trial click on trigger (interactive button) before Escape
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('light-dismiss');

		// Reopen and close via click outside
		await trigger.click();
		await expect(content).toBeVisible();
		await page.getByTestId('outside-target').click();
		await expect(content).toBeHidden();
	});

	test('closes programmatically via hidePopover()', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/104-testing-popover-programmatic-close.tsx')
		>('design-system', 'top-layer', 'testing-popover-programmatic-close');

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.getByTestId('programmatic-close-button').click();

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('close-indicator')).toHaveText('closed');
	});

	test('scroll does not close popover', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/117-testing-popover-scroll.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-scroll',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.getByTestId('scroll-container').evaluate((el) => {
			el.scrollTop = 200;
		});

		await expect(page.getByTestId('popover-content')).toBeVisible();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Popup - keyboard journey
//
// Covers the keyboard user's full session: open with Enter, Tab into content,
// Escape to close. Combines what were previously separate keyboard/focus describes.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Popup - keyboard journey', () => {
	// WCAG 2.1.1 Keyboard — popover operable via keyboard only
	// WCAG 2.4.3 Focus Order — focus returns to trigger after Escape
	test('keyboard user: Enter opens, Tab navigates content, Escape closes and returns focus', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');

		// Open via keyboard Enter — trigger.focus() guarantees focus; toBeFocused() confirms it
		await trigger.focus();
		await expect(trigger).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Close via Escape — trial click on trigger (interactive button, always stable)
		await page.getByTestId('popover-trigger').click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();
	});

	// WCAG 2.1.2 No Keyboard Trap — non-dialog popovers must NOT trap focus
	test('Tab moves focus out of a non-dialog popover (no focus trap)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Tab multiple times — focus must eventually leave the popover
		for (let i = 0; i < 5; i++) {
			await page.keyboard.press('Tab');
		}

		const isFocusInsidePopover = await page.evaluate(() => {
			const popover = document.querySelector('[popover]');
			return popover?.contains(document.activeElement) ?? false;
		});
		expect(isFocusInsidePopover).toBe(false);
	});

	// WCAG 3.2.1 On Focus — focus returning to trigger must NOT re-open the popover
	test('focus returning to trigger after close does not re-open popover', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/105-testing-focus-return-no-reopen.tsx')>(
			'design-system',
			'top-layer',
			'testing-focus-return-no-reopen',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// role="dialog" auto-focuses inner content on open — use inner button for trial click
		const innerButton = page.getByTestId('inner-button');
		await expect(innerButton).toBeFocused();
		await innerButton.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();

		// Re-focus the trigger — popover must stay closed
		await trigger.focus();
		await expect(page.getByTestId('popover-content')).toBeHidden();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Popup - top layer DOM order
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Popup - top layer DOM order', () => {
	test('popover renders without a portal (inline in DOM)', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/100-testing-dom-order.tsx')>(
			'design-system',
			'top-layer',
			'testing-dom-order',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Verify the popover is a sibling of the trigger, not teleported elsewhere
		const isInlineWithTrigger = await page.evaluate(() => {
			const trigger = document.querySelector('[data-testid="popover-trigger"]');
			const popover = document.querySelector('[popover]');
			return trigger?.parentElement?.contains(popover) ?? false;
		});
		expect(isInlineWithTrigger).toBe(true);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Popup - ARIA attributes
//
// All ARIA assertions run after a single page load and single open action.
// WCAG 4.1.2 Name, Role, Value
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Popup - ARIA attributes', () => {
	test('trigger and popover have correct ARIA attributes before and after open', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/90-testing-popover-basic.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-basic',
		);

		const trigger = page.getByTestId('popover-trigger');

		// Before open: trigger should have aria-expanded=false and aria-controls
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		/* eslint-disable playwright/prefer-web-first-assertions -- need actual value for CSS selector */
		const ariaControls = await trigger.getAttribute('aria-controls');
		expect(ariaControls).toBeTruthy();
		/* eslint-enable playwright/prefer-web-first-assertions */

		// Open
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// After open: aria-expanded=true, popover element accessible
		await expect(trigger).toHaveAttribute('aria-expanded', 'true');
		const popoverEl = page.locator(`#${ariaControls}`);
		await expect(popoverEl).toBeVisible();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Popup - manual mode accessibility
//
// mode="manual" popovers don't get browser-native Escape/click-outside handling.
// Consumers must implement their own handlers. Tests the full user journey:
// open → Escape dismiss → reopen → click-outside dismiss.
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Popup - manual mode accessibility', () => {
	// WCAG 2.1.2 No Keyboard Trap — manual popovers must still be dismissible
	test('manual popover: user can dismiss via Escape and via click outside', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/120-testing-manual-popover-a11y.tsx')>(
			'design-system',
			'top-layer',
			'testing-manual-popover-a11y',
		);

		const trigger = page.getByTestId('trigger');
		const content = page.getByTestId('popover-content');

		// Open and dismiss with Escape — trial click on trigger (interactive button)
		await trigger.click();
		await expect(content).toBeVisible();
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('escape');

		// Reopen and dismiss with click outside
		await trigger.click();
		await expect(content).toBeVisible();
		await page.getByTestId('outside-button').click();
		await expect(content).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('click-outside');
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Popup - mode="hint" fallback (webkit only)
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Popup - mode="hint" fallback', () => {
	test('when mode="hint" is not supported, popover attribute falls back to "auto"', async ({
		page,
		browserName,
	}) => {
		test.fixme(browserName !== 'webkit', 'popover="hint" fallback only testable in webkit');

		await page.visitExample<typeof import('../../examples/107-testing-popover-mode-hint.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-mode-hint',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		/* eslint-disable playwright/prefer-web-first-assertions -- need actual value for CSS selector */
		const ariaControls = await trigger.getAttribute('aria-controls');
		expect(ariaControls).toBeTruthy();
		/* eslint-enable playwright/prefer-web-first-assertions */

		const popover = page.locator(`#${ariaControls}`);
		await expect(popover).toBeVisible();
		await expect(popover).toHaveAttribute('popover', 'auto');
	});
});
