import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `PopupSelect` running on the top-layer path.
 *
 * `PopupSelect` always renders react-select inside a `role="dialog"`
 * popover, so `top-layer/useInitialFocus` moves focus to the first
 * focusable element inside the popover — the react-select search input.
 *
 * Each test uses its own single-PopupSelect fixture. An earlier version of
 * this spec rendered two PopupSelects (one closed, one `defaultIsOpen`) on
 * a single page, which raced the second popover's light-dismiss and
 * focus-restoration against the first popover's `useInitialFocus` and
 * caused intermittent failures where neither popover stayed open.
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

		const searchInput = page.locator('#initial-focus-popup-select-input');
		await expect(searchInput).toBeFocused();
	});

	test('mounted with `defaultIsOpen` focuses the react-select search input', async ({ page }) => {
		await page.visitExample<
			typeof import('../../../../../../examples/98-testing-initial-focus-default-open.tsx')
		>('design-system', 'select', 'testing-initial-focus-default-open', {
			featureFlag,
		});

		const menu = page.getByTestId('default-open-popup-select--menu');
		await expect(menu).toBeVisible();

		const searchInput = page.locator('#default-open-popup-select-input');
		await expect(searchInput).toBeFocused();
	});
});
