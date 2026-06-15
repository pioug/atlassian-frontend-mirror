import { expect, test } from '@af/integration-testing';

/**
 * Popup: focus contract on the top-layer code path.
 *
 * `Popup` is a generic positioned overlay whose initial-focus behaviour
 * depends on the `role` prop and the `autoFocus` prop. The tests in this
 * spec exercise each branch of `top-layer/useInitialFocus` reachable
 * through the public `Popup` API:
 *
 * - `role="dialog"`: focus moves to the first focusable inside the popup
 *   (default case), or to an element carrying the native HTML `autofocus`
 *   attribute when present.
 * - no `role`: focus stays on the trigger; no focus movement is performed.
 * - `role="listbox"`: focus prefers `[aria-selected="true"]` over the
 *   first option, except when the popup is owned by a combobox.
 * - combobox carve-outs: focus stays on the combobox input when the popup
 *   is its owned listbox, whether the combobox is the trigger or rendered
 *   outside the popup element (react-select pattern).
 * - `autoFocus={false}`: focus stays on the trigger regardless of role.
 *
 * Escape-to-restore and Tab cycling are also exercised for the default
 * dialog case as representative top-layer focus-trap behaviour.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Popup: top-layer focus contract', () => {
	test('initial focus: focus moves to first focusable on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('dialog-popup-trigger').click();
		await expect(page.getByTestId('dialog-popup-content')).toBeVisible();

		await expect(page.getByTestId('dialog-popup-first-button')).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('dialog-popup-trigger');
		await trigger.click();
		await expect(page.getByTestId('dialog-popup-content')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('dialog-popup-content')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	test('focus movement: Tab moves focus between focusable elements within the popup', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('dialog-popup-trigger').click();
		await expect(page.getByTestId('dialog-popup-content')).toBeVisible();

		const first = page.getByTestId('dialog-popup-first-button');
		const second = page.getByTestId('dialog-popup-second-button');

		await expect(first).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(second).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Dialog pattern
	// (https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
	// For `role="dialog"`, when a descendant carries the native HTML
	// `autofocus` attribute, focus must land on that element instead of
	// the first focusable in source order.
	test('initial focus: native [autofocus] element wins for role="dialog"', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('autofocus-dialog-popup-trigger').click();
		await expect(page.getByTestId('autofocus-dialog-popup-content')).toBeVisible();

		// The popup's first focusable is a button, but a sibling
		// `<input>` carries `autofocus`, so focus must land on the
		// input.
		await expect(page.getByTestId('autofocus-dialog-popup-input')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order (no opinionated movement when no role is
	// declared). The Popover API does not move focus on open; ARIA roles
	// such as `dialog` / `menu` / `listbox` are what trigger the
	// initial-focus contract. A popover without a role has no APG
	// pattern, so focus must stay on the trigger.
	test('initial focus: no `role` prop keeps focus on the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('no-role-popup-trigger');
		// Explicitly focus the trigger before clicking so the assertion
		// reflects the contract under test (focus is preserved across
		// open). `button.click()` does not synchronously focus the
		// element on every browser engine (notably WebKit), so we cannot
		// rely on the click as the focus trigger here.
		await trigger.focus();
		await trigger.click();
		await expect(page.getByTestId('no-role-popup-content')).toBeVisible();

		// Without a role, the popup is `tabIndex={-1}` and is not a
		// useful focus target, so focus remains on the trigger.
		await expect(trigger).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Listbox pattern
	// (https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).
	// "If an option is selected, focus is set on the selected option."
	// Focus must land on `[aria-selected="true"]` rather than the first
	// `[role="option"]`.
	test('initial focus: listbox prefers `[aria-selected="true"]` over the first option', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('selected-option-listbox-popup-trigger').click();
		await expect(page.getByTestId('selected-option-listbox-popup-content')).toBeVisible();

		await expect(page.getByTestId('selected-option-listbox-option-2')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Combobox pattern
	// (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
	// "DOM focus remains on the combobox... the listbox does not
	// receive focus." When the combobox's `aria-controls` references the
	// popup id, focus must remain on the combobox input so the user can
	// keep typing; the active option is surfaced via
	// `aria-activedescendant`.
	test('initial focus: combobox-controlled listbox keeps focus on the combobox input', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const combobox = page.getByTestId('combobox-controls-input');
		await combobox.focus();
		await expect(page.getByTestId('combobox-controls-popup-content')).toBeVisible();

		await expect(combobox).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order. Carve-out scoping: the APG Combobox
	// exception only applies when the focused combobox's `aria-controls`
	// references this popup. An unrelated combobox on the page must not
	// block the standard listbox initial-focus behaviour.
	test('initial focus: an unrelated combobox does not block focus movement into the listbox', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		// Focus an unrelated combobox first so it is the active element
		// at the moment the popup opens. Its `aria-controls` points
		// elsewhere, so the carve-out must not apply.
		await page.getByTestId('unrelated-combobox-input').focus();
		await page.getByTestId('unrelated-combobox-popup-trigger').click();
		await expect(page.getByTestId('unrelated-combobox-popup-content')).toBeVisible();

		await expect(page.getByTestId('unrelated-combobox-option-1')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Combobox pattern
	// (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/).
	// The combobox-carve-out is scoped by the `aria-controls`
	// relationship, not by DOM containment. The `react-select` pattern
	// portals the listbox separately from the textbox, so focus must
	// still stay on the external input.
	test('initial focus: external combobox (react-select pattern) keeps focus on the input', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const combobox = page.getByTestId('external-combobox-input');
		await combobox.focus();
		await expect(page.getByTestId('external-combobox-popup-content')).toBeVisible();

		await expect(combobox).toBeFocused();
	});

	// Consumer escape hatch. `autoFocus={false}` disables Popup's
	// initial-focus behaviour entirely. Note: pairing `autoFocus={false}`
	// with `role="dialog"` deviates from the WAI-ARIA APG Dialog
	// pattern, which expects focus to move into the dialog on open.
	// The escape hatch is intended for patterns where the popup is
	// visual-only (e.g. a hover-card / tooltip-like surface) and must
	// not be combined with a focus-receiving role in production code.
	test('initial focus: `autoFocus={false}` keeps focus on the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('auto-focus-disabled-popup-trigger');
		// Explicitly focus the trigger before clicking so the assertion
		// reflects the contract under test (focus is preserved across
		// open). `button.click()` does not synchronously focus the
		// element on every browser engine (notably WebKit).
		await trigger.focus();
		await trigger.click();
		await expect(page.getByTestId('auto-focus-disabled-popup-content')).toBeVisible();

		await expect(trigger).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order. `Popup`'s `content` render prop exposes
	// `setInitialFocusRef` so consumers can override the default
	// `getInitialFocusTarget` resolution and pick a specific element to
	// focus on open. The consumer-supplied ref must win over the role-
	// based default (first focusable for `role="dialog"`).
	test('initial focus: consumer-supplied `setInitialFocusRef` overrides the role-based default', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('set-initial-focus-ref-popup-trigger').click();
		await expect(page.getByTestId('set-initial-focus-ref-popup-content')).toBeVisible();

		// The first focusable in the popup is the first button, but the
		// consumer wired `setInitialFocusRef` to the second button.
		await expect(page.getByTestId('set-initial-focus-ref-popup-second-button')).toBeFocused();
	});
});
