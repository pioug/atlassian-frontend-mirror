import { expect, test } from '@af/integration-testing';

/**
 * Drawer: focus contract on the top-layer code path.
 *
 * The top-layer `Drawer` renders as a native modal `<dialog>` (via the
 * `@atlaskit/top-layer` `Dialog` primitive). Per WCAG 2.4.3 (Focus Order) and
 * the top-layer focus rules:
 *
 * 1. Initial focus moves to the first focusable element on open (or to the
 *    element marked with the native HTML `autofocus` attribute when present).
 * 2. Closing the drawer (Escape) restores focus to the trigger.
 * 3. Tab / Shift+Tab cycle focus within the drawer (focus does not escape to
 *    elements behind the inert modal surface).
 *
 * `Drawer` has no `autoFocus` ref prop (unlike `ModalDialog`); its consumer
 * focus override is `shouldReturnFocus`, exercised in the top-layer
 * `drawer.spec.tsx`.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Drawer: top-layer focus contract', () => {
	test('initial focus: focus moves to the first focusable element on open', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'drawer',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('default-drawer-trigger').click();

		const dialog = page.getByTestId('default-drawer');
		await expect(dialog).toBeVisible();

		// The first focusable inside the drawer is the sidebar close button.
		await expect(page.getByTestId('DrawerCloseButton')).toBeFocused();
	});

	test('focus restoration: Escape restores focus to the trigger', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'drawer',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		const trigger = page.getByTestId('default-drawer-trigger');
		await trigger.click();
		await expect(page.getByTestId('default-drawer')).toBeVisible();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('default-drawer')).toBeHidden();
		await expect(trigger).toBeFocused();
	});

	// WCAG 2.4.3 Focus Order + HTML `<dialog>` focusing steps
	// (https://html.spec.whatwg.org/multipage/interactive-elements.html#dialog-focusing-steps).
	// When a descendant of the dialog carries the native HTML `autofocus`
	// attribute, focus must land on that element instead of the first
	// focusable. This matches both `<dialog>.showModal()` and the WAI-ARIA APG
	// Dialog pattern.
	test('initial focus: native [autofocus] element wins over the first focusable element', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'drawer',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('native-autofocus-drawer-trigger').click();

		const dialog = page.getByTestId('native-autofocus-drawer');
		await expect(dialog).toBeVisible();

		// The first focusable inside the drawer is the sidebar close button, but
		// the body input carries `autofocus`, so focus must land on the input.
		await expect(page.getByTestId('native-autofocus-input')).toBeFocused();
	});

	test('focus movement: Tab cycles focus forward within the drawer', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'drawer',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('multi-focusable-drawer-trigger').click();
		const dialog = page.getByTestId('multi-focusable-drawer');
		await expect(dialog).toBeVisible();

		// Walk forward through every focusable element in the drawer and verify
		// focus never escapes the dialog surface.
		const focusables = [
			page.getByTestId('DrawerCloseButton'),
			page.getByTestId('focusable-1'),
			page.getByTestId('focusable-2'),
			page.getByTestId('focusable-3'),
		];

		for (const target of focusables) {
			await expect(target).toBeFocused();
			await page.keyboard.press('Tab');
		}

		// After cycling past the last focusable, focus must remain inside the
		// drawer (focus wrap), never on a node behind it.
		const activeWithinDialog = await dialog.evaluate(
			(dialogElement) =>
				document.activeElement !== null && dialogElement.contains(document.activeElement),
		);
		expect(activeWithinDialog).toBe(true);
	});

	test('focus movement: Shift+Tab cycles focus backward within the drawer', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/98-testing-initial-focus-matrix.tsx')>(
			'design-system',
			'drawer',
			'testing-initial-focus-matrix',
			{ featureFlag },
		);

		await page.getByTestId('multi-focusable-drawer-trigger').click();
		const dialog = page.getByTestId('multi-focusable-drawer');
		await expect(dialog).toBeVisible();
		await expect(page.getByTestId('DrawerCloseButton')).toBeFocused();

		// From the first focusable, Shift+Tab wraps to the last, then walks back
		// up. Focus stays trapped within the drawer throughout.
		const backwardOrder = [
			page.getByTestId('focusable-3'),
			page.getByTestId('focusable-2'),
			page.getByTestId('focusable-1'),
			page.getByTestId('DrawerCloseButton'),
		];

		for (const target of backwardOrder) {
			await page.keyboard.press('Shift+Tab');
			await expect(target).toBeFocused();
		}
	});
});
