import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

/**
 * Smoke test: on the top layer, `Popup` asks `onClose` first, and closes only when `isOpen`
 * becomes `false`. `@atlaskit/top-layer` covers the behaviour in full, in all browsers
 * (`manual-ask-first-close.spec.tsx`). See `@atlaskit/top-layer`
 * `notes/decisions/wrappers-ask-first-close.md`.
 */

test.beforeEach(async ({ page, skipAxeCheck }) => {
	skipAxeCheck();
	// No entry animation, so the popup is visible as soon as it opens.
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.visitExample<typeof import('../../../../../examples/99-testing-ask-first-close.tsx')>(
		'design-system',
		'popup',
		'testing-ask-first-close',
		{ featureFlag },
	);
});

function getPopup({ page }: { page: Page }) {
	return page.getByTestId('popup--container');
}

/**
 * Opens by keyboard, so the trigger had focus at open in every browser (Safari does not focus a
 * button on click).
 */
async function openByKeyboard({ page }: { page: Page }) {
	await page.getByTestId('trigger').focus();
	await page.keyboard.press('Enter');
	await expect(getPopup({ page })).toBeVisible();
	await expect(page.getByTestId('inside')).toBeFocused();
}

test.describe('Popup top-layer: ask first on close', () => {
	test('an outside press that onClose refuses keeps the popup open and visible', async ({
		page,
	}) => {
		await page.getByTestId('refuse').click();
		await openByKeyboard({ page });

		await page.getByTestId('outside').click();

		await expect(page.getByTestId('close-log')).toHaveText('outside-press');
		await expect(getPopup({ page })).toBeVisible();
		await expect(page.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
	});

	test('an accepted Escape closes the popup, and focus returns to the trigger', async ({
		page,
	}) => {
		await openByKeyboard({ page });

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('close-log')).toHaveText('escape');
		await expect(getPopup({ page })).toBeHidden();
		await expect(page.getByTestId('trigger')).toBeFocused();
	});
});
