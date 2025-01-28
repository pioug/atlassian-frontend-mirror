/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'modal-dialog', 'default-modal');

	const modalTrigger = page.getByTestId('modal-trigger').first();

	await modalTrigger.click();

	await expect(page.getByTestId('modal').first()).toBeVisible();
});

test('should include icon as part of title <h1>', async ({ page }) => {
	/**
	 * The icon provides visual context to the type of modal that is being presented. If it is removed from the title
	 * `<h1>` then the context will not be provided to assistive technology users.
	 *
	 * Example with icon in title: "danger You're about to delete this page"
	 * Example without icon in title "You're about to delete this page"
	 *
	 * Not including the icon would fail WCAG 1.3.1
	 *
	 * DO NOT REMOVE THE ICON FROM THE TITLE
	 */
	await page.visitExample('design-system', 'modal-dialog', 'appearance');

	const warningTrigger = page.getByTestId('warning');
	await warningTrigger.click();

	await expect(page.locator('h1:has(span > [role="img"][aria-label="warning"])')).toBeVisible();
});
