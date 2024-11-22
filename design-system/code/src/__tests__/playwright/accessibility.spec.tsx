import { expect, test } from '@af/integration-testing';

test('should be rendered and pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'code', 'inline-code-basic');
	await expect(page.locator("[data-testid='code-h1']").first()).toBeVisible();
});
