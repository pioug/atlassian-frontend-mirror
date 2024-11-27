import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'avatar-group', 'basic-avatar-group');
	await expect(page.getByTestId('stack--avatar-group').first()).toBeVisible();
});
