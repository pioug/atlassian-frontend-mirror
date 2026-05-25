/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

/**
 * Locks down `useInitialFocus`'s RAF cancel + element-identity guard.
 * A rapid `open -> close -> open` sequence inside a single frame must
 * not leave a queued RAF firing against a torn-down popover instance
 * (which previously surfaced as a focus-on-disconnected-element error
 * or silent focus loss to body).
 */
test.describe('Popup - rapid initial-focus race', () => {
	test('rapid toggle does not leave focus on a torn-down element', async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('pageerror', (error) => {
			consoleErrors.push(error.message);
		});
		page.on('console', (msg) => {
			if (msg.type() === 'error') {
				consoleErrors.push(msg.text());
			}
		});

		await page.visitExample<typeof import('../../examples/131-testing-rapid-open-toggle.tsx')>(
			'design-system',
			'top-layer',
			'testing-rapid-open-toggle',
		);

		const trigger = page.getByTestId('popover-trigger');

		// 3 rapid clicks → odd parity → popover open.
		await trigger.click();
		await trigger.click();
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// No "focus a disconnected element" / "removed node" errors.
		const focusRelatedErrors = consoleErrors.filter((message) =>
			/(disconnected|detached|removed node|null is not an object)/i.test(message),
		);
		expect(focusRelatedErrors).toEqual([]);

		// Popover is interactable: clicking the inner button moves focus
		// to it. If focus state were corrupt (RAF fired against the wrong
		// instance and got stuck), this would not work.
		const innerButton = page.getByTestId('popover-button');
		await innerButton.click();
		await expect(innerButton).toBeFocused();
	});
});
