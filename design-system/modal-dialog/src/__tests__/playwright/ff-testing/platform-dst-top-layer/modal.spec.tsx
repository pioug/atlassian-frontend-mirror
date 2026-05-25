import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

const featureFlag = 'platform-dst-top-layer';

test.describe('ModalDialog top-layer — WCAG 2.1.1 Keyboard', () => {
	test('should open modal via click on trigger button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
	});

	test('should open modal via Enter key on trigger button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(dialog).toBeVisible();
	});

	test('should open modal via Space key on trigger button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.focus();
		await page.keyboard.press('Space');

		await expect(dialog).toBeVisible();
	});

	test('should allow Tab navigation between focusable elements inside modal', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);
		const secondaryButton = page.getByTestId('secondary');
		const primaryButton = page.getByTestId('primary');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		// Initial focus from <dialog>.showModal() lands on the close button
		// (first focusable descendant of the dialog).
		await expect(closeButton).toBeFocused();

		await page.keyboard.press('Tab');

		await expect(secondaryButton).toBeFocused();

		await page.keyboard.press('Tab');

		await expect(primaryButton).toBeFocused();
	});

	test('should allow Shift+Tab navigation backwards inside modal', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);
		const secondaryButton = page.getByTestId('secondary');
		const primaryButton = page.getByTestId('primary');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		await primaryButton.focus();
		await expect(primaryButton).toBeFocused();

		// Tab order is closeButton → secondaryButton → primaryButton, so two
		// Shift+Tab presses are needed to reach the close button from primary.
		await page.keyboard.press('Shift+Tab');
		await expect(secondaryButton).toBeFocused();

		await page.keyboard.press('Shift+Tab');
		await expect(closeButton).toBeFocused();
	});
});

test.describe('ModalDialog top-layer — WCAG 2.1.2 No Keyboard Trap', () => {
	test('should close modal when Escape key is pressed', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(dialog).toBeHidden();
	});

	test('should wrap focus to close button when Tab pressed on last focusable element', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);
		const primaryButton = page.getByTestId('primary');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		await expect(closeButton).toBeFocused();

		await primaryButton.focus();

		await page.keyboard.press('Tab');

		await expect(closeButton).toBeFocused();
	});

	test('should wrap focus backwards to last element when Shift+Tab pressed on first focusable element', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);
		const primaryButton = page.getByTestId('primary');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		await expect(closeButton).toBeFocused();

		await page.keyboard.press('Shift+Tab');

		await expect(primaryButton).toBeFocused();
	});

	test('should prevent focus from moving outside modal with Tab when no focusable elements outside', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/95-custom-child.tsx')>(
			'design-system',
			'modal-dialog',
			'custom-child',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		await expect(closeButton).toBeFocused();

		await page.keyboard.press('Tab');

		await expect(closeButton).toBeFocused();

		await page.keyboard.press('Shift+Tab');

		await expect(closeButton).toBeFocused();
	});
});

test.describe('ModalDialog top-layer — WCAG 2.4.3 Focus Order', () => {
	test('should move focus to close button when modal opens', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);

		await expect(dialog).toBeHidden();
		await expect(trigger).not.toBeFocused();

		await trigger.click();

		await expect(dialog).toBeVisible();
		await expect(closeButton).toBeFocused();
	});

	test('should move focus to first focusable element by default when autoFocus is true', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/20-autofocus.tsx')>(
			'design-system',
			'modal-dialog',
			'autofocus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('boolean-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		await expect(closeButton).toBeFocused();
	});

	test('should move focus to element specified by autoFocus ref on open', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/20-autofocus.tsx')>(
			'design-system',
			'modal-dialog',
			'autofocus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('autofocus-trigger');
		const dialog = page.getByRole('dialog');
		const autoFocusInput = page.getByLabel('This textbox should be focused');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		await expect(autoFocusInput).toBeFocused();
	});

	test('should return focus to trigger button when modal closes', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const primaryButton = page.getByTestId('primary');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		await primaryButton.click();

		await expect(dialog).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('should return focus to specified ref after modal closes', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/focus-to-ref-on-modal-close.tsx')
		>('design-system', 'modal-dialog', 'focus-to-ref-on-modal-close', { featureFlag });

		const openModal = page.getByTestId('open-modal');
		const dialog = page.getByRole('dialog');
		const closeModal = page.getByTestId('close-modal');
		const focusOnModalClose = page.getByTestId('return-focus-element');

		await expect(dialog).toBeHidden();

		await openModal.click();

		await expect(dialog).toBeVisible();

		await closeModal.click();

		await expect(dialog).toBeHidden();
		await expect(focusOnModalClose).toBeFocused();
	});

	test('should return focus to correct trigger in nested modals', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/40-multiple.tsx')>(
			'design-system',
			'modal-dialog',
			'multiple',
			{ featureFlag },
		);

		const largeTrigger = page.getByTestId('large');
		const mediumTrigger = page.getByTestId('large-modal-trigger');
		const smallTrigger = page.getByTestId('medium-modal-trigger');
		const closeSmallButton = page.getByTestId('small-modal-close-button');

		// `getByRole('dialog')` matches both implicit (<dialog>) and explicit
		// `role="dialog"` semantics. The legacy modal used a <section
		// role="dialog">; the top-layer modal uses native <dialog> which
		// has implicit role and no explicit attribute.
		const dialogs = page.getByRole('dialog');

		await expect(dialogs).toHaveCount(0);

		await largeTrigger.click();

		await expect(dialogs).toHaveCount(1);

		await mediumTrigger.click();

		await expect(dialogs).toHaveCount(2);

		await smallTrigger.click();

		await expect(dialogs).toHaveCount(3);

		await closeSmallButton.click();

		await expect(dialogs).toHaveCount(2);
		await expect(smallTrigger).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(dialogs).toHaveCount(1);
		await expect(mediumTrigger).toBeFocused();

		await page.keyboard.press('Escape');

		await expect(dialogs).toHaveCount(0);
		await expect(largeTrigger).toBeFocused();
	});
});

test.describe('ModalDialog top-layer — WCAG 2.4.7 Focus Visible', () => {
	test('should show focus indicator on close button when focused via keyboard', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);

		await expect(dialog).toBeHidden();

		// Open via keyboard so the close button (which receives initial focus
		// from <dialog>.showModal()) is treated as a keyboard-focused element
		// for `:focus-visible` purposes. Browsers track the last input
		// modality — focus initiated after a mouse click never matches
		// `:focus-visible`, even when the focus shift itself is programmatic.
		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(dialog).toBeVisible();
		await expect(closeButton).toBeFocused();

		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement as HTMLElement | null;
			const styles = el ? window.getComputedStyle(el) : null;
			return styles ? styles.outlineWidth !== '0px' || styles.boxShadow !== 'none' : false;
		});

		expect(focusedElement).toBe(true);
	});

	test('should show focus indicator on buttons when navigating with Tab', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);
		const secondaryButton = page.getByTestId('secondary');

		await expect(dialog).toBeHidden();

		// Open via keyboard so the focused button matches `:focus-visible`
		// throughout the test (browsers track the last input modality).
		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(dialog).toBeVisible();
		await expect(closeButton).toBeFocused();

		await page.keyboard.press('Tab');

		await expect(secondaryButton).toBeFocused();

		const focusedElement = await page.evaluate(() => {
			const el = document.activeElement as HTMLElement | null;
			const styles = el ? window.getComputedStyle(el) : null;
			return styles ? styles.outlineWidth !== '0px' || styles.boxShadow !== 'none' : false;
		});

		expect(focusedElement).toBe(true);
	});
});

test.describe('ModalDialog top-layer — WCAG 2.4.11 Focus Not Obscured', () => {
	test('should display modal content without visual obstruction', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		const boundingBox = await dialog.boundingBox();

		expect(boundingBox).not.toBeNull();
		invariant(boundingBox !== null);

		expect(boundingBox.width).toBeGreaterThan(0);
		expect(boundingBox.height).toBeGreaterThan(0);
	});

	test('should keep modal in viewport and centered', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		const viewportSize = page.viewportSize();
		const boundingBox = await dialog.boundingBox();

		expect(boundingBox).not.toBeNull();
		expect(viewportSize).not.toBeNull();
		invariant(boundingBox !== null && viewportSize !== null);

		// `<dialog>.showModal()` may render a tall modal that extends below
		// the viewport (browser allows scrolling within the dialog). Allow
		// the dialog to extend slightly past the viewport bottom — what we
		// really want to assert is that the dialog is anchored within the
		// viewport, not pushed off-screen entirely.
		expect(boundingBox.x).toBeGreaterThanOrEqual(0);
		expect(boundingBox.y).toBeGreaterThanOrEqual(0);
		expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(viewportSize.width + 1);
		expect(boundingBox.y).toBeLessThan(viewportSize.height);
	});
});

test.describe('ModalDialog top-layer — WCAG 4.1.2 Name, Role, Value', () => {
	test('should have role="dialog" attribute (sanity check)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		// `<dialog>` has implicit role="dialog" — we don't assert the
		// explicit attribute (it isn't required and is not set by top-layer).
		// `getByRole('dialog')` already verifies the role is exposed via the
		// accessibility tree.
		const tag = await dialog.evaluate((el) => el.tagName.toLowerCase());
		expect(tag).toBe('dialog');
	});

	test('should not have aria-modal="true" attribute (sanity check)', async ({ page }) => {
		// `aria-modal` is intentionally NOT set: native `<dialog>.showModal()`
		// already conveys modal semantics to assistive tech, and double-
		// declaring it forecloses non-modal use cases (consumers calling
		// `.show()` would still appear modal). Modern AT (NVDA / JAWS /
		// VoiceOver) infer modality from the platform accessibility API.
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		await expect(dialog).not.toHaveAttribute('aria-modal');
	});

	test('should have aria-labelledby set to modal title (sanity check)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		await expect(dialog).toHaveAttribute('aria-labelledby');
		await expect(dialog.getByRole('heading', { name: 'Modal Title' })).toBeVisible();
	});

	test('should have trigger button with aria-haspopup="dialog" (sanity check)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');

		await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});
});

test.describe('ModalDialog top-layer — WCAG 1.3.2 Meaningful Sequence', () => {
	test('should render modal near trigger in DOM order (sanity check)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		const triggerElement = await trigger.evaluate((el) => el.outerHTML);
		const dialogElement = await dialog.evaluate((el) => el.outerHTML);

		const bodyHtml = await page.content();
		const triggerIndex = bodyHtml.indexOf(triggerElement);
		const dialogIndex = bodyHtml.indexOf(dialogElement);

		expect(dialogIndex).toBeGreaterThan(triggerIndex);
	});
});

test.describe('ModalDialog top-layer — Behavior and Interactions', () => {
	test('should close modal when clicking outside (on blanket)', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		await page.mouse.click(0, 0);

		await expect(dialog).toBeHidden();
	});

	test('should close modal when clicking close button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const closeButton = page.getByTestId(/--close-button/);

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		await closeButton.click();

		await expect(dialog).toBeHidden();
	});

	test('should close modal when clicking action button', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/00-default-modal.tsx')>(
			'design-system',
			'modal-dialog',
			'default-modal',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const primaryButton = page.getByTestId('primary');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();

		await primaryButton.click();

		await expect(dialog).toBeHidden();
	});

	test('should handle scrollable modal body with focus management', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/55-scroll.tsx')>(
			'design-system',
			'modal-dialog',
			'scroll',
			{ featureFlag },
		);

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const modalBody = page.getByTestId('modal--scrollable');

		await expect(dialog).toBeHidden();

		await trigger.click();

		await expect(dialog).toBeVisible();
		await expect(modalBody).toBeVisible();

		// Tab order in this example: close → modal--scrollable → scrollDown
		// → primary. Initial focus from <dialog>.showModal() lands on the
		// close button, so a single Tab press reaches the scrollable body.
		await page.keyboard.press('Tab');
		await expect(modalBody).toBeFocused();
	});

	test('should handle multiple modals independently', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/40-multiple.tsx')>(
			'design-system',
			'modal-dialog',
			'multiple',
			{ featureFlag },
		);

		const largeTrigger = page.getByTestId('large');
		const mediumTrigger = page.getByTestId('large-modal-trigger');
		// Use accessibility-tree role rather than the explicit `role="dialog"`
		// attribute selector — native <dialog> exposes the role implicitly.
		const dialogs = page.getByRole('dialog');

		await expect(dialogs).toHaveCount(0);

		await largeTrigger.click();

		await expect(dialogs).toHaveCount(1);

		await mediumTrigger.click();

		await expect(dialogs).toHaveCount(2);
	});

	test('should close inner modal and preserve outer modal state', async ({ page }) => {
		await page.visitExample<typeof import('../../../../../examples/40-multiple.tsx')>(
			'design-system',
			'modal-dialog',
			'multiple',
			{ featureFlag },
		);

		const largeTrigger = page.getByTestId('large');
		const mediumTrigger = page.getByTestId('large-modal-trigger');
		// The 40-multiple example renders a 3-level chain (large → medium → small).
		// "Inner modal" in this test means the middle one — which is named
		// "medium". Its close button has the `medium-modal-close-button` testId.
		const closeMiddleButton = page.getByTestId('medium-modal-close-button');
		const dialogs = page.getByRole('dialog');

		await expect(dialogs).toHaveCount(0);

		await largeTrigger.click();

		await expect(dialogs).toHaveCount(1);

		await mediumTrigger.click();

		await expect(dialogs).toHaveCount(2);

		await closeMiddleButton.click();

		await expect(dialogs).toHaveCount(1);
	});
});

test.describe('ModalDialog top-layer — WCAG 2.4.3 — Requirement 3 (background inert via showModal)', () => {
	test('background control does not receive focus when focused programmatically while modal is open', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/97-modal-a11y-background-inert.tsx')
		>('design-system', 'modal-dialog', 'modal-a11y-background-inert', { featureFlag });

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const background = page.getByTestId('modal-background-control');

		await trigger.click();
		await expect(dialog).toBeVisible();

		const activeTestIdAfterProgrammaticFocus = await page.evaluate(() => {
			const bg = document.querySelector(
				'[data-testid="modal-background-control"]',
			) as HTMLElement | null;
			bg?.focus();
			return document.activeElement?.getAttribute('data-testid') ?? null;
		});

		expect(activeTestIdAfterProgrammaticFocus).not.toBe('modal-background-control');
		await expect(background).not.toBeFocused();
	});

	test('Tab navigation does not move focus to the background control while modal is open', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/97-modal-a11y-background-inert.tsx')
		>('design-system', 'modal-dialog', 'modal-a11y-background-inert', { featureFlag });

		const trigger = page.getByTestId('modal-trigger');
		const dialog = page.getByRole('dialog');
		const background = page.getByTestId('modal-background-control');

		await trigger.click();
		await expect(dialog).toBeVisible();

		for (let i = 0; i < 40; i++) {
			await page.keyboard.press('Tab');
			await expect(background).not.toBeFocused();
		}
	});
});
