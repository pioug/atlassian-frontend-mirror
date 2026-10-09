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
	test('default modal focuses its first control in modern React mode', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/98-testing-initial-focus-matrix.tsx')
		>('design-system', 'modal-dialog', 'testing-initial-focus-matrix', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const trigger = page.getByTestId('default-modal-trigger');
		const dialog = page.getByTestId('default-modal');

		await trigger.click();
		await expect(dialog).toBeVisible();
		await expect(page.getByTestId('default-modal--close-button')).toBeFocused();
	});

	test('native [autofocus] wins in modern React mode', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/98-testing-initial-focus-matrix.tsx')
		>('design-system', 'modal-dialog', 'testing-initial-focus-matrix', {
			featureFlag,
			'react-18-mode': 'modern',
		});

		const trigger = page.getByTestId('native-autofocus-modal-trigger');
		const dialog = page.getByTestId('native-autofocus-modal');

		await trigger.click();
		await expect(dialog).toBeVisible();
		await expect(page.getByTestId('native-autofocus-input')).toBeFocused();
	});
});
