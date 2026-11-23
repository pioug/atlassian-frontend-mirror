import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

/**
 * Smoke test: on the top layer, `InlineDialog` asks `onClose` first, and closes only when `isOpen`
 * becomes `false`. `@atlaskit/top-layer` covers the behaviour in full, in all browsers
 * (`manual-ask-first-close.spec.tsx`). See `@atlaskit/top-layer`
 * `notes/decisions/wrappers-ask-first-close.md`.
 */

test.beforeEach(async ({ page, skipAxeCheck }) => {
	skipAxeCheck();
	// No entry animation, so the dialog is visible as soon as it opens.
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.visitExample<typeof import('../../../../../examples/98-testing-ask-first-close.tsx')>(
		'design-system',
		'inline-dialog',
		'testing-ask-first-close',
		{ featureFlag },
	);
});

/**
 * Opens by keyboard, so the trigger had focus at open in every browser (Safari does not focus a
 * button on click).
 */
async function openByKeyboard({ page }: { page: Page }) {
	await page.getByTestId('trigger').focus();
	await page.keyboard.press('Enter');
	await expect(page.getByTestId('inline-dialog')).toBeVisible();
	await expect(page.getByTestId('inside')).toBeFocused();
}

test.describe('InlineDialog top-layer: ask first on close', () => {
	test('an outside press that onClose refuses keeps the dialog open and visible', async ({
		page,
	}) => {
		await page.getByTestId('refuse').click();
		await openByKeyboard({ page });

		await page.getByTestId('outside').click();

		await expect(page.getByTestId('close-log')).toHaveText('outside-press');
		await expect(page.getByTestId('inline-dialog')).toBeVisible();
	});

	test('an accepted Escape closes the dialog, and focus returns to the trigger', async ({
		page,
	}) => {
		await openByKeyboard({ page });

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('close-log')).toHaveText('escape');
		await expect(page.getByTestId('inline-dialog')).toBeHidden();
		await expect(page.getByTestId('trigger')).toBeFocused();
	});
});
