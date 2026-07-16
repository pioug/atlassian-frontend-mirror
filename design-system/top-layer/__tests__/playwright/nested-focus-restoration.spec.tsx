/* eslint-disable testing-library/prefer-screen-queries */
import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

import {
	focusInteractionScenarios,
	MOUSE_FOCUS_WEBKIT_FIXME_REASON,
} from './focus-interaction-scenarios';

// Nested-popover focus restoration coverage.
//
// The native HTML Popover API only restores focus for the OUTERMOST
// `popover="auto"`. Nested popovers close with `shouldRestoreFocus: false`,
// so for focus-capturing roles (dialog, menu, listbox, alertdialog, tree,
// grid) Popover must run an internal fallback: snapshot `document.activeElement`
// in `beforetoggle` (newState='open') and restore it on close.
//
// Passive roles (tooltip) do not move focus on open, so no restoration is
// required and the snapshot is a no-op.
//
// Every focus-return test is generated for both modalities (`focusInteractionScenarios`);
// the mouse variant is skipped on WebKit. See notes/decisions/safari-escape-nested-popover-in-dialog.md
//
// WCAG 2.4.3 Focus Order

// Roles whose `useInitialFocus` implementation actually moves focus into
// the popover on open. `shouldFocusIntoPopover` also returns true for `tree`
// and `grid`, but `getInitialFocusTarget` does not yet implement those roles
// (see src/internal/use-initial-focus.tsx). Without focus moving into the
// popover, the restoration check `element.contains(document.activeElement)`
// is false and the snapshot path is a no-op for those roles. The tree/grid
// gap is tracked separately from this restoration work.
const FOCUS_CAPTURING_ROLES = [
	{ role: 'dialog', prefix: 'inner-dialog', innerFocusableTestId: 'inner-button' },
	{ role: 'alertdialog', prefix: 'inner-alertdialog', innerFocusableTestId: 'inner-button' },
	{ role: 'menu', prefix: 'inner-menu', innerFocusableTestId: 'inner-menuitem' },
	{ role: 'listbox', prefix: 'inner-listbox', innerFocusableTestId: 'inner-option' },
] as const;

test.describe('Nested popover focus restoration - focus-capturing roles', () => {
	for (const { role, prefix, innerFocusableTestId } of FOCUS_CAPTURING_ROLES) {
		for (const scenario of focusInteractionScenarios) {
			test(`role="${role}" nested in dialog: Escape restores focus to nested trigger (${scenario.method})`, async ({
				page,
				browserName,
			}) => {
				test.fixme(
					scenario.skipFocusRestorationOnWebKit && browserName === 'webkit',
					MOUSE_FOCUS_WEBKIT_FIXME_REASON,
				);
				await page.visitExample<
					typeof import('../../examples/140-testing-nested-focus-restoration.tsx')
				>('design-system', 'top-layer', 'testing-nested-focus-restoration');

				// Open the outer dialog to establish the nested context.
				await scenario.activate({ page, trigger: page.getByTestId('outer-trigger') });
				await expect(page.getByTestId('outer-popover')).toBeVisible();

				// Open the inner focus-capturing popover.
				const innerTrigger = page.getByTestId(`${prefix}-trigger`);
				await scenario.activate({ page, trigger: innerTrigger });
				const innerPopover = page.getByTestId(`${prefix}-popover`);
				await expect(innerPopover).toBeVisible();

				// Wait for `useInitialFocus` to move focus into the popover so the
				// restoration path is the one we are exercising (focus inside the
				// closing element).
				await expect(page.getByTestId(innerFocusableTestId)).toBeFocused();

				// Dismiss via Escape. The browser does NOT restore focus for nested
				// popovers, so Popover's internal fallback must move it back to the
				// trigger.
				await page.keyboard.press('Escape');
				await expect(innerPopover).toBeHidden();
				await expect(innerTrigger).toBeFocused();

				// The outer dialog stays open so the user keeps their place.
				await expect(page.getByTestId('outer-popover')).toBeVisible();
			});

			test(`role="${role}" nested in dialog: programmatic close restores focus to nested trigger (${scenario.method})`, async ({
				page,
				browserName,
			}) => {
				test.fixme(
					scenario.skipFocusRestorationOnWebKit && browserName === 'webkit',
					MOUSE_FOCUS_WEBKIT_FIXME_REASON,
				);
				await page.visitExample<
					typeof import('../../examples/140-testing-nested-focus-restoration.tsx')
				>('design-system', 'top-layer', 'testing-nested-focus-restoration');

				await scenario.activate({ page, trigger: page.getByTestId('outer-trigger') });
				await expect(page.getByTestId('outer-popover')).toBeVisible();

				const innerTrigger = page.getByTestId(`${prefix}-trigger`);
				// First activation opens, second toggles closed (programmatic).
				await scenario.activate({ page, trigger: innerTrigger });
				await expect(page.getByTestId(`${prefix}-popover`)).toBeVisible();

				await scenario.activate({ page, trigger: innerTrigger });
				await expect(page.getByTestId(`${prefix}-popover`)).toBeHidden();

				// Trigger keeps focus after the toggle (it is the activation target).
				// Verifies the snapshot/restore path does not stomp the already-focused
				// trigger.
				await expect(innerTrigger).toBeFocused();
			});
		}

		test(`role="${role}" nested in dialog: click-outside closes the popover stack`, async ({
			page,
		}) => {
			await page.visitExample<
				typeof import('../../examples/140-testing-nested-focus-restoration.tsx')
			>('design-system', 'top-layer', 'testing-nested-focus-restoration');

			await page.getByTestId('outer-trigger').click();
			await expect(page.getByTestId('outer-popover')).toBeVisible();

			const innerTrigger = page.getByTestId(`${prefix}-trigger`);
			await innerTrigger.click();
			const innerPopover = page.getByTestId(`${prefix}-popover`);
			await expect(innerPopover).toBeVisible();
			await expect(page.getByTestId(innerFocusableTestId)).toBeFocused();

			// Click outside the popovers. Light dismiss closes the entire auto
			// stack (inner + outer) in a single event sequence. Per the HTML
			// Popover spec, light dismiss uses `focusPreviousElement=false`,
			// so neither the browser nor our internal restore moves focus back
			// to a trigger - the click target keeps focus.
			const viewport = page.viewportSize();
			invariant(viewport, 'Playwright viewport size should be defined');
			await page.mouse.click(viewport.width - 1, viewport.height - 1);

			await expect(innerPopover).toBeHidden();
			await expect(page.getByTestId('outer-popover')).toBeHidden();
			// Our internal restore is gated by `closeReason === 'escape'` or
			// programmatic, so click-outside intentionally skips it. The outer
			// trigger does not regain focus, matching native browser behavior.
			await expect(page.getByTestId('outer-trigger')).not.toBeFocused();
		});
	}
});

test.describe('Nested popover focus restoration - passive roles', () => {
	// Tooltip never moves focus on open, so the three-guard check
	// (`shouldFocusIntoPopover({ role: 'tooltip' })` returns false) short-circuits
	// before any restoration is attempted. Focus must remain on the trigger.
	// Generated for both modalities; mouse open skipped on WebKit.
	for (const scenario of focusInteractionScenarios) {
		test(`role="tooltip" nested in dialog: tooltip open and close do not steal or move focus (${scenario.method})`, async ({
			page,
			browserName,
		}) => {
			test.fixme(
				scenario.skipFocusRestorationOnWebKit && browserName === 'webkit',
				MOUSE_FOCUS_WEBKIT_FIXME_REASON,
			);
			await page.visitExample<
				typeof import('../../examples/140-testing-nested-focus-restoration.tsx')
			>('design-system', 'top-layer', 'testing-nested-focus-restoration');

			await page.getByTestId('outer-trigger').click();
			await expect(page.getByTestId('outer-popover')).toBeVisible();

			// Show the tooltip via the interaction modality (fixture wires a click/
			// activate toggle on the trigger).
			const tooltipTrigger = page.getByTestId('inner-tooltip-trigger');
			await scenario.activate({ page, trigger: tooltipTrigger });
			await expect(page.getByTestId('inner-tooltip-popover')).toBeVisible();

			// Focus must remain on the trigger - tooltip never moves focus into itself.
			await expect(tooltipTrigger).toBeFocused();

			// Close via Escape and verify the trigger still has focus.
			await page.keyboard.press('Escape');
			await expect(page.getByTestId('inner-tooltip-popover')).toBeHidden();
			await expect(tooltipTrigger).toBeFocused();
		});
	}
});

test.describe('Nested popover focus restoration - outer is always restored by browser', () => {
	// Sanity check: closing the outer (outermost) dialog via Escape uses the
	// browser's native restoration path. Generated for both modalities; mouse open
	// skipped on WebKit.
	for (const scenario of focusInteractionScenarios) {
		test(`outer dialog: Escape restores focus to outer trigger natively (${scenario.method})`, async ({
			page,
			browserName,
		}) => {
			test.fixme(
				scenario.skipFocusRestorationOnWebKit && browserName === 'webkit',
				MOUSE_FOCUS_WEBKIT_FIXME_REASON,
			);
			await page.visitExample<
				typeof import('../../examples/140-testing-nested-focus-restoration.tsx')
			>('design-system', 'top-layer', 'testing-nested-focus-restoration');

			const outerTrigger = page.getByTestId('outer-trigger');
			await scenario.activate({ page, trigger: outerTrigger });
			await expect(page.getByTestId('outer-popover')).toBeVisible();

			// Move focus inside the outer dialog so we can verify the browser
			// performs the restoration.
			const innerButton = page.getByTestId('inner-dialog-trigger');
			await innerButton.focus();
			await expect(innerButton).toBeFocused();

			await page.keyboard.press('Escape');
			await expect(page.getByTestId('outer-popover')).toBeHidden();
			await expect(outerTrigger).toBeFocused();
		});
	}
});
