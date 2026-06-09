/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('useSimpleLightDismiss', () => {
	// WCAG 2.1.2 No Keyboard Trap - Escape always dismisses
	test('closes on Escape and reports reason as "escape"', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/119-testing-simple-light-dismiss.tsx')>(
			'design-system',
			'top-layer',
			'testing-simple-light-dismiss',
		);

		const trigger = page.getByTestId('trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// useSimpleLightDismiss handles Escape at document level — trial click on trigger
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('escape');
	});

	test('closes on click outside and reports reason as "light-dismiss"', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/119-testing-simple-light-dismiss.tsx')>(
			'design-system',
			'top-layer',
			'testing-simple-light-dismiss',
		);

		const trigger = page.getByTestId('trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.getByTestId('outside-button').click();

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('close-reason')).toHaveText('light-dismiss');
	});

	test('does not close when clicking inside the popover', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/119-testing-simple-light-dismiss.tsx')>(
			'design-system',
			'top-layer',
			'testing-simple-light-dismiss',
		);

		const trigger = page.getByTestId('trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await page.getByTestId('inner-button').click();

		await expect(page.getByTestId('popover-content')).toBeVisible();
		await expect(page.getByTestId('close-count')).toHaveText('0');
	});

	test('does not fire dismiss events when popover is closed', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/119-testing-simple-light-dismiss.tsx')>(
			'design-system',
			'top-layer',
			'testing-simple-light-dismiss',
		);

		// Don't open the popover — just press Escape and click outside
		await page.keyboard.press('Escape');
		await page.getByTestId('outside-button').click();

		await expect(page.getByTestId('close-count')).toHaveText('0');
	});

	test('can be reopened after dismiss', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/119-testing-simple-light-dismiss.tsx')>(
			'design-system',
			'top-layer',
			'testing-simple-light-dismiss',
		);

		const trigger = page.getByTestId('trigger');

		// Open and dismiss with Escape — trial click on trigger (interactive button, always stable)
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(page.getByTestId('popover-content')).toBeHidden();

		// Reopen and dismiss with click outside
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();
		await page.getByTestId('outside-button').click();
		await expect(page.getByTestId('popover-content')).toBeHidden();

		await expect(page.getByTestId('close-count')).toHaveText('2');
	});

	test('non-Escape keys do not dismiss', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/119-testing-simple-light-dismiss.tsx')>(
			'design-system',
			'top-layer',
			'testing-simple-light-dismiss',
		);

		const trigger = page.getByTestId('trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// These keys must NOT dismiss — trial click on trigger (interactive button)
		await trigger.click({ trial: true });
		await page.keyboard.press('Enter');
		await page.keyboard.press('Tab');
		await page.keyboard.press('a');

		await expect(page.getByTestId('popover-content')).toBeVisible();
		await expect(page.getByTestId('close-count')).toHaveText('0');
	});
});
