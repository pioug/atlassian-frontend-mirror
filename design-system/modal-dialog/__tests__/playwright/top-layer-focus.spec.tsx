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
	// The blocking interaction fixture asserts the lifecycle during teardown.
	// eslint-disable-next-line playwright/expect-expect
	test('focus lifecycle: default focus moves into the modal and returns to the trigger', async ({
		page,
		interactionA11y,
	}) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('default-modal-trigger');
		const modal = page.getByTestId('default-modal');

		await interactionA11y.checkModalFocus({
			trigger,
			dialog: modal,
			open: () => trigger.click(),
			dismiss: () => page.keyboard.press('Escape'),
		});
	});

	// WCAG 2.4.3 Focus Order + HTML `<dialog>` focusing steps
	// (https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-focusing-steps).
	// When a descendant of the dialog carries the native HTML `autofocus`
	// attribute, focus must land on that element instead of the first
	// focusable. This matches both `<dialog>.showModal()` and the
	// WAI-ARIA APG Dialog pattern.
	// The blocking interaction fixture asserts the lifecycle during teardown.
	// eslint-disable-next-line playwright/expect-expect
	test('focus lifecycle: native [autofocus] wins over the first focusable element', async ({
		page,
		interactionA11y,
	}) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('native-autofocus-modal-trigger');
		const modal = page.getByTestId('native-autofocus-modal');

		await interactionA11y.checkModalFocus({
			trigger,
			dialog: modal,
			open: () => trigger.click(),
			dismiss: () => page.keyboard.press('Escape'),
		});
	});

	// WCAG 2.4.3 Focus Order. `Modal`'s `autoFocus` prop accepts a
	// `RefObject` that points at a specific descendant to focus on
	// open. This is the consumer-level override of the default
	// first-focusable behaviour and is implemented in `modal-wrapper`
	// outside `useInitialFocus`, but it shares the same WCAG / APG
	// contract: the chosen element receives focus instead of the
	// natural first focusable.
	// The blocking interaction fixture asserts the lifecycle during teardown.
	// eslint-disable-next-line playwright/expect-expect
	test('focus lifecycle: `autoFocus` ref is a documented initial-focus exception', async ({
		page,
		interactionA11y,
	}) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('auto-focus-ref-modal-trigger');
		const modal = page.getByTestId('auto-focus-ref-modal');
		const autoFocusInput = page.getByTestId('auto-focus-ref-input');

		await interactionA11y.checkModalFocus({
			trigger,
			dialog: modal,
			open: () => trigger.click(),
			dismiss: () => page.keyboard.press('Escape'),
			initialFocusException: {
				target: autoFocusInput,
				reason: 'Characterises supported ADS Modal autoFocus ref behavior.',
			},
		});
	});
	test('focus movement: Tab traverses each control before wrapping', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'modal-dialog',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);
		await page.getByTestId('default-modal-trigger').click();
		await expect(page.getByTestId('default-modal--close-button')).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('default-modal-secondary')).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('default-modal-primary')).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByTestId('default-modal--close-button')).toBeFocused();
	});
});
