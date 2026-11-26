import { expect, type Page, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

/**
 * On the top layer, a `PopupSelect` that gets `isOpen` only while it is open (`true` or `undefined`)
 * is not controlled, as on the legacy path: a pick and Escape close it, and focus returns to the
 * trigger.
 */

test.beforeEach(async ({ page, skipAxeCheck }) => {
	skipAxeCheck();
	// No entry animation, so the popup is visible as soon as it opens.
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.visitExample<
		typeof import('../../../../../../examples/100-testing-popup-select-open-only.tsx')
	>('design-system', 'select', 'testing-popup-select-open-only', { featureFlag });
});

function getPopup({ page }: { page: Page }) {
	return page.getByTestId('popup-select--content');
}

/**
 * Opens with Enter, so the trigger click runs (it sets `isOpen`) and the trigger had focus at open in
 * every browser (Safari does not focus a button on click).
 */
async function openWithEnter({ page }: { page: Page }) {
	const trigger = page.getByTestId('trigger');
	await trigger.focus();
	await page.keyboard.press('Enter');
	await expect(getPopup({ page })).toBeVisible();
	await expect(trigger).toHaveAttribute('aria-expanded', 'true');
}

test.describe('PopupSelect top-layer: isOpen passed only while open', () => {
	test('a pick closes the popup, and focus returns to the trigger', async ({ page }) => {
		const trigger = page.getByTestId('trigger');
		await openWithEnter({ page });

		await page.getByText('Brisbane').click();

		await expect(getPopup({ page })).toBeHidden();
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toBeFocused();
	});

	test('Escape closes the popup, and the trigger opens it again', async ({ page }) => {
		const trigger = page.getByTestId('trigger');
		await openWithEnter({ page });

		await page.keyboard.press('Escape');
		await expect(getPopup({ page })).toBeHidden();
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toBeFocused();

		await openWithEnter({ page });
		await page.keyboard.press('Escape');

		await expect(getPopup({ page })).toBeHidden();
		await expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await expect(trigger).toBeFocused();
	});
});
