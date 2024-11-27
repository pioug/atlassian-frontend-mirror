import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'tag-group', 'basic');
	await expect(page.getByTestId('standard').first()).toBeVisible();
});
