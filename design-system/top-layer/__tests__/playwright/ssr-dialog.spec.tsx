/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from '@af/integration-testing';

test.describe('Dialog - SSR + hydration', () => {
	test('opens as part of initial render when isOpen=true on first mount', async ({ page }) => {
		await page.visitExample<
			typeof import('../../examples/151-testing-dialog-ssr-initial-open.tsx')
		>('design-system', 'top-layer', 'testing-dialog-ssr-initial-open');

		const dialog = page.locator('dialog[data-testid="ssr-initial-open-dialog"]');
		await expect(dialog).toBeVisible();
		await expect(dialog).toHaveAttribute('open', '');

		await expect(page.getByTestId('ssr-initial-open-dialog-body')).toBeVisible();
		await expect(page.getByTestId('ssr-initial-open-dialog-close')).toBeFocused();
	});
});
