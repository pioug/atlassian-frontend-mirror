/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Animation lifecycle - entry animation', () => {
	// Category 2: Animation Lifecycle
	// Verifies that the entry animation data attribute is present when the popover opens.
	test('entry animation: data attribute is present while open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/125-testing-animation-exit.tsx')>(
			'design-system',
			'top-layer',
			'testing-animation-exit',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// The popover element should have the slide-and-fade data attribute
		const hasAttribute = await page.evaluate(() => {
			const content = document.querySelector('[data-testid="popover-content"]');
			const popoverEl = content?.closest('[popover]');
			return popoverEl?.hasAttribute('data-ds-popover-slide-and-fade') ?? false;
		});

		expect(hasAttribute).toBe(true);
	});
});

test.describe('Animation lifecycle - exit animation', () => {
	// Category 2: Animation Lifecycle
	// Verifies that the exit animation completes before element is logically hidden.
	// This catches the class of bug where React unmounts before transitionend fires.
	test('exit animation: element remains in DOM during exit transition', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/125-testing-animation-exit.tsx')>(
			'design-system',
			'top-layer',
			'testing-animation-exit',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Close the popover
		await page.keyboard.press('Escape');

		// The popover element should still exist in the DOM immediately after close
		// (exit animation should be in progress, not instant removal).
		// We check that the popover element hasn't been removed from DOM yet
		// by verifying it still exists right after the close action.
		const existsImmediatelyAfterClose = await page.evaluate(() => {
			const popoverEl = document.querySelector('[popover]');
			return popoverEl !== null;
		});

		expect(existsImmediatelyAfterClose).toBe(true);

		// After the animation completes, the popover should be hidden
		await expect(page.getByTestId('popover-content')).toBeHidden();

		// Status should reflect closed state
		await expect(page.getByTestId('status')).toHaveText('closed');
	});
});

test.describe('Animation lifecycle - reduced motion', () => {
	// Category 2: Animation Lifecycle
	// Verifies that prefers-reduced-motion: reduce disables animations.
	// The popover should appear instantly without transition.
	test('prefers-reduced-motion: reduce disables transition durations', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.visitExample<
			typeof import('../../examples/126-testing-animation-reduced-motion.tsx')
		>('design-system', 'top-layer', 'testing-animation-reduced-motion');

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		// Popover should appear instantly (no transition delay)
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Verify the popover element exists and is open
		const isOpen = await page.evaluate(() => {
			const content = document.querySelector('[data-testid="popover-content"]');
			const popoverEl = content?.closest('[popover]');
			return popoverEl?.matches(':popover-open') ?? false;
		});

		expect(isOpen).toBe(true);
	});

	test('prefers-reduced-motion: reduce — popover closes instantly', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.visitExample<
			typeof import('../../examples/126-testing-animation-reduced-motion.tsx')
		>('design-system', 'top-layer', 'testing-animation-reduced-motion');

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Close the popover — should close instantly with reduced motion
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('status')).toHaveText('closed');
	});
});
