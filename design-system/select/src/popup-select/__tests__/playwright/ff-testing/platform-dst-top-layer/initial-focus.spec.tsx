import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `PopupSelect` running on the top-layer path.
 *
 * `PopupSelect` always renders react-select inside a `role="dialog"`
 * popover, so `top-layer/useInitialFocus` moves focus to the first
 * focusable element inside the popover — the react-select search input.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.beforeEach(async ({ skipAxeCheck }) => {
	skipAxeCheck();
});

test.describe('PopupSelect top-layer — initial focus matrix', () => {
	test('opens with focus on the react-select search input', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/97-testing-initial-focus-matrix.tsx')
		>('design-system', 'select', 'testing-initial-focus-matrix', {
			featureFlag,
		});

		await page.getByTestId('initial-focus-popup-select-trigger').click();

		const menu = page.getByTestId('initial-focus-popup-select--menu');
		await expect(menu).toBeVisible();

		// react-select renders its search input inside the popover; the
		// first focusable should be the combobox input.
		const searchInput = page.getByRole('combobox');
		await expect(searchInput).toBeFocused();
	});
});
