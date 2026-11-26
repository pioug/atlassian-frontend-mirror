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

/**
 * As on the legacy path, a pick and Tab do not ask a controlled `PopupSelect` to close. The consumer
 * decides, for example a multi-value picker stays open after a pick.
 */
test.describe('PopupSelect top-layer: a pick and Tab with a controlled isOpen', () => {
	// The popup keeps focus, except that `react-select` blurs the input on a pick in a touch-capable
	// engine (WebKit here), so only the trigger is checked.
	test('a pick does not ask to close, and does not move focus to the trigger', async ({ page }) => {
		await openByKeyboard({ page });

		await page.keyboard.press('Enter');

		await expect(page.getByTestId('close-log')).toHaveText('change');
		await expect(getPopup({ page })).toBeVisible();
		await expect(page.getByTestId('trigger')).not.toBeFocused();
	});

	test('Tab does not ask to close, and focus stays in the popup', async ({ page }) => {
		await openByKeyboard({ page });

		await page.keyboard.press('Tab');

		await expect(getPopup({ page })).toBeVisible();
		await expect(page.getByRole('combobox')).toBeFocused();
		await expect(page.getByTestId('close-log')).toHaveText('');
	});

	test('a pick that the consumer closes on returns focus to the trigger', async ({ page }) => {
		await page.getByTestId('close-on-pick').click();
		await openByKeyboard({ page });

		await page.keyboard.press('Enter');

		await expect(page.getByTestId('close-log')).toHaveText('change');
		await expect(getPopup({ page })).toBeHidden();
		await expect(page.getByTestId('trigger')).toBeFocused();
	});
});
