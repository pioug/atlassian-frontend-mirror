import { expect, test } from '@af/integration-testing';

test('Breadcrumbs should pass basic aXe audit', async ({ page }) => {
	await page.visitExample('design-system', 'breadcrumbs', 'basic');
	const breadcrumbs = page.getByTestId('MyBreadcrumbsTestId');
	await expect(breadcrumbs).toBeVisible();
});
