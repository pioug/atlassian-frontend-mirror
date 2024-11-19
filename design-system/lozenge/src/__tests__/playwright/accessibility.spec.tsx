import { expect, test } from '@af/integration-testing';

['basic', 'basic-compiled'].forEach((testName) => {
	test(`should be rendered and pass basic aXe audit on ${testName}`, async ({ page }) => {
		await page.visitExample('design-system', 'lozenge', testName);

		const subtleLozenge = page.locator("[data-testid='lozenge-subtle']").first();

		await expect(subtleLozenge).toBeVisible();
	});
});
