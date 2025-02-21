// Will be removed in scope of https://product-fabric.atlassian.net/browse/DSP-19675

import { expect, test } from '@af/integration-testing';

import { gutter } from '../../../../internal/constants';

const openModalBtn = 'modal-trigger';
const modalDialog = 'modal';
const modalScrollable = 'modal--scrollable';
const primaryBtn = 'primary';
const secondaryBtn = 'secondary';
const scrollBtn = 'scrollDown';
const closeModalBtn = 'modal-close';

test.describe('Default Modal', () => {
	test('Modal should move focus based on reading order, and be closed', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'default-modal', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
			'react-18-mode': 'legacy',
		});

		const open = page.getByTestId(openModalBtn);
		const primary = page.getByTestId(primaryBtn);
		const secondary = page.getByTestId(secondaryBtn);
		const close = page.getByTestId(closeModalBtn);

		await expect(open).toBeVisible();
		await open.click();
		await expect(page.getByTestId(modalDialog)).toBeVisible();
		await expect(close).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(secondary).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(primary).toBeFocused();

		// Focus should go back to close button, not content body,
		// because this modal is not scrollable.
		await page.keyboard.press('Tab');
		await expect(close).toBeFocused();

		// Close the modal dialog
		await primary.click();

		// As we have closed the modal-dialog, only the open modal button should be visible.
		await expect(open).toBeVisible();
	});
});

test.describe('Modal Dialog Scroll', () => {
	test('Scrollable modal should have focus on its content', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'scroll', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
			'react-18-mode': 'legacy',
		});

		const open = page.getByTestId(openModalBtn);
		const primary = page.getByTestId(primaryBtn);
		const scroll = page.getByTestId(scrollBtn);
		const body = page.getByTestId(modalScrollable);
		const close = page.getByTestId(closeModalBtn);

		await expect(open).toBeVisible();
		await open.click();
		await expect(page.getByTestId(modalDialog)).toBeVisible();
		await page.keyboard.press('Tab');
		await expect(body).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(scroll).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(primary).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(close).toBeFocused();

		// Focus should go to content body,
		// because this modal is scrollable.
		await page.keyboard.press('Tab');
		await expect(body).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(scroll).toBeFocused();

		// Focus should go back to primary action.
		await page.keyboard.press('Tab');
		await expect(primary).toBeFocused();
	});

	test('Empty modals (no focusable children) should still lock focus', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'scroll', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
			'react-18-mode': 'legacy',
		});

		// Ensure shouldScrollInViewport is enabled.
		await page.getByTestId('scroll--checkbox-label').click();

		// Open the modal
		const open = page.getByTestId(openModalBtn);
		await expect(open).toBeVisible();
		await open.click();

		// Click to the side of the modal.
		await page.mouse.click(0, gutter * 2);

		// Ensure it's been closed.
		await expect(page.getByTestId(modalDialog)).toBeHidden();
	});

	// Tests for accessibility properties only testable via integration tests
	test('Scrollable modal should be accessible to keyboard and AT', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'scroll', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
			'react-18-mode': 'legacy',
		});

		const open = page.getByTestId(openModalBtn);
		await expect(open).toBeVisible();
		await expect(open).toHaveAttribute('aria-haspopup', 'dialog');
		await open.click();

		await expect(page.getByTestId(modalDialog)).toBeVisible();
		await expect(page.getByTestId(closeModalBtn)).toBeFocused();

		const body = page.getByTestId(modalScrollable);
		await expect(body).toHaveAttribute('tabindex', '0');
		await expect(body).toHaveAttribute('role', 'region');
		const label = await body.getAttribute('aria-label');
		await expect(label).not.toBeNull();
	});
});

test('Empty modals (no focusable children) should still lock focus', async ({ page }) => {
	await page.visitExample('design-system', 'modal-dialog', 'custom-child', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
		'react-18-mode': 'legacy',
	});

	const open = page.getByTestId(openModalBtn);
	const modal = page.getByTestId(modalDialog);
	const close = page.getByTestId(closeModalBtn);

	await expect(open).toBeVisible();
	await open.focus();
	await expect(open).toBeFocused();

	await open.click();
	await expect(modal).toBeVisible();
	await expect(close).toBeFocused();

	await page.keyboard.press('Tab');
	await expect(close).toBeFocused();

	await page.keyboard.press('Shift+Tab');
	await expect(close).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(open).toBeVisible();
	await expect(open).toBeFocused();
});

test.describe('Autofocus', () => {
	test('should focus first focusable item when true', async ({ page }) => {
		const open = page.getByTestId('boolean-trigger');
		const modal = page.getByTestId(modalDialog);

		await page.visitExample('design-system', 'modal-dialog', 'autofocus', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
			'react-18-mode': 'legacy',
		});

		await expect(open).toBeVisible();
		await open.click();
		await expect(modal).toBeVisible();
		await expect(page.getByTestId(closeModalBtn)).toBeFocused();
	});

	test('should focus item specified by ref', async ({ page }) => {
		const open = page.getByTestId('autofocus-trigger');
		const modal = page.getByTestId(modalDialog);

		await page.visitExample('design-system', 'modal-dialog', 'autofocus', {
			featureFlag: 'platform_dst_popup-disable-focuslock',
		});

		await expect(open).toBeVisible();
		await open.click();
		await expect(modal).toBeVisible();
		await expect(page.getByLabel('This textbox should be focused')).toBeFocused();
	});
});

test('Modal with no focusable children should gain focus on its container', async ({ page }) => {
	const open = page.getByTestId(openModalBtn);
	const modal = page.getByTestId(modalDialog);
	const close = page.getByTestId(closeModalBtn);

	await page.visitExample('design-system', 'modal-dialog', 'custom-child', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
		'react-18-mode': 'legacy',
	});
	await expect(open).toBeVisible();
	await open.click();
	await expect(modal).toBeVisible();
	await expect(close).toBeFocused();
});

test('Focus should return to item specified by ref after modal is closed', async ({ page }) => {
	const openModal = page.getByTestId('open-modal');
	const closeModal = page.getByTestId('close-modal');
	const focusOnModalClose = page.getByTestId('return-focus-element');

	await page.visitExample('design-system', 'modal-dialog', 'focus-to-ref-on-modal-close', {
		featureFlag: 'platform_dst_popup-disable-focuslock',
		'react-18-mode': 'legacy',
	});
	await expect(openModal).toBeVisible();
	await expect(focusOnModalClose).toBeVisible();
	await openModal.click();
	await expect(closeModal).toBeVisible();
	await closeModal.click();
	await expect(focusOnModalClose).toBeFocused();
});
