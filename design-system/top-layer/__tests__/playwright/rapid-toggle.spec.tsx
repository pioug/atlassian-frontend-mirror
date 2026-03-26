/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Popup - rapid toggle', () => {
	test('rapid toggling does not leave popover stuck open or closed', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/118-testing-popover-rapid-toggle.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-rapid-toggle',
		);

		const trigger = page.getByTestId('popover-trigger');
		const content = page.getByTestId('popover-content');

		// Rapidly click the trigger multiple times
		await trigger.click();
		await trigger.click();
		await trigger.click();
		await trigger.click();

		// After 4 clicks (even number), the popover should be closed
		await expect(content).toBeHidden();

		// Verify click count was tracked correctly
		await expect(page.getByTestId('click-count')).toHaveText('4');
	});

	test('popover is visible after odd number of rapid clicks', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/118-testing-popover-rapid-toggle.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-rapid-toggle',
		);

		const trigger = page.getByTestId('popover-trigger');
		const content = page.getByTestId('popover-content');

		// Rapidly click the trigger an odd number of times
		await trigger.click();
		await trigger.click();
		await trigger.click();

		// After 3 clicks (odd number), the popover should be open
		await expect(content).toBeVisible();
	});

	test('popover can be opened normally after rapid toggling', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/118-testing-popover-rapid-toggle.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-rapid-toggle',
		);

		const trigger = page.getByTestId('popover-trigger');
		const content = page.getByTestId('popover-content');

		// Rapid toggle sequence
		await trigger.click();
		await trigger.click();
		await trigger.click();
		await trigger.click();

		// After even number of clicks, should be closed
		await expect(content).toBeHidden();

		// Now open normally and verify it works
		await trigger.click();
		await expect(content).toBeVisible();

		// Close normally via Escape
		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
	});

	test('rapid toggle does not cause multiple popovers to be visible', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/118-testing-popover-rapid-toggle.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-rapid-toggle',
		);

		const trigger = page.getByTestId('popover-trigger');

		// Rapid clicks
		await trigger.click();
		await trigger.click();
		await trigger.click();

		// There should be at most one visible popover element in the DOM
		const visiblePopovers = await page.evaluate(() => {
			const popovers = document.querySelectorAll('[popover]');
			return Array.from(popovers).filter((el) => el.matches(':popover-open')).length;
		});

		expect(visiblePopovers).toBeLessThanOrEqual(1);
	});
});
