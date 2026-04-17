/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

// ─────────────────────────────────────────────────────────────────────────────
// Popup - rapid toggle
//
// Validates that rapid open/close sequences don't corrupt popover state.
// Two tests:
//  1. Even/odd clicks produce predictable open state (no stuck state, no ghost)
//  2. Recovery: popover works normally after rapid toggling
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Popup - rapid toggle', () => {
	// Verifies that the open/closed state matches click parity and that no
	// ghost popovers accumulate in the DOM during rapid interaction.
	test('rapid clicks: even number closes, odd number opens, no ghost popovers', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/118-testing-popover-rapid-toggle.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-rapid-toggle',
		);

		const trigger = page.getByTestId('popover-trigger');
		const content = page.getByTestId('popover-content');

		// 3 rapid clicks → open (odd)
		await trigger.click();
		await trigger.click();
		await trigger.click();
		await expect(content).toBeVisible();
		await expect(page.getByTestId('click-count')).toHaveText('3');

		// 1 more click → closed (even total = 4)
		await trigger.click();
		await expect(content).toBeHidden();
		await expect(page.getByTestId('click-count')).toHaveText('4');

		// At most one popover element should be open in the DOM at any point
		const visiblePopovers = await page.evaluate(() =>
			Array.from(document.querySelectorAll('[popover]')).filter((el) =>
				el.matches(':popover-open'),
			).length,
		);
		expect(visiblePopovers).toBeLessThanOrEqual(1);
	});

	// After a rapid toggle sequence the popover must work normally —
	// open on click, dismiss on Escape, focus returns to trigger.
	test('popover recovers to normal behaviour after rapid toggling', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/118-testing-popover-rapid-toggle.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-rapid-toggle',
		);

		const trigger = page.getByTestId('popover-trigger');
		const content = page.getByTestId('popover-content');

		// Rapid toggle sequence (end on closed)
		await trigger.click();
		await trigger.click();
		await trigger.click();
		await trigger.click();
		await expect(content).toBeHidden();

		// Open normally
		await trigger.click();
		await expect(content).toBeVisible();

		// Close via Escape — run trial click on trigger for actionability before keypress
		await expect(trigger).toBeFocused();
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');
		await expect(content).toBeHidden();
	});
});
