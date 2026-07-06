import { expect, test } from '@af/integration-testing';

/**
 * SSR + hydration startup parity for `Drawer` that is open on initial render.
 *
 * Both paths must reach a correct, visible state after the example is
 * server-rendered and hydrated:
 * - Flag off (legacy Portal + Blanket path): the panel renders and is visible.
 * - Flag on (top-layer path): the native `<dialog>` is upgraded via
 *   `showModal()` after hydration, so it ends up visible with the `open`
 *   attribute set.
 *
 * See: `platform/packages/design-system/top-layer/notes/rules/testing.md`
 * (Integration and Migration → "Component works after SSR hydration").
 */

test.describe('Drawer - SSR startup parity', () => {
	test('opens as part of initial render with feature flag off (legacy path)', async ({ page }) => {
		await page.visitExample<typeof import('../../../examples/97-ssr-initial-open.tsx')>(
			'design-system',
			'drawer',
			'ssr-initial-open',
		);

		await expect(page.getByTestId('ssr-initial-open-drawer')).toBeVisible();
		await expect(page.getByTestId('ssr-initial-open-drawer-body')).toBeVisible();
	});

	test('opens as part of initial render with feature flag on (top-layer path)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/97-ssr-initial-open.tsx')>(
			'design-system',
			'drawer',
			'ssr-initial-open',
			{
				featureFlag: 'platform-dst-top-layer',
			},
		);

		// The `open` attribute is the spec-defined signal that `showModal()` ran
		// after hydration.
		const dialog = page.locator('dialog[data-testid="ssr-initial-open-drawer"]');
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveAttribute('open', '');
		await expect(page.getByTestId('ssr-initial-open-drawer-body')).toBeVisible();
	});
});
