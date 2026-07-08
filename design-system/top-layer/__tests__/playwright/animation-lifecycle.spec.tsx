/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

function hasRunningCssAnimation({ selector }: { selector: string }): boolean {
	const element = document.querySelector(selector);
	if (!element) {
		return false;
	}

	return element.getAnimations({ subtree: true }).some((animation) => {
		const timing = animation.effect?.getComputedTiming();
		const animationName = 'animationName' in animation ? animation.animationName : '';
		return (
			typeof animationName === 'string' &&
			animationName !== '' &&
			animationName !== 'none' &&
			animation.playState === 'running' &&
			timing?.iterations !== Infinity
		);
	});
}

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

		// Close via Escape - trial click on trigger (interactive button, always stable)
		await trigger.click({ trial: true });
		await page.keyboard.press('Escape');

		// The popover element should still exist in the DOM immediately after close
		// (exit animation should be in progress, not instant removal).
		// We check that the popover element has not been removed from DOM yet
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

/**
 * These tests ensure that a valid CSS animation is actually being applied for the preset animations
 */
test.describe('Animation lifecycle - CSS animation presence', () => {
	test('testing-popover-animation has entry animation', async ({ page, skipAxeCheck }) => {
		// Can produce false positives because of the artificially long animation duration
		skipAxeCheck();

		await page.visitExample<typeof import('../../examples/115-testing-popover-animation.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-animation',
		);

		await page.addStyleTag({
			content: `
				[data-ds-popover-popup-motion],
				[data-ds-popover-popup-motion]:popover-open {
					animation-duration: 100s !important;
				}
			`,
		});

		await page.getByTestId('popover-trigger').click();

		expect(
			await page.evaluate(hasRunningCssAnimation, { selector: '[data-ds-popover-popup-motion]' }),
		).toBe(true);
	});

	test('basic-dialog has entry animation', async ({ page, skipAxeCheck }) => {
		// Can produce false positives because of the artificially long animation duration
		skipAxeCheck();

		await page.visitExample<typeof import('../../examples/04-basic-dialog.tsx')>(
			'design-system',
			'top-layer',
			'basic-dialog',
		);

		await page.addStyleTag({
			content: `
				[data-ds-dialog-motion],
				[data-ds-dialog-motion][open],
				[data-ds-dialog-motion]::backdrop,
				[data-ds-dialog-motion][open]::backdrop {
					animation-duration: 100s !important;
				}
			`,
		});

		await page.getByRole('button', { name: 'Open dialog' }).click();

		expect(
			await page.evaluate(hasRunningCssAnimation, { selector: '[data-ds-dialog-motion]' }),
		).toBe(true);
	});

	test.describe('exit animation checks', () => {
		// Firefox does not yet support transitions on the `display` property using the `allow-discrete` keyword
		// So the popover / dialog immediately disappears on unmount and exit animations do not apply
		test.fixme(
			({ browserName }) => browserName === 'firefox',
			'Firefox does not yet support allow-discrete for display, so exit animations do not run',
		);

		test('testing-popover-animation has exit animation', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/115-testing-popover-animation.tsx')>(
				'design-system',
				'top-layer',
				'testing-popover-animation',
			);

			await page.addStyleTag({
				content: `
					[data-ds-popover-popup-motion],
					[data-ds-popover-popup-motion]:popover-open {
						animation-duration: 100s !important;
					}
				`,
			});

			const trigger = page.getByTestId('popover-trigger');
			await trigger.click();
			await trigger.click();

			expect(
				await page.evaluate(hasRunningCssAnimation, { selector: '[data-ds-popover-popup-motion]' }),
			).toBe(true);
		});

		test('basic-dialog has exit animation', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/04-basic-dialog.tsx')>(
				'design-system',
				'top-layer',
				'basic-dialog',
			);

			await page.addStyleTag({
				content: `
					[data-ds-dialog-motion],
					[data-ds-dialog-motion][open],
					[data-ds-dialog-motion]::backdrop,
					[data-ds-dialog-motion][open]::backdrop {
						animation-duration: 100s !important;
					}
				`,
			});

			await page.getByRole('button', { name: 'Open dialog' }).click();
			await page.getByRole('button', { name: 'Close' }).click();

			expect(
				await page.evaluate(hasRunningCssAnimation, { selector: '[data-ds-dialog-motion]' }),
			).toBe(true);
		});
	});
});

test.describe('Animation lifecycle - animation callbacks', () => {
	// Verifies that onEnterFinish and onExitFinish fire after real CSS transitionend
	// events in a real browser. This cannot be tested in JSDOM (which has no CSS
	// transitions) so it lives here in Playwright.
	test('onEnterFinish fires after entry animation, not before', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/127-testing-animation-callbacks.tsx')>(
			'design-system',
			'top-layer',
			'testing-animation-callbacks',
		);

		const enterCount = page.getByTestId('enter-count');

		await expect(enterCount).toHaveText('0');

		// Open the popup - entry animation begins
		await page.getByTestId('popover-trigger').click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Immediately after click the animation has just started - not fired yet
		await expect(enterCount).toHaveText('0');

		// Wait for entry animation to complete (slideAndFade: 350ms + CI headroom)
		await expect(enterCount).toHaveText('1', { timeout: 2000 });
	});

	test('onExitFinish fires after exit animation, not before', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/127-testing-animation-callbacks.tsx')>(
			'design-system',
			'top-layer',
			'testing-animation-callbacks',
		);

		const trigger = page.getByTestId('popover-trigger');
		const exitCount = page.getByTestId('exit-count');

		// Open the popup and wait for it to be visible
		await trigger.click();
		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Close the popup - exit animation begins
		await trigger.click();

		// Immediately after close the animation has just started - not fired yet
		await expect(exitCount).toHaveText('0');

		// Wait for exit animation to complete (slideAndFade: 350ms + CI headroom)
		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(exitCount).toHaveText('1', { timeout: 2000 });
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

	test('prefers-reduced-motion: reduce - popover closes instantly', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.visitExample<
			typeof import('../../examples/126-testing-animation-reduced-motion.tsx')
		>('design-system', 'top-layer', 'testing-animation-reduced-motion');

		const trigger = page.getByTestId('popover-trigger');
		await trigger.click();

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Close via Escape - trial click on trigger (interactive button, always stable)
		await trigger.click({ trial: true });
		// Close the popover - should close instantly with reduced motion
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('status')).toHaveText('closed');
	});
});
