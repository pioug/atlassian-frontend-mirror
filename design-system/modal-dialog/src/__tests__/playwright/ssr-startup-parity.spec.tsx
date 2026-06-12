/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Modal - SSR startup parity', () => {
	test('opens as part of initial render with feature flag off (legacy path)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/103-ssr-initial-open.tsx')>(
			'design-system',
			'modal-dialog',
			'ssr-initial-open',
		);

		await expect(page.getByTestId('ssr-initial-open-modal')).toBeVisible();
		await expect(page.getByTestId('ssr-initial-open-modal-body')).toBeVisible();
	});

	test('opens as part of initial render with feature flag on (top-layer path)', async ({
		page,
	}) => {
		await page.visitExample<typeof import('../../../examples/103-ssr-initial-open.tsx')>(
			'design-system',
			'modal-dialog',
			'ssr-initial-open',
			{
				featureFlag: 'platform-dst-top-layer',
			},
		);

		// `open` attribute is the spec-defined signal that `showModal()` ran.
		const dialog = page.locator('dialog[data-testid="ssr-initial-open-modal"]');
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveAttribute('open', '');
		await expect(page.getByTestId('ssr-initial-open-modal-body')).toBeVisible();
	});
});
