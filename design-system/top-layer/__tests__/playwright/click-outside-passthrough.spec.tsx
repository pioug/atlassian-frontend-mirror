/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Interaction - click outside passthrough', () => {
	// Category 4: Interaction Patterns
	// Verifies that click-outside closes the popover AND the clicked element
	// still receives its click event. This catches stopPropagation bugs where
	// the light-dismiss handler eats the event.
	test('click-outside closes popover and the target element receives the click', async ({
		page,
	}) => {
		await page.visitExample(
			'design-system',
			'top-layer',
			'testing-click-outside-passthrough',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Click the outside button — this should BOTH close the popover
		// AND increment the outside button's click counter.
		await page.getByTestId('outside-button').click();

		// Popover should be closed
		await expect(page.getByTestId('popover-content')).toBeHidden();

		// The popover's onClose should have fired
		await expect(page.getByTestId('close-count')).toHaveText('1');

		// The outside button's onClick should ALSO have fired —
		// the light-dismiss must not swallow the event.
		await expect(page.getByTestId('outside-click-count')).toHaveText('1');
	});

	// Verify that multiple click-outside events work consistently
	test('repeated click-outside events are all received by target elements', async ({ page }) => {
		await page.visitExample(
			'design-system',
			'top-layer',
			'testing-click-outside-passthrough',
		);

		// Open and close via outside click — 3 times
		for (let i = 0; i < 3; i++) {
			await page.getByTestId('popover-trigger').click();
			await expect(page.getByTestId('popover-content')).toBeVisible();
			await page.getByTestId('outside-button').click();
			await expect(page.getByTestId('popover-content')).toBeHidden();
		}

		// All 3 outside clicks should have been registered
		await expect(page.getByTestId('outside-click-count')).toHaveText('3');
	});
});
