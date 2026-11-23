import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

/**
 * Smoke test: on the top layer, a controlled `PopupSelect` asks `onClose` first, and closes only
 * when `isOpen` becomes `false`. `@atlaskit/top-layer` covers the behaviour in full, in all
 * browsers (`manual-ask-first-close.spec.tsx`). See `@atlaskit/top-layer`
 * `notes/decisions/wrappers-ask-first-close.md`.
 */

test.beforeEach(async ({ page, skipAxeCheck }) => {
	skipAxeCheck();
	// No entry animation, so the popup is visible as soon as it opens.
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.visitExample<
		typeof import('../../../../../../examples/96-testing-popup-select-ask-first-close.tsx')
	>('design-system', 'select', 'testing-popup-select-ask-first-close', { featureFlag });
});

function getPopup({ page }: { page: Page }) {
	return page.getByTestId('popup-select--content');
}

/**
 * Opens by keyboard, so the trigger had focus at open in every browser (Safari does not focus a
 * button on click).
 */
async function openByKeyboard({ page }: { page: Page }) {
	await page.getByTestId('trigger').focus();
	await page.keyboard.press('ArrowDown');
	await expect(getPopup({ page })).toBeVisible();
}

test.describe('PopupSelect top-layer: ask first on close', () => {
	test('an outside press that onClose refuses keeps the popup open and visible', async ({
		page,
	}) => {
		await page.getByTestId('refuse').click();
		await openByKeyboard({ page });

		await page.getByTestId('outside').click();

		await expect(page.getByTestId('close-log')).toHaveText('close');
		await expect(getPopup({ page })).toBeVisible();
	});

	test('an accepted Escape closes the popup, and focus returns to the trigger', async ({
		page,
	}) => {
		await openByKeyboard({ page });

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('close-log')).toHaveText('close');
		await expect(getPopup({ page })).toBeHidden();
		await expect(page.getByTestId('trigger')).toBeFocused();
	});
});
