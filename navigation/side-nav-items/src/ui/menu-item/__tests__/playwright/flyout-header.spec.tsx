/* eslint-disable playwright/no-standalone-expect -- Navigation requires the it alias, which this rule does not recognize. */
/* eslint-disable testing-library/prefer-screen-queries -- These are Playwright page locators, not Testing Library render queries. */

import { expect, type Page, test as it } from '@af/integration-testing';

it.afterEach(async ({ page }) => {
	// Automatic accessibility checks need running timers during page teardown.
	await page.clock.resume();
});

for (const topLayer of [false, true]) {
	it.describe(`FlyoutHeader with ${topLayer ? 'top-layer' : 'legacy popup'}`, () => {
		it('should focus Close after loading without controls and restore the trigger on Close', async ({
			page,
		}) => {
			const { trigger, dialog, closeButton, initialFocus } = await setupComponent(page, {
				topLayer,
			});

			await expect(initialFocus).toBeFocused();
			await expect(closeButton).toBeHidden();
			await page.clock.runFor(1000);

			await expect(closeButton).toBeFocused();
			await expect(dialog).toHaveAccessibleName('Recent');
			await closeButton.click();
			await page.clock.runFor(100);
			await expect(dialog).toBeHidden();
			await expect(trigger).toBeFocused();
		});

		const delayedFocusBehavior = topLayer
			? 'should preserve automatically focused Search when the delayed header arrives'
			: 'should move focus from the popup container to the delayed Close button';
		it(delayedFocusBehavior, async ({ page }) => {
			const { trigger, dialog, closeButton, initialFocus, loadedFocus } = await setupComponent(
				page,
				{ topLayer, showSearchWhileLoading: true },
			);

			// No click, Tab, or focus call on Search: this must exercise popup-assigned focus.
			await expect(initialFocus).toBeFocused();
			await expect(closeButton).toBeHidden();
			await page.clock.runFor(1000);

			await expect(closeButton).toBeVisible();
			await expect(loadedFocus).toBeFocused();
			await closeButton.click();
			await page.clock.runFor(100);
			await expect(dialog).toBeHidden();
			await expect(trigger).toBeFocused();
		});

		it('should preserve typing across header loading and restore the trigger on Escape', async ({
			page,
		}) => {
			const { trigger, dialog, closeButton, search } = await setupComponent(page, {
				topLayer,
				showSearchWhileLoading: true,
			});

			await search.click();
			await page.keyboard.type('kan');
			await expect(closeButton).toBeHidden();
			await page.clock.runFor(1000);

			await expect(closeButton).toBeVisible();
			await expect(search).toBeFocused();
			await expect(search).toHaveValue('kan');
			await page.keyboard.type('ban');
			await expect(search).toBeFocused();
			await expect(search).toHaveValue('kanban');

			await page.keyboard.press('Escape');
			await page.clock.runFor(100);
			await expect(dialog).toBeHidden();
			await expect(trigger).toBeFocused();
		});
	});
}

async function setupComponent(
	page: Page,
	{
		topLayer,
		showSearchWhileLoading = false,
	}: {
		/** Keeps Search mounted while the header loads. */
		showSearchWhileLoading?: boolean;
		/** Selects the popup implementation under test. */
		topLayer: boolean;
	},
) {
	await page.visitExample<
		typeof import('../../../../../examples/flyout-menu-item-lazy-loaded-content-focus.tsx')
	>('navigation', 'side-nav-items', 'flyout-menu-item-lazy-loaded-content-focus', {
		...(topLayer ? { featureFlag: 'platform-dst-top-layer' } : {}),
		showSearchWhileLoading: String(showSearchWhileLoading),
	});

	// Control the example's one-second load without racing user interaction against real time.
	await page.clock.install({ time: '2026-01-01T00:00:00Z' });
	await page.clock.pauseAt('2026-01-01T00:00:01Z');
	const trigger = page.getByRole('button', { name: 'Toggle flyout' });
	const dialog = page.getByRole('dialog', { name: 'Recent' });
	const closeButton = page.getByRole('button', { name: 'Close menu' });
	const search = page.getByRole('textbox', { name: 'Search recent items' });

	await trigger.focus();
	await page.keyboard.press('Enter');
	await page.clock.runFor(100);
	await expect(dialog).toBeVisible();

	return {
		trigger,
		dialog,
		closeButton,
		search,
		initialFocus: topLayer ? (showSearchWhileLoading ? search : trigger) : dialog,
		// Legacy initially focuses its container; top-layer initially focuses Search.
		loadedFocus: topLayer && showSearchWhileLoading ? search : closeButton,
	};
}
