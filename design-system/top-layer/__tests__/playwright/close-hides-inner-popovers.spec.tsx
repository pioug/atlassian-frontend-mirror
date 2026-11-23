import { expect, test } from '@af/integration-testing';

/**
 * When a `manual` `Popover` hides, the open popovers inside it close at once, as inside an `auto`
 * popover. Otherwise an inner popover stays in the top layer during the
 * outer exit, and takes the next Escape.
 *
 * Layers open by keyboard, so the trigger is the element that had focus at open in every browser.
 *
 * See notes/decisions/wrappers-ask-first-close.md.
 */

test.beforeEach(async ({ page }) => {
	await page.visitExample<
		typeof import('../../examples/175-testing-close-hides-inner-popovers.tsx')
	>('design-system', 'top-layer', 'testing-close-hides-inner-popovers');
});

test('closing the outer popover hides the inner popover, which then takes no Escape', async ({
	page,
}) => {
	await page.getByTestId('outer-trigger').focus();
	await page.keyboard.press('Enter');
	await page.getByTestId('inner-trigger').focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId('inner-layer')).toBeVisible();

	await page.getByTestId('close-outer').click();

	await expect(page.getByTestId('outer-layer')).toBeHidden();
	await expect(page.getByTestId('inner-layer')).toBeHidden();
	// The inner owner hears of the close, as for a light dismiss.
	await expect(page.getByTestId('log')).toHaveText('inner:light-dismiss');

	await page.keyboard.press('Escape');

	// No popover was left to take the Escape.
	await expect(page.getByTestId('log')).toHaveText('inner:light-dismiss');
});
