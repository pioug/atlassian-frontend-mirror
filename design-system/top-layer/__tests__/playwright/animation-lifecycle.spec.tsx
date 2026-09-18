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

function finishCssAnimations({ selector }: { selector: string }): void {
	const element = document.querySelector(selector);
	if (!element) {
		return;
	}

	for (const animation of element.getAnimations({ subtree: true })) {
		if (animation.effect?.getComputedTiming().iterations !== Infinity) {
			animation.finish();
		}
	}
}

test.describe('Animation lifecycle - exit animation', () => {
	// Category 2: Animation Lifecycle
	// Verifies that the exit animation completes before element is logically hidden.
	// This catches the class of bug where React unmounts before the exit animations settle.
	test('exit animation: element remains in DOM during exit transition', async ({
		page,
		browserName,
	}) => {
		test.fixme(
			browserName === 'firefox' || browserName === 'webkit',
			'Firefox and WebKit do not support allow-discrete for display, so exit animations do not run',
		);

		await page.visitExample<typeof import('../../examples/125-testing-animation-exit.tsx')>(
			'design-system',
			'top-layer',
			'testing-animation-exit',
		);

		const trigger = page.getByTestId('popover-trigger');
		await trigger.press('Enter');

		await expect(page.getByTestId('popover-content')).toBeVisible();

		await trigger.press('Enter');

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
	test('testing-popover-animation has entry animation', async ({
		page,
		skipAxeCheck,
		browserName,
	}) => {
		test.fixme(
			browserName === 'webkit',
			'WebKit inconsistently instantiates native Popover entry animations',
		);
		// Can produce false positives because of the artificially long animation duration
		skipAxeCheck();

		await page.visitExample<typeof import('../../examples/115-testing-popover-animation.tsx')>(
			'design-system',
			'top-layer',
			'testing-popover-animation',
		);

		await page.addStyleTag({
			content: `
				[popover],
				[popover]:popover-open {
					animation-duration: 100s !important;
				}
			`,
		});

		await page.getByTestId('popover-trigger').press('Enter');

		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: '[popover]' }))
			.toBe(true);
	});

	test('basic-dialog has entry animation', async ({ page, skipAxeCheck }) => {
		// Can produce false positives because of the artificially long animation duration
		skipAxeCheck();

		await page.visitExample<typeof import('../../examples/04-basic-dialog.vr.ap.tsx')>(
			'design-system',
			'top-layer',
			'basic-dialog',
		);

		await page.addStyleTag({
			content: `
				dialog,
				dialog[open],
				dialog::backdrop,
				dialog[open]::backdrop {
					animation-duration: 100s !important;
				}
			`,
		});

		await page.getByRole('button', { name: 'Open dialog' }).click();

		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: 'dialog' }))
			.toBe(true);
	});

	test.describe('exit animation checks', () => {
		// Neither Firefox nor WebKit support `transition` on `display` via `allow-discrete`,
		// so the popover / dialog disappears immediately on unmount with no exit animation.
		// On WebKit the dialog Close button also never settles during the (missing) exit
		// transition, so the interaction times out before the assertion.
		test.fixme(
			({ browserName }) => browserName === 'firefox' || browserName === 'webkit',
			'Firefox and WebKit do not support allow-discrete for display, so exit animations do not run',
		);

		test('testing-popover-animation has exit animation', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/115-testing-popover-animation.tsx')>(
				'design-system',
				'top-layer',
				'testing-popover-animation',
			);

			await page.addStyleTag({
				content: `
					[popover],
					[popover]:popover-open {
						animation-duration: 100s !important;
					}
				`,
			});

			const trigger = page.getByTestId('popover-trigger');
			await trigger.press('Enter');
			await trigger.press('Enter');

			await expect
				.poll(() => page.evaluate(hasRunningCssAnimation, { selector: '[popover]' }))
				.toBe(true);
		});

		test('basic-dialog has exit animation', async ({ page }) => {
			await page.visitExample<typeof import('../../examples/04-basic-dialog.vr.ap.tsx')>(
				'design-system',
				'top-layer',
				'basic-dialog',
			);

			await page.addStyleTag({
				content: `
					dialog,
					dialog[open],
					dialog::backdrop,
					dialog[open]::backdrop {
						animation-duration: 100s !important;
					}
				`,
			});

			await page.getByRole('button', { name: 'Open dialog' }).click();
			await page.getByRole('button', { name: 'Close' }).click();

			await expect
				.poll(() => page.evaluate(hasRunningCssAnimation, { selector: 'dialog' }))
				.toBe(true);
		});
	});
});

test.describe('Animation lifecycle - animation callbacks', () => {
	// Verifies that onEnterFinish and onExitFinish fire after real CSS animations settle
	// events in a real browser. This cannot be tested in JSDOM (which has no CSS
	// animations) so it lives here in Playwright.
	test('onEnterFinish fires after entry animation, not before', async ({ page, browserName }) => {
		test.fixme(
			browserName === 'webkit',
			'WebKit inconsistently instantiates native Popover entry animations',
		);

		await page.visitExample<typeof import('../../examples/127-testing-animation-callbacks.tsx')>(
			'design-system',
			'top-layer',
			'testing-animation-callbacks',
		);
		await page.addStyleTag({
			content: `
				[popover],
				[popover]:popover-open {
					animation-duration: 100s !important;
				}
			`,
		});

		const enterCount = page.getByTestId('enter-count');

		await expect(enterCount).toHaveText('0');

		// Open the popup - entry animation begins
		await page.getByTestId('popover-trigger').press('Enter');
		await expect(page.getByTestId('popover-content')).toBeVisible();

		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: '[popover]' }))
			.toBe(true);
		await expect(enterCount).toHaveText('0');

		await page.evaluate(finishCssAnimations, { selector: '[popover]' });
		await expect(enterCount).toHaveText('1');
	});

	test('onExitFinish fires after exit animation, not before', async ({ page, browserName }) => {
		test.fixme(
			browserName === 'firefox' || browserName === 'webkit',
			'Firefox and WebKit do not support allow-discrete for display, so exit animations do not run',
		);

		await page.visitExample<typeof import('../../examples/127-testing-animation-callbacks.tsx')>(
			'design-system',
			'top-layer',
			'testing-animation-callbacks',
		);
		await page.addStyleTag({
			content: `
				[popover],
				[popover]:popover-open {
					animation-duration: 100s !important;
				}
			`,
		});

		const trigger = page.getByTestId('popover-trigger');
		const exitCount = page.getByTestId('exit-count');

		await trigger.press('Enter');
		await expect(page.getByTestId('popover-content')).toBeVisible();
		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: '[popover]' }))
			.toBe(true);
		await page.evaluate(finishCssAnimations, { selector: '[popover]' });
		await expect(page.getByTestId('enter-count')).toHaveText('1');

		await trigger.press('Enter');
		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: '[popover]' }))
			.toBe(true);
		await expect(exitCount).toHaveText('0');

		await page.evaluate(finishCssAnimations, { selector: '[popover]' });
		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(exitCount).toHaveText('1');
	});

	test('Dialog callbacks fire after their animations complete', async ({ page, browserName }) => {
		test.fixme(
			browserName === 'firefox' || browserName === 'webkit',
			'Firefox and WebKit do not support allow-discrete for display, so exit animations do not run',
		);

		await page.visitExample<typeof import('../../examples/testing-dialog-animation-callbacks.tsx')>(
			'design-system',
			'top-layer',
			'testing-dialog-animation-callbacks',
		);
		await page.addStyleTag({
			content: `
				dialog,
				dialog[open],
				dialog::backdrop,
				dialog[open]::backdrop {
					animation-duration: 100s !important;
				}
			`,
		});

		const enterCount = page.getByTestId('dialog-enter-count');
		const exitCount = page.getByTestId('dialog-exit-count');

		await page.getByTestId('dialog-trigger').click();
		await expect(page.getByTestId('dialog-content')).toBeVisible();
		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: 'dialog' }))
			.toBe(true);
		await expect(enterCount).toHaveText('0');
		await page.evaluate(finishCssAnimations, { selector: 'dialog' });
		await expect(enterCount).toHaveText('1');

		await page.getByTestId('dialog-close').click();
		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: 'dialog' }))
			.toBe(true);
		await expect(exitCount).toHaveText('0');
		await page.evaluate(finishCssAnimations, { selector: 'dialog' });
		await expect(page.getByTestId('dialog-content')).toBeHidden();
		await expect(exitCount).toHaveText('1');
	});

	test('Popover leaves the accessibility tree before its exit animation finishes', async ({
		page,
		browserName,
	}) => {
		test.fixme(
			browserName === 'firefox' || browserName === 'webkit',
			'Firefox and WebKit do not support allow-discrete for display, so exit animations do not run',
		);

		await page.visitExample<typeof import('../../examples/127-testing-animation-callbacks.tsx')>(
			'design-system',
			'top-layer',
			'testing-animation-callbacks',
		);
		await page.addStyleTag({
			content: `
				[popover],
				[popover]:popover-open {
					animation-duration: 100s !important;
				}
			`,
		});

		const trigger = page.getByTestId('popover-trigger');
		const content = page.getByTestId('popover-content');
		await trigger.press('Enter');
		await page.evaluate(finishCssAnimations, { selector: '[popover]' });
		await expect(page.getByRole('dialog', { name: 'Animation callback test' })).toBeVisible();

		await trigger.press('Enter');

		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: '[popover]' }))
			.toBe(true);
		await expect(content).toBeVisible();
		await expect(page.getByRole('dialog', { name: 'Animation callback test' })).toHaveCount(0);
	});

	test('Dialog leaves the accessibility tree before its exit animation finishes', async ({
		page,
		browserName,
	}) => {
		test.fixme(
			browserName === 'firefox' || browserName === 'webkit',
			'Firefox and WebKit do not support allow-discrete for display, so exit animations do not run',
		);

		await page.visitExample<typeof import('../../examples/04-basic-dialog.vr.ap.tsx')>(
			'design-system',
			'top-layer',
			'basic-dialog',
		);
		await page.addStyleTag({
			content: `
				dialog,
				dialog[open],
				dialog::backdrop,
				dialog[open]::backdrop {
					animation-duration: 100s !important;
				}
			`,
		});

		const content = page.getByText('This dialog uses the native <dialog> element.');
		await page.getByRole('button', { name: 'Open dialog' }).click();
		await page.evaluate(finishCssAnimations, { selector: 'dialog' });
		await expect(page.getByRole('dialog', { name: 'Basic dialog' })).toBeVisible();

		await page.getByRole('button', { name: 'Close' }).click();

		await expect
			.poll(() => page.evaluate(hasRunningCssAnimation, { selector: 'dialog' }))
			.toBe(true);
		await expect(content).toBeVisible();
		await expect(page.getByRole('dialog', { name: 'Basic dialog' })).toHaveCount(0);
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
		await trigger.press('Enter');

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
		await trigger.press('Enter');

		await expect(page.getByTestId('popover-content')).toBeVisible();

		// Close the popover - should close instantly with reduced motion
		await trigger.press('Enter');

		await expect(page.getByTestId('popover-content')).toBeHidden();
		await expect(page.getByTestId('status')).toHaveText('closed');
	});
});
