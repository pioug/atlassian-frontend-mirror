import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'modal-dialog', 'default-modal');

	const modalTrigger = page.getByTestId('modal-trigger').first();

	await modalTrigger.click();

	await expect(page.getByTestId('modal').first()).toBeVisible();
});
