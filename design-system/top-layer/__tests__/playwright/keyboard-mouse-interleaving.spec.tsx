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

		// Close via keyboard Escape
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('status')).toHaveText('closed');
	});

	test('keyboard Enter opens, mouse click outside closes', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/128-testing-keyboard-mouse-interleaving.tsx')
		>('design-system', 'top-layer', 'testing-keyboard-mouse-interleaving');

		const trigger = page.getByTestId('trigger');

		// Open via keyboard Enter
		await trigger.focus();
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

		// Tab to inner button (keyboard interaction after mouse open)
		await page.keyboard.press('Tab');
		const innerButton = page.getByTestId('inner-button');
		await expect(innerButton).toBeFocused();

		// Close via Escape
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
		await expect(page.getByTestId('popover-content')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();

		// Cycle 2: keyboard open → mouse close
		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(page.getByTestId('popover-content')).toBeVisible();
		await page.mouse.click(0, 0);
		await expect(page.getByTestId('popover-content')).toBeHidden();

		// Cycle 3: mouse open → keyboard close again (verify no state drift)
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();

		await expect(page.getByTestId('status')).toHaveText('closed');
	});
});
