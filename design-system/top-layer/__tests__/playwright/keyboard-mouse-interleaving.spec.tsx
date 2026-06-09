/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Interaction - mouse + keyboard interleaving', () => {
	// Category 4: Interaction Patterns
	// Verifies that mouse and keyboard interactions can be mixed without
	// confusing the component's state machine.

	test('mouse click opens, keyboard Escape closes', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/128-testing-keyboard-mouse-interleaving.tsx')
		>('design-system', 'top-layer', 'testing-keyboard-mouse-interleaving');

		const trigger = page.getByTestId('trigger');

		// Open via mouse click
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();
		await expect(page.getByTestId('status')).toHaveText('open');

		// Close via keyboard Escape — trial click on trigger (interactive button, always stable)
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('status')).toHaveText('closed');
	});

	test('keyboard Enter opens, mouse click outside closes', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/128-testing-keyboard-mouse-interleaving.tsx')
		>('design-system', 'top-layer', 'testing-keyboard-mouse-interleaving');

		const trigger = page.getByTestId('trigger');

		// Open via keyboard Enter — trigger.focus() guarantees focus; toBeFocused() confirms it
		await trigger.focus();
		await expect(trigger).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('popover-content')).toBeVisible();
		await expect(page.getByTestId('status')).toHaveText('open');

		// Close via mouse click outside
		await page.mouse.click(0, 0);
		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('status')).toHaveText('closed');
	});

	test('mouse open → keyboard Tab to inner element → keyboard Escape to close', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../examples/128-testing-keyboard-mouse-interleaving.tsx')
		>('design-system', 'top-layer', 'testing-keyboard-mouse-interleaving');

		const trigger = page.getByTestId('trigger');

		// Open via mouse click
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Tab to inner button — popup has role="dialog" so popover-content gets auto-focus on open
		// trial click on auto-focused content before Tab
		const popoverContent = page.getByTestId('popover-content');
		await expect(popoverContent).toBeVisible();
		await popoverContent.click({ trial: true });
		await page.keyboard.press('Tab');
		const innerButton = page.getByTestId('inner-button');
		await expect(innerButton).toBeFocused();

		// Close via Escape — inner button has focus, use it for trial click
		await innerButton.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('status')).toHaveText('closed');
	});

	test('alternating mouse and keyboard open/close cycles work correctly', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/128-testing-keyboard-mouse-interleaving.tsx')
		>('design-system', 'top-layer', 'testing-keyboard-mouse-interleaving');

		const trigger = page.getByTestId('trigger');

		// Cycle 1: mouse open → keyboard close
		await trigger.click();
		const content = page.getByTestId('popover-content');
		await expect(content).toBeVisible();
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();

		// Cycle 2: keyboard open → mouse close
		// trigger.focus() guarantees focus; toBeFocused() confirms it
		await trigger.focus();
		await expect(trigger).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(content).toBeVisible();
		await page.mouse.click(0, 0);
		await expect(content).toBeHidden();

		// Cycle 3: mouse open → keyboard close again (verify no state drift)
		await trigger.click();
		await expect(content).toBeVisible();
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();

		await expect(page.getByTestId('status')).toHaveText('closed');
	});
});
