import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `ModalDialog` running on the top-layer path.
 *
 * `top-layer/useInitialFocus` for `role="dialog"` prefers the first element
 * with the native HTML `autofocus` attribute, and falls back to the first
 * focusable element inside the popover.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('ModalDialog top-layer — initial focus matrix', () => {
	test('default modal focuses the first focusable element (close button in header)', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/98-testing-initial-focus-matrix.tsx')
		>('design-system', 'modal-dialog', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		await page.getByTestId('default-modal-trigger').click();

		const dialog = page.getByTestId('default-modal');
		await expect(dialog).toBeVisible();

		// The close button in the header is the first focusable element.
		const closeButton = dialog.getByRole('button', { name: 'Close Modal' });
		await expect(closeButton).toBeFocused();
	});

	test('modal with native [autofocus] element focuses that element instead of the close button', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/98-testing-initial-focus-matrix.tsx')
		>('design-system', 'modal-dialog', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		await page.getByTestId('native-autofocus-modal-trigger').click();

		const dialog = page.getByTestId('native-autofocus-modal');
		await expect(dialog).toBeVisible();

		await expect(page.getByTestId('native-autofocus-input')).toBeFocused();
	});
});
