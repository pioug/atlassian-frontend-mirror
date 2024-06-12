import { expect, test } from '@af/integration-testing';

import { gutter } from '../../internal/constants';

const openModalBtn = 'modal-trigger';
const modalDialog = 'modal';
const modalScrollable = 'modal--scrollable';
const primaryBtn = 'primary';
const secondaryBtn = 'secondary';
const scrollBtn = 'scrollDown';

test.describe('Default Modal', () => {
	test('Modal should move focus based on reading order, and be closed', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'default-modal');

		const open = page.getByTestId(openModalBtn);
		const primary = page.getByTestId(primaryBtn);
		const secondary = page.getByTestId(secondaryBtn);

		await expect(open).toBeVisible();
		await open.click();
		await expect(page.getByTestId(modalDialog)).toBeVisible();
		await expect(secondary).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(primary).toBeFocused();

		// Focus should go back to secondary action, not content body,
		// because this modal is not scrollable.
		await page.keyboard.press('Tab');
		await expect(secondary).toBeFocused();

		// Close the modal dialog
		await primary.click();

		// As we have closed the modal-dialog, only the open modal button should be visible.
		await expect(open).toBeVisible();
	});

	// This tests is skipped because it does not appear there is a good way to click and drag to simulate text selection as expected for DSP-6264.
	test.skip('Modal should not close when click event starts on modal and finishes outside of modal', async ({
		page,
	}) => {
		await page.visitExample('design-system', 'modal-dialog', 'default-modal');

		const open = page.getByTestId(openModalBtn);
		const modal = page.getByTestId(modalDialog);

		await expect(open).toBeVisible();
		await open.click();
		await expect(modal).toBeVisible();

		// Start selecting text and then drag off to outside modal
		await page.getByTestId('modal--header').hover();
		await page.mouse.down();
		await open.hover();
		await page.mouse.up();
		await expect(modal).toBeVisible();
	});
});

test.describe('Modal Dialog Scroll', () => {
	test('Scrollable modal should have focus on its content', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'scroll');

		const open = page.getByTestId(openModalBtn);
		const primary = page.getByTestId(primaryBtn);
		const scroll = page.getByTestId(scrollBtn);
		const body = page.getByTestId(modalScrollable);

		await expect(open).toBeVisible();
		await open.click();
		await expect(page.getByTestId(modalDialog)).toBeVisible();
		await expect(scroll).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(primary).toBeFocused();

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
		await page.visitExample('design-system', 'modal-dialog', 'scroll');

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
		await page.visitExample('design-system', 'modal-dialog', 'scroll');

		const open = page.getByTestId(openModalBtn);
		await expect(open).toBeVisible();
		await open.click();

		await expect(page.getByTestId(modalDialog)).toBeVisible();
		await expect(page.getByTestId(scrollBtn)).toBeFocused();

		const body = page.getByTestId(modalScrollable);
		await expect(body).toHaveAttribute('tabindex', '0');
		await expect(body).toHaveAttribute('role', 'region');
		const label = await body.getAttribute('aria-label');
		await expect(label).not.toBeNull();
	});
});

test('Empty modals (no focusable children) should still lock focus', async ({ page }) => {
	await page.visitExample('design-system', 'modal-dialog', 'custom-child');

	const open = page.getByTestId(openModalBtn);
	const modal = page.getByTestId(modalDialog);

	await expect(open).toBeVisible();
	await open.focus();
	await expect(open).toBeFocused();

	await open.click();
	await expect(modal).toBeVisible();
	await expect(modal).toBeFocused();

	await page.keyboard.press('Tab');
	await expect(modal).toBeFocused();

	await page.keyboard.press('Shift+Tab');
	await expect(modal).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(open).toBeVisible();
	await expect(open).toBeFocused();
});

test.describe('Autofocus', () => {
	test('should focus first focusable item when true', async ({ page }) => {
		const open = page.getByTestId('boolean-trigger');
		const modal = page.getByTestId(modalDialog);

		await page.visitExample('design-system', 'modal-dialog', 'autofocus');

		await expect(open).toBeVisible();
		await open.click();
		await expect(modal).toBeVisible();
		await expect(page.getByRole('button', { name: 'I am focused!' })).toBeFocused();
	});

	test('should focus item specified by ref', async ({ page }) => {
		const open = page.getByTestId('autofocus-trigger');
		const modal = page.getByTestId(modalDialog);

		await page.visitExample('design-system', 'modal-dialog', 'autofocus');

		await expect(open).toBeVisible();
		await open.click();
		await expect(modal).toBeVisible();
		await expect(page.getByLabel('This textbox should be focused')).toBeFocused();
	});
});

test('Modal with no focusable children should gain focus on its container', async ({ page }) => {
	const open = page.getByTestId(openModalBtn);
	const modal = page.getByTestId(modalDialog);

	await page.visitExample('design-system', 'modal-dialog', 'custom-child');
	await expect(open).toBeVisible();
	await open.click();
	await expect(modal).toBeVisible();
	await expect(modal).toBeFocused();
});

test('Focus should return to item specified by ref after modal is closed', async ({ page }) => {
	const openModal = page.getByTestId('open-modal');
	const closeModal = page.getByTestId('close-modal');
	const focusOnModalClose = page.getByTestId('return-focus-element');

	await page.visitExample('design-system', 'modal-dialog', 'focus-to-ref-on-modal-close');
	await expect(openModal).toBeVisible();
	await expect(focusOnModalClose).toBeVisible();
	await openModal.click();
	await expect(closeModal).toBeVisible();
	await closeModal.click();
	await expect(focusOnModalClose).toBeFocused();
});
