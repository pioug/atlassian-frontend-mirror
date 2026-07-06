import { expect, test } from '@af/integration-testing';

/**
 * Initial-focus matrix for `Drawer` running on the top-layer path.
 *
 * The top-layer `Drawer` renders a native modal `<dialog>` (via the
 * `@atlaskit/top-layer` `Dialog` primitive), so `showModal()` owns initial
 * focus: it focuses the first element carrying the native HTML `autofocus`
 * attribute, falling back to the first focusable descendant (the sidebar close
 * button).
 *
 * The broader focus contract (restoration on close, focus wrapping) lives in
 * `__tests__/playwright/top-layer-focus.spec.tsx`.
 *
 * See: `platform/packages/design-system/top-layer/notes/architecture/focus.md`.
 */

const featureFlag = 'platform-dst-top-layer';

test.describe('Drawer top-layer — initial focus matrix', () => {
	test('default drawer focuses the first focusable element (sidebar close button)', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/98-testing-initial-focus-matrix.tsx')
		>('design-system', 'drawer', 'testing-initial-focus-matrix', { featureFlag });

		await page.getByTestId('default-drawer-trigger').click();

		const dialog = page.getByTestId('default-drawer');
		await expect(dialog).toBeVisible();

		// The sidebar close button is the first focusable element.
		await expect(page.getByTestId('DrawerCloseButton')).toBeFocused();
	});

	test('drawer with a native [autofocus] element focuses that element instead of the close button', async ({
		page,
	}) => {
		await page.visitExample<
			typeof import('../../../../../examples/98-testing-initial-focus-matrix.tsx')
		>('design-system', 'drawer', 'testing-initial-focus-matrix', { featureFlag });

		await page.getByTestId('native-autofocus-drawer-trigger').click();

		const dialog = page.getByTestId('native-autofocus-drawer');
		await expect(dialog).toBeVisible();

		// `showModal()` prefers the [autofocus] element over the first focusable,
		// even though the close button comes first in source order.
		await expect(page.getByTestId('native-autofocus-input')).toBeFocused();
	});
});
