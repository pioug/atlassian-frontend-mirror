import { expect, test } from '@af/integration-testing';

/**
 * Modal dialog: focus contract on the top-layer code path.
 *
 * `ModalDialog` renders as a `role="dialog"` modal. Per WCAG 2.4.3 (Focus
 * Order) and the top-layer focus rules:
 *
 * 1. Initial focus moves to the first focusable element on open (or to the
 *    element marked with the native HTML `autofocus` attribute when present).
 * 2. Closing the modal (Escape) restores focus to the trigger.
 * 3. Tab cycles focus within the modal (focus does not escape to elements
 *    behind the modal).
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Modal dialog: top-layer focus contract', () => {
	test('initial focus: focus moves to first focusable element on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('default-modal-trigger').click();

		const modal = page.getByTestId('default-modal');
		await expect(modal).toBeVisible();

		// The first focusable inside the modal is the header's close button.
		await expect(page.getByTestId('default-modal--close-button')).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('default-modal-trigger');
		await trigger.click();
		await expect(page.getByTestId('default-modal')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('default-modal')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + HTML `<dialog>` focusing steps
	// (https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-focusing-steps).
	// When a descendant of the dialog carries the native HTML `autofocus`
	// attribute, focus must land on that element instead of the first
	// focusable. This matches both `<dialog>.showModal()` and the
	// WAI-ARIA APG Dialog pattern.
	test('initial focus: native [autofocus] element wins over the first focusable element', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('native-autofocus-modal-trigger').click();

		const modal = page.getByTestId('native-autofocus-modal');
		await expect(modal).toBeVisible();

		// The first focusable inside the modal is the header close
		// button, but the body input carries `autofocus`, so focus must
		// land on the input.
		await expect(page.getByTestId('native-autofocus-input')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order. `Modal`'s `autoFocus` prop accepts a
	// `RefObject` that points at a specific descendant to focus on
	// open. This is the consumer-level override of the default
	// first-focusable behaviour and is implemented in `modal-wrapper`
	// outside `useInitialFocus`, but it shares the same WCAG / APG
	// contract: the chosen element receives focus instead of the
	// natural first focusable.
	test('initial focus: `autoFocus` ref overrides the first focusable element', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('auto-focus-ref-modal-trigger').click();

		const modal = page.getByTestId('auto-focus-ref-modal');
		await expect(modal).toBeVisible();

		// The header close button is the first focusable, but the
		// consumer pointed `autoFocus` at the body input, so focus must
		// land on the input.
		await expect(page.getByTestId('auto-focus-ref-input')).toBeFocused();
	});

	test('focus movement: Tab cycles focus within the modal', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('default-modal-trigger').click();
		const modal = page.getByTestId('default-modal');
		await expect(modal).toBeVisible();

		// Walk forward through every focusable element in the modal and verify
		// focus never escapes the dialog surface.
		const focusables = [
			page.getByTestId('default-modal--close-button'),
			page.getByTestId('default-modal-secondary'),
			page.getByTestId('default-modal-primary'),
		];

		for (const target of focusables) {
			await expect(target).toBeFocused();
			await page.keyboard.press('Tab');
		}

		// After cycling past the last focusable, focus must remain inside the
		// modal (focus wrap), never on a node outside it.
		const activeWithinModal = await modal.evaluate(
			(modalElement) =>
				document.activeElement !== null && modalElement.contains(document.activeElement),
		);
		expect(activeWithinModal).toBe(true);
	});
});
