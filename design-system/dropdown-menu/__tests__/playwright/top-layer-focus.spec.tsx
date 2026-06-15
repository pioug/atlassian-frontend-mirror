import invariant from 'tiny-invariant';

import { expect, test } from '@af/integration-testing';

/**
 * Dropdown menu: focus contract on the top-layer code path.
 *
 * `DropdownMenu` renders a `role="menu"` popover. The focus contract is:
 *
 * 1. Initial focus moves to the first menu item on open.
 * 2. Escape closes the menu and restores focus to the trigger.
 * 3. ArrowDown moves focus to the next menu item within the menu.
 *
 * `DropdownMenu` also exposes an `autoFocus` boolean prop that overrides
 * the trigger-source heuristic (focus the first item only when the
 * trigger was activated via the keyboard) and forces focus to the first
 * menu item whenever the menu opens. This spec exercises both variants.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Dropdown menu: top-layer focus contract', () => {
	test('initial focus: focus moves to the first menu item on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await page.getByTestId('dropdown--trigger').click();

		await expect(page.getByTestId('dropdown-item-1')).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('dropdown--trigger');
		await trigger.click();
		await expect(page.getByTestId('dropdown-item-1')).toBeFocused();

		await page.keyboard.press('Escape');
		await expect(trigger).toBeFocused();
	});

	test('focus movement: ArrowDown moves focus between menu items', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await page.getByTestId('dropdown--trigger').click();
		await expect(page.getByTestId('dropdown-item-1')).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(page.getByTestId('dropdown-item-2')).toBeFocused();

		await page.keyboard.press('ArrowDown');
		await expect(page.getByTestId('dropdown-item-3')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Menu Button pattern
	// (https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/).
	// "Enter / Space / Down Arrow: Opens the menu and moves focus to the
	// first menu item." Keyboard activation must move focus to the
	// first menu item even when `autoFocus` is left at its default.
	test('initial focus: keyboard-triggered open focuses the first menu item (default `autoFocus={false}`)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('dropdown--trigger');
		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(page.getByTestId('dropdown-item-1')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Menu Button pattern. The
	// `defaultOpen` prop mounts the menu in the open state, so there is
	// no trigger interaction to source focus from. The menu must still
	// move focus to the first menu item on mount, exercising the
	// mount-time open path of `useInitialFocus`.
	test('initial focus: `defaultOpen` focuses the first menu item on mount', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		await expect(page.getByTestId('dropdown-default-open-item-1')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order. `returnFocusRef` lets a consumer redirect
	// Escape-restoration to a different element than the trigger. The
	// dropdown's focus-restoration code runs after the browser's native
	// trigger restoration, so the consumer-supplied target must win.
	test('focus restoration: `returnFocusRef` redirects Escape focus to a sibling element', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('dropdown-return-focus-ref--trigger');
		await trigger.focus();
		await page.keyboard.press('Enter');

		await expect(page.getByTestId('dropdown-return-focus-ref-item-1')).toBeFocused();

		await page.keyboard.press('Escape');

		// Focus must land on the consumer-supplied target, not on the
		// trigger that opened the menu.
		await expect(page.getByTestId('dropdown-return-focus-ref-target')).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + WAI-ARIA APG Menu Button pattern. The
	// `autoFocus` prop is an opt-in override of the default
	// trigger-source heuristic (focus the first item only on keyboard
	// open). With `autoFocus={true}`, focus must move to the first
	// menu item regardless of how the trigger was activated, which is
	// the strict APG behaviour.
	test('initial focus: `autoFocus={true}` focuses the first menu item even on real mouse open', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/testing-top-layer-focus.tsx')>(
			'design-system',
			'dropdown-menu',
			'testing-top-layer-focus',
			{ featureFlag },
		);

		const trigger = page.getByTestId('dropdown-autofocus--trigger');
		const box = await trigger.boundingBox();
		invariant(box, 'autoFocus dropdown trigger should have a bounding box');

		// Drive a real mouse click with non-zero coordinates so the
		// dropdown's trigger-source heuristic classifies it as a mouse
		// (not keyboard) activation. `autoFocus={true}` must still
		// pull focus onto the first menu item.
		await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

		await expect(page.getByTestId('dropdown-autofocus-item-1')).toBeFocused();
	});
});
