import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `InlineDialog` running on the top-layer path.
 *
 * `InlineDialog` is a `role="dialog"` popover. `top-layer/useInitialFocus`
 * therefore prefers the first element with the native HTML `autofocus`
 * attribute, falling back to the first focusable element.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.beforeEach(async ({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('InlineDialog top-layer — initial focus matrix', () => {
	test('default content focuses the first focusable element inside the dialog', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/99-testing-initial-focus-matrix.tsx')
		>('design-system', 'inline-dialog', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		await page.getByTestId('default-inline-dialog-trigger').click();

		await expect(page.getByTestId('default-inline-dialog-content')).toBeVisible();
		await expect(page.getByTestId('default-inline-dialog-first-button')).toBeFocused();
	});

	test('content with native [autofocus] element focuses that element', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../examples/99-testing-initial-focus-matrix.tsx')
		>('design-system', 'inline-dialog', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		await page.getByTestId('autofocus-inline-dialog-trigger').click();

		await expect(page.getByTestId('autofocus-inline-dialog-content')).toBeVisible();
		await expect(page.getByTestId('autofocus-inline-dialog-input')).toBeFocused();
	});
});
