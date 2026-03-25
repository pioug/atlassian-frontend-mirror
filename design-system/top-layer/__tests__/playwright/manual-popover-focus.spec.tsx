import { expect, test } from '@af/integration-testing';

/**
 * Native popover="manual" focus behavior tests.
 *
 * Uses raw HTML popover attribute (no React component wrappers) to verify
 * what the browser does with focus natively.
 *
 * The native `autofocus` attribute is set via DOM manipulation (not React's
 * autoFocus prop) so the browser's "popover focusing steps" algorithm can
 * find it during showPopover().
 *
 * WHATWG HTML spec says "popover focusing steps" run for ALL popover types
 * (auto, hint, manual) on show. This means:
 *   - If a descendant has `autofocus`, focus moves there
 *   - If no autofocus is present, focus does NOT move
 */
test.describe('Native popover="manual" focus behavior', () => {
	// ── Show: without autofocus ──

	test('manual popover WITHOUT autofocus: focus stays on trigger after show', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'top-layer', 'testing-manual-popover-focus');

		const trigger = page.getByTestId('manual-no-af-trigger');
		await trigger.click();

		await expect(page.getByTestId('manual-no-af-content')).toBeVisible();
		await expect(trigger).toBeFocused();
	});

	test('auto popover WITHOUT autofocus: focus stays on trigger (comparison)', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'top-layer', 'testing-manual-popover-focus');

		const trigger = page.getByTestId('auto-no-af-trigger');
		await trigger.click();

		await expect(page.getByTestId('auto-no-af-content')).toBeVisible();
		await expect(trigger).toBeFocused();
	});

	// ── Show: with native autofocus attribute ──

	test('manual popover WITH autofocus: browser runs popover focusing steps', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'top-layer', 'testing-manual-popover-focus');

		const trigger = page.getByTestId('manual-af-trigger');
		await trigger.click();

		await expect(page.getByTestId('manual-af-content')).toBeVisible();

		// Spec says "popover focusing steps" run for ALL types including manual.
		// The autofocused inner button should receive focus.
		const innerButton = page.getByTestId('manual-af-inner');
		await expect(innerButton).toBeFocused();
	});

	test('auto popover WITH autofocus: browser runs popover focusing steps (comparison)', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'top-layer', 'testing-manual-popover-focus');

		const trigger = page.getByTestId('auto-af-trigger');
		await trigger.click();

		await expect(page.getByTestId('auto-af-content')).toBeVisible();

		const innerButton = page.getByTestId('auto-af-inner');
		await expect(innerButton).toBeFocused();
	});

	// ── Hide: focus restoration ──

	test('manual popover: hidePopover() does NOT restore focus to trigger', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-manual-popover-focus');

		const trigger = page.getByTestId('manual-restore-trigger');
		await trigger.click();

		await expect(page.getByTestId('manual-restore-content')).toBeVisible();

		// Verify autofocus moved focus into the popover
		const innerButton = page.getByTestId('manual-restore-inner');
		await expect(innerButton).toBeFocused();

		// Close via button that calls hidePopover()
		const closeButton = page.getByTestId('manual-restore-close');
		await closeButton.click();

		await expect(page.getByTestId('manual-restore-content')).toBeHidden();

		// Manual popovers don't participate in the auto/hint stack,
		// so shouldRestoreFocus is not set. Focus should NOT return to trigger.
		await expect(trigger).not.toBeFocused();
	});

	test('auto popover: Escape DOES restore focus to trigger (comparison)', async ({ page }) => {
		await page.visitExample('design-system', 'top-layer', 'testing-manual-popover-focus');

		const trigger = page.getByTestId('auto-restore-trigger');
		await trigger.click();

		await expect(page.getByTestId('auto-restore-content')).toBeVisible();

		// Verify autofocus moved focus into the popover
		const innerButton = page.getByTestId('auto-restore-inner');
		await expect(innerButton).toBeFocused();

		// Dismiss via Escape — close watcher passes focusPreviousElement=true
		await page.keyboard.press('Escape');

		await expect(page.getByTestId('auto-restore-content')).toBeHidden();

		// Auto popovers: shouldRestoreFocus is true, Escape restores focus
		await expect(trigger).toBeFocused();
	});
});
