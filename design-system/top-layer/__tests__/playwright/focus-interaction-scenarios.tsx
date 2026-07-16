import { type Locator, type Page } from '@af/integration-testing';

/**
 * Interaction modality used to activate a trigger in the focus tests.
 *
 * Focus behaviour is modality-dependent on macOS Safari: a mouse click does NOT
 * focus a `<button>` (AppKit convention), whereas keyboard activation does. So
 * the "focus returns to the trigger on dismiss" contract only holds for keyboard
 * interaction on WebKit — for mouse, Safari has no trigger focus to restore.
 * Tests run once per scenario (see `focusInteractionScenarios`), skipping the
 * mouse variant on WebKit via `test.fixme(scenario.skipFocusRestorationOnWebKit
 * && browserName === 'webkit', ...)`.
 *
 * See notes/decisions/safari-escape-nested-popover-in-dialog.md
 */
export type TScenario = {
	/**
	 * Interaction modality. Included in the generated test title.
	 */
	method: 'mouse' | 'keyboard';
	/**
	 * Activate the trigger to open its layer.
	 * - `mouse`: a real click (does not focus a `<button>` on macOS Safari).
	 * - `keyboard`: focus, then Enter (focuses on every platform, as if tabbed to).
	 */
	activate: (args: { page: Page; trigger: Locator }) => Promise<void>;
	/**
	 * `true` when focus-restoration assertions do not hold on WebKit for this
	 * modality. Pair with `test.fixme(... && browserName === 'webkit', ...)`.
	 */
	skipFocusRestorationOnWebKit: boolean;
};

/**
 * The two interaction scenarios every focus test is generated for. Loop over
 * these and skip the mouse variant on WebKit with `test.fixme(...)` and
 * `MOUSE_FOCUS_WEBKIT_FIXME_REASON`; see `activation-focus-restore.spec.tsx` for
 * the pattern.
 */
export const focusInteractionScenarios: TScenario[] = [
	{
		method: 'mouse',
		activate: async ({ trigger }) => {
			await trigger.click();
		},
		skipFocusRestorationOnWebKit: true,
	},
	{
		method: 'keyboard',
		activate: async ({ page, trigger }) => {
			await trigger.focus();
			await page.keyboard.press('Enter');
		},
		skipFocusRestorationOnWebKit: false,
	},
];

/**
 * Shared `test.fixme` reason for mouse-interaction focus-restoration on WebKit.
 */
export const MOUSE_FOCUS_WEBKIT_FIXME_REASON =
	'macOS Safari does not focus a <button> on click (AppKit convention), so focus does not return to the trigger for mouse interaction; the keyboard scenario covers focus restoration on WebKit. See notes/decisions/safari-escape-nested-popover-in-dialog.md';
