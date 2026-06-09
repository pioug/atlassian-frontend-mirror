/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

/**
 * `getFocusables` must filter nested top-layer descendants out of the
 * outer popover's Tab cycle. The nested popover owns its own focus scope.
 *
 * Steps:
 *   1. Open the outer dialog.
 *   2. Open then close the inner popover so its `[popover]` is mounted
 *      but no longer the active trap.
 *   3. Tab through the outer cycle and assert `inner-button` is never
 *      visited.
 */
test.describe('Popup - nested top-layer focus scope', () => {
	test('outer Tab cycle excludes nested popover focusables', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/135-testing-nested-focus-scope.tsx')>(
			'design-system',
			'top-layer',
			'testing-nested-focus-scope',
		);

		await page.getByTestId('outer-trigger').click();
		await expect(page.getByTestId('outer-popover')).toBeVisible();

		// Open then immediately close the inner so the [popover] element is
		// in the DOM and its `inner-button` exists, but the inner is not
		// trapping focus during the test.
		await page.getByTestId('inner-trigger').click();
		await expect(page.getByTestId('inner-popover')).toBeVisible();
		// The inner popover is `mode="manual"` so it does not light-dismiss on
		// outside clicks. Call `hidePopover()` directly to move it to hidden state
		// without disturbing focus or interacting with other elements.
		await page.evaluate(() => {
			const inner = document.querySelector('[data-testid="inner-popover"]');
			const popover = inner?.closest('[popover]') as HTMLElement | null;
			if (popover && 'hidePopover' in popover) {
				popover.hidePopover();
			}
		});
		await expect(page.getByTestId('inner-popover')).toBeHidden();

		// Focus to the start of the outer cycle.
		await page.getByTestId('outer-button-a').focus();
		await expect(page.getByTestId('outer-button-a')).toBeFocused();

		// Tab through the outer cycle several times and collect what gets
		// focused. inner-button MUST NEVER appear.
		const visited: Array<string | null> = [];
		for (const _ of Array.from({ length: 6 })) {
			await page.keyboard.press('Tab');
			const id = await page.evaluate(
				() => document.activeElement?.getAttribute('data-testid') ?? null,
			);
			visited.push(id);
		}

		expect(visited).not.toContain('inner-button');
		// Outer cycle should hit outer-button-b at least once.
		expect(visited).toContain('outer-button-b');
	});
});
