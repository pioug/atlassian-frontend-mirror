import { expect, test } from '@af/integration-testing';

/**
 * Select (`PopupSelect`): focus contract on the top-layer code path.
 *
 * `PopupSelect` renders react-select inside a `role="dialog"` popover. The
 * first focusable inside the popover is the react-select search input, so
 * the focus contract is:
 *
 * 1. Initial focus moves to the search input on open.
 * 2. Escape closes the popup and restores focus to the trigger.
 * 3. ArrowDown moves the highlighted option (focus stays on the search input
 *    via `aria-activedescendant`, but the highlighted option changes).
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('PopupSelect: top-layer focus contract', () => {
	test('initial focus: focus moves to the search input on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'select',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('initial-focus-popup-select-trigger').click();

		const input = page.getByTestId('initial-focus-popup-select-select--input');
		await expect(input).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'select',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('initial-focus-popup-select-trigger');
		await trigger.click();
		await expect(page.getByTestId('initial-focus-popup-select-select--input')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Combobox pattern. The
	// `defaultIsOpen` prop mounts the PopupSelect already-open, so there
	// is no trigger interaction to source focus from. The combobox
	// carve-out in `useInitialFocus` must still apply, leaving focus on
	// the react-select search input on mount.
	test('initial focus: `defaultIsOpen` focuses the search input on mount', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'select',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await expect(page.getByTestId('default-open-popup-select-select--input')).toBeFocused();
	});

	test('focus movement: ArrowDown moves the highlighted option', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'select',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('initial-focus-popup-select-trigger').click();
		const input = page.getByTestId('initial-focus-popup-select-select--input');
		await expect(input).toBeFocused();

		await page.keyboard.press('ArrowDown');

		// The combobox input itself keeps focus; the active option is tracked
		// via aria-activedescendant. Assert the input still owns focus and
		// references an option element after movement.
		await expect(input).toBeFocused();
		await expect(input).toHaveAttribute('aria-activedescendant', /option/);
	});
});
