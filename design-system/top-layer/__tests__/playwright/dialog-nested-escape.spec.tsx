import { expect, test } from '@af/integration-testing';

test.describe('Dialog nested Escape handling', () => {
	test('Escape closes only the topmost dialog, not its ancestor', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/152-testing-nested-dialog-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-nested-dialog-escape',
		);

		await page.getByTestId('open-outer').click();
		await page.getByTestId('open-inner').click();
		await expect(page.getByTestId('outer-content')).toBeVisible();
		await expect(page.getByTestId('inner-content')).toBeVisible();

		await page.keyboard.press('Escape');

		// Only the inner (topmost) dialog closes; the outer stays open. Without the
		// cancel target guard, the inner dialog's cancel would bubble through React
		// to the outer dialog's handler and close it too.
		await expect(page.getByTestId('inner-content')).toBeHidden();
		await expect(page.getByTestId('outer-content')).toBeVisible();
	});

	test('a second Escape then closes the outer dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/152-testing-nested-dialog-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-nested-dialog-escape',
		);

		await page.getByTestId('open-outer').click();
		await page.getByTestId('open-inner').click();

		await page.keyboard.press('Escape');
		await expect(page.getByTestId('inner-content')).toBeHidden();
		await expect(page.getByTestId('outer-content')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('outer-content')).toBeHidden();
	});

	test('Escape closes a single, non-nested dialog', async ({ page }) => {
		await page.visitExample<typeof import('../../examples/152-testing-nested-dialog-escape.tsx')>(
			'design-system',
			'top-layer',
			'testing-nested-dialog-escape',
		);

		await page.getByTestId('open-outer').click();
		await expect(page.getByTestId('outer-content')).toBeVisible();

		await page.keyboard.press('Escape');

		await expect(page.getByTestId('outer-content')).toBeHidden();
	});
});
