import { expect, test } from '@af/integration-testing';

const openModalBtn = 'modal-trigger';
const modalDialog = 'modal';
const modalScrollable = 'modal--scrollable';
const primaryBtn = 'primary';
const secondaryBtn = 'secondary';
const scrollBtn = 'scrollDown';
const closeModalBtn = 'modal-close';

test.describe('Default Modal', () => {
	test('Modal should move focus based on reading order, and be closed', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'default-modal');

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
		await page.visitExample('design-system', 'modal-dialog', 'scroll');

		// Ensure shouldScrollInViewport is enabled.
		await page.getByTestId('scroll--checkbox-label').click();

		// Open the modal
		const open = page.getByTestId(openModalBtn);
		await expect(open).toBeVisible();
		await open.click();

		// Click to the side of the modal.
		// 60 is the size of the gutter, as defined in `packages/design-system/modal-dialog/src/internal/components/positioner.tsx`
		await page.mouse.click(0, 60 * 2);

		// Ensure it's been closed.
		await expect(page.getByTestId(modalDialog)).toBeHidden();
	});

	// Tests for accessibility properties only testable via integration tests
	test('Scrollable modal should be accessible to keyboard and AT', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'scroll');

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
		expect(label).not.toBeNull();
	});
});

test('Empty modals (no focusable children) should still lock focus', async ({ page }) => {
	await page.visitExample('design-system', 'modal-dialog', 'custom-child');

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

		await page.visitExample('design-system', 'modal-dialog', 'autofocus');

		await expect(open).toBeVisible();
		await open.click();
		await expect(modal).toBeVisible();
		await expect(page.getByTestId(closeModalBtn)).toBeFocused();
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
	const close = page.getByTestId(closeModalBtn);

	await page.visitExample('design-system', 'modal-dialog', 'custom-child');
	await expect(open).toBeVisible();
	await open.click();
	await expect(modal).toBeVisible();
	await expect(close).toBeFocused();
});

test.describe('Focus', () => {
	test('should return to item specified by ref after modal is closed', async ({ page }) => {
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
	test('should return to trigger element in nested modals', async ({ page }) => {
		const sizes = ['large', 'medium', 'small'];
		const nestedModalLargeTrigger = page.getByTestId(sizes[0]);
		const nestedModalMediumTrigger = page.getByTestId(`${sizes[0]}-modal-trigger`);
		const nestedModalSmallTrigger = page.getByTestId(`${sizes[1]}-modal-trigger`);
		const closeModalSmallButton = page.getByTestId(`${sizes[2]}-modal-close-button`);

		await page.visitExample('design-system', 'modal-dialog', 'multiple');
		await expect(nestedModalLargeTrigger).toBeVisible();
		await nestedModalLargeTrigger.click();

		await expect(nestedModalMediumTrigger).toBeVisible();
		await nestedModalMediumTrigger.click();

		await expect(nestedModalSmallTrigger).toBeVisible();
		await nestedModalSmallTrigger.click();
		await expect(closeModalSmallButton).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(nestedModalSmallTrigger).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(nestedModalMediumTrigger).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(nestedModalLargeTrigger).toBeFocused();
	});
});

test.describe('Modal over a popup', () => {
	test('Should not close modal nor popup when interact with Modal', async ({ page }) => {
		await page.visitExample('design-system', 'modal-dialog', 'modal-over-popup');
		const popupTrigger = page.getByRole('button');
		await popupTrigger.click();
		const open = page.getByTestId(openModalBtn);
		const modal = page.getByTestId(modalDialog);
		const close = page.getByTestId(closeModalBtn);

		await expect(open).toBeVisible();

		await open.click();
		await expect(modal).toBeVisible();

		await close.click();
		await expect(modal).toBeHidden();
		await expect(open).toBeVisible();
		await expect(open).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(open).toBeHidden();
	});

	test(`Aui dialog's inner elements should be available for focus interaction while opened from AK modal, FG on`, async ({
		page,
	}) => {
		await page.visitExample('design-system', 'modal-dialog', 'open-aui-from-popup-in-modal', {
			featureFlag: 'platform_dst_allowlist-aui-dialog-for-ak-modal',
		});
		const atlaskitDialogTrigger = page.getByTestId('ak-modal-trigger');
		await atlaskitDialogTrigger.focus();
		await atlaskitDialogTrigger.click();
		const atlaskitDialog = page.getByTestId('ak-modal');
		const akPopupTrigger = page.getByTestId('popup-trigger');
		const auiDialogTrigger = page.getByTestId('aui-trigger');

		await expect(atlaskitDialog).toBeVisible();
		await expect(akPopupTrigger).toBeFocused();

		await akPopupTrigger.click();
		await auiDialogTrigger.focus();
		await auiDialogTrigger.click();

		const auiInput = page.getByTestId('aui-input');
		const auiSubmitButton = page.getByTestId('aui-submit-button');

		await auiInput.click();
		await expect(auiInput).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(auiSubmitButton).toBeFocused();

		await page.keyboard.press('Tab');
		await expect(auiInput).toBeFocused();
	});
	test(`Aui dialog's inner elements should be available for focus interaction while opened from AK modal, FG off`, async ({
		page,
	}) => {
		await page.visitExample('design-system', 'modal-dialog', 'open-aui-from-popup-in-modal');
		const atlaskitDialogTrigger = page.getByTestId('ak-modal-trigger');
		await atlaskitDialogTrigger.focus();
		await atlaskitDialogTrigger.click();
		const atlaskitDialog = page.getByTestId('ak-modal');
		const akPopupTrigger = page.getByTestId('popup-trigger');
		const auiDialogTrigger = page.getByTestId('aui-trigger');

		await expect(atlaskitDialog).toBeVisible();
		await expect(akPopupTrigger).toBeFocused();

		await akPopupTrigger.click();
		await auiDialogTrigger.focus();
		await auiDialogTrigger.click();

		const auiInput = page.getByTestId('aui-input');

		await auiInput.click();
		await expect(auiInput).not.toBeFocused();
	});
});
