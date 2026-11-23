import { expect, type Page, test } from '@af/integration-testing';

/**
 * Popup: focus contract on the top-layer code path.
 *
 * `Popup` is a generic positioned overlay whose initial-focus behaviour
 * depends on the `role` prop. The tests in this
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
 * - `autoFocus={false}`: no effect; a dialog popup still takes focus.
 *
 * Escape-to-restore and Tab cycling are also exercised for the default
 * dialog case as representative top-layer focus-trap behaviour.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

/**
 * Safari's default Tab reaches only text fields, and WebKit in Playwright does the same. Alt+Tab
 * reaches every control, as Tab does in the other engines.
 */
function getTabKey({ browserName }: { browserName: string }): string {
	return browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
}

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

	// WCAG 2.1.2 No Keyboard Trap: a popup with no role does not trap focus. Tab moves out of it
	// in DOM order and the popup stays open. A later Escape does not pull focus back to the trigger.
	test('Tab out of a popup with no role leaves it open, and a later Escape leaves focus outside', async ({
		page,
		browserName,
	}) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);
		const tabKey = getTabKey({ browserName });
		const trigger = page.getByTestId('no-role-popup-trigger');
		const content = page.getByTestId('no-role-popup-content');
		await trigger.focus();
		await page.keyboard.press('Enter');
		await expect(content).toBeVisible();

		await page.keyboard.press(tabKey);
		await expect(page.getByTestId('no-role-popup-first-button')).toBeFocused();
		await page.keyboard.press(tabKey);

		const focusedOutside = await page.evaluateHandle(() => document.activeElement);
		const isOutsidePopup = await page.evaluate(
			(element) =>
				element !== null &&
				element !== document.body &&
				!document.querySelector('[data-testid="no-role-popup-content"]')?.contains(element) &&
				element !== document.querySelector('[data-testid="no-role-popup-trigger"]'),
			focusedOutside,
		);
		expect(isOutsidePopup).toBe(true);
		await expect(content).toBeVisible();

		// Focus on the combobox opens its listbox popup. A layer that opens does not close the popup,
		// and one Escape closes one layer, the later one first.
		const listbox = page.getByTestId('combobox-controls-popup-content');
		await expect(listbox).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(listbox).toBeHidden();
		await expect(content).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(content).toBeHidden();
		expect(
			await page.evaluate((element) => document.activeElement === element, focusedOutside),
		).toBe(true);
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

	// `autoFocus` has no effect on the top-layer path: the role decides. See
	// `top-layer/notes/decisions/role-and-focus.md`.
	test('initial focus: `autoFocus={false}` does not stop a dialog popup taking focus', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'popup',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('auto-focus-disabled-popup-trigger').click();
		await expect(page.getByTestId('auto-focus-disabled-popup-content')).toBeVisible();

		await expect(page.getByTestId('auto-focus-disabled-popup-first-button')).toBeFocused();
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

async function visitMatrix({ page, isTopLayer }: { page: Page; isTopLayer: boolean }) {
	await page.visitExample<typeof import('../../examples/97-testing-initial-focus-matrix.tsx')>(
		'design-system',
		'popup',
		'testing-initial-focus-matrix',
		isTopLayer ? { featureFlag } : undefined,
	);
}

// Waits two frames, so work that runs after a paint (effects, animation frames) has run.
async function waitForFrames({ page }: { page: Page }) {
	await page.evaluate(
		() =>
			new Promise((resolve) => {
				requestAnimationFrame(() => requestAnimationFrame(resolve));
			}),
	);
}

/**
 * The popup moves focus only as it opens. A target that the content sets later does not take focus.
 * See `@atlaskit/top-layer` `notes/decisions/react-autofocus-and-focus-on-open.md`.
 */
test.describe('Popup: top-layer focus timing', () => {
	test('a `setInitialFocusRef` target that mounts after the open does not take focus', async ({
		page,
	}) => {
		await visitMatrix({ page, isTopLayer: true });

		await page.getByTestId('late-target-popup-trigger').click();
		await expect(page.getByTestId('late-target-popup-first-button')).toBeFocused();

		await expect(page.getByTestId('late-target-popup-target')).toBeVisible();
		await waitForFrames({ page });

		await expect(page.getByTestId('late-target-popup-first-button')).toBeFocused();
	});

	test('a target that the content sets in a `useEffect` does not take focus', async ({ page }) => {
		await visitMatrix({ page, isTopLayer: true });

		await page.getByTestId('effect-target-popup-trigger').click();
		await expect(page.getByTestId('effect-target-popup-content')).toHaveAttribute(
			'data-is-target-set',
			'true',
		);
		await waitForFrames({ page });

		await expect(page.getByTestId('effect-target-popup-first-button')).toBeFocused();
	});

	test('`UNSAFE__disableInitialAutoFocus` moves no focus, so the content can move it later', async ({
		page,
	}) => {
		await visitMatrix({ page, isTopLayer: true });
		const trigger = page.getByTestId('disabled-initial-focus-popup-trigger');

		// From the keyboard, so the trigger has focus before the open in every browser.
		await trigger.press('Enter');
		await expect(page.getByTestId('disabled-initial-focus-popup-content')).toBeVisible();
		// Without the opt-out, the dialog role would focus the first button.
		await expect(trigger).toBeFocused();

		await expect(page.getByTestId('disabled-initial-focus-popup-target')).toBeFocused();
	});

	test('`PopupContent`: a `setInitialFocusRef` target that mounts after the open does not take focus', async ({
		page,
	}) => {
		await visitMatrix({ page, isTopLayer: true });

		await page.getByTestId('popup-content-late-target-trigger').click();
		await expect(page.getByTestId('popup-content-late-target-first-button')).toBeFocused();

		await expect(page.getByTestId('popup-content-late-target-target')).toBeVisible();
		await waitForFrames({ page });

		await expect(page.getByTestId('popup-content-late-target-first-button')).toBeFocused();
	});
});

/**
 * The legacy path runs its focus trap again when the target changes, so a late target takes focus
 * there.
 */
test.describe('Popup: legacy focus timing', () => {
	test('a `setInitialFocusRef` target that mounts after the open takes focus', async ({ page }) => {
		await visitMatrix({ page, isTopLayer: false });

		await page.getByTestId('late-target-popup-trigger').click();
		await expect(page.getByTestId('late-target-popup-content')).toBeVisible();

		await expect(page.getByTestId('late-target-popup-target')).toBeFocused();
	});
});
