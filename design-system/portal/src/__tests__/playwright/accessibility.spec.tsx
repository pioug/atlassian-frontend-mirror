import { expect, test } from '@af/integration-testing';

test('modal should be created and pass basic aXe audit', async ({ page }) => {
	await page.visitExample<typeof import('../../../examples/1-complex-layering.vr.ap.tsx')>(
		'design-system',
		'portal',
		'complex-layering',
	);
	await page.getByTestId('dialog-trigger').click();

	const modal = page.getByTestId('modal');
	await expect(modal).toBeVisible();
	await expect(modal).toContainText('Modal dialog');
	await expect(modal).toContainText('This dialog has three great features:');
});
